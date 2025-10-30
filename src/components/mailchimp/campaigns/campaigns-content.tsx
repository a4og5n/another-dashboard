/**
 * Campaigns Content Component
 * Displays campaigns table with pagination and sorting
 *
 * Server Component using URL-based pagination and sorting
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import type { Campaign } from "@/types/mailchimp/campaigns";
import { formatDateTimeSafe } from "@/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

interface CampaignsContentProps {
  campaigns: Campaign[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  errorCode?: string;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Formats campaign status for display
 */
function formatCampaignStatus(status: string): {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} {
  switch (status) {
    case "sent":
      return { label: "Sent", variant: "default" };
    case "sending":
      return { label: "Sending", variant: "secondary" };
    case "schedule":
      return { label: "Scheduled", variant: "outline" };
    case "paused":
      return { label: "Paused", variant: "secondary" };
    case "save":
      return { label: "Draft", variant: "outline" };
    case "canceled":
    case "canceling":
      return { label: "Canceled", variant: "destructive" };
    case "archived":
      return { label: "Archived", variant: "secondary" };
    default:
      return { label: status, variant: "secondary" };
  }
}

/**
 * Formats campaign type for display
 */
function formatCampaignType(type: string): string {
  switch (type) {
    case "regular":
      return "Regular";
    case "plaintext":
      return "Plain Text";
    case "absplit":
      return "A/B Split";
    case "rss":
      return "RSS";
    case "variate":
      return "Multivariate";
    default:
      return type;
  }
}

export function CampaignsContent({
  campaigns,
  currentPage,
  pageSize,
  totalItems,
  errorCode,
  sortField,
  sortDirection = "ASC",
  searchParams,
}: CampaignsContentProps) {
  const baseUrl = "/mailchimp/campaigns";

  // URL generation functions for pagination
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Preserve existing search params
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            params.set(key, stringValue);
          }
        }
      });
    }

    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();

    // Preserve existing search params
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "page" &&
          key !== "perPage"
        ) {
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            params.set(key, stringValue);
          }
        }
      });
    }

    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // URL generator for sorting (preserves all query params)
  const createSortUrl = (field?: string, direction?: "ASC" | "DESC") => {
    const params = new URLSearchParams();

    // Preserve existing search params
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            params.set(key, stringValue);
          }
        }
      });
    }

    params.set("page", "1"); // Reset to first page when sorting changes
    if (field) {
      params.set("sortField", field);
      params.set("sortDir", direction || "ASC");
    } else {
      // Clear sorting
      params.delete("sortField");
      params.delete("sortDir");
    }

    // Clean up default values
    if (params.get("page") === "1") {
      params.delete("page");
    }
    if (params.get("perPage") === "10") {
      params.delete("perPage");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns ({totalItems.toLocaleString()})</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No campaigns found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>List</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Emails Sent</TableHead>
                    <TableHead>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 font-medium"
                      >
                        <Link
                          href={createSortUrl(
                            "create_time",
                            sortField === "create_time" &&
                              sortDirection === "ASC"
                              ? "DESC"
                              : "ASC",
                          )}
                        >
                          Created
                          {sortField === "create_time" ? (
                            sortDirection === "ASC" ? (
                              <ArrowUp className="ml-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="ml-1 h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          )}
                        </Link>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 font-medium"
                      >
                        <Link
                          href={createSortUrl(
                            "send_time",
                            sortField === "send_time" && sortDirection === "ASC"
                              ? "DESC"
                              : "ASC",
                          )}
                        >
                          Sent
                          {sortField === "send_time" ? (
                            sortDirection === "ASC" ? (
                              <ArrowUp className="ml-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="ml-1 h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          )}
                        </Link>
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => {
                    const statusInfo = formatCampaignStatus(campaign.status);

                    return (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          {campaign.settings.title ||
                            campaign.settings.subject_line ||
                            "Untitled"}
                        </TableCell>
                        <TableCell>
                          {formatCampaignType(campaign.type)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{campaign.recipients.list_name}</TableCell>
                        <TableCell>
                          {campaign.recipients.recipient_count.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {campaign.emails_sent.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {campaign.create_time
                            ? formatDateTimeSafe(campaign.create_time)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {campaign.send_time
                            ? formatDateTimeSafe(campaign.send_time)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <PerPageSelector
              value={pageSize}
              createPerPageUrl={createPerPageUrl}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              createPageUrl={createPageUrl}
            />
          </div>
        )}
      </div>
    </MailchimpConnectionGuard>
  );
}
