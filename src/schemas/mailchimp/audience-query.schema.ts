import { z } from "zod";

/**
 * MailchimpAudienceQuerySchema
 * Comprehensive Zod schema for Mailchimp Lists API query parameters
 *
 * Issue #86: Consolidated duplicate schemas and added missing parameters
 * Based on: https://mailchimp.com/developer/marketing/api/lists/
 * Replaces: duplicate schema in /src/actions/mailchimp-audiences.ts
 */
export const MailchimpAudienceQuerySchema = z.object({
  // Field selection (API expects comma-separated strings)
  fields: z.string().optional(),
  exclude_fields: z.string().optional(),

  // Pagination parameters
  count: z.coerce.number().int().min(1).max(1000).default(10),
  offset: z.coerce.number().int().min(0).default(0),

  // Date filtering parameters
  before_date_created: z.string().datetime().optional(),
  since_date_created: z.string().datetime().optional(),
  before_campaign_last_sent: z.string().datetime().optional(),
  since_campaign_last_sent: z.string().datetime().optional(),

  // Email filtering
  email: z.string().email().optional(),

  // Sorting parameters
  sort_field: z.enum(["date_created", "member_count"]).default("date_created"),
  sort_dir: z.enum(["ASC", "DESC"]).default("DESC"),
});

/**
 * Alternative schema for actions/internal use where fields are arrays
 * Transforms string fields to arrays for service layer consumption
 */
export const MailchimpAudienceQueryInternalSchema =
  MailchimpAudienceQuerySchema.extend({
    fields: z.array(z.string()).optional(),
    exclude_fields: z.array(z.string()).optional(),
  });

/**
 * Transform function to convert API query params to internal format
 */
export function transformQueryParams(
  params: z.infer<typeof MailchimpAudienceQuerySchema>,
) {
  return {
    ...params,
    fields: params.fields
      ? params.fields.split(",").map((f) => f.trim())
      : undefined,
    exclude_fields: params.exclude_fields
      ? params.exclude_fields.split(",").map((f) => f.trim())
      : undefined,
  };
}
