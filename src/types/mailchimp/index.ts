export * from "@/types/mailchimp/common";
export * from "@/types/mailchimp/root";
export * from "@/types/mailchimp/reports";
export * from "@/types/mailchimp/report-detail";
export * from "@/types/mailchimp/report-open-details";
export * from "@/types/mailchimp/campaign-report-page-props";
export * from "@/types/mailchimp/campaign-opens-page-props";
export * from "@/types/mailchimp/reports-page-props";
export * from "@/types/mailchimp/campaign-detail-page-props";
export * from "@/types/mailchimp/lists-page-props";
export * from "@/types/mailchimp/list";

// Alias exports for backward compatibility with service layer naming
export type { CampaignReport as MailchimpCampaignReport } from "@/types/mailchimp/reports";
