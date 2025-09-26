import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Page() {
  return (
    <DashboardLayout>
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
              href="/mailchimp/account"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">👤</div>
              <h2 className="text-xl font-semibold mb-2">Account</h2>
              <p className="text-sm text-muted-foreground">
                Manage your Mailchimp account settings
              </p>
            </Link>

            <Link
              href="/mailchimp/audiences"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">👥</div>
              <h2 className="text-xl font-semibold mb-2">Audiences</h2>
              <p className="text-sm text-muted-foreground">
                View and manage your subscriber lists
              </p>
            </Link>

            <Link
              href="/mailchimp/campaigns"
              className="flex flex-col items-center p-8 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-3xl mb-4">📧</div>
              <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage email campaigns
              </p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: "Mailchimp Dashboard",
  description:
    "Choose a section to manage your Mailchimp data - account settings, audiences, and campaigns",
};
