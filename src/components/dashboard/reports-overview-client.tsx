"use client";

import { useRouter } from "next/navigation";
import { ReportsOverview } from "./reports-overview";
import type { MailchimpCampaignReport } from "@/services";

interface ReportsOverviewClientProps {
  reports: MailchimpCampaignReport[];
  loading?: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  perPage: number;
  perPageOptions: number[];
  reportType?: string;
  beforeSendTime?: string;
  sinceSendTime?: string;
}

export function ReportsOverviewClient({
  reports,
  loading = false,
  error = null,
  currentPage,
  totalPages,
  perPage,
  perPageOptions,
  reportType,
  beforeSendTime,
  sinceSendTime,
}: ReportsOverviewClientProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", perPage.toString());
    if (reportType) params.set("type", reportType);
    if (beforeSendTime) params.set("before_send_time", beforeSendTime);
    if (sinceSendTime) params.set("since_send_time", sinceSendTime);
    router.push(`/mailchimp/reports?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    if (reportType) params.set("type", reportType);
    if (beforeSendTime) params.set("before_send_time", beforeSendTime);
    if (sinceSendTime) params.set("since_send_time", sinceSendTime);
    router.push(`/mailchimp/reports?${params.toString()}`);
  };

  return (
    <ReportsOverview
      reports={reports}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      perPage={perPage}
      perPageOptions={perPageOptions}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
    />
  );
}