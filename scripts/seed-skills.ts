#!/usr/bin/env bun

/**
 * Seed script for skill categories and skills
 * Run with: bun scripts/seed-skills.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

async function seedSkills() {
  // Get Convex URL from environment or use default
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error(
      "Error: NEXT_PUBLIC_CONVEX_URL environment variable is not set.",
    );
    console.error("Please set it to your Convex deployment URL.");
    console.error(
      "Example: NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud",
    );
    process.exit(1);
  }

  console.log(`🌱 Seeding skills to Convex at: ${convexUrl}`);

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log("📚 Seeding skill categories...");

    // First, seed skill categories
    const categoriesResult = await client.mutation(
      api.skills.index.seedSkillCategories,
      {},
    );

    console.log(`✅ Seeded ${categoriesResult.count} categories:`);
    categoriesResult.categories.forEach(
      (category: { name: string; icon?: string }) => {
        console.log(`   - ${category.name} ${category.icon || ""}`);
      },
    );

    console.log("\n🎯 Seeding skills...");

    // Then, seed skills
    const skillsResult = await client.mutation(api.skills.index.seedSkills, {});

    console.log(
      `✅ Seeded ${skillsResult.count} skills across ${categoriesResult.count} categories`,
    );

    // Summary of skills per category
    console.log("\n📊 Skills summary:");

    // We can't easily get the breakdown from the result, but we can query
    // Alternatively, we can just show a success message
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n✨ Your onboarding flow now has:");
    console.log(`   - ${categoriesResult.count} skill categories`);
    console.log(`   - ${skillsResult.count} pre-defined skills`);
    console.log("\n🔄 To reset and reseed, run:");
    console.log("   bun scripts/reset-skills.ts");
  } catch (error) {
    console.error("❌ Error seeding skills:");
    console.error(error);
    process.exit(1);
  }
}

// Run the seed function
if (
  typeof import.meta !== "undefined" &&
  (import.meta as { main?: boolean }).main
) {
  seedSkills();
}

export { seedSkills };
