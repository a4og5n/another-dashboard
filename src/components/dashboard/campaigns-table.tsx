import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { DateFilterPopover } from "@/components/ui/date-filter-popover";
import { ExternalLink, Mail } from "lucide-react";
import { DateRange } from "react-day-picker";

interface Campaign {
  id: string;
  title: string;
  status: string;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  sendTime: string;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  loading?: boolean;
  // Date filtering props
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onPresetSelect?: (range: DateRange | undefined) => void;
}

export function CampaignsTable({
  campaigns,
  loading = false,
  dateRange,
  onDateRangeChange,
  onPresetSelect,
}: CampaignsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "sending":
        return <Badge variant="secondary">Sending</Badge>;
      case "schedule":
        return <Badge variant="outline">Scheduled</Badge>;
      case "save":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          <TableSkeleton rows={6} columns={5} />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Emails Sent</TableHead>
                  <TableHead className="text-right">Open Rate</TableHead>
                  <TableHead className="text-right">Click Rate</TableHead>
                  <TableHead className="text-right">Sent Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={campaign.title}>
                        {campaign.title}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-right">
                      {campaign.emailsSent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          campaign.openRate > 20
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {campaign.openRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          campaign.clickRate > 2
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {campaign.clickRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(campaign.sendTime)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View campaign</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {campaigns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No campaigns found. Connect your Mailchimp account to view
                campaigns.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
