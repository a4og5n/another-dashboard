/**
 * Automations Content Component
 * Displays automation workflows in a table format
 *
 * Uses shadcn/ui Table component for consistency
 * Server component with URL-based pagination
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
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Badge } from "@/components/ui/badge";
import type { AutomationsSuccess } from "@/types/mailchimp/automations";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { createPaginationUrls } from "@/utils/pagination/url-generators";
import Link from "next/link";

interface AutomationsContentProps {
  automationsData: AutomationsSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
}

/**
 * Get badge variant for automation status
 */
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "sending":
      return "default"; // Active/running
    case "paused":
      return "secondary"; // Paused/inactive
    case "save":
      return "outline"; // Draft/saved
    default:
      return "outline";
  }
}

export function AutomationsContent({
  automationsData,
  currentPage,
  pageSize,
  perPageOptions,
  baseUrl,
}: AutomationsContentProps) {
  const { automations, total_items } = automationsData;

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
          <CardTitle>
            Automations ({(total_items || 0).toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {automations.length === 0 ? (
            <TableEmptyState message="No automations found." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>List</TableHead>
                  <TableHead>List Status</TableHead>
                  <TableHead>Emails Sent</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automations.map((automation) => (
                  <TableRow key={automation.id}>
                    {/* Workflow Name & Type - Clickable */}
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/mailchimp/automations/${automation.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {automation.settings?.title || automation.id}
                        </Link>
                        {automation.trigger_settings?.workflow_title && (
                          <div className="text-sm text-muted-foreground">
                            {automation.trigger_settings.workflow_title}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Automation Status */}
                    <TableCell>
                      <Badge variant={getStatusVariant(automation.status)}>
                        {automation.status}
                      </Badge>
                    </TableCell>

                    {/* List Name - Clickable (no ID) */}
                    <TableCell>
                      {automation.recipients?.list_id &&
                      automation.recipients?.list_name ? (
                        <Link
                          href={`/mailchimp/lists/${automation.recipients.list_id}`}
                          className="text-primary hover:underline"
                        >
                          {automation.recipients.list_name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>

                    {/* List Status Badge */}
                    <TableCell>
                      {automation.recipients?.list_is_active !== undefined ? (
                        <Badge
                          variant={
                            automation.recipients.list_is_active
                              ? "default"
                              : "secondary"
                          }
                        >
                          {automation.recipients.list_is_active
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>

                    {/* Emails Sent */}
                    <TableCell className="text-right pr-8">
                      {automation.emails_sent?.toLocaleString() || "0"}
                    </TableCell>

                    {/* Performance Metrics */}
                    <TableCell>
                      {automation.report_summary && (
                        <div className="space-y-1 text-sm">
                          <div className="text-muted-foreground">
                            Opens:{" "}
                            {automation.report_summary.open_rate !== undefined
                              ? `${(automation.report_summary.open_rate * 100).toFixed(1)}%`
                              : "N/A"}
                          </div>
                          <div className="text-muted-foreground">
                            Clicks:{" "}
                            {automation.report_summary.click_rate !== undefined
                              ? `${(automation.report_summary.click_rate * 100).toFixed(1)}%`
                              : "N/A"}
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination - OUTSIDE Card */}
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="automations"
            options={perPageOptions}
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
