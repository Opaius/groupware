import z from "zod/v4";

export const genderEnum = z.enum(["male", "female", "other"]);
export const address = z.object({
  city: z.string(),
  region: z.string(),
  country: z.string(),
  zipCode: z.string(),
});
