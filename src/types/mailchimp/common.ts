/**
 * Mailchimp Error Response Type
 * Used by Mailchimp API error responses.
 */
export type MailchimpErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
};
