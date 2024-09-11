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
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (val) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
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
      .min(8, "Password must be at least 8 characters long")
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
    .min(8, "Password must be at least 8 characters long")
    .transform((val) => val.trim()),
});

const userSettingsSchema = z.object({
  username: z
    .string()
    .trim() // Remove leading and trailing whitespace
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long") // Optional: Set a maximum length
    .regex(/^\S+$/, "Username cannot contain spaces")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, and underscores"
    ) // Optional: Only allow alphanumeric characters and underscores
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Please enter a valid email address (e.g., john.doe@example.com)")
    .transform((val) => val.trim()),
  bio: z
    .string()
    .min(3, "Bio must be at least 3 characters long")
    .transform((val) => val.trim()),
  location: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Please enter a valid URL (e.g., https://example.com)",
    })
    .transform((val) => val?.trim()),
  pronouns: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

const updatePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export {
  signUpFormSchema,
  signInFormSchema,
  userSettingsSchema,
  updatePasswordFormSchema,
};
