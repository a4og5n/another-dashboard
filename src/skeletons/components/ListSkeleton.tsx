import { Skeleton } from "@/skeletons/components/Skeleton";

interface ListSkeletonProps {
  items?: number;
}

function ListSkeleton({ items = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
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

export { ListSkeleton };
