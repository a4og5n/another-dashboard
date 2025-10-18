/**
 * Mailchimp General Info Page
 * Displays general account information and API statistics from Mailchimp
 *
 * @route /mailchimp/general-info
 * @requires Mailchimp connection
 * @features Account info, API stats, Connection status, Real-time data
 */

import { GeneralInfoOverview } from "@/components/mailchimp/general-info";
import { GeneralInfoOverviewSkeleton } from "@/skeletons/mailchimp";
import { PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { bc } from "@/utils";

async function GeneralInfoPageContent() {
  // Fetch data (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchApiRoot();

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success ? (
        <GeneralInfoOverview data={response.data!} />
      ) : (
        <GeneralInfoOverview
          error={response.error || "Failed to load general info data"}
          data={null}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default function GeneralInfoPage() {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("General Info")]}
      title="General Information"
      description="View your Mailchimp general information, contact details, and industry benchmarks"
      skeleton={<GeneralInfoOverviewSkeleton />}
    >
      <GeneralInfoPageContent />
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "General Info | Mailchimp Dashboard",
  description: "View your Mailchimp general information and settings",
};
