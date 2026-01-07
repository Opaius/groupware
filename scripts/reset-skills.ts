#!/usr/bin/env bun

/**
 * Reset script for skill categories and skills
 * Run with: bun scripts/reset-skills.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

async function resetSkills() {
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

  console.log(`🗑️  Resetting skills from Convex at: ${convexUrl}`);

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log("⚠️  Clearing all skills and categories...");

    // Clear all skills and categories
    const resetResult = await client.mutation(
      api.skills.index.clearAllSkills,
      {},
    );

    console.log(`✅ Successfully cleared:`);
    console.log(`   - ${resetResult.deleted.skills} skills`);
    console.log(`   - ${resetResult.deleted.categories} categories`);

    console.log("\n✨ Database reset completed!");
    console.log("\n🌱 To reseed with default data, run:");
    console.log("   bun scripts/seed-skills.ts");
  } catch (error) {
    console.error("❌ Error resetting skills:");
    console.error(error);
    process.exit(1);
  }
}

// Run the reset function
if (
  typeof import.meta !== "undefined" &&
  (import.meta as { main?: boolean }).main
) {
  resetSkills();
}

export { resetSkills };
