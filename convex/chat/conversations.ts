import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "../_generated/server";
import { authComponent} from "../auth";
import { v } from "convex/values";
import { makeDirectKey } from "../utils";



export const getConversationsWithMetadata = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    // 1️⃣ Get paginated conversationParticipant rows for this user
    const results = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_user", (q) => q.eq("userId", auth._id))
      .order("desc")
      .paginate(paginationOpts);

    const pageWithData = await Promise.all(
      results.page.map(async (p) => {
        // 2️⃣ Get conversation info
        const conversation = await ctx.db.get(p.conversationId);

        if (!conversation) return null;

        // 3️⃣ Get all participants
        const participants = await ctx.db
          .query("conversationParticipants")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", p.conversationId)
          )
          .collect();

        // 4️⃣ Identify the other user (for 1–1 chats)
        const otherParticipant = participants.find(
          (x) => x.userId !== auth._id
        );

        let otherUserData = null;
        if (otherParticipant) {
          const otherUser = await authComponent.getAnyUserById(
            ctx,
            otherParticipant.userId
          );
          if (otherUser) {
            otherUserData = {
              id: otherParticipant._id,
              name: otherUser.name,
              avatarUrl: otherUser.image,
            };
          }
        }

        // 5️⃣ Count unseen messages for this conversation
        const notSeenMessages = await ctx.db
          .query("messageMeta")
          .withIndex("by_conv_and_seen_and_user", (q) =>
            q
              .eq("conversationId", p.conversationId)
              .eq("userId", auth._id)
              .eq("seen", false)
          )
          .collect();

        return {
          ...p,
          conversation,
          otherUser: otherUserData,
          notSeenMessagesCount:
            notSeenMessages.length === 0 ? null : notSeenMessages.length,
        };
      })
    );

    return {
      ...results,
      page: pageWithData.filter(Boolean),
    };
  },
});



export const getOrCreateDirectConversation = mutation({
  args: {
    userB: v.string(),
  },
  handler: async (ctx, {  userB }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return null;
    const userA = authUser._id

    if (userA === userB) {
      throw new Error("Cannot create a conversation with yourself.");
    }

    const key = makeDirectKey(userA, userB);

    // 1. Check if exists O(1)
    const existing = await ctx.db
      .query("directChats")
      .withIndex("by_key", q => q.eq("key", key))
      .unique();

    if (existing) {
      return existing.conversationId;
    }

    const now = Date.now();

    // 2. Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: now,
      updatedAt: now,
    });

    // 3. Insert participants
    await ctx.db.insert("conversationParticipants", {
      conversationId,
      userId: userA,
    });

    await ctx.db.insert("conversationParticipants", {
      conversationId,
      userId: userB,
    });

    // 4. Store instant lookup for next time
    await ctx.db.insert("directChats", {
      key,
      conversationId,
    });

    return conversationId;
  },
});