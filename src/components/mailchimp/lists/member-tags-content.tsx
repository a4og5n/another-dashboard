/**
 * Member Tags Content Component
 * Displays tags assigned to a list member with pagination
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
import type { MemberTagsResponse } from "@/types/mailchimp/member-tags";

interface MemberTagsContentProps {
  data: MemberTagsResponse;
  listId: string;
  subscriberHash: string;
  currentPage: number;
  pageSize: number;
}

export function MemberTagsContent({
  data,
  listId,
  subscriberHash,
  currentPage,
  pageSize,
}: MemberTagsContentProps) {
  const { tags, total_items } = data;
  const totalPages = Math.ceil(total_items / pageSize);
  const baseUrl = `/mailchimp/lists/${listId}/members/${subscriberHash}/tags`;

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
    <Card>
      <CardHeader>
        <CardTitle>Member Tags ({total_items.toLocaleString()})</CardTitle>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tags assigned to this member.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>{formatDateTimeSafe(tag.date_added)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <PerPageSelector
                value={pageSize}
                createPerPageUrl={createPerPageUrl}
                itemName="tags"
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                createPageUrl={createPageUrl}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
