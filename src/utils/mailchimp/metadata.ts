/**
 * Mailchimp Metadata Utilities
 * Functions for generating metadata for Mailchimp-related pages
 *
 * Issue #135: Campaign report detail metadata generation
 * Following project guidelines to extract reusable utilities
 */

import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { Metadata } from "next";
import {
  reportPageParamsSchema,
  reportOpensPageParamsSchema,
  abuseReportsPageParamsSchema,
} from "@/schemas/components";
import { clickDetailsPageParamsSchema } from "@/schemas/components/mailchimp/reports-click-page-params";
import { campaignUnsubscribesPageParamsSchema } from "@/schemas/components/mailchimp/report-unsubscribes-page-params";
import { emailActivityPageParamsSchema } from "@/schemas/components/mailchimp/email-activity-page-params";
import { campaignRecipientsPageParamsSchema } from "@/schemas/components/mailchimp/report-sent-to-page-params";
import { reportLocationActivityPageParamsSchema } from "@/schemas/components/mailchimp/report-location-activity-page-params";
import { campaignAdvicePageParamsSchema } from "@/schemas/components/mailchimp/report-advice-page-params";
import { domainPerformancePageParamsSchema } from "@/schemas/components/mailchimp/report-domain-performance-page-params";
import { listActivityPageParamsSchema } from "@/schemas/components/mailchimp/list-activity-page-params";
import { listGrowthHistoryPageParamsSchema } from "@/schemas/components/mailchimp/list-growth-history-page-params";
import { listPageParamsSchema } from "@/schemas/components/mailchimp/list-page-params";
import { memberProfilePageParamsSchema } from "@/schemas/components/mailchimp/member-info-page-params";
import { listSegmentsPageRouteParamsSchema } from "@/schemas/components/mailchimp/list-segments-page-params";
import type { CampaignReport, List } from "@/types/mailchimp";

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
  const rawParams = await params;
  const { id } = reportPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

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

/**
 * Generates metadata specifically for campaign opens pages
 * @param params - Object containing the campaign ID
 * @returns Next.js Metadata object for the opens page
 */
export async function generateCampaignOpensMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportOpensPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Opens - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Opens`,
    description: `View all members who opened ${report.campaign_title}. Total opens: ${report.opens.opens_total.toLocaleString()}`,
    openGraph: {
      title: `${report.campaign_title} - Campaign Opens`,
      description: `${report.opens.opens_total.toLocaleString()} total opens from ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign abuse reports pages
 * @param params - Object containing the campaign ID
 * @returns Next.js Metadata object for the abuse reports page
 */
export async function generateCampaignAbuseReportsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = abuseReportsPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Abuse Reports - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;
  const abuseReportCount = report.abuse_reports || 0;

  return {
    title: `${report.campaign_title} - Abuse Reports`,
    description: `View abuse reports and spam complaints for ${report.campaign_title}. ${
      abuseReportCount === 0
        ? "No abuse reports recorded."
        : `${abuseReportCount.toLocaleString()} ${abuseReportCount === 1 ? "report" : "reports"} received.`
    }`,
    openGraph: {
      title: `${report.campaign_title} - Abuse Reports`,
      description:
        abuseReportCount === 0
          ? `No abuse reports for campaign sent to ${report.emails_sent.toLocaleString()} recipients`
          : `${abuseReportCount} ${abuseReportCount === 1 ? "abuse report" : "abuse reports"} from ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for click details pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the click details page
 */
export async function generateClickDetailsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = clickDetailsPageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Click Details - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data;

  return {
    title: `${data.campaign_title} - Click Details`,
    description: "URLs clicked in this campaign",
    openGraph: {
      title: `${data.campaign_title} - Click Details`,
      description: "URLs clicked in this campaign",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign unsubscribes pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the campaign unsubscribes page
 */
export async function generateCampaignUnsubscribesMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = campaignUnsubscribesPageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Unsubscribes - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as CampaignReport;

  return {
    title: `${data.campaign_title || "Resource"} - Campaign Unsubscribes`,
    description: "Members who unsubscribed from this campaign",
    openGraph: {
      title: `${data.campaign_title || "Resource"} - Campaign Unsubscribes`,
      description: "Members who unsubscribed from this campaign",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign email activity pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the campaign email activity page
 */
export async function generateCampaignEmailActivityMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = emailActivityPageParamsSchema.parse(rawParams);

  // Fetch campaign report for metadata
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Email Activity - Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data as CampaignReport;

  return {
    title: `${report.campaign_title} - Email Activity`,
    description: `Email activity tracking for ${report.campaign_title}. Opens, clicks, and bounces for ${report.emails_sent.toLocaleString()} recipients.`,
    openGraph: {
      title: `${report.campaign_title} - Email Activity`,
      description: `Track email activity for campaign sent to ${report.emails_sent.toLocaleString()} recipients`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign recipients pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the campaign recipients page
 */
export async function generateCampaignRecipientsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = campaignRecipientsPageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Recipients - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as CampaignReport;

  return {
    title: `${data.campaign_title || "Resource"} - Campaign Recipients`,
    description: "Members who received this campaign",
    openGraph: {
      title: `${data.campaign_title || "Resource"} - Campaign Recipients`,
      description: "Members who received this campaign",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign locations pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the campaign locations page
 */
export async function generateCampaignLocationsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = reportLocationActivityPageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Locations - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as CampaignReport;

  return {
    title: `${data.campaign_title || "Resource"} - Campaign Locations`,
    description: "Geographic engagement by location",
    openGraph: {
      title: `${data.campaign_title || "Resource"} - Campaign Locations`,
      description: "Geographic engagement by location",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign advice pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the campaign advice page
 */
export async function generateCampaignAdviceMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = campaignAdvicePageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Advice - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data;

  return {
    title: `${data.campaign_title || "Resource"} - Campaign Advice`,
    description: "Feedback and recommendations to improve campaign performance",
    openGraph: {
      title: `${data.campaign_title || "Resource"} - Campaign Advice`,
      description:
        "Feedback and recommendations to improve campaign performance",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for domain performance pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the domain performance page
 */
export async function generateDomainPerformanceMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = domainPerformancePageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Domain Performance - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as CampaignReport;

  return {
    title: `${data.campaign_title} - Domain Performance`,
    description:
      "Email provider performance breakdown (Gmail, Outlook, Yahoo, etc.)",
    openGraph: {
      title: `${data.campaign_title || "Resource"} - Domain Performance`,
      description:
        "Email provider performance breakdown (Gmail, Outlook, Yahoo, etc.)",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for list activity pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the list activity page
 */
export async function generateListActivityMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listActivityPageParamsSchema.parse(rawParams);

  // Fetch list data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "List Activity - Not Found",
      description: "The requested list could not be found.",
    };
  }

  const list = response.data as List;

  return {
    title: `${list.name} - List Activity`,
    description:
      "Recent list activity timeline with subscriber engagement metrics",
    openGraph: {
      title: `${list.name} - List Activity`,
      description: `Activity timeline for ${list.stats.member_count.toLocaleString()} members`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for list growth history pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the list growth history page
 */
export async function generateListGrowthHistoryMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listGrowthHistoryPageParamsSchema.parse(rawParams);

  // Fetch list data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "List Growth History - Not Found",
      description: "The requested list could not be found.",
    };
  }

  const data = response.data as List;

  return {
    title: `${data.name} - Growth History`,
    description: `Historical growth data for ${data.name} showing subscriber trends over time`,
    openGraph: {
      title: `${data.name} - Growth History`,
      description: `Historical growth data for ${data.name} showing subscriber trends over time`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for list members pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the list members page
 */
export async function generateListMembersMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listPageParamsSchema.parse(rawParams);

  // Fetch list data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "List Members - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const list = response.data;

  return {
    title: `${list.name} - Members`,
    description: "View and manage members in this list",
    openGraph: {
      title: `${list.name} - Members`,
      description: "View and manage members in this list",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for member profile pages
 * @param params - Object containing the id and subscriber_hash
 * @returns Next.js Metadata object for the member profile page
 */
export async function generateMemberProfileMetadata({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberProfilePageParamsSchema.parse(rawParams);

  // Fetch data for metadata
  const response = await mailchimpDAL.fetchMemberInfo(id, subscriber_hash);

  if (!response.success || !response.data) {
    return {
      title: "Member Profile - Not Found",
      description: "The requested member profile could not be found.",
    };
  }

  const member = response.data;

  return {
    title: `${member.email_address} - Member Profile`,
    description: `View profile for ${member.email_address} - ${member.status} member`,
    openGraph: {
      title: `${member.email_address} - Member Profile`,
      description: `View profile for ${member.email_address} - ${member.status} member`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for member tags page
 *
 * @param params - Object containing the list ID and subscriber hash
 * @returns Next.js Metadata object for the page
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateMemberTagsMetadata;
 * ```
 */
export async function generateMemberTagsMetadata({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberProfilePageParamsSchema.parse(rawParams);

  // Fetch member info for email address
  const response = await mailchimpDAL.fetchMemberInfo(id, subscriber_hash);

  if (!response.success || !response.data) {
    return {
      title: "Member Tags - Not Found",
      description: "The requested member could not be found.",
    };
  }

  const member = response.data;

  return {
    title: `Tags - ${member.email_address}`,
    description: `View and manage tags for ${member.email_address}`,
    openGraph: {
      title: `Tags - ${member.email_address}`,
      description: `View and manage tags for ${member.email_address}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for list segments page
 *
 * @param params - Object containing the list ID
 * @returns Next.js Metadata object for the page
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateListSegmentsMetadata;
 * ```
 */
export async function generateListSegmentsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listSegmentsPageRouteParamsSchema.parse(rawParams);

  // Fetch list for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "List Segments - Not Found",
      description: "The requested list could not be found.",
    };
  }

  const list = response.data;

  return {
    title: `${list.name} - Segments`,
    description: `View and manage segments for ${list.name}`,
    openGraph: {
      title: `${list.name} - Segments`,
      description: `View and manage segments for ${list.name}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for segment members pages
 * @param params - Object containing the id (list) and segment_id
 * @returns Next.js Metadata object for the segment members page
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateSegmentMembersMetadata;
 * ```
 */
export async function generateSegmentMembersMetadata({
  params,
}: {
  params: Promise<{ id: string; segment_id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { segmentMembersRouteParamsSchema } = await import(
    "@/schemas/components/mailchimp/segment-members-route-params"
  );
  const { id } = segmentMembersRouteParamsSchema.parse(rawParams);

  // Fetch list for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "Segment Members - Not Found",
      description: "The requested segment could not be found.",
    };
  }

  const list = response.data;

  return {
    title: `${list.name} - Segment Members`,
    description: `View members in this segment from ${list.name}`,
    openGraph: {
      title: `${list.name} - Segment Members`,
      description: `View members in this segment from ${list.name}`,
      type: "website",
    },
  };
}
