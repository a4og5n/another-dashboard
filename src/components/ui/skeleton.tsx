import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

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

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex space-x-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-24 flex-1" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps {
  items?: number;
}

function ListSkeleton({ items = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DashboardSkeletonProps {
  showMetrics?: boolean;
  showTable?: boolean;
  showList?: boolean;
}

function DashboardSkeleton({ 
  showMetrics = true, 
  showTable = true, 
  showList = true 
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      {showMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton showTrend={false} />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left Column - Table */}
        {showTable && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={6} columns={5} />
            </CardContent>
          </Card>
        )}
        
        {/* Right Column - List */}
        {showList && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <ListSkeleton items={4} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export { 
  Skeleton, 
  MetricCardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  DashboardSkeleton 
};
