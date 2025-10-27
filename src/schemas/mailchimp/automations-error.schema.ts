/**
 * Automations Error Response Schema
 * Validates error responses from the Mailchimp automations endpoint
 *
 * Endpoint: GET /automations
 * Source: Standard Mailchimp API error format
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const automationsErrorSchema = errorSchema;
