/**
 * TableEmptyState Component Types
 */

import type { LucideIcon } from "lucide-react";

export interface TableEmptyStateProps {
  /**
   * Empty state message to display
   */
  message: string;
  /**
   * Optional icon to display above the message
   */
  icon?: LucideIcon;
  /**
   * Additional CSS classes
   */
  className?: string;
}
