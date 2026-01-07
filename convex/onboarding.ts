import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

// ============================================================================
// TYPES & VALIDATORS
// ============================================================================

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get onboarding completion status for the current user
 */
export const getOnboardingStatus = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const userId = args.userId || auth._id;

    // Check if user has seen onboarding in auth table
    const hasSeenOnboarding = auth.hasSeenOnboarding || false;

    // Check if user has a profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const hasProfile = !!profile;

    return {
      hasSeenOnboarding,
      hasProfile,
      profile: profile || null,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Complete the onboarding process for the current user
 */
export const completeOnboarding = mutation({
  args: {
    bio: v.optional(v.string()),
    specializationLabel: v.string(), // The label from UI (e.g., "Tech & Digital Skills")

    // Catalog skills - array of skill titles with type
    catalogSkills: v.array(
      v.object({
        title: v.string(),
        type: v.union(v.literal("current"), v.literal("wanted")),
        categoryName: v.string(),
      }),
    ),

    // Custom skills
    customSkills: v.array(
      v.object({
        name: v.string(),
        type: v.union(v.literal("current"), v.literal("wanted")),
        description: v.optional(v.string()),
        link: v.optional(v.string()),
      }),
    ),

    // Profile images
    mainPhoto: v.optional(v.string()), // URL or storage ID
    featuredImage: v.optional(v.string()), // URL or storage ID
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const userId = auth._id;
    const now = Date.now();

    // ============================================================================
    // 1. FIND OR CREATE SKILL CATEGORY FOR SPECIALIZATION
    // ============================================================================
    let specializationCategoryId: Id<"skillCategory"> | undefined = undefined;
    if (args.specializationLabel && args.specializationLabel.trim()) {
      // Try to find existing category
      let category = await ctx.db
        .query("skillCategory")
        .filter((q) => q.eq(q.field("name"), args.specializationLabel))
        .first();

      // If category doesn't exist, create it
      if (!category) {
        const categoryId = await ctx.db.insert("skillCategory", {
          name: args.specializationLabel,
          // Note: No icon here since UI uses emojis, but schema supports optional icon
        });
        category = {
          _id: categoryId,
          _creationTime: now,
          name: args.specializationLabel,
        };
      }

      specializationCategoryId = category._id;
    }

    // ============================================================================
    // 2. CREATE OR UPDATE USER PROFILE
    // ============================================================================
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    let profileId;
    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        bio: args.bio || existingProfile.bio,
        mainPhoto: args.mainPhoto || existingProfile.mainPhoto,
        featuredImage: args.featuredImage || existingProfile.featuredImage,
        specializationCategoryId: specializationCategoryId,
        updatedAt: now,
      });
      profileId = existingProfile._id;
    } else {
      profileId = await ctx.db.insert("userProfiles", {
        userId,
        bio: args.bio || "",
        mainPhoto: args.mainPhoto,
        featuredImage: args.featuredImage,
        specializationCategoryId,
        createdAt: now,
        updatedAt: now,
      });
    }

    // ============================================================================
    // 3. PROCESS CATALOG SKILLS
    // ============================================================================
    const processedCatalogSkills = [];

    for (const catalogSkill of args.catalogSkills) {
      // First find the category by name
      const category = await ctx.db
        .query("skillCategory")
        .filter((q) => q.eq(q.field("name"), catalogSkill.categoryName))
        .first();

      if (!category) {
        // Category not found, skip this skill
        console.warn(`Category not found: ${catalogSkill.categoryName}`);
        continue;
      }

      // Find the skill by title AND category
      const skill = await ctx.db
        .query("skill")
        .filter((q) =>
          q.and(
            q.eq(q.field("name"), catalogSkill.title),
            q.eq(q.field("categoryId"), category._id),
          ),
        )
        .first();

      if (skill) {
        // Check if user already has this skill
        const existingUserSkill = await ctx.db
          .query("userSkills")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .filter((q) => q.eq(q.field("skillId"), skill._id))
          .first();

        if (!existingUserSkill) {
          const userSkillId = await ctx.db.insert("userSkills", {
            userId,
            skillId: skill._id,
            type: catalogSkill.type,
            description: "", // No description for catalog skills from selection step
            link: "",
            createdAt: now,
          });
          processedCatalogSkills.push({
            skillId: skill._id,
            userSkillId,
            title: skill.name,
            type: catalogSkill.type,
            categoryName: catalogSkill.categoryName,
          });
        } else {
          // Update existing skill type if different
          if (existingUserSkill.type !== catalogSkill.type) {
            await ctx.db.patch(existingUserSkill._id, {
              type: catalogSkill.type,
            });
          }
          processedCatalogSkills.push({
            skillId: skill._id,
            userSkillId: existingUserSkill._id,
            title: skill.name,
            type: catalogSkill.type,
            categoryName: catalogSkill.categoryName,
          });
        }
      } else {
        // Skill not found in catalog for this category
        console.warn(
          `Skill not found: ${catalogSkill.title} in category ${catalogSkill.categoryName}`,
        );
      }
      // Note: If skill not found in catalog, it will be skipped
      // In a production app, you might want to log this or create as custom skill
    }

    // ============================================================================
    // 4. PROCESS CUSTOM SKILLS
    // ============================================================================
    const processedCustomSkills = [];

    for (const customSkill of args.customSkills) {
      // Check if custom skill already exists for this user
      const existingCustomSkill = await ctx.db
        .query("userCustomSkills")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("name"), customSkill.name))
        .first();

      if (!existingCustomSkill) {
        const customSkillId = await ctx.db.insert("userCustomSkills", {
          userId,
          name: customSkill.name,
          type: customSkill.type,
          description: customSkill.description || "",
          link: customSkill.link || "",
          createdAt: now,
        });
        processedCustomSkills.push({
          customSkillId,
          name: customSkill.name,
          type: customSkill.type,
        });
      } else {
        // Update existing custom skill
        await ctx.db.patch(existingCustomSkill._id, {
          type: customSkill.type,
          description:
            customSkill.description || existingCustomSkill.description,
          link: customSkill.link || existingCustomSkill.link,
        });
        processedCustomSkills.push({
          customSkillId: existingCustomSkill._id,
          name: customSkill.name,
          type: customSkill.type,
        });
      }
    }

    // ============================================================================
    // 5. UPDATE USER'S ONBOARDING STATUS IN AUTH
    // ============================================================================
    // Note: This requires updating the auth user's additional fields
    // The actual implementation depends on how better-auth handles updates
    // For now, we'll assume there's a way to mark onboarding as complete

    return {
      success: true,
      profileId,
      processedCatalogSkills,
      processedCustomSkills,
      specializationCategoryId,
      message: "Onboarding completed successfully",
    };
  },
});

/**
 * Save partial onboarding data (for multi-step saving)
 */
export const saveOnboardingStep = mutation({
  args: v.object({
    step: v.union(
      v.literal("skills"),
      v.literal("specialization"),
      v.literal("skillDetails"),
      v.literal("profile"),
    ),
    data: v.any(), // Flexible data for different steps
  }),
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const userId = auth._id;
    const now = Date.now();

    // Get or create profile
    let profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      const profileId = await ctx.db.insert("userProfiles", {
        userId,
        bio: "",
        createdAt: now,
        updatedAt: now,
      });
      profile = await ctx.db.get(profileId);
      if (!profile) {
        throw new ConvexError("Failed to create profile");
      }
    }

    // Update based on step
    switch (args.step) {
      case "profile":
        if (args.data.bio !== undefined) {
          await ctx.db.patch(profile._id, {
            bio: args.data.bio,
            updatedAt: now,
          });
        }
        if (args.data.mainPhoto !== undefined) {
          await ctx.db.patch(profile._id, {
            mainPhoto: args.data.mainPhoto,
            updatedAt: now,
          });
        }
        if (args.data.featuredImage !== undefined) {
          await ctx.db.patch(profile._id, {
            featuredImage: args.data.featuredImage,
            updatedAt: now,
          });
        }
        break;

      case "specialization":
        if (
          args.data.specializationLabel &&
          args.data.specializationLabel.trim()
        ) {
          // Find or create category
          let category = await ctx.db
            .query("skillCategory")
            .filter((q) => q.eq(q.field("name"), args.data.specializationLabel))
            .first();

          if (!category) {
            const categoryId = await ctx.db.insert("skillCategory", {
              name: args.data.specializationLabel,
            });
            category = {
              _id: categoryId,
              _creationTime: now,
              name: args.data.specializationLabel,
            };
          }

          await ctx.db.patch(profile._id, {
            specializationCategoryId: category._id,
            updatedAt: now,
          });
        } else {
          // Clear specialization if label is empty
          await ctx.db.patch(profile._id, {
            specializationCategoryId: undefined,
            updatedAt: now,
          });
        }
        break;

      // Note: For skills steps, it's better to use completeOnboarding
      // or implement specific skill-saving mutations
    }

    return {
      success: true,
      step: args.step,
      profileId: profile._id,
    };
  },
});

/**
 * Clear all onboarding data for the current user (for testing/reset)
 */
export const resetOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const userId = auth._id;

    // Delete user skills
    const userSkills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const skill of userSkills) {
      await ctx.db.delete(skill._id);
    }

    // Delete user custom skills
    const userCustomSkills = await ctx.db
      .query("userCustomSkills")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const customSkill of userCustomSkills) {
      await ctx.db.delete(customSkill._id);
    }

    // Delete user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.delete(profile._id);
    }

    return {
      success: true,
      deleted: {
        userSkills: userSkills.length,
        userCustomSkills: userCustomSkills.length,
        profile: profile ? 1 : 0,
      },
    };
  },
});
