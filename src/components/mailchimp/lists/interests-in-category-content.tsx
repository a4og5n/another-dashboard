/**
 * Interests in Category Content Component
 * Displays interests table with pagination and subscriber counts
 *
 * Server Component using URL-based pagination
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
import type { Interest } from "@/types/mailchimp/list-interests";

interface InterestsInCategoryContentProps {
  interests: Interest[];
  listId: string;
  categoryId: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function InterestsInCategoryContent({
  interests,
  listId,
  categoryId,
  currentPage,
  pageSize,
  totalItems,
}: InterestsInCategoryContentProps) {
  const baseUrl = `/mailchimp/lists/${listId}/interest-categories/${categoryId}/interests`;

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
          <CardTitle>Interests ({totalItems.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          {interests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No interests found in this category.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Subscribers</TableHead>
                  <TableHead className="text-right">Display Order</TableHead>
                  <TableHead className="text-right">Interest ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell>
                      <div className="font-medium">{interest.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">
                        {parseInt(
                          interest.subscriber_count.toString(),
                        ).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">
                        {interest.display_order}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {interest.id}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
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
            itemName="interests"
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
