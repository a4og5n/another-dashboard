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
import { memberActivityPageRouteParamsSchema } from "@/schemas/components/mailchimp/member-activity-page-params";
import { memberGoalsPageRouteParamsSchema } from "@/schemas/components/mailchimp/member-goals-page-params";
import { listLocationsPageParamsSchema } from "@/schemas/components/mailchimp/list-locations-page-params";
import { listInterestCategoriesPageRouteParamsSchema } from "@/schemas/components/mailchimp/list-interest-categories-page-params";
import { listInterestsPageRouteParamsSchema } from "@/schemas/components/mailchimp/list-interests-page-params";
import { interestCategoryInfoPageRouteParamsSchema } from "@/schemas/components/mailchimp/interest-category-info-page-params";
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
 * Generates metadata for list locations page
 *
 * @param params - Object containing the list ID
 * @returns Next.js Metadata object for the page
 */
export async function generateListLocationsMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listLocationsPageParamsSchema.parse(rawParams);

  // Fetch list data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "List Locations - Not Found",
      description: "The requested list could not be found.",
    };
  }

  const data = response.data as List;

  return {
    title: `${data.name} - Locations`,
    description: `Geographic distribution of subscribers for ${data.name} by country`,
    openGraph: {
      title: `${data.name} - Locations`,
      description: `Geographic distribution of subscribers for ${data.name} by country`,
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
 * Generates metadata for member notes page
 *
 * @param params - Object containing id and subscriber_hash route parameters
 * @returns Metadata object with title, description, and OpenGraph data
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateMemberNotesMetadata;
 * ```
 */
export async function generateMemberNotesMetadata({
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
      title: "Member Notes - Not Found",
      description: "The requested member could not be found.",
    };
  }

  const member = response.data;

  return {
    title: `Notes - ${member.email_address}`,
    description: `View notes for ${member.email_address}`,
    openGraph: {
      title: `Notes - ${member.email_address}`,
      description: `View notes for ${member.email_address}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for member activity page
 *
 * @param params - Object containing the list ID and subscriber hash
 * @returns Next.js Metadata object for the page
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateMemberActivityMetadata;
 * ```
 */
export async function generateMemberActivityMetadata({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberActivityPageRouteParamsSchema.parse(rawParams);

  // Fetch member info for email address
  const response = await mailchimpDAL.fetchMemberInfo(id, subscriber_hash);

  if (!response.success || !response.data) {
    return {
      title: "Member Activity - Not Found",
      description: "The requested member could not be found.",
    };
  }

  const member = response.data;

  return {
    title: `Activity - ${member.email_address}`,
    description: `View activity feed for ${member.email_address} - opens, clicks, bounces, and more`,
    openGraph: {
      title: `Activity - ${member.email_address}`,
      description: `View activity feed for ${member.email_address}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for member goals page
 *
 * @param params - Object containing the list ID and subscriber hash
 * @returns Next.js Metadata object for the page
 *
 * @example
 * ```tsx
 * export const generateMetadata = generateMemberGoalsMetadata;
 * ```
 */
export async function generateMemberGoalsMetadata({
  params,
}: {
  params: Promise<{ id: string; subscriber_hash: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id, subscriber_hash } =
    memberGoalsPageRouteParamsSchema.parse(rawParams);

  // Fetch member info for email address
  const response = await mailchimpDAL.fetchMemberInfo(id, subscriber_hash);

  if (!response.success || !response.data) {
    return {
      title: "Member Goals - Not Found",
      description: "The requested member could not be found.",
    };
  }

  const member = response.data;

  return {
    title: `Goals - ${member.email_address}`,
    description: `View goal events for ${member.email_address}`,
    openGraph: {
      title: `Goals - ${member.email_address}`,
      description: `View goal events for ${member.email_address}`,
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

/**
 * Generates metadata for list interest categories page
 * @param params - Object containing the list ID
 * @returns Next.js Metadata object for the interest categories page
 */
export async function generateListInterestCategoriesMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listInterestCategoriesPageRouteParamsSchema.parse(rawParams);

  // Fetch list data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "Interest Categories - List Not Found",
      description: "The requested list could not be found.",
    };
  }

  const list = response.data as List;

  return {
    title: `${list.name} - Interest Categories`,
    description: `Subscription preference groups for ${list.name}`,
    openGraph: {
      title: `${list.name} - Interest Categories`,
      description: `Subscription preference groups for ${list.name}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for automations list page
 * @returns Next.js Metadata object for the automations page
 */
export function generateAutomationsMetadata(): Metadata {
  return {
    title: "Automations | Fichaz",
    description: "View and manage your automation workflows",
    openGraph: {
      title: "Automations | Fichaz",
      description: "View and manage your automation workflows",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for interests in category pages
 * @param params - Object containing the id
 * @returns Next.js Metadata object for the interests in category page
 */
export async function generateInterestsInCategoryMetadata({
  params,
}: {
  params: Promise<{ id: string; interest_category_id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id } = listInterestsPageRouteParamsSchema.parse(rawParams);

  // Fetch data for metadata
  const response = await mailchimpDAL.fetchList(id);

  if (!response.success || !response.data) {
    return {
      title: "Interests - Not Found",
      description: "The requested list could not be found.",
    };
  }

  const list = response.data;

  return {
    title: `${list.name} - Interests`,
    description: `Individual interests within an interest category for ${list.name}`,
    openGraph: {
      title: `${list.name} - Interests`,
      description: `Individual interests within an interest category for ${list.name}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for interest category info pages
 * @param params - Object containing the id and interest_category_id
 * @returns Next.js Metadata object for the interest category info page
 */
export async function generateInterestCategoryInfoMetadata({
  params,
}: {
  params: Promise<{ id: string; interest_category_id: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { id, interest_category_id } =
    interestCategoryInfoPageRouteParamsSchema.parse(rawParams);

  // Fetch interest category data
  const categoryResponse = await mailchimpDAL.fetchInterestCategoryInfo(
    id,
    interest_category_id,
  );

  // Fetch list data for context
  const listResponse = await mailchimpDAL.fetchList(id);

  if (!categoryResponse.success || !categoryResponse.data) {
    return {
      title: "Interest Category - Not Found",
      description: "The requested interest category could not be found.",
    };
  }

  const category = categoryResponse.data;
  const listName = listResponse.success ? listResponse.data?.name : "List";

  return {
    title: `${category.title} - ${listName}`,
    description: `Details for ${category.title} interest category in ${listName}`,
    openGraph: {
      title: `${category.title} - Interest Category`,
      description: `Type: ${category.type}, Display Order: ${category.display_order}`,
      type: "website",
    },
  };
}

/**
 * Generates metadata for landing pages list page
 * @returns Next.js Metadata object for the landing pages page
 */
export function generateLandingPagesMetadata(): Metadata {
  return {
    title: "Landing Pages | Fichaz",
    description: "View and track your Mailchimp landing pages",
    openGraph: {
      title: "Landing Pages | Fichaz",
      description: "View and track your Mailchimp landing pages",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for landing page details pages
 * @returns Next.js Metadata object for the landing page details page
 */
export function generateLandingPageDetailsMetadata(): Metadata {
  return {
    title: "Landing Page Details",
    description: "View detailed information about this landing page",
    openGraph: {
      title: "Landing Page Details",
      description: "View detailed information about this landing page",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign detail pages
 * @returns Next.js Metadata object for the campaign detail page
 */
export function generateCampaignDetailMetadata(): Metadata {
  return {
    title: "Campaign Details",
    description:
      "Complete campaign information including settings, recipients, and performance metrics",
    openGraph: {
      title: "Campaign Details",
      description:
        "View detailed information about this campaign including settings, recipients, and performance metrics",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for api root pages
 * @returns Next.js Metadata object for the api root page
 */
export async function generateApiRootMetadata(): Promise<Metadata> {
  // Fetch data for metadata
  const response = await mailchimpDAL.fetchApiRoot();

  if (!response.success || !response.data) {
    return {
      title: "API Root - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data;

  return {
    title: `${data.account_name} - API Root`,
    description: "View Mailchimp API metadata and account information",
    openGraph: {
      title: `${data.account_name} - API Root`,
      description: "View Mailchimp API metadata and account information",
      type: "website",
    },
  };
}

/**
 * Generates metadata for batch webhooks page
 * @returns Next.js Metadata object for the batch webhooks page
 */
export async function generateBatchWebhooksMetadata(): Promise<Metadata> {
  return {
    title: "Batch Webhooks - Fichaz",
    description:
      "Manage batch webhooks for batch operations API responses (max 20 webhooks)",
    openGraph: {
      title: "Batch Webhooks - Fichaz",
      description:
        "Manage batch webhooks for batch operations API responses (max 20 webhooks)",
      type: "website",
    },
  };
}

/**
 * Generates metadata for campaigns page
 * @returns Next.js Metadata object for the campaigns page
 */
export async function generateCampaignsMetadata(): Promise<Metadata> {
  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchApiRoot();

  if (!response.success || !response.data) {
    return {
      title: "Campaigns - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as { account_name?: string };

  return {
    title: `${data.account_name || "Campaigns"} - Campaigns`,
    description: "View and manage all your Mailchimp marketing campaigns",
    openGraph: {
      title: `${data.account_name || "Campaigns"} - Campaigns`,
      description: "View and manage all your Mailchimp marketing campaigns",
      type: "website",
    },
  };
}

/**
 * Generates metadata specifically for campaign content pages
 * @param campaign_id - The campaign ID
 * @returns Next.js Metadata object for the campaign content page
 */
export async function generateCampaignContentMetadata(
  campaign_id: string,
): Promise<Metadata> {
  // Fetch campaign data for metadata
  const response = await mailchimpDAL.fetchCampaign(campaign_id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Content - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const campaign = response.data;
  const campaignTitle = campaign.settings?.title || "Untitled Campaign";

  return {
    title: `${campaignTitle} - Campaign Content`,
    description: "Preview campaign HTML and plain-text content",
    openGraph: {
      title: `${campaignTitle} - Campaign Content`,
      description: "Preview campaign HTML and plain-text content",
      type: "website",
    },
  };
}
