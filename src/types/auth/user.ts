/**
 * Auth User Types
 * TypeScript types inferred from auth schemas using z.infer pattern
 * 
 * Following established mailchimp type patterns exactly
 */
import { z } from "zod";
import {
  kindeUserSchema,
  authSessionSchema,
  authErrorSchema,
  extendedUserSchema,
  USER_ROLES,
  USER_PERMISSIONS,
} from "@/schemas/auth/user";

/**
 * Kinde User Type
 * Inferred from kindeUserSchema
 */
export type KindeUser = z.infer<typeof kindeUserSchema>;

/**
 * Authentication Session Type
 * Inferred from authSessionSchema
 */
export type AuthSession = z.infer<typeof authSessionSchema>;

/**
 * Authentication Error Type
 * Inferred from authErrorSchema
 */
export type AuthError = z.infer<typeof authErrorSchema>;

/**
 * Extended User Type
 * Inferred from extendedUserSchema
 */
export type ExtendedUser = z.infer<typeof extendedUserSchema>;

/**
 * User Role Type
 * Inferred from USER_ROLES enum
 */
export type UserRole = (typeof USER_ROLES)[number];

/**
 * User Permission Type
 * Inferred from USER_PERMISSIONS enum
 */
export type UserPermission = (typeof USER_PERMISSIONS)[number];