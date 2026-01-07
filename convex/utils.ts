import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server";

export function makeDirectKey(a: string, b: string) {
  return [a, b].sort().join("|");
}

type User = {
  userId: string;
  name: string | null;
  pictureUrl: string | null;
};

type WithUserContext = {
  db: any;
  user: User;
};

export const withUser = <T extends any[], R>(
  handler: (ctx: WithUserContext, ...args: T) => Promise<R>
) => {
  return async (ctx: any, ...args: T) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = {
      userId: identity.subject,
      name: identity.name ?? null,
      pictureUrl: identity.pictureUrl ?? null,
    };

    return handler({ ...ctx, user }, ...args);
  };
};
