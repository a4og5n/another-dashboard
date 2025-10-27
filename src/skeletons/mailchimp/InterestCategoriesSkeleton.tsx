/**
 * Interest Categories Skeleton Component
 * Skeleton loading state for interest categories table
 *
 * Shows loading placeholders matching the structure of the interest categories table
 * with category titles, types, and display order.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function InterestCategoriesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Table Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="space-y-4">
            <div className="flex gap-4 py-3 border-b">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>

            {/* Table Rows - 5 rows for interest categories */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-4 py-3">
                {/* Title Column */}
                <Skeleton className="h-4 w-48" />
                {/* Type Column */}
                <Skeleton className="h-4 w-28" />
                {/* Display Order Column */}
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
