/**
 * Campaign Detail Page
 * Main campaign detail page showing comprehensive campaign information
 *
 * Issue #136: Main campaign detail page
 * Following Next.js 15 App Router patterns
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

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fields?: string; exclude_fields?: string }>;
}

export default async function CampaignDetailPage({
  params,
  searchParams,
}: CampaignDetailPageProps) {
  const { id } = await params;
  const { fields, exclude_fields } = await searchParams;

  // Fetch campaign report data
  const response = await getMailchimpCampaignReport(id, {
    fields,
    exclude_fields,
  });

  // Handle error states
  if (!response.success || !response.data) {
    if (
      response.error?.includes("not found") ||
      response.error?.includes("404")
    ) {
      notFound();
    }

    throw new Error(response.error || "Failed to fetch campaign report");
  }

  const report = response.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mailchimp">Mailchimp</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mailchimp/reports">Campaign Reports</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-muted-foreground">
              {report.campaign_title}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pb-8">
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
      title: "Campaign Not Found",
      description: "The requested campaign could not be found.",
    };
  }

  const report = response.data;

  return {
    title: `${report.campaign_title} - Campaign Details`,
    description: `Detailed analytics for ${report.campaign_title}. Open rate: ${(report.opens.open_rate * 100).toFixed(1)}%, Click rate: ${(report.clicks.click_rate * 100).toFixed(1)}%`,
    openGraph: {
      title: `${report.campaign_title} - Campaign Details`,
      description: `Campaign sent to ${report.emails_sent.toLocaleString()} recipients with ${(report.opens.open_rate * 100).toFixed(1)}% open rate`,
      type: "website",
    },
  };
}
