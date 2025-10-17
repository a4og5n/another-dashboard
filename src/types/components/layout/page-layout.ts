/**
 * Types for PageLayout component
 *
 * Centralizes the common page layout pattern used across all dashboard pages.
 * Supports both static breadcrumbs (Pattern A) and dynamic breadcrumbs (Pattern B).
 *
 * @see src/components/layout/page-layout.tsx
 */

import type { BreadcrumbItem } from "@/types/components/layout";
import type { ReactNode } from "react";

/**
 * Props for the PageLayout component
 *
 * Use either `breadcrumbs` OR `breadcrumbsSlot`, never both:
 * - Pattern A (static pages): Use `breadcrumbs` prop with BreadcrumbItem array
 * - Pattern B (dynamic pages): Use `breadcrumbsSlot` prop with pre-wrapped Suspense
 */
export interface PageLayoutProps {
  /**
   * Breadcrumb items for static pages (Pattern A)
   * Use this when page has no dynamic route params
   *
   * @example
   * breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
   */
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Pre-rendered breadcrumb content for dynamic pages (Pattern B)
   * Use this when breadcrumbs need dynamic params (e.g., [id] routes)
   * Should be wrapped in Suspense boundary
   *
   * @example
   * breadcrumbsSlot={
   *   <Suspense fallback={null}>
   *     <BreadcrumbContent params={params} />
   *   </Suspense>
   * }
   */
  breadcrumbsSlot?: ReactNode;

  /**
   * Page title displayed in h1
   */
  title: string;

  /**
   * Page description displayed below title
   */
  description: string;

  /**
   * Skeleton component to show while content loads
   */
  skeleton: ReactNode;

  /**
   * Main page content (async component)
   */
  children: ReactNode;
}
