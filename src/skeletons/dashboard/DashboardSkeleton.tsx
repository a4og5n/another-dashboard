import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons/components/Skeleton";
import { TableSkeleton } from "@/skeletons/components/TableSkeleton";
import { ListSkeleton } from "@/skeletons/components/ListSkeleton";

interface DashboardSkeletonProps {
  showTable?: boolean;
  showList?: boolean;
}

function DashboardSkeleton({
  showTable = true,
  showList = true,
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tabs Navigation */}
      <div className="space-y-4">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Tab Content */}
        {showTable && (
          <Card>
            <CardContent className="pt-6">
              <TableSkeleton rows={5} columns={6} />
            </CardContent>
          </Card>
        )}

        {showList && !showTable && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <ListSkeleton items={4} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-6 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export { DashboardSkeleton };
