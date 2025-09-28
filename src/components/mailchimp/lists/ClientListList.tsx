"use client";

import { ListList } from "./ListList";
import { useStaticPaginationHandlers } from "@/utils/pagination";
import type { MailchimpList } from "@/services";

interface ClientListListProps {
  lists: MailchimpList[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function ClientListList({
  lists,
  totalCount,
  currentPage,
  pageSize,
}: Pick<
  ClientListListProps,
  "lists" | "totalCount" | "currentPage" | "pageSize"
>) {
  const { handlePageChange, handlePerPageChange } =
    useStaticPaginationHandlers();

  return (
    <ListList
      lists={lists}
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
