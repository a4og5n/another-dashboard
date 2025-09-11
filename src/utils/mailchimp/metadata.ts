/**
 * Mailchimp Metadata Utilities
 * Functions for generating metadata for Mailchimp-related pages
 * 
 * Issue #135: Campaign report detail metadata generation
 * Following project guidelines to extract reusable utilities
 */

import { getMailchimpCampaignReport } from "@/actions/mailchimp-reports";
import { Metadata } from "next";

/**
 * Generates metadata for campaign-related pages based on campaign ID
 * 
 * @param params - Object containing the campaign ID
 * @param pageType - The type of page (report, edit, etc.) to generate appropriate title/description
 * @returns Next.js Metadata object for the page
 */
export async function generateCampaignMetadata({
  params,
  pageType = "report",
}: {
  params: Promise<{ id: string }>;
  pageType?: "report" | "edit" | "analytics" | "general";
}): Promise<Metadata> {
  const { id } = await params;

  // Fetch campaign report for metadata
  const response = await getMailchimpCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data;
  
  // Create metadata based on page type
  switch (pageType) {
    case "report":
      return {
        title: `${report.campaign_title} - Campaign Report`,
        description: `Detailed performance analytics for ${report.campaign_title}. Open rate: ${(report.opens.open_rate * 100).toFixed(1)}%, Click rate: ${(report.clicks.click_rate * 100).toFixed(1)}%`,
        openGraph: {
          title: `${report.campaign_title} - Campaign Report`,
          description: `Campaign sent to ${report.emails_sent.toLocaleString()} recipients with ${(report.opens.open_rate * 100).toFixed(1)}% open rate`,
          type: "website",
        },
      };
    case "edit":
      return {
        title: `Edit ${report.campaign_title}`,
        description: `Edit campaign settings and content for ${report.campaign_title}.`,
        openGraph: {
          title: `Edit ${report.campaign_title}`,
          description: `Modify campaign settings for ${report.campaign_title}`,
          type: "website",
        },
      };
    case "analytics":
      return {
        title: `${report.campaign_title} - Analytics`,
        description: `Advanced analytics for ${report.campaign_title} campaign.`,
        openGraph: {
          title: `${report.campaign_title} - Analytics Dashboard`,
          description: `Detailed analytics for campaign sent to ${report.emails_sent.toLocaleString()} recipients`,
          type: "website",
        },
      };
    default:
      return {
        title: report.campaign_title,
        description: `Campaign information for ${report.campaign_title}.`,
        openGraph: {
          title: report.campaign_title,
          description: `Campaign details for ${report.campaign_title}`,
          type: "website",
        },
      };
  }
}

/**
 * Generates metadata specifically for campaign report pages
 * @param params - Object containing the campaign ID
 * @returns Next.js Metadata object for the report page
 */
export async function generateCampaignReportMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return generateCampaignMetadata({ params, pageType: "report" });
}
