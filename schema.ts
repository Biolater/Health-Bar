import { z } from "zod";

const signUpFormSchema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address (e.g., john.doe@example.com)")
      .transform((val) => val.trim()),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^\S+$/, "Username cannot contain spaces")
      .transform((val) => val.trim()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine(
        (val) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
            val
          ),
        {
          message:
            "Password must include uppercase, lowercase, numbers, and symbols",
        }
      )
      .transform((val) => val.trim()),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .transform((val) => val.trim()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const signInFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address (e.g., john.doe@example.com)")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .transform((val) => val.trim()),
});

export { signUpFormSchema, signInFormSchema };
