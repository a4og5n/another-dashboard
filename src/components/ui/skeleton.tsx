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
  showTable?: boolean;
  showList?: boolean;
}

function DashboardSkeleton({ 
  showTable = true, 
  showList = true 
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

interface MailchimpDashboardSkeletonProps {
  activeTab?: 'campaigns' | 'audiences';
}

function MailchimpDashboardSkeleton({ activeTab = 'campaigns' }: MailchimpDashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" /> {/* "Mailchimp Dashboard" */}
          <Skeleton className="h-4 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-24" /> {/* Refresh button */}
      </div>
      
      {/* Tabs Navigation */}
      <div className="space-y-4">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          <Skeleton className={`h-8 w-20 ${activeTab === 'campaigns' ? 'bg-background' : ''}`} />
          <Skeleton className={`h-8 w-20 ${activeTab === 'audiences' ? 'bg-background' : ''}`} />
          <Skeleton className="h-8 w-20 opacity-50" /> {/* Disabled Analytics tab */}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'campaigns' ? (
          <Card>
            <CardContent className="pt-6">
              <TableSkeleton rows={5} columns={6} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <ListSkeleton items={3} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-8 w-12 mx-auto mb-2" />
                      <Skeleton className="h-3 w-16 mx-auto" />
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

export { 
  Skeleton, 
  MetricCardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  DashboardSkeleton,
  MailchimpDashboardSkeleton
};
