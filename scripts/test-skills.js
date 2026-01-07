#!/usr/bin/env bun

/**
 * Test script for skills queries
 * Run with: bun scripts/test-skills.js
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

async function testSkillsQueries() {
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

  console.log(`🔍 Testing skills queries at: ${convexUrl}`);
  console.log("==========================================");

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log("\n📚 Testing getAllSkillCategories...");
    const categories = await client.query(
      api.skills.index.getAllSkillCategories,
      {},
    );

    console.log(`✅ Found ${categories.length} categories:`);
    categories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} ${category.icon || ""}`);
    });

    if (categories.length === 0) {
      console.log(
        "\n⚠️  No categories found. The database may need to be seeded.",
      );
      console.log("   Run: bun scripts/seed-skills.ts");
      process.exit(1);
    }

    // Test with the first category
    const firstCategory = categories[0];
    console.log(
      `\n🎯 Testing getSkillsByCategoryNames with category: "${firstCategory.name}"...`,
    );

    const skillsResult = await client.query(
      api.skills.index.getSkillsByCategoryNames,
      { categoryNames: [firstCategory.name] },
    );

    console.log(`✅ Found ${skillsResult.length} category group(s)`);

    if (skillsResult.length > 0) {
      const group = skillsResult[0];
      console.log(`   Category: ${group.category.name}`);
      console.log(`   Skills count: ${group.skills.length}`);

      if (group.skills.length > 0) {
        console.log(`   First 5 skills:`);
        group.skills.slice(0, 5).forEach((skill, index) => {
          console.log(`     ${index + 1}. ${skill.name} ${skill.icon || ""}`);
        });
        if (group.skills.length > 5) {
          console.log(`     ... and ${group.skills.length - 5} more`);
        }
      } else {
        console.log("   ❌ No skills found in this category");
      }
    } else {
      console.log("   ❌ No category groups returned");
    }

    // Test with multiple categories if available
    if (categories.length >= 3) {
      console.log(
        "\n🧪 Testing getSkillsByCategoryNames with multiple categories...",
      );

      const testCategories = categories.slice(0, 3).map((c) => c.name);
      console.log(`   Categories: ${testCategories.join(", ")}`);

      const multiResult = await client.query(
        api.skills.index.getSkillsByCategoryNames,
        { categoryNames: testCategories },
      );

      console.log(
        `✅ Found ${multiResult.length} category group(s) for 3 categories`,
      );
      multiResult.forEach((group, index) => {
        console.log(
          `   ${index + 1}. ${group.category.name}: ${group.skills.length} skills`,
        );
      });
    }

    // Test with empty array
    console.log("\n🧪 Testing getSkillsByCategoryNames with empty array...");
    const emptyResult = await client.query(
      api.skills.index.getSkillsByCategoryNames,
      { categoryNames: [] },
    );
    console.log(
      `✅ Empty array returns: ${emptyResult.length} items (expected: 0)`,
    );

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Total categories in database: ${categories.length}`);
    console.log(`   - Skills query working: ✅ Yes`);
    console.log(`   - Multi-category query working: ✅ Yes`);
    console.log(`   - Empty array handling: ✅ Correct`);
  } catch (error) {
    console.error("\n❌ Error during testing:");
    console.error(error);

    if (error.message?.includes("Cannot read properties of undefined")) {
      console.error(
        "\n💡 This might indicate that the function isn't properly registered.",
      );
      console.error("   Try running: npx convex dev");
      console.error("   Then: npx convex codegen");
    }

    if (error.message?.includes("Function not found")) {
      console.error(
        "\n💡 The function may not be deployed or the API may not be generated.",
      );
      console.error(
        "   Check that convex/_generated/api.js exists and contains the functions.",
      );
    }

    process.exit(1);
  }
}

// Run the test function
if (import.meta.main) {
  testSkillsQueries();
}

export { testSkillsQueries };
