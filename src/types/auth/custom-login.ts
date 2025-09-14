/**
 * Custom Authentication Types
 * TypeScript types for custom login functionality
 *
 * Following established auth type patterns
 */
import { z } from "zod";
import {
  customLoginSchema,
  customRegisterSchema,
  customLoginResponseSchema,
} from "@/schemas/auth/custom-login";

/**
 * Custom Login Input Type
 */
export type CustomLoginInput = z.infer<typeof customLoginSchema>;

/**
 * Custom Register Input Type
 */
export type CustomRegisterInput = z.infer<typeof customRegisterSchema>;

/**
 * Custom Login Response Type
 */
export type CustomLoginResponse = z.infer<typeof customLoginResponseSchema>;
