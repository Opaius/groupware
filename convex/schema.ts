import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.optional(v.number()),
    lastMessageText: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.string()),
  }),

  conversationParticipants: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"]), // Used to fetch participants

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    body: v.string(),
    sentAt: v.number(),
  }).index("by_conversation", ["conversationId"]), // Used for pagination

  messageMeta: defineTable({
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    userId: v.string(),
    seen: v.boolean(),
  })
    // CRITICAL: This index allows us to fetch metadata for a specific message instantly
    .index("by_message", ["messageId"])
    .index("by_user_seen", ["userId", "seen"])
    .index("by_user_conv_seen", ["userId", "conversationId", "seen"]),

  directChats: defineTable({
    key: v.string(),
    conversationId: v.id("conversations"),
  })
    .index("by_key", ["key"])
    .index("by_conv", ["conversationId"]),

  // Call signaling tables
  callInvitations: defineTable({
    callerId: v.string(),
    receiverId: v.string(),
    conversationId: v.id("conversations"),
    status: v.union(
      v.literal("ringing"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("cancelled"),
      v.literal("ended"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    callerPeerId: v.optional(v.string()),
    receiverPeerId: v.optional(v.string()),
  })
    .index("by_receiver_status", ["receiverId", "status"])
    .index("by_caller_status", ["callerId", "status"])
    .index("by_conversation_status", ["conversationId", "status"])
    .index("by_receiver", ["receiverId"])
    .index("by_caller", ["callerId"])
    .index("by_conversation", ["conversationId"]),

  activeCalls: defineTable({
    callerId: v.string(),
    receiverId: v.string(),
    conversationId: v.id("conversations"),
    callerPeerId: v.string(),
    receiverPeerId: v.string(),
    startedAt: v.number(),
  })
    .index("by_caller", ["callerId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["conversationId"]),
});
