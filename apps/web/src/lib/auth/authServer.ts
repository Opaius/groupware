import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@repo/shared/drizzle"; // your drizzle instance
import { authSchema } from "@repo/shared/drizzle/schemas/expAuth";
import { genderEnum, address } from "@repo/shared/zod";
import { nationalitati } from "@repo/shared/drizzle/schemas";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  user: {
    modelName: "user",
    fields: {
      name: "full_name",
    },
    additionalFields: {
      gen: {
        fieldName: "gender",
        type: "string",
        validator: {
          input: genderEnum,
          output: genderEnum,
        },
      },
      telefon: {
        fieldName: "phone",
        type: "string",
      },
      adresa: {
        fieldName: "address",
        type: "json",
        validator: {
          input: address,
          output: address,
        },
      },
      nationalitate: {
        fieldName: "nationalitate",
        type: "string",
        references: {
          model:"nationalitati",
          field:"id",
        },
      },
    },
  },
});
