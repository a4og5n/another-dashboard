/**
 * Campaign Opens Table Component
 * Displays a table of members who opened a specific campaign
 *
 * Server component with URL-based pagination for better performance
 * Refactored from TanStack Table to simple shadcn/ui Table (Issue #214)
 */

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { formatDateTime } from "@/utils/format-date";
import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
import { Mail, Eye, User, Clock } from "lucide-react";
import type { ReportOpenListMember } from "@/types/mailchimp";
import type { ReportOpensTableProps } from "@/types/components/mailchimp";
import { CampaignOpensEmpty } from "@/components/dashboard/reports/CampaignOpensEmpty";
import {
  getVipBadge,
  getMemberStatusBadge,
} from "@/components/ui/helpers/badge-utils";

export function CampaignOpensTable({
  opensData,
  currentPage,
  pageSize,
  perPageOptions = [...PER_PAGE_OPTIONS],
  baseUrl,
  campaignId,
}: ReportOpensTableProps) {
  const { members, total_items, total_opens, total_proxy_excluded_opens } =
    opensData || {};

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);

  // URL generation functions for pagination
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Defensive checks for data structure
  if (!opensData) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  // Validate members array
  if (!Array.isArray(members)) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  // Handle empty state when there are no opens
  if (total_items === 0) {
    return <CampaignOpensEmpty campaignId={campaignId} />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_opens?.toLocaleString() ?? "0"}
                </p>
                <p className="text-xs text-muted-foreground">Total Opens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_items.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Unique Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {total_proxy_excluded_opens?.toLocaleString() ?? "0"}
                </p>
                <p className="text-xs text-muted-foreground">Proxy Excluded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opens Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Campaign Opens</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      Email Address
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center justify-end text-right">
                      Opens Count
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      Last Opened
                    </div>
                  </TableHead>
                  <TableHead className="px-2">
                    <div className="h-8 px-2 lg:px-3 flex items-center">
                      VIP
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length > 0 ? (
                  members.map((member: ReportOpenListMember) => {
                    const lastOpen =
                      member.opens && member.opens.length > 0
                        ? member.opens[member.opens.length - 1]
                        : null;

                    return (
                      <TableRow key={member.email_id}>
                        <TableCell className="px-2">
                          <div className="font-medium max-w-xs">
                            <div
                              className="truncate"
                              title={member.email_address}
                            >
                              {member.email_address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          {getMemberStatusBadge(member.contact_status)}
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="text-right">
                            <span className="font-mono">
                              {member.opens_count}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          <div className="text-muted-foreground">
                            {lastOpen
                              ? formatDateTime(lastOpen.timestamp)
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-2">
                          {getVipBadge(member.vip)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div
                        className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <Eye
                          className="h-8 w-8 mb-2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-lg mb-2">
                          No opens found
                        </span>
                        <span>No members have opened this campaign yet.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={perPageOptions}
            createPerPageUrl={createPerPageUrl}
            itemName="items per page"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createPageUrl={createPageUrl}
          />
        </div>
      )}
    </div>
  );
}
