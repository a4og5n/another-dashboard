/**
 * Interest Categories Content Component
 * Displays interest categories table with pagination
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
import type { InterestCategory } from "@/types/mailchimp/list-interest-categories";

interface InterestCategoriesContentProps {
  categories: InterestCategory[];
  listId: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

/**
 * Formats category type for display
 */
function formatCategoryType(type: string): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  switch (type) {
    case "checkboxes":
      return { label: "Checkboxes", variant: "default" };
    case "dropdown":
      return { label: "Dropdown", variant: "secondary" };
    case "radio":
      return { label: "Radio Buttons", variant: "outline" };
    case "hidden":
      return { label: "Hidden", variant: "secondary" };
    default:
      return { label: type, variant: "secondary" };
  }
}

export function InterestCategoriesContent({
  categories,
  listId,
  currentPage,
  pageSize,
  totalItems,
}: InterestCategoriesContentProps) {
  const baseUrl = `/mailchimp/lists/${listId}/interest-categories`;

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
          <CardTitle>
            Interest Categories ({totalItems.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No interest categories found for this list.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Display Order</TableHead>
                  <TableHead className="text-right">Category ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const typeInfo = formatCategoryType(category.type);
                  const interestsUrl = `/mailchimp/lists/${listId}/interest-categories/${category.id}/interests`;

                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Link
                          href={interestsUrl}
                          className="font-medium hover:underline"
                        >
                          {category.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeInfo.variant}>
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-muted-foreground">
                          {category.display_order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={interestsUrl}>
                          <code className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors cursor-pointer">
                            {category.id}
                          </code>
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
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector
            value={pageSize}
            createPerPageUrl={createPerPageUrl}
            itemName="categories"
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
