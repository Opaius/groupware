// inside convex/betterAuth/queries.ts
import { v } from "convex/values";
import { query } from "./_generated/server";
import schema from "./schema";
import { doc } from "convex-helpers/validators";


export const getAllAuthUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("user").collect();
  },
  returns: v.union(v.null(), v.array(doc(schema, "user"))),
});
