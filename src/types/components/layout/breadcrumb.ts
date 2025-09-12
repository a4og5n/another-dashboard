/**
 * Types for Breadcrumb Navigation components
 *
 * Follows project guidelines for centralized type definitions
 */

/**
 * Represents an item in the breadcrumb navigation
 */
export interface BreadcrumbItem {
  /**
   * The text to display for the breadcrumb item
   */
  label: string;

  /**
   * Optional URL for the breadcrumb item
   * If not provided, the item will be rendered as plain text
   */
  href?: string;

  /**
   * Whether this item represents the current page
   * Affects styling and accessibility attributes
   */
  isCurrent?: boolean;
}

/**
 * Props for the BreadcrumbNavigation component
 */
export interface BreadcrumbNavigationProps {
  /**
   * Array of breadcrumb items to display
   */
  items: BreadcrumbItem[];

  /**
   * Optional additional CSS class names
   */
  className?: string;
}
