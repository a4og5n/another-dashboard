/**
 * Mailchimp Common Types
 * Shared types used across all Mailchimp API integrations
 *
 * Issue #127: Refactored to use z.infer pattern consistently
 * All types now properly inferred from corresponding schemas
 */
import { z } from "zod";
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";
import {
  LinkSchema,
  HTTP_METHODS,
} from "@/schemas/mailchimp/common/link.schema";

/**
 * Mailchimp Error Response Type
 * Inferred from error schema - includes all 5 fields
 */
export type ErrorResponse = z.infer<typeof errorSchema>;

/**
 * Mailchimp Link Type
 * Inferred from common link schema
 */
export type Link = z.infer<typeof LinkSchema>;

/**
 * HTTP Method Type
 * Inferred from HTTP_METHODS enum
 */
export type HttpMethod = (typeof HTTP_METHODS)[number];
