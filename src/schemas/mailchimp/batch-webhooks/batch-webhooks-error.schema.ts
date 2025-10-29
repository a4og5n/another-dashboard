/**
 * Batch Webhooks Error Response Schema
 * GET /batch-webhooks
 *
 * @see https://mailchimp.com/developer/marketing/api/batch-webhooks/list-batch-webhooks/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

/**
 * Error response for batch webhooks endpoint
 * Reuses common Mailchimp API error format
 */
export const batchWebhooksErrorSchema = errorSchema;
