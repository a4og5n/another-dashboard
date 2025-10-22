/**
 * Page parameter schema for Campaign Email Activity page
 * Used for validating route parameters in the email activity page component
 */

import { z } from "zod";

/**
 * Schema for email activity page route parameters
 * Validates the campaign ID from the URL path
 */
export const emailActivityPageParamsSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
});
