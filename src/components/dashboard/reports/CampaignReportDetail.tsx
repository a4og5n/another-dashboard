/**
 * Campaign Report Detail Container Component
 * Main container that orchestrates all campaign report sub-components
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "@/components/dashboard/reports/ReportHeader";
import { ReportMetrics } from "@/components/dashboard/reports/ReportMetrics";
import { ReportCharts } from "@/components/dashboard/reports/ReportCharts";
import { ReportLinks } from "@/components/dashboard/reports/ReportLinks";
import { DeliveryStatusCard } from "@/components/dashboard/reports/DeliveryStatusCard";
import { EcommerceCard } from "@/components/dashboard/reports/EcommerceCard";
import { TimeseriesCard } from "@/components/dashboard/reports/TimeseriesCard";
import { TimewarpCard } from "@/components/dashboard/reports/TimewarpCard";
import { AbSplitCard } from "@/components/dashboard/reports/AbSplitCard";
import { ForwardsCard } from "@/components/dashboard/reports/ForwardsCard";
import { OpensCard } from "@/components/dashboard/reports/OpensCard";
import { ClicksCard } from "@/components/dashboard/reports/ClicksCard";
import { IndustryStatsCard } from "@/components/dashboard/reports/IndustryStatsCard";
import { EmailsSentCard } from "@/components/dashboard/reports/EmailsSentCard";
import { DeliveryIssuesCard } from "@/components/dashboard/reports/DeliveryIssuesCard";
import { ListHealthCard } from "@/components/dashboard/reports/ListHealthCard";
import { UnsubscribedCard } from "@/components/dashboard/reports/UnsubscribedCard";
import type { CampaignReportDetailProps } from "@/types/components";

export function CampaignReportDetail({ report }: CampaignReportDetailProps) {
  // Define valid tabs for the component
  const validTabs = ["overview", "analytics", "links"];
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current tab from URL search params or use default
  const tabFromUrl = searchParams.get("tab");

  // Determine the active tab with validation
  const activeTab =
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "overview";

  // No longer forcing the default tab into URL when not present
  // We'll just use the activeTab variable instead
   
  useEffect(() => {
    // No initialization needed - we'll handle this in the tab change handler
  }, []); // Empty dependency array to run only on mount

  // Handle tab changes - update URL when tab changes
  const handleTabChange = (value: string) => {
    // Create a new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams.toString());

    // If it's the default tab (overview), remove the tab parameter
    // Otherwise, set the tab parameter
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }

    // Update the URL without reloading the page
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Report Header */}
      <ReportHeader report={report} />

      {/* Tabbed Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-full overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EmailsSentCard emailsSent={report.emails_sent} />
              <DeliveryIssuesCard
                bounces={report.bounces}
                totalEmails={report.emails_sent}
              />
              <ListHealthCard
                unsubscribed={report.unsubscribed}
                abuseReports={report.abuse_reports}
                emailsSent={report.emails_sent}
              />
              <UnsubscribedCard
                unsubscribed={report.unsubscribed}
                abuseReports={report.abuse_reports}
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportMetrics report={report} />
              <div className="space-y-6">
                <OpensCard opens={report.opens} />
                <ClicksCard clicks={report.clicks} />
                <IndustryStatsCard
                  industryStats={report.industry_stats}
                  campaignStats={{
                    open_rate: report.opens.open_rate,
                    click_rate: report.clicks.click_rate,
                  }}
                />
                <DeliveryStatusCard
                  deliveryStatus={report.delivery_status}
                  totalEmails={report.emails_sent}
                />
                <ForwardsCard forwards={report.forwards} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-8">
            {/* Timeseries and Charts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Campaign Performance</h2>
              {report.timeseries && report.timeseries.length > 0 && (
                <TimeseriesCard timeseries={report.timeseries} />
              )}
              <ReportCharts report={report} />
            </div>

            {/* A/B Test Section */}
            <div className="space-y-6 pt-4 border-t">
              <h2 className="text-2xl font-bold">A/B Test Analysis</h2>
              {report.ab_split ? (
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
                  <AbSplitCard abSplit={report.ab_split} />
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

            {/* Ecommerce Section */}
            <div className="space-y-6 pt-4 border-t">
              <h2 className="text-2xl font-bold">Ecommerce Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <EcommerceCard
                    ecommerce={report.ecommerce}
                    className="h-full"
                  />
                </div>
                <div className="md:col-span-1 bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Ecommerce Insights
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p>
                      This campaign generated{" "}
                      <strong>
                        {report.ecommerce.total_orders.toLocaleString()}
                      </strong>{" "}
                      orders with a total revenue of{" "}
                      <strong>
                        {report.ecommerce.total_revenue.toLocaleString()}
                      </strong>
                      {report.ecommerce.currency_code
                        ? ` ${report.ecommerce.currency_code}`
                        : ""}
                      .
                    </p>
                    {report.ecommerce.total_orders > 0 && (
                      <p>
                        The average order value was{" "}
                        <strong>
                          {(
                            report.ecommerce.total_spent /
                            report.ecommerce.total_orders
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                          {report.ecommerce.currency_code
                            ? ` ${report.ecommerce.currency_code}`
                            : ""}
                        </strong>
                        .
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm mt-4">
                      For detailed product sales information, visit your
                      e-commerce platform&apos;s analytics dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timewarp Section */}
            <div className="space-y-6 pt-4 border-t">
              <h2 className="text-2xl font-bold">Time Zone Analysis</h2>
              {report.timewarp && report.timewarp.length > 0 ? (
                <>
                  <div className="bg-card rounded-xl border shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Time Zone Performance
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This campaign was sent using Timewarp, delivering your
                      content at the same local time in different time zones.
                      Below you can see how your campaign performed across
                      different regions.
                    </p>
                  </div>
                  <TimewarpCard timewarp={report.timewarp} />
                </>
              ) : (
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Timewarp Not Available
                  </h3>
                  <p className="text-muted-foreground">
                    This campaign was not sent using Timewarp, or no time zone
                    data is available. Timewarp allows you to send campaigns to
                    arrive at the same local time in different time zones.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="links" className="mt-6">
          <div className="space-y-6">
            <ReportLinks report={report} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
