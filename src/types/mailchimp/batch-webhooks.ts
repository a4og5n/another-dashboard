/**
 * Batch Webhooks Types
 * Inferred from Zod schemas
 */

import type { z } from "zod";
import type {
  batchWebhookSchema,
  batchWebhooksSuccessSchema,
} from "@/schemas/mailchimp/batch-webhooks/batch-webhooks-success.schema";

/**
 * Individual batch webhook
 */
export type BatchWebhook = z.infer<typeof batchWebhookSchema>;

/**
 * Batch webhooks list response
 */
export type BatchWebhooksResponse = z.infer<typeof batchWebhooksSuccessSchema>;
