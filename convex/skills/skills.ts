import { v } from "convex/values";
import { query } from "../_generated/server";

export const getAllSkillCategories = query({
  args: {},
  handler: async (ctx, args) => {
    const skillCategories = await ctx.db.query("skillCategory").collect();
    return skillCategories;
  },
});

export const getSkillsByCategory = query({
  args: { categoryId: v.id("skillCategory") },
  handler: async (ctx, args) => {
    const skills = await ctx.db
      .query("skill")
      .withIndex("by_category", (p) => p.eq("categoryId", args.categoryId))
      .collect();

    return skills;
  },
});
