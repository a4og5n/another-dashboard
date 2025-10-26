/**
 * Member Notes Content Component
 * Displays notes for a list member with pagination
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
import type { MemberNotesResponse } from "@/types/mailchimp/member-notes";

interface MemberNotesContentProps {
  data: MemberNotesResponse;
  listId: string;
  subscriberHash: string;
  currentPage: number;
  pageSize: number;
}

export function MemberNotesContent({
  data,
  listId,
  subscriberHash,
  currentPage,
  pageSize,
}: MemberNotesContentProps) {
  const { notes, total_items } = data;
  const totalPages = Math.ceil(total_items / pageSize);
  const baseUrl = `/mailchimp/lists/${listId}/members/${subscriberHash}/notes`;

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
          <CardTitle>Member Notes ({total_items.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notes found for this member.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Note ID</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>{note.id}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2">{note.note}</p>
                    </TableCell>
                    <TableCell>{note.created_by}</TableCell>
                    <TableCell>{formatDateTimeSafe(note.created_at)}</TableCell>
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
            itemName="notes"
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
