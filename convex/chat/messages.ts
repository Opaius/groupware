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
    // --- 0) Auth ---
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) return null;

    // --- 1) Fetch conversation & Participants in parallel ---
    const [conversation, participants] = await Promise.all([
      ctx.db.get(conversationId),
      ctx.db
        .query("conversationParticipants")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
        .collect(),
    ]);

    if (!conversation) return null;

    const participantIds = participants.map((p) => p.userId);
    const otherParticipants = participants.filter((p) => p.userId !== auth._id);

    // --- 2) Fetch paginated messages ---
    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("desc")
      .paginate(paginationOpts);

    const messages = messagesPage.page;

    // If page is empty, return early
    if (messages.length === 0) {
      return {
        conversation,
        participants,
        otherParticipants,
        messages: [],
        users: {},
        pagination: {
          continueCursor: messagesPage.continueCursor,
          isDone: messagesPage.isDone,
        },
      };
    }

    // --- 3) OPTIMIZED: Fetch Metadata ONLY for these messages ---
    // We use Promise.all to fetch metadata for the 20 messages in parallel.
    // Convex handles parallel queries very efficiently.
    const metaResults = await Promise.all(
      messages.map((msg) =>
        ctx.db
          .query("messageMeta")
          .withIndex("by_message", (q) => q.eq("messageId", msg._id))
          .collect()
      )
    );

    // --- 4) Process Metadata ---
    const messagesWithMeta = messages.map((msg, index) => {
      const metaRows = metaResults[index]; // Corresponds to the message at this index
      
      const seenByUserIds = metaRows.filter((r) => r.seen).map((r) => r.userId);
      const seenByOtherUserIds = seenByUserIds.filter((uid) => uid !== msg.senderId);

      // Calculate if everyone else has seen it
      // Note: We subtract 1 (the sender) from total participants
      const otherParticipantsCount = participants.length - 1; 
      const allOtherUsersSeen = 
        otherParticipantsCount > 0 && 
        seenByOtherUserIds.length >= otherParticipantsCount;

      // Fallback: If I sent it, I have "seen" it.
      const currentUserHasSeen = seenByUserIds.includes(auth._id) || msg.senderId === auth._id;

      return {
        ...msg,
        metadata: {
          seen: currentUserHasSeen,
          seenByUserIds,
          seenByOtherUserIds,
          allOtherUsersSeen,
          currentUserHasSeen,
        },
      };
    });

    // --- 5) Fetch Users (Senders + Participants) ---
    // We use a Set to ensure we only fetch each user once
    const uniqueUserIds = new Set([
      ...messages.map((m) => m.senderId),
      ...participantIds,
    ]);

    const userProfiles = await Promise.all(
      Array.from(uniqueUserIds).map(async (userId) => {
        const profile = await authComponent.getAnyUserById(ctx, userId);
        return { userId, profile };
      })
    );

    const usersById: Record<string, { name: string; image: string | null }> = {};
    for (const { userId, profile } of userProfiles) {
      if (profile) {
        usersById[userId] = {
          name: profile.name ?? "Unknown",
          image: profile.image ?? null,
        };
      }
    }

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
          seen: p.userId === auth._id, // sender has already "seen" 
          messageId: msgId,
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
