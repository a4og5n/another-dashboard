/**
 * Campaign Unsubscribes Table Component
 * Displays unsubscribed members in a simple table format
 *
 * TODO: Replace with full TanStack Table implementation (see click-details-content.tsx)
 * For now, using simple Card + table markup as placeholder
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UnsubscribesSuccess } from "@/types/mailchimp/unsubscribes";
import { formatDateTimeSafe } from "@/utils/format-date";

interface CampaignUnsubscribesTableProps {
  unsubscribesData: UnsubscribesSuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

export function CampaignUnsubscribesTable({
  unsubscribesData,
}: CampaignUnsubscribesTableProps) {
  const { unsubscribes, total_items } = unsubscribesData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unsubscribed Members ({total_items})</CardTitle>
        </CardHeader>
        <CardContent>
          {unsubscribes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No unsubscribes found for this campaign.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Reason</th>
                    <th className="text-left p-4 font-medium">VIP</th>
                  </tr>
                </thead>
                <tbody>
                  {unsubscribes.map((member) => (
                    <tr
                      key={member.email_id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-4">{member.email_address}</td>
                      <td className="p-4 text-muted-foreground">
                        {formatDateTimeSafe(member.timestamp)}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {member.reason || "N/A"}
                      </td>
                      <td className="p-4">
                        {member.vip ? (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            VIP
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add pagination component when needed */}
      {total_items > 10 && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              TODO: Add pagination component (total: {total_items} members)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
