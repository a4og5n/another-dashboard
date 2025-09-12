/**
 * Campaign Opens Client Component
 * Client wrapper for CampaignOpensTable that handles URL-based pagination
 *
 * Issue #135: Campaign opens pagination implementation
 * Following established patterns from ReportsOverviewClient
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CampaignOpensTable } from "./CampaignOpensTable";
import type {
  ReportOpenListSuccess,
  OpenListQueryParams,
} from "@/types/mailchimp";

interface CampaignOpensClientProps {
  opensData: ReportOpenListSuccess;
  currentParams: OpenListQueryParams & { count: number; offset: number };
  campaignId: string;
  perPageOptions?: number[];
}

export function CampaignOpensClient({
  opensData,
  currentParams,
  campaignId,
  perPageOptions = [10, 20, 50],
}: CampaignOpensClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const newOffset = (page - 1) * currentParams.count;
    params.set("offset", newOffset.toString());
    params.set("count", currentParams.count.toString());
    router.push(
      `/mailchimp/campaigns/${campaignId}/report/opens?${params.toString()}`,
    );
  };

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", "0"); // Reset to first page
    params.set("count", newPerPage.toString());
    router.push(
      `/mailchimp/campaigns/${campaignId}/report/opens?${params.toString()}`,
    );
  };

  const handleSortChange = (sortField: string, sortDir: "ASC" | "DESC") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", "0"); // Reset to first page when sorting
    params.set("sort_field", sortField);
    params.set("sort_dir", sortDir);
    router.push(
      `/mailchimp/campaigns/${campaignId}/report/opens?${params.toString()}`,
    );
  };

  return (
    <CampaignOpensTable
      opensData={opensData}
      currentParams={currentParams}
      perPageOptions={perPageOptions}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      onSortChange={handleSortChange}
    />
  );
}
