/**
 * Domain Performance Page
 * Email provider performance breakdown (Gmail, Outlook, Yahoo, etc.)
 *
 * @route /mailchimp/reports/[id]/domain-performance
 * @requires Kinde Auth, Mailchimp connection
 * @features Dynamic routing, Domain analytics, Deliverability insights
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation";
import { DomainPerformanceSkeleton } from "@/skeletons/mailchimp";
import { DomainPerformanceContent } from "@/components/mailchimp/reports/domain-performance-content";
import { mailchimpDAL } from "@/dal";
import { handleApiError } from "@/utils/errors";
import { bc } from "@/utils/breadcrumbs";
import { generateDomainPerformanceMetadata } from "@/utils/mailchimp/metadata";

// Page params validation
interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = generateDomainPerformanceMetadata;

/**
 * Breadcrumb content component (async, requires campaign data)
 */
async function BreadcrumbContent({ campaignId }: { campaignId: string }) {
  const response = await mailchimpDAL.fetchCampaignReport(campaignId);
  const error = handleApiError(response);

  if (error) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.reports,
          bc.report(campaignId),
          bc.current("Domain Performance"),
        ]}
      />
    );
  }

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(campaignId),
        bc.domainPerformance(campaignId),
      ]}
    />
  );
}

export default async function DomainPerformancePage({ params }: PageProps) {
  const { id: campaignId } = await params;

  // Fetch domain performance data
  const response = await mailchimpDAL.fetchDomainPerformance(campaignId);
  const error = handleApiError(response);

  if (error || !response.data) {
    notFound();
  }

  return (
    <PageLayout
      title="Domain Performance"
      description="Email provider performance breakdown (Gmail, Outlook, Yahoo, etc.)"
      skeleton={<DomainPerformanceSkeleton />}
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent campaignId={campaignId} />
        </Suspense>
      }
    >
      <DomainPerformanceContent data={response.data} />
    </PageLayout>
  );
}
