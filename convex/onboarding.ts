import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";
import { components } from "./_generated/api";

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

/**
 * Parse storage ID from either plain string or JSON string
 * Handles cases where storageId might be a JSON string like {"storageId":"..."}
 * Also handles double-encoded JSON strings (quoted JSON strings)
 * Recursively parses until a non-JSON string or string without storageId field
 */
function parseStorageId(
  storageId: string | null | undefined,
): string | null | undefined {
  if (!storageId) return storageId;

  let actualStorageId = storageId.trim();
  let changed = true;
  let iterations = 0;

  // Keep parsing as long as we're making progress, but limit iterations to prevent infinite loops
  while (changed && iterations < 10) {
    changed = false;
    iterations++;

    // Try to strip outer quotes if present
    if (
      actualStorageId.length >= 2 &&
      actualStorageId[0] === '"' &&
      actualStorageId[actualStorageId.length - 1] === '"'
    ) {
      actualStorageId = actualStorageId.slice(1, -1);
      changed = true;
    }

    try {
      const parsed = JSON.parse(actualStorageId);
      if (parsed && typeof parsed.storageId === "string") {
        actualStorageId = parsed.storageId;
        changed = true;
      }
    } catch {
      // Not JSON, use as-is
    }
  }

  return actualStorageId;
}

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

    // Parse storage IDs if they exist in the profile
    let parsedProfile = null;
    if (profile) {
      parsedProfile = {
        ...profile,
        mainPhoto: parseStorageId(profile.mainPhoto),
        featuredImage: parseStorageId(profile.featuredImage),
      };
    }

    return {
      hasSeenOnboarding,
      hasProfile,
      profile: parsedProfile || null,
    };
  },
});

/**
 * Get a download URL for a storage ID
 */
export const getImageUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    if (!args.storageId || args.storageId.trim() === "") {
      throw new ConvexError("Storage ID is required");
    }

    // Parse storageId - it might be a JSON string containing storageId field
    const actualStorageId = parseStorageId(args.storageId);
    if (!actualStorageId) {
      throw new ConvexError("Invalid storage ID");
    }

    // Get URL for the storage ID
    const url = await ctx.storage.getUrl(actualStorageId);

    return {
      success: true,
      url,
      storageId: actualStorageId,
      exists: url !== null,
    };
  },
});

/**
 * Get complete user profile data including skills for edit-profile page
 */
export const getUserProfileWithSkills = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    const userId = args.userId || auth._id;

    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return {
        profile: null,
        catalogSkills: [],
        customSkills: [],
        authUser: auth,
        hasSeenOnboarding: auth.hasSeenOnboarding || false,
      };
    }

    // Parse storage IDs in profile
    const parsedProfile = {
      ...profile,
      mainPhoto: parseStorageId(profile.mainPhoto),
      featuredImage: parseStorageId(profile.featuredImage),
    };

    // Get catalog skills (userSkills with skill details)
    const userSkills = await ctx.db
      .query("userSkills")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const catalogSkills = [];
    for (const userSkill of userSkills) {
      const skill = await ctx.db.get(userSkill.skillId);
      if (skill) {
        const category = skill.categoryId
          ? await ctx.db.get(skill.categoryId)
          : null;
        catalogSkills.push({
          id: userSkill._id,
          skillId: skill._id,
          name: skill.name,
          icon: skill.icon || "",
          type: userSkill.type,
          description: userSkill.description || "",
          category: category ? category.name : "Unknown",
          createdAt: userSkill.createdAt,
        });
      }
    }

    // Get custom skills
    const userCustomSkills = await ctx.db
      .query("userCustomSkills")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const customSkills = userCustomSkills.map((skill) => ({
      id: skill._id,
      name: skill.name,
      type: skill.type,
      category: skill.category || "Other",
      description: skill.description || "",
      link: skill.link || "",
      createdAt: skill.createdAt,
    }));

    return {
      profile: parsedProfile,
      catalogSkills,
      customSkills,
      authUser: auth,
      hasSeenOnboarding: auth.hasSeenOnboarding || false,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Generate upload URLs for profile images
 */
export const generateUploadUrl = mutation({
  args: {
    count: v.optional(v.number()), // Number of URLs to generate (default: 1)
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
        category: v.optional(v.string()),
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
        mainPhoto:
          (parseStorageId(args.mainPhoto) ?? undefined) ||
          existingProfile.mainPhoto,
        featuredImage:
          (parseStorageId(args.featuredImage) ?? undefined) ||
          existingProfile.featuredImage,
        specializationCategoryId: specializationCategoryId,
        updatedAt: now,
      });
      profileId = existingProfile._id;
    } else {
      profileId = await ctx.db.insert("userProfiles", {
        userId,
        bio: args.bio || "",
        mainPhoto: parseStorageId(args.mainPhoto) ?? undefined,
        featuredImage: parseStorageId(args.featuredImage) ?? undefined,
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
          category: customSkill.category,
          description: customSkill.description || "",
          link: customSkill.link || "",
          createdAt: now,
        });
        processedCustomSkills.push({
          customSkillId,
          name: customSkill.name,
          type: customSkill.type,
          category: customSkill.category,
        });
      } else {
        // Update existing custom skill
        await ctx.db.patch(existingCustomSkill._id, {
          type: customSkill.type,
          category: customSkill.category,
          description:
            customSkill.description || existingCustomSkill.description,
          link: customSkill.link || existingCustomSkill.link,
        });
        processedCustomSkills.push({
          customSkillId: existingCustomSkill._id,
          name: customSkill.name,
          type: customSkill.type,
          category: customSkill.category,
        });
      }
    }

    // ============================================================================
    // 5. UPDATE USER'S ONBOARDING STATUS IN AUTH
    // ============================================================================
    // Update the user's onboarding status in the auth table using Better-Auth adapter
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        update: { hasSeenOnboarding: true },
        where: [{ field: "_id", operator: "eq", value: auth._id }],
      },
    });

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
            mainPhoto: parseStorageId(args.data.mainPhoto) ?? undefined,
            updatedAt: now,
          });
        }
        if (args.data.featuredImage !== undefined) {
          await ctx.db.patch(profile._id, {
            featuredImage: parseStorageId(args.data.featuredImage) ?? undefined,
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
