import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@repo/shared/drizzle"; // your drizzle instance
import { authSchema } from "@repo/shared/drizzle/schemas/expAuth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
});
