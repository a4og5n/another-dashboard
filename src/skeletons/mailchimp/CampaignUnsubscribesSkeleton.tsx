/**
 * Campaign Unsubscribes Skeleton Component
 * Skeleton loading state for campaign unsubscribes table
 *
 * Shows loading placeholders matching the structure of the unsubscribes table
 * with email addresses, unsubscribe dates, reasons, and pagination controls.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function CampaignUnsubscribesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Table Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 py-3 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Table Rows - 5 rows for unsubscribed members */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
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
