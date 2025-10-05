import { Skeleton } from "@/skeletons";

export function ReportsOverviewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b last:border-b-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
