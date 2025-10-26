/**
 * Member Activity Skeleton Component
 * Skeleton loading state for member activity feed table
 *
 * Shows loading placeholders matching the structure of the activity feed
 * with activity types, timestamps, and action details.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function MemberActivitySkeleton() {
  return (
    <div className="space-y-6">
      {/* Table Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 py-3 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table Rows - 10 rows for activity events */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-3">
                {/* Activity Type Column */}
                <Skeleton className="h-5 w-20" />
                {/* Campaign Title Column */}
                <Skeleton className="h-4 w-40" />
                {/* Details Column */}
                <Skeleton className="h-4 w-32" />
                {/* Timestamp Column */}
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
