/**
 * List Locations Skeleton Component
 * Skeleton loading state for list locations table
 *
 * Shows loading placeholders matching the structure of the geographic locations table
 * with country names, codes, percentages, and totals.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function ListLocationsSkeleton() {
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
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Table Rows - 10 rows for country locations */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex gap-4 py-3">
                {/* Country Column */}
                <Skeleton className="h-4 w-32" />
                {/* Country Code Column */}
                <Skeleton className="h-4 w-12" />
                {/* Percentage Column */}
                <Skeleton className="h-4 w-16 ml-auto" />
                {/* Total Column */}
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
