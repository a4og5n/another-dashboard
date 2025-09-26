/**
 * Mailchimp Account Overview Component
 * Displays account information from the API Root endpoint
 *
 * Issue #121: Account Overview UI components
 * Uses data from: @/actions/mailchimp-root.ts
 * Uses types from: @/types/mailchimp/root.ts
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingPlanBadge } from "@/components/ui/pricing-plan-badge";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { Building2, Mail, Users, Calendar, Globe } from "lucide-react";
import type { AccountOverviewProps } from "@/types/components";
import { formatDateLongSafe } from "@/utils";

export function AccountOverview({ account, error }: AccountOverviewProps) {
  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no account data provided
  if (!account) {
    return <DashboardInlineError error="No account data provided" />;
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
              <p className="text-2xl font-bold">{account.account_name}</p>
              <p className="text-xs text-muted-foreground">
                Account ID: {account.account_id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm">{account.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PricingPlanBadge planType={account.pricing_plan_type} />
              {account.pro_enabled && (
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
            <p className="font-medium">{account.contact.company}</p>
            <div className="text-sm text-muted-foreground">
              <p>{account.contact.addr1}</p>
              {account.contact.addr2 && <p>{account.contact.addr2}</p>}
              <p>
                {account.contact.city}, {account.contact.state}{" "}
                {account.contact.zip}
              </p>
              <p>{account.contact.country}</p>
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
            {account.total_subscribers.toLocaleString()}
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
                {formatDateLongSafe(account.member_since)}
              </p>
            </div>
            {account.first_payment && (
              <div className="space-y-2">
                <p className="text-sm font-medium">First Payment</p>
                <p className="text-xl font-bold">
                  {formatDateLongSafe(account.first_payment)}
                </p>
              </div>
            )}
            {account.last_login && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-xl font-bold">
                  {formatDateLongSafe(account.last_login)}
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
            Average performance metrics for the {account.account_industry}{" "}
            industry
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(account.industry_stats.open_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Open Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {(account.industry_stats.click_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Click Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {(account.industry_stats.bounce_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
