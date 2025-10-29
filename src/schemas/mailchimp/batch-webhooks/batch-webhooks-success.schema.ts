/**
 * Batch Webhooks Success Response Schema
 * GET /batch-webhooks
 *
 * @see https://mailchimp.com/developer/marketing/api/batch-webhooks/list-batch-webhooks/
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual batch webhook schema
 */
export const batchWebhookSchema = z.object({
  id: z.string().min(1), // A string that uniquely identifies this Batch Webhook
  url: z.url(), // A valid URL for the Webhook
  enabled: z.boolean(), // Whether the webhook receives requests or not
  _links: z.array(linkSchema), // HATEOAS navigation links
});

/**
 * Success response for fetching batch webhooks
 */
export const batchWebhooksSuccessSchema = z.object({
  webhooks: z.array(batchWebhookSchema), // Array of batch webhook configurations
  total_items: z.number().min(0), // Total number of webhooks (max: 20)
  _links: z.array(linkSchema), // HATEOAS navigation links
});
