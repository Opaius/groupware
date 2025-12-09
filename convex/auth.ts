import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

console.log(process.env.SITE_URL);

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    verbose: true,
    local: {
      schema: authSchema,
    },
  },
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const allUsers = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    const users = await ctx.runQuery(
      components.betterAuth.queries.getAllAuthUsers,
    );
    if (!users) return [];
    return users.filter((user) => user._id !== auth._id);
  },
});

export const getAuthUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

export const getAllUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    const sessions = await ctx.runQuery(
      components.betterAuth.queries.getAllUserSessions,
      { userId: auth._id },
    );
    if (!sessions) return [];
    return sessions;
  },
});
