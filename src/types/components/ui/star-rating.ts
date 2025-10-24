/**
 * StarRating Component Types
 */

export interface StarRatingProps {
  /**
   * Rating value (0-5)
   */
  rating: number;
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Additional CSS classes
   */
  className?: string;
}
