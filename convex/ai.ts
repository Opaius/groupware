import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { authComponent } from "./auth";
import OpenAI from "openai";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export type AIClassification = {
  categories: string[];
  skillType: "current" | "wanted" | "both";
  matchedSkills: string[];
  explanation: string;
  queryIntent: string;
};

export type SkillCategory = {
  name: string;
  icon?: string;
};

// Shape of the JSON response expected from DeepSeek
type DeepSeekResponse = {
  categories: string[];
  skillType: "current" | "wanted" | "both";
  skillKeywords: string[];
  explanation: string;
  queryIntent: string;
};

// --------------------------------------------------------------------------
// Database Helpers (Internal Queries)
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Logic Helpers
// --------------------------------------------------------------------------

/**
 * Fuzzy match logic to find database skills based on AI keywords
 */
function matchSkillsToDatabase(
  keywords: string[],
  availableSkills: string[],
): string[] {
  const scoredMatches = new Map<string, number>();
  const lowerAvailable = availableSkills.map((s) => ({
    original: s,
    lower: s.toLowerCase(),
  }));

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();

    for (const skill of lowerAvailable) {
      let score = 0;

      // 1. Exact Match (highest priority)
      if (skill.lower === lowerKeyword) {
        score = 3;
      }
      // 2. Skill contains keyword (good match)
      else if (skill.lower.includes(lowerKeyword) && lowerKeyword.length >= 4) {
        score = 2;
      }
      // 3. Keyword contains skill (moderate match)
      else if (lowerKeyword.includes(skill.lower) && skill.lower.length >= 4) {
        score = 1;
      }
      // 4. Stripped match heuristic (lowest priority)
      else {
        const cleanSkill = skill.lower
          .replace(/development|design|engineering/g, "")
          .trim();
        const cleanKeyword = lowerKeyword
          .replace(/development|design|engineering/g, "")
          .trim();

        if (cleanSkill && cleanKeyword && cleanSkill === cleanKeyword) {
          score = 1;
        }
      }

      if (score > 0) {
        const currentScore = scoredMatches.get(skill.original) || 0;
        scoredMatches.set(skill.original, Math.max(currentScore, score));
      }
    }
  }

  // Sort by score (descending) and take top 5
  const sorted = Array.from(scoredMatches.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  return sorted;
}

/**
 * Calls DeepSeek via OpenAI SDK
 */
async function callDeepSeekAI(
  categories: SkillCategory[],
  userQuery: string,
): Promise<DeepSeekResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not defined in environment variables");
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com",
  });

  const categoryList = categories
    .map((cat) => `- ${cat.name} ${cat.icon || ""}`)
    .join("\n");

  const systemPrompt = `You are a skill matching assistant.
Available categories:
${categoryList}

Analyze the user's query.
Rules:
- "current" = user has skills (mentor)
- "wanted" = user wants skills (learner)
- "both" = ambiguous
- Extract specific skill names (e.g. "React", "Marketing")
- **EXTRACT ONLY SKILLS EXPLICITLY MENTIONED.** Do not add related skills unless the user asks for "related" things.
- If the user asks for "UI/UX", return ["UI/UX Design"]. Do not return "Art" or "Figma" unless mentioned.

Return valid JSON:
{
  "categories": ["Category 1", "Category 2"],
  "skillType": "current" | "wanted" | "both",
  "skillKeywords": ["React", "JavaScript"],
  "explanation": "Brief reasoning",
  "queryIntent": "Short summary"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");

    return JSON.parse(content) as DeepSeekResponse;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    throw new Error("Failed to classify query with AI");
  }
}

// --------------------------------------------------------------------------
// Main Action
// --------------------------------------------------------------------------

export const aiClassifyQuery = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args): Promise<AIClassification> => {
    // 1. Authentication (Assumes authComponent works with actions)
    const auth = await authComponent.getAuthUser(ctx);
    if (!auth) {
      throw new ConvexError("Not authenticated");
    }

    // 2. Fetch Context (Categories & Skills)
    const [categories, allSkillNames] = await Promise.all([
      ctx.runQuery(internal.internalai.getAllSkillCategoriesInternal),
      ctx.runQuery(internal.internalai.getAllSkillNamesInternal),
    ]);

    try {
      // 3. Attempt AI Classification
      const aiResult = await callDeepSeekAI(categories, args.query);

      // 4. Match Keywords to Real DB Skills
      const matchedSkills = matchSkillsToDatabase(
        aiResult.skillKeywords,
        allSkillNames,
      );

      // 5. Validate Categories
      const validCategoryNames = categories.map((c) => c.name);
      const finalCategories = aiResult.categories.filter((cat) =>
        validCategoryNames.some(
          (vc) => vc.toLowerCase() === cat.toLowerCase() || vc.includes(cat),
        ),
      );

      return {
        categories:
          finalCategories.length > 0
            ? finalCategories
            : ["Tech & Digital Skills"],
        skillType: aiResult.skillType,
        matchedSkills,
        explanation: aiResult.explanation,
        queryIntent: aiResult.queryIntent,
      };
    } catch (e) {
      console.warn("AI Classification failed, falling back to keywords.", e);
      // 6. Fallback Logic (if AI fails or key is missing)
      return fallbackKeywordClassification(
        args.query,
        categories,
        allSkillNames,
      );
    }
  },
});

// --------------------------------------------------------------------------
// Fallback Logic
// --------------------------------------------------------------------------

function fallbackKeywordClassification(
  query: string,
  categories: SkillCategory[],
  allSkillNames: string[],
): AIClassification {
  const queryLower = query.toLowerCase();

  // Simple category mapping
  const matchedCategories = categories
    .filter((cat) => {
      const keywords = cat.name.toLowerCase().split(" ");
      return keywords.some((k) => k.length > 3 && queryLower.includes(k));
    })
    .map((c) => c.name);

  // Intent
  let skillType: "current" | "wanted" | "both" = "both";
  if (["mentor", "teach", "expert"].some((w) => queryLower.includes(w)))
    skillType = "current";
  if (["learn", "student", "beginner"].some((w) => queryLower.includes(w)))
    skillType = "wanted";

  // Simple keyword extraction based on common terms
  const commonTerms = [
    "react",
    "javascript",
    "design",
    "business",
    "marketing",
  ];
  const foundKeywords = commonTerms.filter((t) => queryLower.includes(t));

  const matchedSkills = matchSkillsToDatabase(foundKeywords, allSkillNames);

  return {
    categories: matchedCategories.length
      ? matchedCategories
      : ["Tech & Digital Skills"],
    skillType,
    matchedSkills,
    explanation: "Fallback keyword matching used (AI unavailable)",
    queryIntent: query,
  };
}
