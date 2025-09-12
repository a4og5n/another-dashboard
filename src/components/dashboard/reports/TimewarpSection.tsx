/**
 * Timewarp Section Component
 * Displays time zone performance analysis for campaigns sent using Timewarp
 *
 * Issue #135: Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { TimewarpCard } from "@/components/dashboard/reports/TimewarpCard";
import type { TimewarpSectionProps } from "@/types/components/dashboard/reports";

export function TimewarpSection({ timewarp }: TimewarpSectionProps) {
  const hasTimewarpData = timewarp && timewarp.length > 0;

  return (
    <div className="space-y-6 pt-4 border-t">
      <h2 className="text-2xl font-bold">Time Zone Analysis</h2>
      {hasTimewarpData ? (
        <>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Time Zone Performance
            </h3>
            <p className="text-muted-foreground mb-4">
              This campaign was sent using Timewarp, delivering your content at
              the same local time in different time zones. Below you can see how
              your campaign performed across different regions.
            </p>
          </div>
          <TimewarpCard timewarp={timewarp} />
        </>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Timewarp Not Available</h3>
          <p className="text-muted-foreground">
            This campaign was not sent using Timewarp, or no time zone data is
            available. Timewarp allows you to send campaigns to arrive at the
            same local time in different time zones.
          </p>
        </div>
      )}
    </div>
  );
}
