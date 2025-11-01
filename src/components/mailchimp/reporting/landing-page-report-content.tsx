/**
 * Landing Page Report Component
 * View comprehensive performance analytics and conversion metrics for this landing page
 *
 * @route /mailchimp/reporting/landing-pages/[outreach_id]
 * Issue #400: Get Landing Page Report implementation
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import {
  Users,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Eye,
  Target,
  Calendar,
  Tag,
} from "lucide-react";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { formatDateTimeSafe } from "@/utils/format-date";
import type { LandingPageReport } from "@/types/mailchimp/reporting/landing-page-report";

interface LandingPageReportContentProps {
  data: LandingPageReport;
  errorCode?: string;
}

export function LandingPageReportContent({
  data,
  errorCode,
}: LandingPageReportContentProps) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{data.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {data.title || "N/A"}
                </p>
              </div>
              <Badge
                variant={data.status === "published" ? "default" : "secondary"}
              >
                {data.status || "N/A"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">URL</p>
              {data.url ? (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {data.url}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">N/A</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Published</p>
              <p className="text-sm text-muted-foreground">
                {data.published_at
                  ? formatDateTimeSafe(data.published_at)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Unpublished</p>
              <p className="text-sm text-muted-foreground">
                {data.unpublished_at
                  ? formatDateTimeSafe(data.unpublished_at)
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Eye} value={data.visits ?? 0} label="Total Visits" />
          <StatCard
            icon={Users}
            value={data.unique_visits ?? 0}
            label="Unique Visitors"
          />
          <StatCard
            icon={Target}
            value={data.subscribes ?? 0}
            label="Signups"
          />
          <StatCard
            icon={TrendingUp}
            value={`${data.conversion_rate?.toFixed(2) ?? 0}%`}
            label="Conversion Rate"
          />
        </div>

        {/* Click Metrics */}
        {data.clicks !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5" />
                Click Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">Total Clicks</p>
                  <p className="text-2xl font-bold">
                    {data.clicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* E-commerce Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              E-commerce Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.ecommerce ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {data.ecommerce.currency_code ?? ""}{" "}
                    {data.ecommerce.total_revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {data.ecommerce.total_orders.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold">
                    {data.ecommerce.average_order_revenue !== undefined
                      ? `${data.ecommerce.currency_code ?? ""} ${data.ecommerce.average_order_revenue.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </CardContent>
        </Card>

        {/* Timeseries Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.timeseries ? (
              <div className="space-y-6">
                {/* Daily Stats */}
                {data.timeseries.daily_stats ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Daily Stats</h4>
                    <div className="space-y-4">
                      {/* Clicks */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Clicks
                        </p>
                        {data.timeseries.daily_stats.clicks?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.daily_stats.clicks.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>

                      {/* Visits */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Visits
                        </p>
                        {data.timeseries.daily_stats.visits?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.daily_stats.visits.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>

                      {/* Unique Visits */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Unique Visits
                        </p>
                        {data.timeseries.daily_stats.unique_visits?.length >
                        0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.daily_stats.unique_visits.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Weekly Stats */}
                {data.timeseries.weekly_stats ? (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Weekly Stats</h4>
                    <div className="space-y-4">
                      {/* Clicks */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Clicks
                        </p>
                        {data.timeseries.weekly_stats.clicks?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.weekly_stats.clicks.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>

                      {/* Visits */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Visits
                        </p>
                        {data.timeseries.weekly_stats.visits?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.weekly_stats.visits.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>

                      {/* Unique Visits */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Unique Visits
                        </p>
                        {data.timeseries.weekly_stats.unique_visits?.length >
                        0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-2">Date</th>
                                  <th className="text-right py-2 px-2">
                                    Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.timeseries.weekly_stats.unique_visits.map(
                                  (point, idx) => (
                                    <tr key={idx} className="border-b">
                                      <td className="py-2 px-2">
                                        {point.date}
                                      </td>
                                      <td className="text-right py-2 px-2">
                                        {point.val.toLocaleString()}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No data
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* If both daily and weekly are missing */}
                {!data.timeseries.daily_stats &&
                  !data.timeseries.weekly_stats && (
                    <p className="text-sm text-muted-foreground">N/A</p>
                  )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </CardContent>
        </Card>

        {/* Signup Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Signup Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.signup_tags && data.signup_tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.signup_tags.map((tag) => (
                  <Badge key={tag.tag_id} variant="secondary">
                    {tag.tag_name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        {(data.list_name || data.web_id) && (
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.list_name && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Associated List
                    </dt>
                    <dd className="mt-1 text-sm">{data.list_name}</dd>
                  </div>
                )}
                {data.web_id && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Web ID
                    </dt>
                    <dd className="mt-1 text-sm">{data.web_id}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </MailchimpConnectionGuard>
  );
}
