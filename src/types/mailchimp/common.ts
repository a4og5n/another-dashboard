/**
 * Mailchimp Common Types
 * Shared types used across all Mailchimp API integrations
 *
 * Issue #127: Refactored to use z.infer pattern consistently
 * All types now properly inferred from corresponding schemas
 */
import { z } from "zod";
import { mailchimpErrorResponseSchema } from "@/schemas/mailchimp/common/error-response.schema";
import {
  MailchimpLinkSchema,
  HTTP_METHODS,
} from "@/schemas/mailchimp/common/link.schema";

/**
 * Mailchimp Error Response Type
 * Inferred from error response schema - includes all 5 fields
 */
export type MailchimpErrorResponse = z.infer<
  typeof mailchimpErrorResponseSchema
>;

/**
 * Mailchimp Link Type
 * Inferred from common link schema
 */
export type MailchimpLink = z.infer<typeof MailchimpLinkSchema>;

/**
 * HTTP Method Type
 * Inferred from HTTP_METHODS enum
 */
export type HttpMethod = (typeof HTTP_METHODS)[number];
