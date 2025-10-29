/**
 * Batch Webhooks Query Parameters Schema
 * GET /batch-webhooks
 *
 * @see https://mailchimp.com/developer/marketing/api/batch-webhooks/list-batch-webhooks/
 */

import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";

/**
 * Query parameters for fetching batch webhooks
 * Supports standard pagination (count, offset) and field filtering (fields, exclude_fields)
 */
export const batchWebhooksQueryParamsSchema = standardQueryParamsSchema;
