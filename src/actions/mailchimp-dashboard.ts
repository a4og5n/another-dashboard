import { MailchimpDashboardQuerySchema } from "@/schemas/mailchimp/dashboard.schema";

/**
 * Validates Mailchimp dashboard API query params using Zod schema.
 * Returns { success, data } or { success, error }.
 */
export function validateMailchimpDashboardQuery(searchParams: URLSearchParams) {
  const params = {
    page: searchParams.get("page") ?? undefined,
    limit:
      searchParams.get("limit") ?? searchParams.get("pageSize") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    campaignType: searchParams.get("type") ?? undefined,
  };
  const result = MailchimpDashboardQuerySchema.safeParse(params);
  return result;
}
