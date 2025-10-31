import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons/components/Skeleton";

/**
 * Loading skeleton for Campaign Send Checklist page
 *
 * Displays placeholder content while checklist data is being fetched.
 * Matches the structure of the actual checklist display.
 */
export function CampaignSendChecklistSkeleton() {
  return (
    <div className="space-y-6">
      {/* Readiness status skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* Checklist items skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b pb-4 last:border-b-0"
            >
              <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
