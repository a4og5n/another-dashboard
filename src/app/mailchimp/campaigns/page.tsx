/**
 * Mailchimp Campaigns Page
 * Displays campaigns with server-side data fetching
 *
 * Issue #140: Campaigns page implementation following App Router patterns
 * Based on reports/page.tsx pattern with server-side data fetching
 * Implements error handling, breadcrumbs, and layout consistency
 */

import { Suspense } from "react";
import { CampaignsPageProps } from "@/types/mailchimp/campaigns-page-props";
import { CampaignsPageContent } from "@/app/mailchimp/campaigns/_components/campaigns-page-content";

/**
 * Main page component for the Campaigns route
 * Wraps the content component with Suspense for better loading UX
 */
export default function CampaignsPage({ searchParams }: CampaignsPageProps) {
  return (
    <Suspense fallback={<div>Loading campaigns...</div>}>
      <CampaignsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
