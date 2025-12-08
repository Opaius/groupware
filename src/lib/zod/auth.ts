import z from "zod";

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SignupFormData = z.infer<typeof signupFormSchema>;
