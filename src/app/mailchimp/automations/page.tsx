/**
 * Mailchimp Automations Page
 * Displays paginated list of automation workflows with filtering
 *
 * @route /mailchimp/automations
 * @requires Mailchimp connection
 * @features Pagination, Status filtering, Workflow metrics
 */

import { Suspense } from "react";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { AutomationsContent } from "@/components/mailchimp/automations/automations-content";
import { automationsQueryParamsSchema } from "@/schemas/mailchimp/automations-params.schema";
import { automationsPageSearchParamsSchema } from "@/schemas/components/mailchimp/automations-page-params.schema";
import { transformAutomationsParams } from "@/utils/mailchimp/query-params";
import { AutomationsSkeleton } from "@/skeletons/mailchimp";
import { validatePageParams } from "@/utils/mailchimp/page-params";
import { bc } from "@/utils";
import { PageLayout } from "@/components/layout";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { generateAutomationsMetadata } from "@/utils/mailchimp/metadata";

interface AutomationsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function AutomationsPageContent({ searchParams }: AutomationsPageProps) {
  // Validate page parameters: validate, redirect if needed, convert to API format
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: automationsPageSearchParamsSchema,
    apiSchema: automationsQueryParamsSchema,
    basePath: "/mailchimp/automations",
    transformer: transformAutomationsParams,
  });

  // Fetch automations (validation happens at DAL layer)
  const response = await mailchimpDAL.fetchAutomations(apiParams);

  // Guard component handles UI based on errorCode from DAL
  return (
    <MailchimpConnectionGuard errorCode={response.errorCode}>
      {response.success && response.data ? (
        <AutomationsContent
          automationsData={response.data}
          currentPage={currentPage}
          pageSize={pageSize}
          perPageOptions={[10, 25, 50, 100]}
          baseUrl="/mailchimp/automations"
        />
      ) : (
        <DashboardInlineError
          error={response.error || "Failed to load automations"}
        />
      )}
    </MailchimpConnectionGuard>
  );
}

export default function AutomationsPage({
  searchParams,
}: AutomationsPageProps) {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.automations]}
      title="Automations"
      description="View and manage your automation workflows"
      skeleton={<AutomationsSkeleton />}
    >
      <Suspense fallback={<AutomationsSkeleton />}>
        <AutomationsPageContent searchParams={searchParams} />
      </Suspense>
    </PageLayout>
  );
}

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

export const metadata = generateAutomationsMetadata();
