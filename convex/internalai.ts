import { internalQuery } from "./_generated/server";
type SkillCategory = {
  name: string;
  icon?: string;
};
/**
 * Fetches all skill categories to provide context to the AI
 */
export const getAllSkillCategoriesInternal = internalQuery({
  args: {},
  handler: async (ctx): Promise<SkillCategory[]> => {
    const categories = await ctx.db.query("skillCategory").collect();
    return categories.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
    }));
  },
});

/**
 * Fetches all available skill names (standard + custom) for fuzzy matching.
 * Note: specific matching logic is better handled in the Action or a dedicated search service
 * to avoid blocking the DB, but this works for datasets < 10k items.
 */
export const getAllSkillNamesInternal = internalQuery({
  args: {},
  handler: async (ctx): Promise<string[]> => {
    const allSkills = await ctx.db.query("skill").collect();
    const customSkills = await ctx.db.query("userCustomSkills").collect();

    return [
      ...allSkills.map((s) => s.name),
      ...customSkills.map((cs) => cs.name),
    ];
  },
});
