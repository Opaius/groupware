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
  skillCategory: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
  }),
  skill: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    categoryId: v.id("skillCategory"),
  })
    .searchIndex("search_skill", {
      searchField: "name",
      staged: false,
    })
    .index("by_category", ["categoryId"]),
  userSkills: defineTable({
    userId: v.string(),
    skillId: v.id("skill"),
    type: v.union(v.literal("current"), v.literal("wanted")),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    createdAt: v.number(),
    // For future vector search
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_skill", ["skillId"])
    .index("by_user_type", ["userId", "type"]),
  userCustomSkills: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.union(v.literal("current"), v.literal("wanted")),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    createdAt: v.number(),
    // For future vector search
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"])
    .searchIndex("search_custom_skill", {
      searchField: "name",
      staged: false,
    }),
  userProfiles: defineTable({
    userId: v.string(),
    bio: v.optional(v.string()),
    mainPhoto: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    specializationCategoryId: v.optional(v.id("skillCategory")),
    createdAt: v.number(),
    updatedAt: v.number(),
    // For future vector search of bio
    bioEmbedding: v.optional(v.array(v.float64())),
  })
    .index("by_user", ["userId"])
    .index("by_specialization", ["specializationCategoryId"]),
});
