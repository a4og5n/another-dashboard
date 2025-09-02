/**
 * Mailchimp Account Page
 * Displays account information from the API Root endpoint
 *
 * Issue #122: Account navigation and routing
 * Uses components from: @/components/mailchimp/account
 * Uses actions from: @/actions/mailchimp-root
 */

import { Suspense } from "react";
import { AccountOverview } from "@/components/mailchimp/account";
import { getApiRoot } from "@/actions/mailchimp-root";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function AccountData() {
  const accountData = await getApiRoot();

  if ("status" in accountData) {
    // Error response
    return (
      <AccountOverview
        account={null}
        loading={false}
        error={accountData.detail || "Failed to load account information"}
      />
    );
  }

  // Success response
  return <AccountOverview account={accountData} loading={false} />;
}

function AccountDataSkeleton() {
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

      {/* Additional skeletons for full-width cards */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-4 w-28" />
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
    </div>
  );
}

export default function AccountPage() {
  return (
    <DashboardShell>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Information
          </h1>
          <p className="text-muted-foreground">
            View your Mailchimp account details, contact information, and
            industry benchmarks
          </p>
        </div>
        <Suspense fallback={<AccountDataSkeleton />}>
          <AccountData />
        </Suspense>
      </div>
    </DashboardShell>
  );
}

export const metadata = {
  title: "Account | Mailchimp Dashboard",
  description: "View your Mailchimp account information and settings",
};
