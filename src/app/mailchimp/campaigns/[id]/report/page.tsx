/**
 * Campaign Report Detail Page
 * Server component that fetches campaign report data and displays detailed analytics
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMailchimpCampaignReport } from "@/actions/mailchimp-reports";
import {
  CampaignReportDetail,
  CampaignReportLoading,
} from "@/components/dashboard";
import { BreadcrumbNavigation } from "@/components/layout";
import { CampaignReportPageProps } from "@/types/mailchimp";
import { generateCampaignReportMetadata } from "@/utils";

export default async function CampaignReportPage({
  params,
  searchParams,
}: CampaignReportPageProps) {
  const { id } = await params;
  const { fields, exclude_fields } = await searchParams;

  // Fetch campaign report data
  const response = await getMailchimpCampaignReport(id, {
    fields,
    exclude_fields,
  });

  // Handle error states
  if (!response.success || !response.data) {
    // Check if this is a "not found" error
    if (
      response.error?.toLowerCase().includes("not found") ||
      response.error?.includes("404") ||
      response.error?.toLowerCase().includes("invalid campaign id")
    ) {
      notFound();
    }

    // Log the error for debugging but use notFound for a better user experience
    console.error(`Error fetching campaign report ${id}:`, response.error);
    notFound();
  }

  const report = response.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Campaigns", href: "/mailchimp/campaigns" },
          { label: report.campaign_title, isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6">
        <Suspense fallback={<CampaignReportLoading />}>
          <CampaignReportDetail report={report} />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignReportMetadata;
