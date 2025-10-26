/**
 * Fichaz Page
 * Main Mailchimp section with navigation to reports, lists, and settings
 *
 * @route /mailchimp
 * @requires Mailchimp connection
 * @features Navigation cards, Connection status, Quick links
 */

import Link from "next/link";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { validateMailchimpConnectionParams } from "@/utils/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";

async function MailchimpDashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Parse OAuth callback parameters for success/error banners
  const params = await searchParams;
  const { connected, error } = validateMailchimpConnectionParams(params);

  // Validate connection via health check (validation happens at DAL layer)
  const healthCheckResult = await mailchimpDAL.healthCheck();
  const errorCode = healthCheckResult.errorCode;

  // Guard component handles UI based on errorCode
  return (
    <MailchimpConnectionGuard
      errorCode={errorCode}
      connected={connected}
      oauthError={error}
    >
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Fichaz</h1>
            <p className="text-muted-foreground text-lg">
              Choose a section to manage your Mailchimp data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
            <Link
              href="/mailchimp/general-info"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">ℹ️</div>
              <h2 className="text-xl font-semibold mb-2">General Info</h2>
              <p className="text-sm text-muted-foreground">
                View your Mailchimp account information
              </p>
            </Link>

            <Link
              href="/mailchimp/lists"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">📋</div>
              <h2 className="text-xl font-semibold mb-2">Lists</h2>
              <p className="text-sm text-muted-foreground">
                View and manage your subscriber lists
              </p>
            </Link>

            <Link
              href="/mailchimp/reports"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">📊</div>
              <h2 className="text-xl font-semibold mb-2">Reports</h2>
              <p className="text-sm text-muted-foreground">
                View campaign performance and analytics
              </p>
            </Link>

            <Link
              href="/mailchimp/search/members"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold mb-2">Search Members</h2>
              <p className="text-sm text-muted-foreground">
                Find members across all lists
              </p>
            </Link>
          </div>
        </div>
      </div>
    </MailchimpConnectionGuard>
  );
}

export default function MailchimpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <MailchimpDashboardContent searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  );
}

export const metadata = {
  title: "Fichaz",
  description:
    "Choose a section to manage your Mailchimp data - account settings, audiences, and campaigns",
};
