import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

const oneOpen = z.object({
  timestamp: z.iso.datetime({ offset: true }), //The date and time recorded for the action in ISO 8601 format.
  is_proxy_open: z.boolean(),
});

/**
 * Schema for Mailchimp merge field address type
 */
const mergeFieldAddressSchema = z.object({
  addr1: z.string(),
  addr2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().optional(),
});

/**
 * Schema for Mailchimp merge fields
 * Supports various field types as documented at:
 * https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
 */
const mergeField = z.record(
  z.string(),
  z.union([
    z.string(), // text, radio, dropdown, date, birthday, zip, phone, url, imageurl
    z.number(), // number
    mergeFieldAddressSchema, // address
  ]),
);

export const reportListMemberSchema = z.object({
  campaign_id: z.string(),
  list_id: z.string(),
  list_is_active: z.boolean(),
  contact_status: z.string(),
  email_id: z.string(),
  email_address: z.string(),
  merge_fields: mergeField,
  vip: z.boolean(),
  opens_count: z.number(),
  proxy_excluded_opens_count: z.number(),
  opens: z.array(oneOpen),
  _links: z.array(linkSchema).optional(),
});
