// convex/messages.ts
import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { authComponent } from "../auth";
import { Doc } from "../betterAuth/_generated/dataModel";
import { Doc as ConvexDoc } from "../_generated/dataModel";

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
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    // Fetch all user profiles for the participants to build a lookup map
    const userProfiles = await Promise.all(
      participants.map(async (p) => {
        const profile = await authComponent.getAnyUserById(ctx, p.userId);
        if (!profile) {
          return { userId: p.userId, profile: null };
        }

        // Get user profile to resolve profile image
        const userProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", p.userId))
          .first();

        let image = profile.image || "";
        // If profile has mainPhoto, try to resolve it from storage
        if (userProfile?.mainPhoto) {
          const url = await ctx.storage.getUrl(userProfile.mainPhoto);
          if (url) image = url;
        }

        // Return profile with resolved image
        return {
          userId: p.userId,
          profile: {
            ...profile,
            image,
          },
        };
      }),
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
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId),
      )
      .collect();

    // 1. Get Paginated Page
    const messagesPage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId),
      )
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
        const seenByUserIds = metaRows
          .filter((r) => r.seen)
          .map((r) => r.userId);
        const seenByOtherUserIds = seenByUserIds.filter(
          (uid) => uid !== msg.senderId,
        );
        const otherParticipantsCount = participants.length - 1;
        const allOtherUsersSeen =
          otherParticipantsCount > 0 &&
          seenByOtherUserIds.length >= otherParticipantsCount;
        const currentUserHasSeen =
          seenByUserIds.includes(auth._id) || msg.senderId === auth._id;

        // Fetch Sender Profile (Embed it directly!)
        const senderProfile = await authComponent.getAnyUserById(
          ctx,
          msg.senderId,
        );

        // Get user profile to resolve profile image
        let image = senderProfile?.image || "";
        if (senderProfile) {
          const userProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", msg.senderId))
            .first();

          // If profile has mainPhoto, try to resolve it from storage
          if (userProfile?.mainPhoto) {
            const url = await ctx.storage.getUrl(userProfile.mainPhoto);
            if (url) image = url;
          }
        }

        // Create enriched sender profile
        const enrichedSenderProfile = senderProfile
          ? {
              ...senderProfile,
              image,
            }
          : undefined;

        // Fetch Attachments if any
        let attachments: (ConvexDoc<"messageAttachments"> & {
          url?: string;
        })[] = [];
        if (msg.attachmentIds && msg.attachmentIds.length > 0) {
          const attachmentPromises = msg.attachmentIds.map(
            async (attachmentId) => {
              const attachment = await ctx.db.get(attachmentId);
              if (attachment) {
                const url = await ctx.storage.getUrl(attachment.storageId);
                return { ...attachment, url };
              }
              return null;
            },
          );
          const attachmentResults = await Promise.all(attachmentPromises);
          attachments = attachmentResults.filter(
            Boolean,
          ) as (ConvexDoc<"messageAttachments"> & { url?: string })[];
        }

        // Fetch Appointment if any
        let appointment: ConvexDoc<"appointments"> | null = null;
        if (msg.appointmentId) {
          appointment = await ctx.db.get(msg.appointmentId);
        }

        return {
          ...msg,
          sender: enrichedSenderProfile, // <--- Embed enriched sender info here
          attachments,
          appointment,
          metadata: {
            seen: currentUserHasSeen,
            seenByUserIds,
            seenByOtherUserIds,
            allOtherUsersSeen,
            currentUserHasSeen,
          },
        };
      }),
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
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId),
      )
      .collect();

    // --- 4️⃣ Insert message metadata per participant ---
    await Promise.all(
      participants.map((p) =>
        ctx.db.insert("messageMeta", {
          conversationId,
          userId: p.userId,
          seen: p.userId === auth._id, // sender has already "seen"
          messageId: msgId,
        }),
      ),
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

export const markSeen = mutation({
  args: {
    messageId: v.id("messages"),
    conversationId: v.id("conversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("messageMeta")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!existing) {
      await ctx.db.insert("messageMeta", {
        conversationId: args.conversationId,
        messageId: args.messageId,
        userId: args.userId,
        seen: true,
      });
    } else if (!existing.seen) {
      await ctx.db.patch(existing._id, { seen: true });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const count = args.count || 1;
    const urls = [];

    for (let i = 0; i < count; i++) {
      const url = await ctx.storage.generateUploadUrl();
      urls.push(url);
    }

    return {
      success: true,
      urls,
      count: urls.length,
    };
  },
});

export const sendAppointment = mutation({
  args: {
    conversationId: v.id("conversations"),
    scheduledFor: v.number(),
    durationMinutes: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const now = Date.now();

    // Create appointment
    const appointmentId = await ctx.db.insert("appointments", {
      conversationId: args.conversationId,
      createdBy: auth._id,
      scheduledFor: args.scheduledFor,
      durationMinutes: args.durationMinutes,
      title: args.title,
      description: args.description,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Create message linked to appointment
    const msgId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: auth._id,
      body: `📅 Appointment: ${args.title}\n${args.description ? args.description + "\n" : ""}Scheduled for: ${new Date(args.scheduledFor).toLocaleString()}`,
      sentAt: now,
      appointmentId,
    });

    // Update conversation timestamps
    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
      lastMessageAt: now,
      lastMessageText: `📅 ${args.title}`,
      lastMessageSenderId: auth._id,
    });

    // Fetch participants and create message meta
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    await Promise.all(
      participants.map((p) =>
        ctx.db.insert("messageMeta", {
          conversationId: args.conversationId,
          userId: p.userId,
          seen: p.userId === auth._id,
          messageId: msgId,
        }),
      ),
    );

    return {
      appointmentId,
      messageId: msgId,
    };
  },
});

export const sendMessageWithAttachments = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
    attachments: v.array(
      v.object({
        storageId: v.id("_storage"),
        filename: v.string(),
        mimeType: v.string(),
        size: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const now = Date.now();

    // Create message
    const msgId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: auth._id,
      body: args.body,
      sentAt: now,
    });

    // Create attachment records
    const attachmentIds = [];
    for (const attachment of args.attachments) {
      const attachmentId = await ctx.db.insert("messageAttachments", {
        messageId: msgId,
        storageId: attachment.storageId,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        uploadedAt: now,
      });
      attachmentIds.push(attachmentId);
    }

    // Update message with attachment IDs
    await ctx.db.patch(msgId, {
      attachmentIds,
    });

    // Update conversation timestamps
    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
      lastMessageAt: now,
      lastMessageText: args.body || `📎 ${args.attachments.length} file(s)`,
      lastMessageSenderId: auth._id,
    });

    // Fetch participants and create message meta
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    await Promise.all(
      participants.map((p) =>
        ctx.db.insert("messageMeta", {
          conversationId: args.conversationId,
          userId: p.userId,
          seen: p.userId === auth._id,
          messageId: msgId,
        }),
      ),
    );

    return {
      messageId: msgId,
      attachmentIds,
    };
  },
});

export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
    declinedReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new ConvexError("Appointment not found");
    }

    // Check if user is a participant in the conversation
    const participants = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", appointment.conversationId),
      )
      .collect();

    const isParticipant = participants.some((p) => p.userId === auth._id);
    if (!isParticipant) {
      throw new ConvexError("Not authorized to update this appointment");
    }

    const now = Date.now();

    // Update appointment
    await ctx.db.patch(args.appointmentId, {
      status: args.status,
      declinedReason:
        args.status === "declined" ? args.declinedReason : undefined,
      updatedAt: now,
      updatedBy: auth._id,
    });

    // Create a notification message about the status change
    const statusMessage =
      args.status === "accepted"
        ? `✅ Accepted appointment: ${appointment.title}`
        : args.status === "declined"
          ? `❌ Declined appointment: ${appointment.title}${args.declinedReason ? `\nReason: ${args.declinedReason}` : ""}`
          : args.status === "cancelled"
            ? `🚫 Cancelled appointment: ${appointment.title}`
            : `✅ Completed appointment: ${appointment.title}`;

    const msgId = await ctx.db.insert("messages", {
      conversationId: appointment.conversationId,
      senderId: auth._id,
      body: statusMessage,
      sentAt: now,
    });

    // Update conversation timestamps
    await ctx.db.patch(appointment.conversationId, {
      updatedAt: now,
      lastMessageAt: now,
      lastMessageText: statusMessage,
      lastMessageSenderId: auth._id,
    });

    // Create message meta for all participants
    await Promise.all(
      participants.map((p) =>
        ctx.db.insert("messageMeta", {
          conversationId: appointment.conversationId,
          userId: p.userId,
          seen: p.userId === auth._id,
          messageId: msgId,
        }),
      ),
    );

    return {
      appointmentId: args.appointmentId,
      status: args.status,
      updatedAt: now,
    };
  },
});
