/**
 * Landing Pages Skeleton
 * Loading state for Landing Pages list
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function LandingPagesSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Table header */}
            <div className="flex gap-4 pb-2 border-b">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Table rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-4 border-b">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
