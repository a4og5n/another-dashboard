/**
 * Auth Loading Component
 * Skeleton loading state for authentication components
 * 
 * Following established loading patterns using shadcn/ui Skeleton
 */
import { Skeleton } from "@/components/ui/skeleton";

export function AuthLoading() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

/**
 * User Menu Loading Skeleton
 * Specific loading state for the user menu dropdown
 */
export function UserMenuLoading() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="hidden md:flex flex-col space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}