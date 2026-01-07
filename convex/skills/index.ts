import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all skill categories
 */
export const getAllSkillCategories = query({
  args: {},
  handler: async (ctx) => {
    const skillCategories = await ctx.db.query("skillCategory").collect();
    return skillCategories;
  },
});

/**
 * Get skills by category ID
 */
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

/**
 * Get skills by category name (for onboarding flow)
 */
export const getSkillsByCategoryName = query({
  args: { categoryName: v.string() },
  handler: async (ctx, args) => {
    // First find the category by name
    const category = await ctx.db
      .query("skillCategory")
      .filter((q) => q.eq(q.field("name"), args.categoryName))
      .first();

    if (!category) {
      return [];
    }

    // Get skills in this category
    const skills = await ctx.db
      .query("skill")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .collect();

    return skills;
  },
});

/**
 * Get skills by multiple category names (for onboarding flow)
 */
export const getSkillsByCategoryNames = query({
  args: { categoryNames: v.array(v.string()) },
  handler: async (ctx, args) => {
    console.log(
      "DEBUG getSkillsByCategoryNames called with:",
      args.categoryNames,
    );

    if (!args.categoryNames || args.categoryNames.length === 0) {
      console.log("DEBUG: No category names provided, returning empty array");
      return [];
    }

    // Find all categories by their names
    const categories = await Promise.all(
      args.categoryNames.map(async (categoryName) => {
        const category = await ctx.db
          .query("skillCategory")
          .filter((q) => q.eq(q.field("name"), categoryName))
          .first();
        console.log("DEBUG: Found category", categoryName, ":", category?._id);
        return category;
      }),
    );

    console.log(
      "DEBUG: All categories found:",
      categories.map((c) => c?.name),
    );

    // Filter out null categories and get skills for each
    const validCategories = categories.filter(
      (category): category is NonNullable<typeof category> => category !== null,
    );

    console.log("DEBUG: Valid categories:", validCategories.length);

    const result = await Promise.all(
      validCategories.map(async (category) => {
        const skills = await ctx.db
          .query("skill")
          .withIndex("by_category", (q) => q.eq("categoryId", category._id))
          .collect();
        console.log(
          "DEBUG: Found",
          skills.length,
          "skills for category",
          category.name,
        );
        return {
          category: {
            name: category.name,
            icon: category.icon,
          },
          skills,
        };
      }),
    );

    console.log(
      "DEBUG: Returning result with",
      result.length,
      "category groups",
    );
    return result;
  },
});

/**
 * Search for skills by name (for auto-complete)
 */
export const searchSkills = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return [];
    }

    const results = await ctx.db
      .query("skill")
      .withSearchIndex("search_skill", (q) => q.search("name", args.query))
      .take(10);

    return results;
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Seed skill categories from JSON data
 * This creates categories if they don't exist
 */
export const seedSkillCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = [
      { name: "Tech & Digital Skills", icon: "💻" },
      { name: "Creative & Design Skills", icon: "🎨" },
      { name: "Communication & Soft Skills", icon: "💬" },
      { name: "Business & Marketing Skills", icon: "📈" },
      { name: "Personal Growth & Lifestyle", icon: "🌱" },
      { name: "Practical & Everyday Skills", icon: "🧰" },
      { name: "Science & Education", icon: "🧠" },
      { name: "Social Impact & Global Studies", icon: "🌍" },
      { name: "Sports, Fitness & Performance", icon: "⚡" },
      { name: "Entertainment & Media", icon: "🎮" },
    ];

    const seededCategories = [];
    for (const categoryData of categories) {
      // Check if category already exists
      const existingCategory = await ctx.db
        .query("skillCategory")
        .filter((q) => q.eq(q.field("name"), categoryData.name))
        .first();

      if (!existingCategory) {
        const categoryId = await ctx.db.insert("skillCategory", {
          name: categoryData.name,
          icon: categoryData.icon,
        });
        seededCategories.push({
          _id: categoryId,
          name: categoryData.name,
          icon: categoryData.icon,
        });
      } else {
        seededCategories.push(existingCategory);
      }
    }

    return {
      success: true,
      count: seededCategories.length,
      categories: seededCategories,
    };
  },
});

/**
 * Seed skills from JSON data
 * This creates skills for each category if they don't exist
 */
export const seedSkills = mutation({
  args: {},
  handler: async (ctx) => {
    // First, get all categories to map names to IDs
    const categories = await ctx.db.query("skillCategory").collect();
    const categoryMap = new Map(categories.map((cat) => [cat.name, cat._id]));

    // Skills data grouped by category
    const skillsByCategory = [
      {
        categoryName: "Tech & Digital Skills",
        skills: [
          { name: "Web Development", icon: "💻" },
          { name: "Mobile App Development", icon: "📱" },
          { name: "Cloud Computing", icon: "☁️" },
          { name: "Data Science", icon: "📊" },
          { name: "Machine Learning", icon: "🤖" },
          { name: "Cybersecurity", icon: "🔒" },
          { name: "UI/UX Design", icon: "🎨" },
          { name: "DevOps", icon: "🔄" },
          { name: "Blockchain", icon: "⛓️" },
          { name: "Game Development", icon: "🎮" },
          { name: "Artificial Intelligence", icon: "🧠" },
          { name: "Augmented Reality", icon: "👓" },
          { name: "Virtual Reality", icon: "🥽" },
          { name: "Internet of Things", icon: "🌐" },
          { name: "Quantum Computing", icon: "⚛️" },
          { name: "Full-Stack Development", icon: "🔄" },
          { name: "Frontend Development", icon: "🎨" },
          { name: "Backend Development", icon: "⚙️" },
          { name: "Database Administration", icon: "🗃️" },
          { name: "API Development", icon: "🔌" },
          { name: "Software Architecture", icon: "🏗️" },
          { name: "Technical Writing", icon: "✍️" },
          { name: "IT Support", icon: "🛠️" },
          { name: "Network Administration", icon: "🌐" },
          { name: "System Administration", icon: "🖥️" },
        ],
      },
      {
        categoryName: "Creative & Design Skills",
        skills: [
          { name: "Graphic Design", icon: "🎨" },
          { name: "Photography", icon: "📷" },
          { name: "Video Editing", icon: "🎬" },
          { name: "3D Modeling", icon: "🔺" },
          { name: "Animation", icon: "🎞️" },
          { name: "Illustration", icon: "✏️" },
          { name: "Fashion Design", icon: "👗" },
          { name: "Interior Design", icon: "🛋️" },
          { name: "Typography", icon: "🔤" },
          { name: "Brand Identity", icon: "🏷️" },
          { name: "Motion Graphics", icon: "🌀" },
          { name: "Digital Art", icon: "🖼️" },
          { name: "Product Design", icon: "📦" },
          { name: "Industrial Design", icon: "🏭" },
          { name: "Architectural Design", icon: "🏛️" },
          { name: "Packaging Design", icon: "📦" },
          { name: "User Interface Design", icon: "🖱️" },
          { name: "User Experience Design", icon: "👤" },
          { name: "Character Design", icon: "👤" },
          { name: "Concept Art", icon: "🎨" },
          { name: "Calligraphy", icon: "✒️" },
          { name: "Print Design", icon: "🖨️" },
          { name: "Web Design", icon: "🌐" },
          { name: "Adobe Creative Suite", icon: "🎨" },
          { name: "Figma", icon: "🎨" },
        ],
      },
      {
        categoryName: "Communication & Soft Skills",
        skills: [
          { name: "Public Speaking", icon: "🎤" },
          { name: "Leadership", icon: "👑" },
          { name: "Team Management", icon: "🤝" },
          { name: "Negotiation", icon: "🤝" },
          { name: "Conflict Resolution", icon: "⚖️" },
          { name: "Active Listening", icon: "👂" },
          { name: "Emotional Intelligence", icon: "💖" },
          { name: "Presentation Skills", icon: "📊" },
          { name: "Networking", icon: "🌐" },
          { name: "Time Management", icon: "⏰" },
          { name: "Adaptability", icon: "🔄" },
          { name: "Empathy", icon: "❤️" },
          { name: "Critical Thinking", icon: "🤔" },
          { name: "Problem Solving", icon: "🔧" },
          { name: "Decision Making", icon: "✅" },
          { name: "Collaboration", icon: "👥" },
          { name: "Influencing Skills", icon: "✨" },
          { name: "Persuasion", icon: "💬" },
          { name: "Storytelling", icon: "📖" },
          { name: "Cultural Intelligence", icon: "🌍" },
          { name: "Feedback Delivery", icon: "💬" },
          { name: "Mentoring", icon: "👨‍🏫" },
          { name: "Coaching", icon: "👟" },
          { name: "Delegation", icon: "📋" },
          { name: "Stress Management", icon: "😌" },
        ],
      },
      {
        categoryName: "Business & Marketing Skills",
        skills: [
          { name: "Digital Marketing", icon: "📱" },
          { name: "SEO Optimization", icon: "🔍" },
          { name: "Social Media Marketing", icon: "📱" },
          { name: "Content Strategy", icon: "📝" },
          { name: "Market Research", icon: "🔍" },
          { name: "Sales Strategy", icon: "💰" },
          { name: "Business Development", icon: "📈" },
          { name: "Financial Planning", icon: "💵" },
          { name: "Project Management", icon: "📋" },
          { name: "Entrepreneurship", icon: "💡" },
          { name: "Brand Management", icon: "🏷️" },
          { name: "Customer Relationship Management", icon: "👥" },
          { name: "Analytics", icon: "📊" },
          { name: "Email Marketing", icon: "📧" },
          { name: "Affiliate Marketing", icon: "🤝" },
          { name: "Influencer Marketing", icon: "⭐" },
          { name: "Content Marketing", icon: "📝" },
          { name: "Product Management", icon: "📦" },
          { name: "Strategic Planning", icon: "🎯" },
          { name: "Risk Management", icon: "⚠️" },
          { name: "Supply Chain Management", icon: "🚚" },
          { name: "E-commerce", icon: "🛒" },
          { name: "Public Relations", icon: "📰" },
          { name: "Event Planning", icon: "🎉" },
          { name: "Business Analytics", icon: "📈" },
        ],
      },
      {
        categoryName: "Personal Growth & Lifestyle",
        skills: [
          { name: "Meditation", icon: "🧘" },
          { name: "Mindfulness", icon: "🌿" },
          { name: "Goal Setting", icon: "🎯" },
          { name: "Habit Building", icon: "🔄" },
          { name: "Stress Management", icon: "😌" },
          { name: "Personal Finance", icon: "💰" },
          { name: "Nutrition Planning", icon: "🥗" },
          { name: "Sleep Optimization", icon: "😴" },
          { name: "Journaling", icon: "📔" },
          { name: "Self-Reflection", icon: "🤔" },
          { name: "Emotional Regulation", icon: "😌" },
          { name: "Time Management", icon: "⏰" },
          { name: "Self-Discipline", icon: "💪" },
          { name: "Mindfulness Meditation", icon: "🧘‍♂️" },
          { name: "Gratitude Practice", icon: "🙏" },
          { name: "Decluttering", icon: "🧹" },
          { name: "Digital Detox", icon: "📵" },
          { name: "Work-Life Balance", icon: "⚖️" },
          { name: "Positive Psychology", icon: "😊" },
          { name: "Resilience Building", icon: "🛡️" },
          { name: "Confidence Building", icon: "💪" },
          { name: "Assertiveness", icon: "🗣️" },
          { name: "Creativity Cultivation", icon: "🎨" },
          { name: "Learning Strategies", icon: "📚" },
          { name: "Self-Care Practices", icon: "💆" },
        ],
      },
      {
        categoryName: "Practical & Everyday Skills",
        skills: [
          { name: "Cooking", icon: "👨‍🍳" },
          { name: "Baking", icon: "🍰" },
          { name: "Home Repair", icon: "🔨" },
          { name: "Gardening", icon: "🌱" },
          { name: "Sewing", icon: "🧵" },
          { name: "Car Maintenance", icon: "🚗" },
          { name: "First Aid", icon: "🩹" },
          { name: "Budgeting", icon: "💰" },
          { name: "Cleaning", icon: "🧹" },
          { name: "Organization", icon: "🗂️" },
          { name: "Basic Plumbing", icon: "🚰" },
          { name: "Electrical Work", icon: "⚡" },
          { name: "Carpentry", icon: "🪚" },
          { name: "Painting", icon: "🎨" },
          { name: "Laundry Skills", icon: "👕" },
          { name: "Meal Planning", icon: "🍽️" },
          { name: "Grocery Shopping", icon: "🛒" },
          { name: "Childcare", icon: "👶" },
          { name: "Pet Care", icon: "🐶" },
          { name: "Home Security", icon: "🔒" },
          { name: "Time Management", icon: "⏰" },
          { name: "Basic Accounting", icon: "💰" },
          { name: "Home Improvement", icon: "🏠" },
          { name: "DIY Projects", icon: "🛠️" },
          { name: "Sustainable Living", icon: "🌱" },
        ],
      },
      {
        categoryName: "Science & Education",
        skills: [
          { name: "Scientific Research", icon: "🔬" },
          { name: "Data Analysis", icon: "📈" },
          { name: "Laboratory Techniques", icon: "🧪" },
          { name: "Teaching", icon: "👩‍🏫" },
          { name: "Curriculum Design", icon: "📚" },
          { name: "Academic Writing", icon: "✍️" },
          { name: "Mentoring", icon: "👥" },
          { name: "Critical Thinking", icon: "🧠" },
          { name: "Research Methodology", icon: "📋" },
          { name: "Scientific Communication", icon: "💬" },
          { name: "Tutoring", icon: "📖" },
          { name: "Educational Technology", icon: "💻" },
          { name: "Online Teaching", icon: "🖥️" },
          { name: "Assessment Design", icon: "📝" },
          { name: "Learning Science", icon: "🧠" },
          { name: "Educational Psychology", icon: "🧠" },
          { name: "Special Education", icon: "🌟" },
          { name: "Adult Education", icon: "👨‍🎓" },
          { name: "STEM Education", icon: "🔬" },
          { name: "Literacy Development", icon: "📚" },
          { name: "Educational Leadership", icon: "👑" },
          { name: "Grant Writing", icon: "✍️" },
          { name: "Peer Review", icon: "👁️" },
          { name: "Scientific Illustration", icon: "🎨" },
          { name: "Academic Publishing", icon: "📰" },
        ],
      },
      {
        categoryName: "Social Impact & Global Studies",
        skills: [
          { name: "Nonprofit Management", icon: "🏛️" },
          { name: "Community Organizing", icon: "👥" },
          { name: "Fundraising", icon: "💰" },
          { name: "Grant Writing", icon: "✍️" },
          { name: "Advocacy", icon: "📢" },
          { name: "Policy Analysis", icon: "📜" },
          { name: "Social Research", icon: "🔍" },
          { name: "Cultural Competency", icon: "🌍" },
          { name: "Volunteer Coordination", icon: "🤝" },
          { name: "Sustainability Planning", icon: "🌱" },
          { name: "Human Rights", icon: "✊" },
          { name: "Environmental Justice", icon: "⚖️" },
          { name: "Social Entrepreneurship", icon: "💡" },
          { name: "Community Development", icon: "🏘️" },
          { name: "International Relations", icon: "🌐" },
          { name: "Public Policy", icon: "📜" },
          { name: "Conflict Resolution", icon: "🕊️" },
          { name: "Humanitarian Aid", icon: "🆘" },
          { name: "Disaster Response", icon: "🌪️" },
          { name: "Social Work", icon: "👥" },
          { name: "Public Health", icon: "🏥" },
          { name: "Environmental Science", icon: "🌿" },
          { name: "Urban Planning", icon: "🏙️" },
          { name: "Gender Studies", icon: "⚧️" },
          { name: "International Development", icon: "🌍" },
        ],
      },
      {
        categoryName: "Sports, Fitness & Performance",
        skills: [
          { name: "Personal Training", icon: "💪" },
          { name: "Yoga Instruction", icon: "🧘" },
          { name: "Nutrition Coaching", icon: "🥗" },
          { name: "Sports Coaching", icon: "⚽" },
          { name: "Dance Instruction", icon: "💃" },
          { name: "Martial Arts", icon: "🥋" },
          { name: "Swimming Instruction", icon: "🏊" },
          { name: "Strength Training", icon: "🏋️" },
          { name: "Cardio Fitness", icon: "🏃" },
          { name: "Rehabilitation", icon: "🩺" },
          { name: "Sports Psychology", icon: "🧠" },
          { name: "Exercise Physiology", icon: "💓" },
          { name: "Sports Nutrition", icon: "🥗" },
          { name: "Team Sports", icon: "🤝" },
          { name: "Individual Sports", icon: "🏅" },
          { name: "Outdoor Activities", icon: "🏕️" },
          { name: "Physical Therapy", icon: "🩹" },
          { name: "Massage Therapy", icon: "💆" },
          { name: "Athletic Performance", icon: "⚡" },
          { name: "Injury Prevention", icon: "🛡️" },
          { name: "Sports Management", icon: "📊" },
          { name: "Fitness Assessment", icon: "📋" },
          { name: "Group Fitness", icon: "👥" },
          { name: "Mind-Body Practices", icon: "🧘‍♀️" },
          { name: "Adventure Sports", icon: "🧗" },
        ],
      },
      {
        categoryName: "Entertainment & Media",
        skills: [
          { name: "Acting", icon: "🎭" },
          { name: "Singing", icon: "🎤" },
          { name: "Music Production", icon: "🎵" },
          { name: "Screenwriting", icon: "📝" },
          { name: "Film Directing", icon: "🎬" },
          { name: "Podcast Production", icon: "🎙️" },
          { name: "Stand-up Comedy", icon: "😂" },
          { name: "Voice Acting", icon: "🗣️" },
          { name: "Event Hosting", icon: "🎤" },
          { name: "Broadcasting", icon: "📡" },
          { name: "Content Creation", icon: "🎬" },
          { name: "Social Media Content", icon: "📱" },
          { name: "Video Production", icon: "🎥" },
          { name: "Sound Design", icon: "🎧" },
          { name: "Lighting Design", icon: "💡" },
          { name: "Set Design", icon: "🎭" },
          { name: "Costume Design", icon: "👗" },
          { name: "Makeup Artistry", icon: "💄" },
          { name: "Photography", icon: "📷" },
          { name: "Journalism", icon: "📰" },
          { name: "Editing", icon: "✂️" },
          { name: "Storyboarding", icon: "📋" },
          { name: "Cinematography", icon: "🎥" },
          { name: "Music Composition", icon: "🎼" },
          { name: "Live Performance", icon: "🎤" },
        ],
      },
    ];

    let totalSeeded = 0;
    const seededSkills = [];

    for (const categoryData of skillsByCategory) {
      const categoryId = categoryMap.get(categoryData.categoryName);
      if (!categoryId) {
        console.warn(`Category not found: ${categoryData.categoryName}`);
        continue;
      }

      for (const skillData of categoryData.skills) {
        // Check if skill already exists in this category
        const existingSkill = await ctx.db
          .query("skill")
          .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
          .filter((q) => q.eq(q.field("name"), skillData.name))
          .first();

        if (!existingSkill) {
          const skillId = await ctx.db.insert("skill", {
            name: skillData.name,
            icon: skillData.icon,
            categoryId,
          });
          seededSkills.push({
            _id: skillId,
            name: skillData.name,
            icon: skillData.icon,
            categoryId,
          });
          totalSeeded++;
        }
      }
    }

    return {
      success: true,
      count: totalSeeded,
      skills: seededSkills,
    };
  },
});

/**
 * Clear all skills and categories (for testing/reset)
 */
export const clearAllSkills = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all skills first (foreign key constraint)
    const skills = await ctx.db.query("skill").collect();
    for (const skill of skills) {
      await ctx.db.delete(skill._id);
    }

    // Delete all categories
    const categories = await ctx.db.query("skillCategory").collect();
    for (const category of categories) {
      await ctx.db.delete(category._id);
    }

    return {
      success: true,
      deleted: {
        skills: skills.length,
        categories: categories.length,
      },
    };
  },
});
