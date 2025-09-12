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
import { BreadcrumbNavigation } from "@/components/layout";
import { CampaignOpensPageProps } from "@/types/mailchimp";
import {
  CampaignOpensClient,
  CampaignOpensLoading,
} from "@/components/dashboard/reports";

export default async function CampaignOpensPage({
  params,
  searchParams,
}: CampaignOpensPageProps) {
  const { id } = await params;
  const { fields, exclude_fields, count, offset, since, sort_field, sort_dir } =
    await searchParams;

  // Convert string parameters to appropriate types
  const queryParams = {
    fields,
    exclude_fields,
    count: count ? parseInt(count, 10) : 25, // Default to 25 items per page
    offset: offset ? parseInt(offset, 10) : 0,
    since,
    sort_field,
    sort_dir,
  };

  // Fetch campaign open list data
  const response = await getMailchimpCampaignOpenList(id, queryParams);

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
    console.error(`Error fetching campaign opens ${id}:`, response.error);
    notFound();
  }

  const opensData = response.data;

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
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Campaign Opens
            </h1>
            <p className="text-muted-foreground">
              Members who opened this campaign - {opensData.total_items} total
              opens
            </p>
          </div>

          {/* Opens Table */}
          <Suspense fallback={<CampaignOpensLoading />}>
            <CampaignOpensClient
              opensData={opensData}
              currentParams={queryParams}
              campaignId={id}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    title: `Campaign Opens - ${id}`,
    description: `View all members who opened campaign ${id}`,
  };
}
