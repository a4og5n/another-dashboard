import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons/components/Skeleton";

interface MetricCardSkeletonProps {
  showTrend?: boolean;
}

function MetricCardSkeleton({ showTrend = true }: MetricCardSkeletonProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        {showTrend && <Skeleton className="h-4 w-4 rounded-full" />}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export { MetricCardSkeleton };
