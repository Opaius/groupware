import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
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

    // 1️⃣ Get paginated participation rows
    // Note: In a real app, you likely want to sort by 'lastMessageAt'
    // stored on the participant object, not just creation time.
    const results = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_user", (q) => q.eq("userId", auth._id))
      .order("desc")
      .paginate(paginationOpts);

    const pageWithData = await Promise.all(
      results.page.map(async (p) => {
        // 2️⃣ Parallelize the sub-queries for maximum speed
        const [conversation, participants, notSeenMessages] = await Promise.all(
          [
            ctx.db.get(p.conversationId),

            ctx.db
              .query("conversationParticipants")
              .withIndex("by_conversation", (q) =>
                q.eq("conversationId", p.conversationId),
              )
              .collect(),

            ctx.db
              .query("messageMeta")
              .withIndex("by_user_conv_seen", (q) =>
                q
                  .eq("userId", auth._id)
                  .eq("conversationId", p.conversationId)
                  .eq("seen", false),
              )
              .collect(),
          ],
        );

        if (!conversation) return null;

        // Filter out conversations without any messages
        if (!conversation.lastMessageAt) return null;

        // 3️⃣ Identify the other user (for 1–1 chats)
        // We find the first participant that isn't me
        const otherParticipant = participants.find(
          (x) => x.userId !== auth._id,
        );

        let otherUserData = null;

        // Only fetch user profile if it's a direct chat (not a group) or strictly 1v1
        if (otherParticipant && !conversation.isGroup) {
          const otherUser = await authComponent.getAnyUserById(
            ctx,
            otherParticipant.userId,
          );

          if (otherUser) {
            otherUserData = {
              id: otherParticipant.userId, // Use userId, not participantId, for frontend nav
              name: otherUser.name,
              avatarUrl: otherUser.image,
            };
          } else {
            // Handle case where other user was deleted
            otherUserData = {
              id: otherParticipant.userId,
              name: "Deleted User",
              avatarUrl: null,
            };
          }
        }

        return {
          ...p,
          conversation,
          otherUser: otherUserData,
          // If count is 0, returning null often helps UI hide badges easier
          notSeenMessagesCount:
            notSeenMessages.length > 0 ? notSeenMessages.length : null,
        };
      }),
    );

    // Filter out nulls (corrupt data) and cast type
    const validPage = pageWithData.filter(
      (item): item is NonNullable<typeof item> => item !== null,
    );

    // Sort conversations by lastMessageAt descending (most recent first)
    validPage.sort((a, b) => {
      const timeA = a.conversation.lastMessageAt ?? 0;
      const timeB = b.conversation.lastMessageAt ?? 0;
      return timeB - timeA; // Descending
    });

    return {
      ...results,
      page: validPage,
    };
  },
});

export const getOrCreateDirectConversation = mutation({
  args: {
    userB: v.string(),
  },
  handler: async (ctx, { userB }) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const userA = authUser._id;

    if (userA === userB) {
      throw new Error("Cannot create a conversation with yourself.");
    }

    const key = makeDirectKey(userA, userB);

    // 1. Check if exists O(1) using the unique key index
    const existing = await ctx.db
      .query("directChats")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    if (existing) {
      return existing.conversationId;
    }

    // 2. Create new conversation
    // Note: Convex mutations are transactional.
    // If two users click "Chat" at the exact same time,
    // one will fail or run serially depending on your unique constraints.
    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      createdAt: now,
      updatedAt: now,
      // Optional: Add initial lastMessage data here if you want empty chats to sort correctly
    });

    // 3. Insert participants and the direct chat lookup key in parallel
    await Promise.all([
      ctx.db.insert("conversationParticipants", {
        conversationId,
        userId: userA,
      }),
      ctx.db.insert("conversationParticipants", {
        conversationId,
        userId: userB,
      }),
      ctx.db.insert("directChats", {
        key,
        conversationId,
      }),
    ]);

    return conversationId;
  },
});

export const getUsersWithDirectConversations = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      return [];
    }

    const currentUserId = auth._id.toString();

    // Get all direct chats
    const allDirectChats = await ctx.db.query("directChats").collect();

    // Filter direct chats that involve the current user
    const userDirectChats = allDirectChats.filter((chat) => {
      const [user1Id, user2Id] = chat.key.split("|");
      return user1Id === currentUserId || user2Id === currentUserId;
    });

    // Get enriched data for each conversation
    const enrichedChats = await Promise.all(
      userDirectChats.map(async (chat) => {
        // Get the other user ID
        const [user1Id, user2Id] = chat.key.split("|");
        const otherUserId = user1Id === currentUserId ? user2Id : user1Id;

        // Get other user info
        const otherUser = await authComponent.getAnyUserById(ctx, otherUserId);
        if (!otherUser) return null;

        // Get conversation info
        const conversation = await ctx.db.get(chat.conversationId);
        if (!conversation) return null;

        // Get last message info if exists
        const lastMessage = conversation.lastMessageAt
          ? {
              text: conversation.lastMessageText || "",
              time: conversation.lastMessageAt,
              senderId: conversation.lastMessageSenderId || "",
            }
          : null;

        return {
          conversationId: chat.conversationId,
          otherUser: {
            id: otherUserId,
            name: otherUser.name,
            email: otherUser.email || "",
            avatarUrl: otherUser.image || "",
          },
          conversation: {
            lastMessageAt: conversation.lastMessageAt || null,
            updatedAt: conversation.updatedAt,
            createdAt: conversation.createdAt,
          },
          lastMessage,
        };
      }),
    );

    // Filter out nulls with proper type guard
    const validChats = enrichedChats.filter(
      (chat): chat is NonNullable<typeof chat> => chat !== null,
    );

    // Sort by updatedAt (most recent first)
    validChats.sort((a, b) => {
      const timeA = a.conversation.updatedAt;
      const timeB = b.conversation.updatedAt;
      return timeB - timeA; // Descending
    });

    return validChats;
  },
});
