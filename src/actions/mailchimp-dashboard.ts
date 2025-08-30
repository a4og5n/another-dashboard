import { mailchimpDashboardPaginationSchema } from "@/schemas/mailchimp/mailchimp-dashboard-pagination";
import { z } from "zod";

/**
 * Validates Mailchimp dashboard API query params using Zod schema.
 * Returns { success, data } or { success, error }.
 */
export function validateMailchimpDashboardQuery(searchParams: URLSearchParams) {
  const validDate = (val: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
    const [year, month, day] = val.split("-").map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    // Days in month, accounting for leap years
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    return true;
  };
  const querySchema = mailchimpDashboardPaginationSchema.extend({
    startDate: z
      .string()
      .refine((val) => val === "" || validDate(val), {
        message: "Invalid date format or value",
      })
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    endDate: z
      .string()
      .refine((val) => val === "" || validDate(val), {
        message: "Invalid date format or value",
      })
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    campaignType: z.string().optional(),
  });
  const params = {
    page: searchParams.get("page") ?? undefined,
    limit:
      searchParams.get("limit") ?? searchParams.get("pageSize") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    campaignType: searchParams.get("type") ?? undefined,
  };
  const result = querySchema.safeParse(params);
  return result;
}
