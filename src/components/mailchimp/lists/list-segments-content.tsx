/**
 * List Segments Content Component
 * Displays segments table with pagination
 *
 * Server Component using URL-based pagination
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
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import type { Segment } from "@/types/mailchimp/list-segments";
import { formatDateTimeSafe } from "@/utils";

interface ListSegmentsContentProps {
  segments: Segment[];
  listId: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

/**
 * Formats segment type for display
 */
function formatSegmentType(type: string): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  switch (type) {
    case "saved":
      return { label: "Saved", variant: "default" };
    case "static":
      return { label: "Static", variant: "secondary" };
    case "fuzzy":
      return { label: "Predicted", variant: "outline" };
    default:
      return { label: type, variant: "secondary" };
  }
}

export function ListSegmentsContent({
  segments,
  listId,
  currentPage,
  pageSize,
  totalItems,
}: ListSegmentsContentProps) {
  const baseUrl = `/mailchimp/lists/${listId}/segments`;

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

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>List Segments ({totalItems.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No segments found for this list.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments.map((segment) => {
                  const typeInfo = formatSegmentType(segment.type);

                  return (
                    <TableRow key={segment.id}>
                      <TableCell>
                        <Link
                          href={`/mailchimp/lists/${listId}/segments/${segment.id}/members`}
                          className="font-medium hover:underline"
                        >
                          {segment.name}
                        </Link>
                        {segment.options && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Match: {segment.options.match} •{" "}
                            {segment.options.conditions.length} condition
                            {segment.options.conditions.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeInfo.variant}>
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {segment.member_count.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDateTimeSafe(segment.created_at)}
                      </TableCell>
                      <TableCell>
                        {formatDateTimeSafe(segment.updated_at)}
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
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="segments"
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
