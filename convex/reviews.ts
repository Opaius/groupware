import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./utils";

// // Query to get all reviews
// export const getReviews = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query("reviews").order("desc").collect();
//   },
// });

// Mutation to create a new review
export const createReview = mutation({
  args: {
    rating: v.number(),
    comment: v.string(),
  },
  handler: withUser(async ({ db, user }, { rating, comment }) => {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const newReview = {
      userId: user.userId,
      userName: user.name || "Anonymous",
      userImage: user.pictureUrl,
      rating,
      comment,
      createdAt: Date.now(),
    };

    await db.insert("reviews", newReview);
    return { success: true };
  }),
});
