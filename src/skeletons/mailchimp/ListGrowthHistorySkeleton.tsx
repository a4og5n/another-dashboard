/**
 * List Growth History Skeleton Component
 * Skeleton loading state for list growth history table
 *
 * Shows loading placeholders matching the structure of the monthly growth table
 * with month labels and numeric growth metrics.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function ListGrowthHistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Table Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="space-y-4">
            <div className="flex gap-4 py-3 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Table Rows - 5 rows for monthly growth */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-4 py-3">
                {/* Month Column */}
                <Skeleton className="h-4 w-24" />
                {/* Numeric Columns */}
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-9 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
