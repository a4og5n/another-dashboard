/**
 * Scaffold for Mailchimp Audience Schema.
 * To be implemented in a future issue.
 */
import { z } from "zod";

/**
 * MailchimpAudienceSchema
 * Zod schema for Mailchimp Audience object.
 * Source: https://mailchimp.com/developer/marketing/api/audiences/get-a-list-of-audiences/
 */
export const VISIBILITY = ["pub", "prv"] as const;

export const MailchimpAudienceSchema = z.object({
	id: z.string().min(1, "Audience ID is required."),
	name: z.string().min(1, "Audience name is required."),
	contact: z.object({
		company: z.string(),
		address1: z.string(),
		address2: z.string().optional(),
		city: z.string(),
		state: z.string(),
		zip: z.string(),
		country: z.string(),
		phone: z.string().optional(),
	}),
	permission_reminder: z.string(),
	use_archive_bar: z.boolean(),
	campaign_defaults: z.object({
		from_name: z.string(),
		from_email: z.string().email(),
		subject: z.string(),
		language: z.string(),
	}),
	notify_on_subscribe: z.string().email().optional(),
	notify_on_unsubscribe: z.string().email().optional(),
	email_type_option: z.boolean(),
	visibility: z.enum(VISIBILITY),
	stats: z.object({
		member_count: z.number(),
		unsubscribe_count: z.number(),
		cleaned_count: z.number(),
		member_count_since_send: z.number().optional(),
		unsubscribe_count_since_send: z.number().optional(),
		cleaned_count_since_send: z.number().optional(),
		campaign_count: z.number().optional(),
		campaign_last_sent: z.string().optional(),
		merge_field_count: z.number().optional(),
		avg_sub_rate: z.number().optional(),
		avg_unsub_rate: z.number().optional(),
		target_sub_rate: z.number().optional(),
		open_rate: z.number().optional(),
		click_rate: z.number().optional(),
		last_sub_date: z.string().optional(),
		last_unsub_date: z.string().optional(),
	}),
	list_rating: z.number().int().min(0).max(5),
	date_created: z.string(),
	last_marked_as_clean: z.string().optional(),
	email_signup: z.boolean().optional(),
	sms_signup: z.boolean().optional(),
	marketing_permissions: z.array(z.object({
		marketing_permission_id: z.string(),
		text: z.string(),
		enabled: z.boolean(),
	})).optional(),
	modules: z.array(z.string()).optional(),
	// Add any additional fields from the API as needed
});
