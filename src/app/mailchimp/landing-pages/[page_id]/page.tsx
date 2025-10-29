/**
 * Landing Page Details
 * View detailed information about this landing page
 *
 * @route /mailchimp/landing-pages/[page_id]
 * @requires Mailchimp connection
 * @features Landing page status, Publication details, Performance metrics, Tracking settings
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { LandingPageDetailsSkeleton } from "@/skeletons/mailchimp";
import { landingPageDetailsPageParamsSchema } from "@/schemas/components/mailchimp/landingPageInfo-page-params";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { LandingPageDetailsContent } from "@/components/mailchimp/landing-pages/landing-page-details-content";
import { handleApiError, bc } from "@/utils";
import { generateLandingPageDetailsMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ page_id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Process route params
  const rawParams = await params;
  const validatedParams = landingPageDetailsPageParamsSchema.parse(rawParams);
  const { page_id } = validatedParams;

  // Fetch data
  const response = await mailchimpDAL.fetchLandingPageInfo(page_id);

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
      title="Landing Page Details"
      description="View detailed information about this landing page"
      skeleton={<LandingPageDetailsSkeleton />}
    >
      {data ? (
        <LandingPageDetailsContent data={data} errorCode={response.errorCode} />
      ) : (
        <div className="text-center text-muted-foreground">
          Failed to load landing page details
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
        bc.current(data?.name || "Loading..."),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Metadata
export const metadata: Metadata = generateLandingPageDetailsMetadata();
