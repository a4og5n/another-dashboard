/**
 * Mailchimp API Common Link Schema
 * Shared schema for _links arrays used across all Mailchimp API endpoints
 *
 * Issue #126: DRY refactoring for shared link schemas
 * Used by: Root API, Reports, Audiences, and other endpoints with _links
 * Documentation: https://mailchimp.com/developer/marketing/api/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";

/**
 * HTTP methods enum values for API links
 */
export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const;

/**
 * Schema for API links (_links array items)
 * Common structure used across all Mailchimp API endpoints
 */
export const linkSchema = z.object({
  rel: z.string(),
  href: z.url(),
  targetSchema: z.string().optional(),
  schema: z.string().optional(),
  method: z.enum(HTTP_METHODS),
});
