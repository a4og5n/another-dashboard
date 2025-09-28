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
import type { MailchimpCampaignReport } from "@/types/mailchimp";

import { generateCampaignReportMetadata } from "@/utils";
import { BreadcrumbNavigation } from "@/components/layout";
import { isDev } from "@/lib/config";
import type { CampaignReportPageProps } from "@/types/mailchimp";

async function CampaignReportPageContent({
  params,
  searchParams,
}: CampaignReportPageProps) {
  const { id } = await params;
  await searchParams; // Keep for type compatibility

  // Fetch campaign report data
  const response = await getMailchimpCampaignReport(id);

  // Handle error states
  if (!response.success) {
    // Log the error for debugging but use notFound for a better user experience
    if (isDev) {
      console.error(`Error fetching campaign report ${id}:`, response.error);
    }
    notFound();
  }

  return <CampaignReportDetail report={response.data as MailchimpCampaignReport} />;
}

export default function CampaignReportPage({
  params,
  searchParams,
}: CampaignReportPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Campaigns", href: "/mailchimp/campaigns" },
          { label: "Report", isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6">
        <Suspense fallback={<CampaignReportLoading />}>
          <CampaignReportPageContent
            params={params}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

// Generate metadata for the page using the utility function
export const generateMetadata = generateCampaignReportMetadata;
