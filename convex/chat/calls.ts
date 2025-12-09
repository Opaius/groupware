// convex/chat/calls.ts
import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "../auth";
import { Doc, Id } from "../_generated/dataModel";

// Start a call (create invitation)
export const startCall = mutation({
  args: {
    conversationId: v.id("conversations"),
    receiverId: v.string(),
    callerPeerId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    // Check if user is part of the conversation
    const participant = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .filter((q) => q.eq(q.field("userId"), auth._id))
      .unique();

    if (!participant) {
      throw new ConvexError("Not a participant in this conversation");
    }

    // Check if receiver is part of the conversation
    const receiverParticipant = await ctx.db
      .query("conversationParticipants")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .filter((q) => q.eq(q.field("userId"), args.receiverId))
      .unique();

    if (!receiverParticipant) {
      throw new ConvexError("Receiver not in conversation");
    }

    // Check for existing active calls where user is caller to this receiver
    const existingActiveCallAsCaller = await ctx.db
      .query("activeCalls")
      .withIndex("by_caller", (q) => q.eq("callerId", auth._id))
      .filter((q) => q.eq(q.field("receiverId"), args.receiverId))
      .first();

    // Check for existing active calls where user is receiver from this caller
    const existingActiveCallAsReceiver = await ctx.db
      .query("activeCalls")
      .withIndex("by_receiver", (q) => q.eq("receiverId", auth._id))
      .filter((q) => q.eq(q.field("callerId"), args.receiverId))
      .first();

    const existingActiveCall =
      existingActiveCallAsCaller || existingActiveCallAsReceiver;

    if (existingActiveCall) {
      throw new ConvexError("Call already in progress");
    }

    // Check for existing pending invitations where receiver is the target user
    const existingInvitationAsReceiver = await ctx.db
      .query("callInvitations")
      .withIndex("by_receiver_status", (q) =>
        q.eq("receiverId", args.receiverId).eq("status", "ringing"),
      )
      .first();

    // Check for existing pending invitations where caller is the current user
    const existingInvitationAsCaller = await ctx.db
      .query("callInvitations")
      .withIndex("by_caller_status", (q) =>
        q.eq("callerId", auth._id).eq("status", "ringing"),
      )
      .first();

    const existingInvitation =
      existingInvitationAsReceiver || existingInvitationAsCaller;

    if (existingInvitation) {
      throw new ConvexError("Receiver already has a pending call");
    }

    // Create call invitation
    const now = Date.now();
    const callInvitationId = await ctx.db.insert("callInvitations", {
      callerId: auth._id,
      receiverId: args.receiverId,
      conversationId: args.conversationId,
      status: "ringing",
      createdAt: now,
      updatedAt: now,
      callerPeerId: args.callerPeerId,
    });

    return { callInvitationId };
  },
});

// Get incoming call for current user
export const getIncomingCall = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const invitation = await ctx.db
      .query("callInvitations")
      .withIndex("by_receiver_status", (q) =>
        q.eq("receiverId", auth._id).eq("status", "ringing"),
      )
      .first();

    if (!invitation) return null;

    // Get caller info
    const caller = await authComponent.getAnyUserById(ctx, invitation.callerId);
    const conversation = await ctx.db.get(invitation.conversationId);

    return {
      invitation,
      caller: {
        id: caller?._id,
        name: caller?.name,
        image: caller?.image,
      },
      conversation: {
        id: conversation?._id,
        name: conversation?.name,
      },
    };
  },
});

// Get outgoing call for current user
export const getOutgoingCall = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const invitation = await ctx.db
      .query("callInvitations")
      .withIndex("by_caller_status", (q) =>
        q.eq("callerId", auth._id).eq("status", "ringing"),
      )
      .first();

    if (!invitation) return null;

    // Get receiver info
    const receiver = await authComponent.getAnyUserById(
      ctx,
      invitation.receiverId,
    );
    const conversation = await ctx.db.get(invitation.conversationId);

    return {
      invitation,
      receiver: {
        id: receiver?._id,
        name: receiver?.name,
        image: receiver?.image,
      },
      conversation: {
        id: conversation?._id,
        name: conversation?.name,
      },
    };
  },
});

// Accept a call
export const acceptCall = mutation({
  args: {
    callInvitationId: v.id("callInvitations"),
    receiverPeerId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const invitation = await ctx.db.get(args.callInvitationId);
    if (!invitation) {
      throw new ConvexError("Call invitation not found");
    }

    if (invitation.receiverId !== auth._id) {
      throw new ConvexError("Not authorized to accept this call");
    }

    if (invitation.status !== "ringing") {
      throw new ConvexError("Call is no longer ringing");
    }

    const now = Date.now();

    // Update invitation
    await ctx.db.patch(args.callInvitationId, {
      status: "accepted",
      updatedAt: now,
      receiverPeerId: args.receiverPeerId,
    });

    // Create active call record
    const activeCallId = await ctx.db.insert("activeCalls", {
      callerId: invitation.callerId,
      receiverId: invitation.receiverId,
      conversationId: invitation.conversationId,
      callerPeerId: invitation.callerPeerId || "",
      receiverPeerId: args.receiverPeerId,
      startedAt: now,
    });

    return { activeCallId };
  },
});

// Decline a call
export const declineCall = mutation({
  args: {
    callInvitationId: v.id("callInvitations"),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const invitation = await ctx.db.get(args.callInvitationId);
    if (!invitation) {
      throw new ConvexError("Call invitation not found");
    }

    if (invitation.receiverId !== auth._id) {
      throw new ConvexError("Not authorized to decline this call");
    }

    if (invitation.status !== "ringing") {
      throw new ConvexError("Call is no longer ringing");
    }

    await ctx.db.patch(args.callInvitationId, {
      status: "declined",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Cancel a call (caller cancels)
export const cancelCall = mutation({
  args: {
    callInvitationId: v.id("callInvitations"),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const invitation = await ctx.db.get(args.callInvitationId);
    if (!invitation) {
      throw new ConvexError("Call invitation not found");
    }

    if (invitation.callerId !== auth._id) {
      throw new ConvexError("Not authorized to cancel this call");
    }

    if (invitation.status !== "ringing") {
      throw new ConvexError("Call is no longer ringing");
    }

    await ctx.db.patch(args.callInvitationId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// End an active call
export const endCall = mutation({
  args: {
    activeCallId: v.id("activeCalls"),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const activeCall = await ctx.db.get(args.activeCallId);
    if (!activeCall) {
      throw new ConvexError("Active call not found");
    }

    if (
      activeCall.callerId !== auth._id &&
      activeCall.receiverId !== auth._id
    ) {
      throw new ConvexError("Not authorized to end this call");
    }

    // Update the invitation if it exists
    const invitation = await ctx.db
      .query("callInvitations")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", activeCall.conversationId),
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "ringing"),
          q.eq(q.field("status"), "accepted"),
        ),
      )
      .first();

    if (invitation) {
      await ctx.db.patch(invitation._id, {
        status: "ended",
        updatedAt: Date.now(),
      });
    }

    // Remove active call
    await ctx.db.delete(args.activeCallId);

    return { success: true };
  },
});

// Get active call for current user
export const getActiveCall = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    // Check if user is a caller in any active call
    const callAsCaller = await ctx.db
      .query("activeCalls")
      .withIndex("by_caller", (q) => q.eq("callerId", auth._id))
      .first();

    if (callAsCaller) {
      const receiver = await authComponent.getAnyUserById(
        ctx,
        callAsCaller.receiverId,
      );
      const conversation = await ctx.db.get(callAsCaller.conversationId);

      return {
        call: callAsCaller,
        role: "caller" as const,
        otherUser: {
          id: receiver?._id,
          name: receiver?.name,
          image: receiver?.image,
        },
        conversation: {
          id: conversation?._id,
          name: conversation?.name,
        },
      };
    }

    // Check if user is a receiver in any active call
    const callAsReceiver = await ctx.db
      .query("activeCalls")
      .withIndex("by_receiver", (q) => q.eq("receiverId", auth._id))
      .first();

    if (callAsReceiver) {
      const caller = await authComponent.getAnyUserById(
        ctx,
        callAsReceiver.callerId,
      );
      const conversation = await ctx.db.get(callAsReceiver.conversationId);

      return {
        call: callAsReceiver,
        role: "receiver" as const,
        otherUser: {
          id: caller?._id,
          name: caller?.name,
          image: caller?.image,
        },
        conversation: {
          id: conversation?._id,
          name: conversation?.name,
        },
      };
    }

    return null;
  },
});

// End all calls for current user (for call interruption)
export const endAllCallsForUser = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Unauthorized");

    const now = Date.now();

    // End all active calls where user is caller
    const activeCallsAsCaller = await ctx.db
      .query("activeCalls")
      .withIndex("by_caller", (q) => q.eq("callerId", auth._id))
      .collect();

    for (const call of activeCallsAsCaller) {
      // Update related invitation if exists
      const invitation = await ctx.db
        .query("callInvitations")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", call.conversationId),
        )
        .filter((q) =>
          q.or(
            q.eq(q.field("status"), "ringing"),
            q.eq(q.field("status"), "accepted"),
          ),
        )
        .first();

      if (invitation) {
        await ctx.db.patch(invitation._id, {
          status: "ended",
          updatedAt: now,
        });
      }

      await ctx.db.delete(call._id);
    }

    // End all active calls where user is receiver
    const activeCallsAsReceiver = await ctx.db
      .query("activeCalls")
      .withIndex("by_receiver", (q) => q.eq("receiverId", auth._id))
      .collect();

    for (const call of activeCallsAsReceiver) {
      // Update related invitation if exists
      const invitation = await ctx.db
        .query("callInvitations")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", call.conversationId),
        )
        .filter((q) =>
          q.or(
            q.eq(q.field("status"), "ringing"),
            q.eq(q.field("status"), "accepted"),
          ),
        )
        .first();

      if (invitation) {
        await ctx.db.patch(invitation._id, {
          status: "ended",
          updatedAt: now,
        });
      }

      await ctx.db.delete(call._id);
    }

    // Cancel all ringing invitations where user is caller
    const ringingInvitationsAsCaller = await ctx.db
      .query("callInvitations")
      .withIndex("by_caller_status", (q) =>
        q.eq("callerId", auth._id).eq("status", "ringing"),
      )
      .collect();

    for (const invitation of ringingInvitationsAsCaller) {
      await ctx.db.patch(invitation._id, {
        status: "cancelled",
        updatedAt: now,
      });
    }

    // Decline all ringing invitations where user is receiver
    const ringingInvitationsAsReceiver = await ctx.db
      .query("callInvitations")
      .withIndex("by_receiver_status", (q) =>
        q.eq("receiverId", auth._id).eq("status", "ringing"),
      )
      .collect();

    for (const invitation of ringingInvitationsAsReceiver) {
      await ctx.db.patch(invitation._id, {
        status: "declined",
        updatedAt: now,
      });
    }

    return {
      endedActiveCalls:
        activeCallsAsCaller.length + activeCallsAsReceiver.length,
      cancelledInvitations:
        ringingInvitationsAsCaller.length + ringingInvitationsAsReceiver.length,
    };
  },
});

// Clean up old calls (can be run as a scheduled function)
export const cleanupOldCalls = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Clean up old invitations
    const oldInvitations = await ctx.db
      .query("callInvitations")
      .filter((q) => q.lt(q.field("updatedAt"), oneHourAgo))
      .collect();

    for (const invitation of oldInvitations) {
      await ctx.db.delete(invitation._id);
    }

    // Clean up old active calls
    const oldActiveCalls = await ctx.db
      .query("activeCalls")
      .filter((q) => q.lt(q.field("startedAt"), oneHourAgo))
      .collect();

    for (const call of oldActiveCalls) {
      await ctx.db.delete(call._id);
    }

    return {
      cleanedInvitations: oldInvitations.length,
      cleanedActiveCalls: oldActiveCalls.length,
    };
  },
});
