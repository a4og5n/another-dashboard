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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface CampaignReportPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fields?: string;
    exclude_fields?: string;
  }>;
}

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
      <div className="container mx-auto pt-20 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mailchimp">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mailchimp/campaigns">Campaigns</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">{report.campaign_title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6">
        <Suspense fallback={<CampaignReportLoading />}>
          <CampaignReportDetail report={report} />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch campaign report for metadata
  const response = await getMailchimpCampaignReport(id);

  if (!response.success || !response.data) {
    return {
      title: "Campaign Report Not Found",
      description: "The requested campaign report could not be found.",
    };
  }

  const report = response.data;

  return {
    title: `${report.campaign_title} - Campaign Report`,
    description: `Detailed performance analytics for ${report.campaign_title}. Open rate: ${(report.opens.open_rate * 100).toFixed(1)}%, Click rate: ${(report.clicks.click_rate * 100).toFixed(1)}%`,
    openGraph: {
      title: `${report.campaign_title} - Campaign Report`,
      description: `Campaign sent to ${report.emails_sent.toLocaleString()} recipients with ${(report.opens.open_rate * 100).toFixed(1)}% open rate`,
      type: "website",
    },
  };
}
