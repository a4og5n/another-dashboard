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
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Mail, Users, Calendar, Globe } from "lucide-react";
import type { MailchimpRoot } from "@/types/mailchimp";

interface AccountOverviewProps {
  account: MailchimpRoot | null;
  loading?: boolean;
  error?: string;
}

export function AccountOverview({
  account,
  loading = false,
  error,
}: AccountOverviewProps) {
  if (loading) {
    return <AccountOverviewSkeleton />;
  }

  if (error || !account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || "Unable to load account information"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPricingPlan = (planType: string) => {
    switch (planType) {
      case "monthly":
        return "Monthly";
      case "pay_as_you_go":
        return "Pay As You Go";
      case "forever_free":
        return "Forever Free";
      default:
        return planType;
    }
  };

  const getPlanVariant = (planType: string) => {
    switch (planType) {
      case "forever_free":
        return "secondary";
      case "pay_as_you_go":
        return "outline";
      case "monthly":
        return "default";
      default:
        return "outline";
    }
  };

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
              <Badge variant={getPlanVariant(account.pricing_plan_type)}>
                {formatPricingPlan(account.pricing_plan_type)}
              </Badge>
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
                {formatDate(account.member_since)}
              </p>
            </div>
            {account.first_payment && (
              <div className="space-y-2">
                <p className="text-sm font-medium">First Payment</p>
                <p className="text-xl font-bold">
                  {formatDate(account.first_payment)}
                </p>
              </div>
            )}
            {account.last_login && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-xl font-bold">
                  {formatDate(account.last_login)}
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

function AccountOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Account Information Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>

      {/* Account Timeline Skeleton */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Stats Skeleton */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
