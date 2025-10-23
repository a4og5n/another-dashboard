import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons/components/Skeleton";

/**
 * Loading skeleton for Campaign Advice page
 *
 * Displays placeholder content while advice data is being fetched.
 * Matches the structure of the actual advice display.
 */
export function CampaignAdviceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Advice items skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 border-b pb-4 last:border-b-0">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
