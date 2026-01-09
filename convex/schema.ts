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
    attachmentIds: v.optional(v.array(v.id("messageAttachments"))),
    appointmentId: v.optional(v.id("appointments")),
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
  userSwipes: defineTable({
    userId: v.string(),
    targetUserId: v.string(),
    action: v.union(
      v.literal("reject"),
      v.literal("like"),
      v.literal("message"),
    ),
    conversationId: v.optional(v.id("conversations")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_target", ["userId", "targetUserId"]),
  notifications: defineTable({
    userId: v.string(),
    fromUserId: v.string(),
    type: v.union(
      v.literal("like"),
      v.literal("match"),
      v.literal("message"),
      v.literal("accept"),
      v.literal("reject"),
    ),
    userSwipeId: v.optional(v.id("userSwipes")),
    conversationId: v.optional(v.id("conversations")),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),
  matches: defineTable({
    user1Id: v.string(),
    user2Id: v.string(),
    conversationId: v.optional(v.id("conversations")),
    createdAt: v.number(),
  })
    .index("by_user", ["user1Id"])
    .index("by_user_pair", ["user1Id", "user2Id"]),

  messageAttachments: defineTable({
    messageId: v.id("messages"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    uploadedAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_storage", ["storageId"]),

  appointments: defineTable({
    conversationId: v.id("conversations"),
    createdBy: v.string(),
    scheduledFor: v.number(),
    durationMinutes: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    declinedReason: v.optional(v.string()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_created_by", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_scheduled_for", ["scheduledFor"]),
});
