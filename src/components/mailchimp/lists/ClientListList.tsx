"use client";

import { AudienceList } from "@/components/mailchimp/audiences";
import { useStaticPaginationHandlers } from "@/utils/pagination";
import type { MailchimpList } from "@/services";

interface ClientAudienceListProps {
  audiences: MailchimpList[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function ClientAudienceList({
  audiences,
  totalCount,
  currentPage,
  pageSize,
}: Pick<
  ClientAudienceListProps,
  "audiences" | "totalCount" | "currentPage" | "pageSize"
>) {
  const { handlePageChange, handlePerPageChange } =
    useStaticPaginationHandlers();

  return (
    <AudienceList
      audiences={audiences}
      totalCount={totalCount}
      loading={false}
      error={null}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePerPageChange}
      className=""
    />
  );
}
