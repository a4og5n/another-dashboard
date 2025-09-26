/**
 * Campaign Opens Page
 * Server component that fetches campaign open list data and displays members who opened the campaign
 *
 * Issue #135: Campaign opens list page implementation
 * Following Next.js 15 App Router patterns and established page structures
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMailchimpCampaignOpenList } from "@/actions/mailchimp-reports-open";
import {
  CampaignOpens,
  CampaignOpensLoading,
} from "@/components/dashboard/reports";
import { processOpenListSearchParams } from "@/utils/mailchimp";
import { BreadcrumbNavigation } from "@/components/layout";
import { generateCampaignOpensMetadata } from "@/utils/mailchimp/metadata";
import { isDev } from "@/lib/config";
import type { CampaignOpensPageProps } from "@/types/mailchimp/campaign-opens-page-props";

async function CampaignOpensPageContent({
  params,
  searchParams,
}: CampaignOpensPageProps) {
  const { id } = await params;
  const rawSearchParams = await searchParams;
  const cleanSearchParams = processOpenListSearchParams(rawSearchParams);

  // Fetch campaign open list data
  const response = await getMailchimpCampaignOpenList(id, cleanSearchParams);

  // Handle error states
  if (!response.success) {
    // Log the error for debugging but use notFound for a better user experience
    if (isDev) {
      console.error(`Error fetching campaign opens ${id}:`, response.error);
    }
    notFound();
  }

  return (
    <CampaignOpens
      opensData={response.data!}
      currentParams={cleanSearchParams}
      campaignId={id}
    />
  );
}

export default async function CampaignOpensPage({
  params,
  searchParams,
}: CampaignOpensPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Campaigns", href: "/mailchimp/campaigns" },
          { label: "Report", href: `/mailchimp/campaigns/${id}/report` },
          { label: "Opens", isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6">
        <Suspense fallback={<CampaignOpensLoading />}>
          <CampaignOpensPageContent
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
export const generateMetadata = generateCampaignOpensMetadata;
