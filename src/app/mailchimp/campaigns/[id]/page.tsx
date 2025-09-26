/**
 * Campaign Detail Page
 * Redirects to the campaign report page
 *
 * Issue #136: Main campaign detail page
 * Following Next.js 15 App Router patterns and implementing redirect pattern
 */

import { redirect } from "next/navigation";
import type { CampaignDetailPageProps } from "@/types/mailchimp/campaign-detail-page-props";

export default async function CampaignDetailPage({
  params,
  searchParams,
}: CampaignDetailPageProps) {
  const { id } = await params;
  const queryParams = new URLSearchParams();

  // Forward any search parameters to the report page
  const { fields, exclude_fields } = await searchParams;
  if (fields) queryParams.set("fields", fields);
  if (exclude_fields) queryParams.set("exclude_fields", exclude_fields);

  // Redirect to the campaign report page
  const queryString = queryParams.toString();
  const redirectUrl = `/mailchimp/campaigns/${id}/report${queryString ? `?${queryString}` : ""}`;

  redirect(redirectUrl);
}
