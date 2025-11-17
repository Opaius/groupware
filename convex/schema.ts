// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Conversations (1–1 or group, future proof) ---
  conversations: defineTable({
    isGroup: v.boolean(),               // false for now
    name: v.optional(v.string()),       // used only for groups later
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.optional(v.number()),
    lastMessageText: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.string()),
  }),

  // --- Participants ---
  conversationParticipants: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"]),

  // --- Messages ---
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    body: v.string(),
    sentAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  messageMeta: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    seen:v.boolean(),
    sent:v.boolean(),
  }).index("by_conv_and_seen_and_user", ["conversationId", "userId","seen"]),


  // --- O(1) lookup for 1–1 convs ---
  directChats: defineTable({
    key: v.string(), // "a|b" sorted
    conversationId: v.id("conversations"),
  }).index("by_key", ["key"]).index("by_conv", ["conversationId"]),
});
