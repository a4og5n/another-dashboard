/**
 * Landing Page Report
 * View comprehensive performance analytics and conversion metrics for this landing page
 *
 * @route /mailchimp/reporting/landing-pages/[outreach_id]
 * @requires Mailchimp connection
 * @features Conversion tracking, Traffic analytics, Signup metrics, E-commerce revenue, Time-series performance, Click tracking
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { LandingPageReportSkeleton } from "@/skeletons/mailchimp";
import { landingPageReportPageParamsSchema } from "@/schemas/components/mailchimp/landing-page-report-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { LandingPageReportContent } from "@/components/mailchimp/reporting/landing-page-report-content";
import { handleApiError, bc } from "@/utils";
import { generateLandingPageReportMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ outreach_id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Process route params
  const rawParams = await params;
  const rawSearchParams = searchParams ? await searchParams : {};
  const validatedParams = landingPageReportPageParamsSchema.parse({
    ...rawParams,
    ...rawSearchParams,
  });
  const { outreach_id } = validatedParams;

  // Fetch data
  const response = await mailchimpDAL.fetchLandingPageReport(outreach_id);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent data={data} />
        </Suspense>
      }
      title="Landing Page Report"
      description="View comprehensive performance analytics and conversion metrics for this landing page"
      skeleton={<LandingPageReportSkeleton />}
    >
      {data ? (
        <LandingPageReportContent data={data} errorCode={response.errorCode} />
      ) : (
        <div className="text-center text-muted-foreground">
          Failed to load landing page report
        </div>
      )}
    </PageLayout>
  );
}

async function BreadcrumbContent({
  data,
}: {
  data: { name?: string } | null | undefined;
}) {
  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.landingPages,
        bc.current(data?.name || "Report"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata
export const metadata: Metadata = generateLandingPageReportMetadata();
