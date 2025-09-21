import { Skeleton } from "@/skeletons/components/Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function TableSkeleton({
  rows = 5,
  columns = 4,
  ...props
}: TableSkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="space-y-4" {...props}>
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

export { TableSkeleton };
