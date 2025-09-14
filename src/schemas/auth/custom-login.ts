/**
 * Custom Authentication Schemas
 * Zod schemas for custom login/registration forms
 *
 * Following established auth schema patterns
 */
import { z } from "zod";

/**
 * Custom Login Schema
 * For email/password login forms
 */
export const customLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Custom Registration Schema
 * For user registration forms
 */
export const customRegisterSchema = z
  .object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    given_name: z.string().min(1, "First name is required"),
    family_name: z.string().min(1, "Last name is required"),
    confirm_password: z.string().min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

/**
 * Custom Login Response Schema
 * Response from custom login action
 */
export const customLoginResponseSchema = z.object({
  success: z.boolean(),
  redirectUrl: z.string().url().optional(),
  error: z
    .object({
      type: z.string(),
      title: z.string(),
      status: z.number(),
      detail: z.string(),
    })
    .optional(),
});
