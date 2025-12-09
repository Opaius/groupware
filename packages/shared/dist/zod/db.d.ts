import z from "zod/v4";
export declare const genderEnum: z.ZodEnum<{
    male: "male";
    female: "female";
    other: "other";
}>;
export declare const address: z.ZodObject<{
    city: z.ZodString;
    region: z.ZodString;
    country: z.ZodString;
    zipCode: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=db.d.ts.map