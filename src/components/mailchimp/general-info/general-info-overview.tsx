/**
 * Mailchimp General Info Overview Component
 * Displays general information from the API Root endpoint
 *
 * Issue #121: General Info Overview UI components
 * Focuses on data display - connection state handled by MailchimpConnectionBanner
 * Uses types from: @/types/mailchimp/root.ts
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlanBadge } from "@/components/ui/pricing-plan-badge";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Building2, Mail, Users, Calendar, Globe } from "lucide-react";
import type { GeneralInfoOverviewProps } from "@/types/components";
import { formatDateLongSafe } from "@/utils";

export function GeneralInfoOverview({ data, error }: GeneralInfoOverviewProps) {
  // Display API errors from service layer (NOT connection errors)
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no general info data provided
  if (!data) {
    return <DashboardInlineError error="No general info data provided" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Account Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Details</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold">{data.account_name}</p>
              <p className="text-xs text-muted-foreground">
                Account ID: {data.account_id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm">{data.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PricingPlanBadge planType={data.pricing_plan_type} />
              {data.pro_enabled && (
                <Badge variant="default" className="bg-orange-600">
                  Pro
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Contact Information
          </CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{data.contact.company}</p>
            <div className="text-sm text-muted-foreground">
              <p>{data.contact.addr1}</p>
              {data.contact.addr2 && <p>{data.contact.addr2}</p>}
              <p>
                {data.contact.city}, {data.contact.state} {data.contact.zip}
              </p>
              <p>{data.contact.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers & Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.total_subscribers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total subscribers
          </p>
        </CardContent>
      </Card>

      {/* Account Timeline */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Account Timeline
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-xl font-bold">
                {formatDateLongSafe(data.member_since)}
              </p>
            </div>
            {data.first_payment && (
              <div className="space-y-2">
                <p className="text-sm font-medium">First Payment</p>
                <p className="text-xl font-bold">
                  {formatDateLongSafe(data.first_payment)}
                </p>
              </div>
            )}
            {data.last_login && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-xl font-bold">
                  {formatDateLongSafe(data.last_login)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Industry Stats */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Industry Benchmarks
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Average performance metrics for the {data.account_industry} industry
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(data.industry_stats.open_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Open Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {(data.industry_stats.click_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Click Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {(data.industry_stats.bounce_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
