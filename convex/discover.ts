import {
  mutation,
  query,
  action,
  QueryCtx,
  ActionCtx,
  MutationCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator, PaginationOptions } from "convex/server";
import { authComponent } from "./auth";
import { ConvexError } from "convex/values";
import { makeDirectKey } from "./utils";
import { api, components } from "./_generated/api";
import { AIClassification } from "./ai"; // Assumes types are exported from your previous file
import { Doc, Id } from "./_generated/dataModel";

// --------------------------------------------------------------------------
// Shared Types
// --------------------------------------------------------------------------

export type SkillItem = { id: string; name: string };

export type EnrichedUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  featuredImage: string;
  bio: string;
  skills: SkillItem[];
  lookingToLearn: SkillItem[];
};

export type AIEnrichedUser = EnrichedUser & {
  matchScore: number;
  matchReasons: string[];
  isGoodMatch: boolean;
  aiClassification?: AIClassification;
};

export type AuthUser = {
  _creationTime: number;
  _id: string;
  createdAt: number;
  email: string;
  emailVerified: boolean;
  hasFinishedCreateAccount?: boolean | null;
  hasSeenOnboarding?: boolean | null;
  image?: string | null;
  name: string;
  updatedAt: number;
  userId?: string | null;
};

// --------------------------------------------------------------------------
// Helper: User Enrichment (Reduces Duplication)
// --------------------------------------------------------------------------

async function enrichUserData(
  ctx: QueryCtx,
  user: AuthUser,
): Promise<EnrichedUser> {
  if (!user || !user._id) {
    console.error("Invalid user object in enrichUserData:", user);
    // Return a placeholder to prevent crashes
    return {
      id: "invalid-user",
      name: "Unknown User",
      email: "",
      image: "",
      featuredImage: "",
      bio: "User data unavailable",
      skills: [],
      lookingToLearn: [],
    };
  }
  const userId = user._id.toString();

  // 1. Fetch Profile & Skills in parallel
  const [profile, userSkills, wantedSkills, customCurrent, customWanted] =
    await Promise.all([
      ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first(),
      ctx.db
        .query("userSkills")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", userId).eq("type", "current"),
        )
        .collect(),
      ctx.db
        .query("userSkills")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", userId).eq("type", "wanted"),
        )
        .collect(),
      ctx.db
        .query("userCustomSkills")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", userId).eq("type", "current"),
        )
        .collect(),
      ctx.db
        .query("userCustomSkills")
        .withIndex("by_user_type", (q) =>
          q.eq("userId", userId).eq("type", "wanted"),
        )
        .collect(),
    ]);

  // 2. Resolve Skill Names
  const resolveSkills = async (
    skillRecords: Doc<"userSkills">[],
    customRecords: Doc<"userCustomSkills">[],
  ) => {
    const standard = await Promise.all(
      skillRecords.map(async (s) => {
        const skillDoc = await ctx.db.get(s.skillId);
        return skillDoc
          ? { id: skillDoc._id.toString(), name: skillDoc.name }
          : null;
      }),
    );
    const custom = customRecords.map((c) => ({
      id: c._id.toString(),
      name: c.name,
    }));
    return [...standard, ...custom].filter((s): s is SkillItem => s !== null);
  };

  const [allCurrentSkills, allWantedSkills] = await Promise.all([
    resolveSkills(userSkills, customCurrent),
    resolveSkills(wantedSkills, customWanted),
  ]);

  // 3. Resolve Images
  let mainPhotoUrl = user.image || "";
  if (profile?.mainPhoto) {
    const url = await ctx.storage.getUrl(profile.mainPhoto);
    if (url) mainPhotoUrl = url;
  }
  let featuredImageUrl = "";
  if (profile?.featuredImage) {
    const url = await ctx.storage.getUrl(profile.featuredImage);
    if (url) featuredImageUrl = url;
  }

  return {
    id: userId,
    name: user.name || "User",
    email: user.email || "",
    image: mainPhotoUrl,
    featuredImage: featuredImageUrl,
    bio: profile?.bio || "No bio yet",
    skills: allCurrentSkills,
    lookingToLearn: allWantedSkills,
  };
}

// --------------------------------------------------------------------------
// Internal Query: Fetch Candidates
// --------------------------------------------------------------------------

export const getEnrichedCandidates = query({
  args: {},
  handler: async (ctx: QueryCtx): Promise<EnrichedUser[]> => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");
    const currentUserId = auth._id.toString();

    // Get all users (BetterAuth)
    const allUsersRaw =
      (await ctx.runQuery(components.betterAuth.queries.getAllAuthUsers, {})) ||
      [];
    const allUsers: AuthUser[] = allUsersRaw.filter((u): u is AuthUser => !!u);

    // Filter out Swipes
    const userSwipes = await ctx.db
      .query("userSwipes")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    const excludedIds = new Set([currentUserId]);
    userSwipes.forEach((s) => {
      // Exclude if rejected OR if already liked (don't show again in discovery)
      if (s.action === "reject" || s.action === "like") {
        excludedIds.add(s.targetUserId);
      }
    });

    const candidates = allUsers.filter(
      (u) => !excludedIds.has(u._id.toString()),
    );

    // Enrich everyone (Note: For large scale, do this after pagination. For MVP, this is fine)
    const validCandidates = candidates.filter(
      (u): u is AuthUser => !!u && !!u._id,
    );
    return await Promise.all(
      validCandidates.map((u) => enrichUserData(ctx, u)),
    );
  },
});

// --------------------------------------------------------------------------
// Public Query: Standard Discovery (Shuffle)
// --------------------------------------------------------------------------

export const getDiscoverableUsers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (
    ctx: QueryCtx,
    args: { paginationOpts: PaginationOptions },
  ) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");

    // Reuse the logic via internal call or duplicating the logic if strict consistency is needed.
    // Since we are in a Query, we can't call `internalQuery` easily without `ctx.runQuery`.
    // We will copy the critical filtering logic for the standard feed to keep it fast.

    const currentUserId = auth._id.toString();
    const allUsersRaw =
      (await ctx.runQuery(components.betterAuth.queries.getAllAuthUsers, {})) ||
      [];
    const allUsers: AuthUser[] = allUsersRaw.filter((u): u is AuthUser => !!u);

    // Swipe filtering
    const userSwipes = await ctx.db
      .query("userSwipes")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    const excludedIds = new Set([currentUserId]);
    userSwipes.forEach((s) => {
      if (s.action === "reject" || s.action === "like")
        excludedIds.add(s.targetUserId);
    });

    const discoverableUsers = allUsers.filter(
      (u) => !excludedIds.has(u._id.toString()),
    );

    // Deterministic Shuffle
    const seed = `${currentUserId}-${new Date().toISOString().slice(0, 10)}`;
    const shuffled = deterministicShuffle(discoverableUsers, seed);

    // Paginate raw users FIRST
    const limit = args.paginationOpts.numItems || 20;
    const start = args.paginationOpts.cursor
      ? parseInt(args.paginationOpts.cursor)
      : 0;
    const paginatedRaw = shuffled.slice(start, start + limit);

    // Enrich ONLY the page
    const enrichedPage = await Promise.all(
      paginatedRaw
        .filter((u): u is AuthUser => !!u && !!u._id)
        .map((u) => enrichUserData(ctx, u)),
    );

    return {
      page: enrichedPage,
      isDone: start + limit >= shuffled.length,
      continueCursor: (start + limit).toString(),
    };
  },
});

// --------------------------------------------------------------------------
// Public Action: AI Filtered Discovery
// --------------------------------------------------------------------------

export const searchUsersWithAI = action({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (
    ctx: ActionCtx,
    args: { query: string; paginationOpts: PaginationOptions },
  ) => {
    // 1. Auth Check
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");

    // 2. Call AI Action (DeepSeek)
    let classification: AIClassification;
    try {
      // Calls the action defined in your `ai.ts` file
      classification = await ctx.runAction(api.ai.aiClassifyQuery, {
        query: args.query,
      });
    } catch (err) {
      console.error("AI failed", err);
      // Fallback classification
      classification = {
        categories: [],
        skillType: "both",
        matchedSkills: [],
        explanation: "AI service unavailable, showing all users.",
        queryIntent: args.query,
      };
    }

    // 3. Fetch Candidates via Internal Query
    const candidates = await ctx.runQuery(api.discover.getEnrichedCandidates);

    // 4. Score Candidates with Exact Match Priority
    const scoredUsers: AIEnrichedUser[] = candidates.map((user) => {
      let matchScore = 0;
      const matchReasons: string[] = [];

      // Get the list of skills relevant to the user's intent
      // If user wants to LEARN (skillType='wanted'), we look at candidate's CURRENT skills (what they can teach)
      // If user wants to TEACH (skillType='current'), we look at candidate's WANTED skills (what they need)
      let targetUserSkills: Array<{ name: string }> = [];

      if (classification.skillType === "wanted") {
        // User wants to learn -> Match with candidate's CURRENT skills
        targetUserSkills = user.skills;
      } else if (classification.skillType === "current") {
        // User wants to teach -> Match with candidate's WANTED skills
        targetUserSkills = user.lookingToLearn;
      } else {
        // "both" -> Match everything
        targetUserSkills = [...user.skills, ...user.lookingToLearn];
      }

      const targetSkillNames = targetUserSkills.map((s) =>
        s.name.toLowerCase(),
      );

      // A. SKILL MATCHING (The most important part)
      classification.matchedSkills.forEach((aiSkill) => {
        const lowerAiSkill = aiSkill.toLowerCase();

        // CHECK 1: EXACT MATCH (Massive Boost)
        // e.g. AI says "UI/UX Design" and user has "UI/UX Design"
        const exactMatch = targetSkillNames.find((s) => s === lowerAiSkill);

        // CHECK 2: STRONG PARTIAL (High Boost)
        // e.g. AI says "UI/UX" and user has "UI/UX Design" (word boundary match or prefix)
        const strongPartial = targetSkillNames.find((s) => {
          // Word boundary match (original logic)
          if (s.split(/[\s/-]/).includes(lowerAiSkill)) {
            return true;
          }
          // Prefix match: user skill starts with AI skill (e.g., "UI/UX Design" starts with "UI/UX")
          if (s.startsWith(lowerAiSkill) && lowerAiSkill.length >= 3) {
            return true;
          }
          // AI skill contains user skill with significant overlap (inverse prefix)
          if (lowerAiSkill.startsWith(s) && s.length >= 3) {
            return true;
          }
          return false;
        });

        // CHECK 3: WEAK PARTIAL (Low Boost)
        // e.g. AI says "Design" and user has "UI/UX Design"
        const weakPartial = targetSkillNames.find((s) =>
          s.includes(lowerAiSkill),
        );

        if (exactMatch) {
          matchScore += 80; // Huge score keeps them at top
          matchReasons.push(`Exact: ${exactMatch}`);
        } else if (strongPartial) {
          matchScore += 50;
          matchReasons.push(`Strong: ${strongPartial}`);
        } else if (weakPartial) {
          matchScore += 10; // Low score for generic matches
          // Only add reason if we don't have better ones yet
          if (matchReasons.length < 2)
            matchReasons.push(`Weak: ${weakPartial}`);
        }
      });

      // B. INTENT MATCHING (Bonus)
      // If I want to learn, and you want to teach, that's a bonus
      if (classification.skillType === "wanted" && user.skills.length > 0) {
        matchScore += 10;
      } else if (
        classification.skillType === "current" &&
        user.lookingToLearn.length > 0
      ) {
        matchScore += 10;
      } else if (classification.skillType === "both") {
        matchScore += 10;
      }

      return {
        ...user,
        matchScore,
        matchReasons,
        isGoodMatch: matchScore >= 40, // Only mark "Good Match" if they have at least a strong partial
        aiClassification: classification,
      };
    });

    // 5. Filter: If user typed specific skills, hide users with no meaningful match
    const relevantUsers = scoredUsers.filter((u) => {
      // If we found specific skills in the query, require at least some matchScore
      if (classification.matchedSkills.length > 0) {
        return u.matchScore > 15; // Must have more than just "Intent" points
      }
      return true;
    });

    // 6. Sort by Score
    const sorted = relevantUsers.sort((a, b) => b.matchScore - a.matchScore);

    // 7. Paginate
    const limit = args.paginationOpts.numItems || 20;
    const start = args.paginationOpts.cursor
      ? parseInt(args.paginationOpts.cursor)
      : 0;
    const end = start + limit;
    const page = sorted.slice(start, end);

    return {
      page,
      isDone: end >= sorted.length,
      continueCursor: end.toString(),
      aiClassification: classification,
      totalUsers: sorted.length,
    };
  },
});

// --------------------------------------------------------------------------
// Standard Helpers & Mutations (Swiping, Notifications, Matches)
// --------------------------------------------------------------------------

function deterministicShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  for (let i = shuffled.length - 1; i > 0; i--) {
    hash = (hash * 9301 + 49297) % 233280;
    const rand = hash / 233280;
    const j = Math.floor(rand * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const createSwipe = mutation({
  args: {
    targetUserId: v.string(),
    action: v.union(
      v.literal("reject"),
      v.literal("like"),
      v.literal("message"),
    ),
  },
  handler: async (
    ctx: MutationCtx,
    args: { targetUserId: string; action: "reject" | "like" | "message" },
  ) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");

    const currentUserIdStr = auth._id.toString();

    if (currentUserIdStr === args.targetUserId) {
      throw new ConvexError("Cannot swipe on yourself");
    }

    const existingSwipe = await ctx.db
      .query("userSwipes")
      .withIndex("by_user_target", (q) =>
        q.eq("userId", currentUserIdStr).eq("targetUserId", args.targetUserId),
      )
      .first();

    if (existingSwipe) throw new ConvexError("Already swiped on this user");

    const now = Date.now();
    let conversationId = undefined;

    if (args.action === "message") {
      const key = makeDirectKey(currentUserIdStr, args.targetUserId);
      const existingDirectChat = await ctx.db
        .query("directChats")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();

      if (existingDirectChat) {
        conversationId = existingDirectChat.conversationId;
      } else {
        const convId = await ctx.db.insert("conversations", {
          isGroup: false,
          createdAt: now,
          updatedAt: now,
        });
        await Promise.all([
          ctx.db.insert("conversationParticipants", {
            conversationId: convId,
            userId: currentUserIdStr,
          }),
          ctx.db.insert("conversationParticipants", {
            conversationId: convId,
            userId: args.targetUserId,
          }),
          ctx.db.insert("directChats", { key, conversationId: convId }),
        ]);
        conversationId = convId;
      }
    }

    const swipeId = await ctx.db.insert("userSwipes", {
      userId: currentUserIdStr,
      targetUserId: args.targetUserId,
      action: args.action,
      conversationId,
      createdAt: now,
    });

    // Notify target
    await ctx.db.insert("notifications", {
      userId: args.targetUserId,
      fromUserId: currentUserIdStr,
      type:
        args.action === "like"
          ? "like"
          : args.action === "message"
            ? "message"
            : "reject",
      userSwipeId: swipeId,
      conversationId,
      read: false,
      createdAt: now,
    });

    // Match Check
    if (args.action === "like") {
      const mutualSwipe = await ctx.db
        .query("userSwipes")
        .withIndex("by_user_target", (q) =>
          q
            .eq("userId", args.targetUserId)
            .eq("targetUserId", currentUserIdStr),
        )
        .first();

      if (mutualSwipe && mutualSwipe.action === "like") {
        const [user1Id, user2Id] = [currentUserIdStr, args.targetUserId].sort();
        const existingMatch = await ctx.db
          .query("matches")
          .withIndex("by_user_pair", (q) =>
            q.eq("user1Id", user1Id).eq("user2Id", user2Id),
          )
          .first();

        if (!existingMatch) {
          // If mutual swipe didn't start a convo, start one now
          let matchConversationId = mutualSwipe.conversationId;

          // Check if conversation already exists
          if (!matchConversationId) {
            const key = makeDirectKey(user1Id, user2Id);
            const existingDirectChat = await ctx.db
              .query("directChats")
              .withIndex("by_key", (q) => q.eq("key", key))
              .first();

            if (existingDirectChat) {
              matchConversationId = existingDirectChat.conversationId;
            } else {
              // Create new conversation for the match
              const convId = await ctx.db.insert("conversations", {
                isGroup: false,
                createdAt: now,
                updatedAt: now,
              });
              await Promise.all([
                ctx.db.insert("conversationParticipants", {
                  conversationId: convId,
                  userId: user1Id,
                }),
                ctx.db.insert("conversationParticipants", {
                  conversationId: convId,
                  userId: user2Id,
                }),
                ctx.db.insert("directChats", { key, conversationId: convId }),
              ]);
              matchConversationId = convId;
            }

            // Update mutual swipe with conversationId for future reference
            await ctx.db.patch(mutualSwipe._id, {
              conversationId: matchConversationId,
            });
          }

          await ctx.db.insert("matches", {
            user1Id,
            user2Id,
            conversationId: matchConversationId,
            createdAt: now,
          });

          await Promise.all([
            ctx.db.insert("notifications", {
              userId: currentUserIdStr,
              fromUserId: args.targetUserId,
              type: "match",
              userSwipeId: swipeId,
              conversationId: matchConversationId,
              read: false,
              createdAt: now,
            }),
            ctx.db.insert("notifications", {
              userId: args.targetUserId,
              fromUserId: currentUserIdStr,
              type: "match",
              userSwipeId: mutualSwipe._id,
              conversationId: matchConversationId,
              read: false,
              createdAt: now,
            }),
          ]);
        }
      }
    }

    return { success: true, swipeId, conversationId };
  },
});

export const getUserNotifications = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");
    const currentUserIdStr = auth._id.toString();

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserIdStr))
      .order("desc")
      .collect();

    return await Promise.all(
      notifications.map(async (notification) => {
        const fromUser = await authComponent.getAnyUserById(
          ctx,
          notification.fromUserId,
        );

        let matchInfo = null;
        if (notification.type === "match") {
          const [u1, u2] = [
            auth._id.toString(),
            notification.fromUserId,
          ].sort();
          const match = await ctx.db
            .query("matches")
            .withIndex("by_user_pair", (q) =>
              q.eq("user1Id", u1).eq("user2Id", u2),
            )
            .first();
          if (match) {
            matchInfo = {
              matchId: match._id,
              conversationId: match.conversationId || null,
            };
          }
        }

        return {
          id: notification._id,
          type: notification.type,
          read: notification.read,
          createdAt: notification.createdAt,
          fromUser: fromUser
            ? {
                id: fromUser._id,
                name: fromUser.name,
                image: fromUser.image || "",
              }
            : null,
          conversationId: notification.conversationId || null,
          matchInfo,
        };
      }),
    );
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (
    ctx: MutationCtx,
    args: { notificationId: Id<"notifications"> },
  ) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");
    const notification = (await ctx.db.get(
      args.notificationId,
    )) as Doc<"notifications"> | null;
    if (!notification) throw new ConvexError("Notification not found");
    if (notification.userId !== auth._id.toString())
      throw new ConvexError("Not authorized");
    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

export const getMatches = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");
    const currentUserIdStr = auth._id.toString();

    const allMatches = await ctx.db.query("matches").collect();
    const userMatches = allMatches.filter(
      (m) => m.user1Id === currentUserIdStr || m.user2Id === currentUserIdStr,
    );

    const enriched = await Promise.all(
      userMatches.map(async (match) => {
        const otherUserId =
          match.user1Id === currentUserIdStr ? match.user2Id : match.user1Id;
        const otherUser = await authComponent.getAnyUserById(ctx, otherUserId);
        if (!otherUser) return null;

        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", otherUserId))
          .first();

        let mainPhotoUrl = otherUser.image || "";
        if (profile?.mainPhoto) {
          const url = await ctx.storage.getUrl(profile.mainPhoto);
          if (url) mainPhotoUrl = url;
        }

        return {
          matchId: match._id,
          userId: otherUserId,
          name: otherUser.name || "User",
          image: mainPhotoUrl,
          bio: profile?.bio || "",
          conversationId: match.conversationId,
          createdAt: match.createdAt,
        };
      }),
    );
    return enriched.filter(Boolean);
  },
});

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx: QueryCtx, args: { userId: string }) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) throw new ConvexError("Not authenticated");

    const currentUserIdStr = auth._id.toString();
    const targetUserId = args.userId;

    // Get user data
    const user = await authComponent.getAnyUserById(ctx, targetUserId);
    if (!user) throw new ConvexError("User not found");

    // Check if current user has swiped on target user
    const existingSwipe = await ctx.db
      .query("userSwipes")
      .withIndex("by_user_target", (q) =>
        q.eq("userId", currentUserIdStr).eq("targetUserId", targetUserId),
      )
      .first();

    // Check if target user has swiped on current user
    const mutualSwipe = await ctx.db
      .query("userSwipes")
      .withIndex("by_user_target", (q) =>
        q.eq("userId", targetUserId).eq("targetUserId", currentUserIdStr),
      )
      .first();

    // Check for match
    const [user1Id, user2Id] = [currentUserIdStr, targetUserId].sort();
    const existingMatch = await ctx.db
      .query("matches")
      .withIndex("by_user_pair", (q) =>
        q.eq("user1Id", user1Id).eq("user2Id", user2Id),
      )
      .first();

    // Get conversation ID from match or from mutual swipe with conversation
    let conversationId = existingMatch?.conversationId || null;
    if (!conversationId && mutualSwipe?.conversationId) {
      conversationId = mutualSwipe.conversationId;
    }

    const enrichedUser = await enrichUserData(ctx, user);

    return {
      ...enrichedUser,
      hasSwiped: !!existingSwipe,
      swipeAction: existingSwipe?.action || null,
      mutualSwipe: !!mutualSwipe,
      mutualSwipeAction: mutualSwipe?.action || null,
      isMatch: !!existingMatch,
      conversationId,
      matchCreatedAt: existingMatch?.createdAt || null,
    };
  },
});
