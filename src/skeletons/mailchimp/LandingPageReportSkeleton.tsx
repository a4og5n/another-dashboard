/**
 * Landing Page Report Skeleton Component
 * Skeleton loading state for landing page report detail pages
 *
 * Issue #400: Get Landing Page Report implementation
 * Following established patterns from existing skeleton components
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons";

export function LandingPageReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Card Loading */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-8 w-96" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Analytics Loading */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion & E-commerce Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeseries Chart Loading */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
