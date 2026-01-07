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
  })
    .index("by_conversation", ["conversationId"]), // Used for pagination

  messageMeta: defineTable({
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    userId: v.string(),
    seen: v.boolean(),
  })
    // CRITICAL: This index allows us to fetch metadata for a specific message instantly
    .index("by_message", ["messageId"]) 
    .index("by_user_seen", ["userId", "seen"]).index("by_user_conv_seen", ["userId", "conversationId", "seen"]), 

  directChats: defineTable({
    key: v.string(), 
    conversationId: v.id("conversations"),
  })
    .index("by_key", ["key"])
    .index("by_conv", ["conversationId"]),

  reviews: defineTable({
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_user", ["userId"]),
});