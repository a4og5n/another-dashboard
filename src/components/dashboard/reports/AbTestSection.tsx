/**
 * A/B Test Section Component
 * Displays A/B test analysis for campaign reports
 *
 * Issue #135: Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { AbSplitCard } from "@/components/dashboard/reports/AbSplitCard";
import type { AbTestSectionProps } from "@/types/components/dashboard/reports";

export function AbTestSection({ abSplit }: AbTestSectionProps) {
  const hasAbTestData = !!abSplit;

  return (
    <div className="space-y-6 pt-4 border-t">
      <h2 className="text-2xl font-bold">A/B Test Analysis</h2>
      {hasAbTestData ? (
        <>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              A/B Test Results
            </h3>
            <p className="text-muted-foreground mb-4">
              This campaign was sent as an A/B test with two different
              variants. Compare the performance of each variant to
              determine which was more effective.
            </p>
          </div>
          <AbSplitCard abSplit={abSplit} />
        </>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">
            A/B Testing Not Available
          </h3>
          <p className="text-muted-foreground">
            This campaign was not sent as an A/B test, or no A/B test
            data is available. A/B testing allows you to test different
            versions of your campaign to see which performs better.
          </p>
        </div>
      )}
    </div>
  );
}
