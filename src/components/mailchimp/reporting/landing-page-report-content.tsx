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
                {data.title && (
                  <p className="text-sm text-muted-foreground">{data.title}</p>
                )}
              </div>
              <Badge
                variant={data.status === "published" ? "default" : "secondary"}
              >
                {data.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">
                  {data.description}
                </p>
              </div>
            )}
            {data.url && (
              <div>
                <p className="text-sm font-medium mb-1">URL</p>
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {data.url}
                </a>
              </div>
            )}
            {data.published_at && (
              <div>
                <p className="text-sm font-medium mb-1">Published</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTimeSafe(data.published_at)}
                </p>
              </div>
            )}
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
        {data.ecommerce && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                E-commerce Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                {data.ecommerce.average_order_revenue !== undefined && (
                  <div>
                    <p className="text-sm font-medium mb-1">Avg Order Value</p>
                    <p className="text-2xl font-bold">
                      {data.ecommerce.currency_code ?? ""}{" "}
                      {data.ecommerce.average_order_revenue.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
