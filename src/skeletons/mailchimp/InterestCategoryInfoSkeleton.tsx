/**
 * Interest Category Info Skeleton Component
 * Skeleton loading state for interest category detail page
 *
 * Shows loading placeholders for category details including
 * title, type, display order, and related information
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function InterestCategoryInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Category Details Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Title */}
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-72" />
            </div>

            {/* Category Type */}
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Display Order */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* IDs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
