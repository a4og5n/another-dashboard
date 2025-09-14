/**
 * Kinde Authentication User Schema
 * Schemas for Kinde user data, session management, and authentication state
 * 
 * Following established mailchimp schema patterns with Zod validation
 */
import { z } from "zod";

/**
 * User roles enum for Kinde authentication
 * Following the established enum pattern from mailchimp schemas
 */
export const USER_ROLES = ["admin", "user", "viewer"] as const;

/**
 * User permissions enum for role-based access control
 */
export const USER_PERMISSIONS = [
  "read:dashboard",
  "write:dashboard", 
  "admin:settings",
  "read:mailchimp",
  "write:mailchimp",
] as const;

/**
 * Kinde User Schema
 * Based on Kinde user profile structure
 */
export const kindeUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.string().email("Valid email is required"),
  given_name: z.string().nullable().optional(),
  family_name: z.string().nullable().optional(),
  picture: z.string().url().nullable().optional(),
  created_on: z.string().nullable().optional(),
  organization: z.string().nullable().optional(),
  job_title: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

/**
 * Authentication Session Schema
 * Represents the current user session state
 */
export const authSessionSchema = z.object({
  user: kindeUserSchema,
  isAuthenticated: z.boolean(),
  isLoading: z.boolean().default(false),
  accessToken: z.string().nullable(),
  permissions: z.array(z.enum(USER_PERMISSIONS)).default([]),
  roles: z.array(z.enum(USER_ROLES)).default([]),
});

/**
 * Authentication Error Schema
 * Following mailchimp error response pattern
 */
export const authErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  instance: z.string().optional(),
});

/**
 * Extended User Schema
 * Includes additional application-specific user data
 */
export const extendedUserSchema = kindeUserSchema.extend({
  displayName: z.string().nullable(),
  initials: z.string().nullable(),
  lastLoginAt: z.string().nullable(),
  preferences: z.object({
    theme: z.enum(["light", "dark", "system"]).default("system"),
    notifications: z.boolean().default(true),
  }).optional(),
});