// convex/messages.ts
import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { authComponent } from "../auth";
import { Doc } from "../betterAuth/_generated/dataModel";


// --- QUERY 1: The Context (Call this with useQuery) ---
export const getConversationMetadata = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    // Fetch all user profiles for the participants to build a lookup map
    const userProfiles = await Promise.all(
      participants.map(async (p) => {
        const profile = await authComponent.getAnyUserById(ctx, p.userId);
        return { userId: p.userId, profile };
      })
    );
    
    const usersById: Record<string, Doc<"user"> | null> = {};
    userProfiles.forEach(({ userId, profile }) => {
      usersById[userId] = profile;
    });

    return { conversation, participants, usersById, currentUserId: auth._id };
  },
});

// --- QUERY 2: The List (Call this with usePaginatedQuery) ---
export const listEnrichedMessages = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { conversationId, paginationOpts }) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    // We still need participants internally to calculate "seen" status
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    // 1. Get Paginated Page
    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("desc")
      .paginate(paginationOpts);

    // 2. Enrich Messages (Meta + Sender Info)
    const enrichedMessages = await Promise.all(
      messagesPage.page.map(async (msg) => {
        // Fetch Meta
        const metaRows = await ctx.db
          .query("messageMeta")
          .withIndex("by_message", (q) => q.eq("messageId", msg._id))
          .collect();

        // Calculate Seen Logic
        const seenByUserIds = metaRows.filter((r) => r.seen).map((r) => r.userId);
        const seenByOtherUserIds = seenByUserIds.filter((uid) => uid !== msg.senderId);
        const otherParticipantsCount = participants.length - 1;
        const allOtherUsersSeen =
          otherParticipantsCount > 0 &&
          seenByOtherUserIds.length >= otherParticipantsCount;
        const currentUserHasSeen = seenByUserIds.includes(auth._id) || msg.senderId === auth._id;

        // Fetch Sender Profile (Embed it directly!)
        const senderProfile = await authComponent.getAnyUserById(ctx, msg.senderId);

        return {
          ...msg,
          sender: senderProfile, // <--- Embed sender info here
          metadata: {
            seen: currentUserHasSeen,
            seenByUserIds,
            seenByOtherUserIds,
            allOtherUsersSeen,
            currentUserHasSeen,
          },
        };
      })
    );

    // 3. Return STRICT PaginationResult
    return {
      page: enrichedMessages,
      isDone: messagesPage.isDone,
      continueCursor: messagesPage.continueCursor,
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
