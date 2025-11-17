// convex/messages.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { authComponent } from "../auth";

export const getMessagesWithMetadata = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { conversationId, paginationOpts }) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) return null;
    // --- 1) Fetch conversation ---
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    // --- 2) Fetch messages paginated ---
    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("desc")
      .paginate(paginationOpts);

    const messages = messagesPage.page;

    // --- 3) Fetch message metadata (seen/sent) for current user ---
    const messageMetaRows = await ctx.db
      .query("messageMeta")
      .withIndex("by_conv_and_seen_and_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", auth._id)
      )
      .collect();

    // Map messageId => metadata
    const messageMetaById: Record<string, { seen: boolean; sent: boolean }> = {};
    for (const meta of messageMetaRows) {
      messageMetaById[meta._id] = { seen: meta.seen, sent: meta.sent };
    }

    // --- 4) Fetch participants ---
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    const otherParticipants = participants.filter((p) => p.userId !== auth._id);

    const uniqueUserIds = Array.from(
      new Set([
        ...messages.map((message) => message.senderId),
        ...participants.map((participant) => participant.userId),
      ])
    );

    const usersEntries = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const profile = await authComponent.getAnyUserById(ctx, userId);
        if (!profile) return null;
        return [userId, { name: profile.name ?? "Unknown" , image: profile.image ?? null }] as const;
      })
    );

    const usersById = Object.fromEntries(
      usersEntries.filter(
        (
          entry
        ): entry is [string, { name: string; image: string | null }] => entry !== null
      )
    );

    // --- 5) Combine messages with metadata ---
    const messagesWithMeta = messages.map((msg) => ({
      ...msg,
      metadata: messageMetaById[msg._id] ?? { seen: false, sent: false },
    }));

    return {
      conversation,
      participants,
      otherParticipants,
      messages: messagesWithMeta,
      users: usersById,
      pagination: {
        continueCursor: messagesPage.continueCursor,
        isDone: messagesPage.isDone,
      },
    };
  },
});


export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
  },
  handler: async (ctx, { conversationId, body }) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    // --- 1️⃣ Insert the new message ---
    const msgId = await ctx.db.insert("messages", {
      conversationId,
      senderId: auth._id,
      body,
      sentAt: now,
    });

    // --- 2️⃣ Update conversation timestamps ---
    await ctx.db.patch(conversationId, {
      updatedAt: now,
      lastMessageAt: now,
      lastMessageText: body,
      lastMessageSenderId: auth._id,
    });

    // --- 3️⃣ Fetch all participants ---
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    // --- 4️⃣ Insert message metadata per participant ---
    await Promise.all(
      participants.map((p) =>
        ctx.db.insert("messageMeta", {
          conversationId,
          userId: p.userId,
          seen: p.userId === auth._id, // sender has already "seen" it
          sent: p.userId === auth._id,
        })
      )
    );

    // --- 5️⃣ Return the message ID or full message ---
    return {
      id: msgId,
      conversationId,
      senderId: auth._id,
      body,
      sentAt: now,
    };
  },
});
