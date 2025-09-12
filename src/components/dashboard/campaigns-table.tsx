import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { DateFilterPopover } from "@/components/ui/date-filter-popover";
import { CampaignStatusBadge } from "@/components/ui/campaign-status-badge";
import { Mail } from "lucide-react";
import { CampaignsArraySchema } from "@/schemas/campaign";
import type { MailchimpDashboardCampaign } from "@/types/mailchimp-dashboard";
import type { CampaignsTableProps } from "@/types/components/dashboard/campaigns-table";
import { formatDateShort } from "@/utils";

export function CampaignsTable({
  campaigns,
  loading = false,
  dateRange,
  onDateRangeChange,
  onPresetSelect,
}: CampaignsTableProps) {
  // Validate campaigns prop
  /**
   * Validated campaigns array. Only valid campaigns will be rendered.
   * If validation fails, renders an empty table. This prevents runtime errors from invalid data.
   *
   * Validation is performed using centralized Zod schemas for strict type safety.
   */
  let safeCampaigns: MailchimpDashboardCampaign[] = [];
  try {
    safeCampaigns = CampaignsArraySchema.parse(campaigns);
  } catch {
    // Optionally log error or show fallback UI
    safeCampaigns = [];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Recent Campaigns</span>
          </div>
          <DateFilterPopover
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange || (() => {})}
            onPresetSelect={onPresetSelect}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TableSkeleton rows={6} columns={5} data-testid="table-skeleton" />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Emails Sent</TableHead>
                  {/* ...existing code... */}
                  <TableHead className="text-right">Sent Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={campaign.title}>
                        {campaign.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CampaignStatusBadge status={campaign.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.emailsSent.toLocaleString()}
                    </TableCell>
                    {/* ...existing code... */}
                    <TableCell className="text-right text-muted-foreground">
                      {formatDateShort(campaign.sendTime)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {safeCampaigns.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <Mail
                  className="h-8 w-8 mb-2 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="font-semibold text-lg mb-2">
                  No campaigns found
                </span>
                <span>
                  Connect your Mailchimp account to view campaigns or adjust
                  your filters.
                </span>
                <Button
                  variant="outline"
                  className="mt-4"
                  aria-label="Connect Mailchimp account"
                >
                  Connect Mailchimp
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
