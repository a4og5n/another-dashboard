/**
 * PageLayout Component
 * Reusable layout wrapper for dashboard pages
 *
 * Encapsulates common page structure:
 * - DashboardLayout wrapper
 * - Breadcrumb navigation (static or dynamic)
 * - Page header (title + description)
 * - Suspense boundary with skeleton
 *
 * @example Pattern A - Static Pages
 * ```tsx
 * <PageLayout
 *   breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
 *   title="Reports"
 *   description="View and analyze your Mailchimp reports"
 *   skeleton={<ReportsOverviewSkeleton />}
 * >
 *   <ReportsPageContent searchParams={searchParams} />
 * </PageLayout>
 * ```
 *
 * @example Pattern B - Dynamic Pages
 * ```tsx
 * <PageLayout
 *   breadcrumbsSlot={
 *     <Suspense fallback={null}>
 *       <BreadcrumbContent params={params} />
 *     </Suspense>
 *   }
 *   title="Campaign Opens"
 *   description="Members who opened this campaign"
 *   skeleton={<CampaignOpensSkeleton />}
 * >
 *   <CampaignOpensPageContent {...props} />
 * </PageLayout>
 * ```
 */

import { Suspense } from "react";
import { DashboardLayout, BreadcrumbNavigation } from "@/components/layout";
import type { PageLayoutProps } from "@/types/components/layout";

export function PageLayout({
  breadcrumbs,
  breadcrumbsSlot,
  title,
  description,
  skeleton,
  children,
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs - support both static and dynamic patterns */}
        {breadcrumbs && <BreadcrumbNavigation items={breadcrumbs} />}
        {breadcrumbsSlot && breadcrumbsSlot}

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Main Content */}
        <Suspense fallback={skeleton}>{children}</Suspense>
      </div>
    </DashboardLayout>
  );
}
