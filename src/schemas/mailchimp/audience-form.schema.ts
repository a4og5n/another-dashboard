/**
 * Audience Form Validation Schema
 *
 * Zod schema for validating audience form data in UI components.
 * Used for client-side form validation in AudienceForm component.
 */

import { z } from "zod";
import { VISIBILITY } from "./audience.schema";

/**
 * Contact information validation schema
 */
const AudienceFormContactSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
});

/**
 * Campaign defaults validation schema
 */
const AudienceFormCampaignDefaultsSchema = z.object({
  from_name: z.string().min(1, "From name is required"),
  from_email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Default subject is required"),
  language: z.string().min(1, "Language is required"),
});

/**
 * Main audience form validation schema
 */
export const AudienceFormDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Audience name is required"),
  contact: AudienceFormContactSchema,
  permission_reminder: z.string().min(1, "Permission reminder is required"),
  campaign_defaults: AudienceFormCampaignDefaultsSchema,
  email_type_option: z.boolean(),
  use_archive_bar: z.boolean(),
  visibility: z.enum(VISIBILITY),
  notify_on_subscribe: z
    .string()
    .email("Valid email required")
    .optional()
    .or(z.literal("")),
  notify_on_unsubscribe: z
    .string()
    .email("Valid email required")
    .optional()
    .or(z.literal("")),
});

/**
 * Type for audience form data derived from schema
 */
export type AudienceFormData = z.infer<typeof AudienceFormDataSchema>;

/**
 * Validation function for audience form
 * Returns validation errors in a flat object structure for easy form handling
 */
export const validateAudienceForm = (
  data: unknown,
): { errors: Record<string, string>; isValid: boolean } => {
  const result = AudienceFormDataSchema.safeParse(data);

  if (result.success) {
    return { errors: {}, isValid: true };
  }

  // Convert Zod errors to flat structure for form handling
  const errors: Record<string, string> = {};

  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { errors, isValid: false };
};
