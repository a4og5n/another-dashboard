/**
 * Star Rating Component
 * Displays a 5-star rating with filled/unfilled stars
 *
 * @example
 * <StarRating rating={3} size="sm" />
 * <StarRating rating={4.5} size="md" />
 */

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StarRatingProps } from "@/types/components/ui/star-rating";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function StarRating({
  rating,
  size = "md",
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

StarRating.displayName = "StarRating";
