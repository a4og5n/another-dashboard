/**
 * List Locations
 * Geographic distribution of list subscribers based on IP address
 *
 * @route /mailchimp/lists/[id]/locations
 * @requires Mailchimp connection
 * @features Dynamic routing, Geographic analytics, Country distribution
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layout";
import { BreadcrumbNavigation } from "@/components/layout";
import { ListLocationsSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { ListLocationsContent } from "@/components/mailchimp/lists/list-locations-content";
import { handleApiError, bc } from "@/utils";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { listLocationsPageParamsSchema } from "@/schemas/components/mailchimp/list-locations-page-params";
import { generateListLocationsMetadata } from "@/utils/metadata";
import type { ListLocationsResponse } from "@/types/mailchimp/list-locations";

// Metadata generation
export const generateMetadata = generateListLocationsMetadata;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Process route params
  const rawParams = await params;
  const { id: listId } = listLocationsPageParamsSchema.parse(rawParams);

  // Fetch data
  const response = await mailchimpDAL.fetchListLocations(listId);

  // Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // Extract data safely
  const data = response.success
    ? (response.data as ListLocationsResponse)
    : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent listId={listId} />
        </Suspense>
      }
      title="List Locations"
      description="Geographic distribution of list subscribers based on IP address"
      skeleton={<ListLocationsSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <ListLocationsContent data={data} listId={listId} />
        ) : (
          <DashboardInlineError error="Failed to load location data" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}

async function BreadcrumbContent({ listId }: { listId: string }) {
  const response = await mailchimpDAL.fetchList(listId);
  const error = handleApiError(response);

  if (error) {
    return (
      <BreadcrumbNavigation
        items={[
          bc.home,
          bc.mailchimp,
          bc.lists,
          bc.list(listId),
          bc.current("Locations"),
        ]}
      />
    );
  }

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.list(listId),
        bc.listLocations(listId),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
