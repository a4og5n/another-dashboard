/**
 * Mailchimp Dashboard Schema
 * Centralized Zod schemas for dashboard query validation and filtering
 */
import { z } from "zod";
import { mailchimpDashboardPaginationSchema } from "@/schemas/mailchimp-dashboard-pagination";
import { validDate } from "@/utils/mailchimp/query-params";

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
