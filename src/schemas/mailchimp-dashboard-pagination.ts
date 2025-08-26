import { z } from "zod";

/**
 * Zod schema for Mailchimp dashboard API pagination parameters.
 * Validates 'page' and 'limit' query params.
 */
export const mailchimpDashboardPaginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1, {
      message: "Page must be an integer greater than or equal to 1",
    })
    .default(1),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1 && val <= 100, {
      message: "Limit must be an integer between 1 and 100",
    })
    .default(25),
});

export type MailchimpDashboardPaginationParams = z.infer<
  typeof mailchimpDashboardPaginationSchema
>;
