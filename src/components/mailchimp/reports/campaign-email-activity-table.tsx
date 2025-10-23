/**
 * Campaign Email Activity Table Component
 * Displays email activity (opens, clicks, bounces) in a table format
 *
 * Uses shadcn/ui Table component for consistency with reports list page
 * Server component with URL-based pagination
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmailActivitySuccess } from "@/types/mailchimp/email-activity";
import { MousePointerClick, Mail, AlertCircle } from "lucide-react";
import { getActiveStatusBadge } from "@/components/ui/helpers/badge-utils";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { createPaginationUrls } from "@/utils/pagination/url-generators";

interface CampaignEmailActivityTableProps {
  emailActivityData: EmailActivitySuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

export function CampaignEmailActivityTable({
  emailActivityData,
  campaignId,
  currentPage,
  pageSize,
  perPageOptions,
  baseUrl,
}: CampaignEmailActivityTableProps) {
  const { emails, total_items } = emailActivityData;

  // Calculate pagination
  const totalPages = Math.ceil((total_items || 0) / pageSize);

  // URL generators for server-side pagination
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Activity ({total_items.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No email activity found for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Total Events</TableHead>
                  <TableHead>List Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => {
                  // Count activity types
                  const opens = email.activity.filter(
                    (a) => a.action === "open",
                  ).length;
                  const clicks = email.activity.filter(
                    (a) => a.action === "click",
                  ).length;
                  const bounces = email.activity.filter(
                    (a) => a.action === "bounce",
                  ).length;

                  const emailActivityUrl = `/mailchimp/reports/${campaignId}/email-activity/${email.email_id}`;

                  return (
                    <TableRow key={email.email_id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="space-y-1">
                          <Link
                            href={emailActivityUrl}
                            className="truncate hover:underline text-primary block"
                            title={email.email_address}
                          >
                            {email.email_address}
                          </Link>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {opens > 0 && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {opens}
                              </span>
                            )}
                            {clicks > 0 && (
                              <span className="flex items-center gap-1">
                                <MousePointerClick className="h-3 w-3" />{" "}
                                {clicks}
                              </span>
                            )}
                            {bounces > 0 && (
                              <span className="flex items-center gap-1 text-destructive">
                                <AlertCircle className="h-3 w-3" /> {bounces}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {email.activity.length}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/mailchimp/lists/${email.list_id}`}
                          className="inline-block hover:opacity-80 transition-opacity"
                        >
                          {getActiveStatusBadge(email.list_is_active)}
                        </Link>
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
      {total_items > 10 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            options={perPageOptions}
            createPerPageUrl={createPerPageUrl}
            itemName="emails per page"
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
