// inside convex/betterAuth/queries.ts
import { v } from "convex/values";
import { query } from "./_generated/server";
import schema from "./schema";
import { doc } from "convex-helpers/validators";
import { authComponent } from "../auth";

export const getAllAuthUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("user").collect();
  },
  returns: v.union(v.null(), v.array(doc(schema, "user"))),
});
export const getAllUserSessions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("session")
      .withIndex("userId", (p) => p.eq("userId", args.userId))
      .collect();
    return sessions;
  },
  returns: v.array(doc(schema, "session")),
});
