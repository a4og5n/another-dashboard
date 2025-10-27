/**
 * Member Goals Content Component
 * Displays goal events for a list member with pagination
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
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { formatDateTimeSafe } from "@/utils/format-date";
import type { MemberGoalsResponse } from "@/types/mailchimp/member-goals";

interface MemberGoalsContentProps {
  data: MemberGoalsResponse;
  listId: string;
  subscriberHash: string;
  currentPage: number;
  pageSize: number;
}

export function MemberGoalsContent({
  data,
  listId,
  subscriberHash,
  currentPage,
  pageSize,
}: MemberGoalsContentProps) {
  const { goals, total_items } = data;
  const totalPages = Math.ceil(total_items / pageSize);
  const baseUrl = `/mailchimp/lists/${listId}/members/${subscriberHash}/goals`;

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Goals ({total_items.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No goals found for this member.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Goal ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Last Visited</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.goal_id}>
                    <TableCell>{goal.goal_id}</TableCell>
                    <TableCell>{goal.event}</TableCell>
                    <TableCell>
                      {formatDateTimeSafe(goal.last_visited_at)}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2">{goal.data || "—"}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="goals"
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
