/**
 * Mailchimp Dashboard Schema
 * Centralized Zod schemas for dashboard query validation and filtering
 */
import { z } from "zod";
import { mailchimpDashboardPaginationSchema } from "@/schemas/mailchimp-dashboard-pagination";

/**
 * Date validation helper for YYYY-MM-DD format
 */
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

/**
 * Schema for Mailchimp dashboard query parameters
 * Extends pagination schema with date and campaign type filters
 */
export const MailchimpDashboardQuerySchema =
  mailchimpDashboardPaginationSchema.extend({
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

/**
 * Schema for date filter parameters (client-side validation)
 * Validates start and end date strings for parsing
 */
export const DateFilterSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid startDate",
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate",
    }),
});
