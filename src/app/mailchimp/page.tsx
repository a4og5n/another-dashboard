import Link from "next/link";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MailchimpConnectionBanner } from "@/components/mailchimp/mailchimp-connection-banner";
import { validateMailchimpConnection } from "@/lib/validate-mailchimp-connection";
import { validateMailchimpConnectionParams } from "@/utils/mailchimp";

async function MailchimpDashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Validate and parse Mailchimp connection status parameters
  const params = await searchParams;
  const { connected, error } = validateMailchimpConnectionParams(params);

  // Validate Mailchimp connection
  const validation = await validateMailchimpConnection();

  // Connection guard handles all states: empty state, banner, and children
  return (
    <MailchimpConnectionBanner
      connected={connected}
      error={validation.error || error}
      isValid={validation.isValid}
    >
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Mailchimp Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Choose a section to manage your Mailchimp data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
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
          </div>
        </div>
      </div>
    </MailchimpConnectionBanner>
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
  title: "Mailchimp Dashboard",
  description:
    "Choose a section to manage your Mailchimp data - account settings, audiences, and campaigns",
};
