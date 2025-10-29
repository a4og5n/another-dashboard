/**
 * API Root
 * View Mailchimp API metadata and account information
 *
 * @route /mailchimp/api-root
 * @requires Mailchimp connection
 * @features API version and health status, Account information, Total subscribers count, Industry benchmark statistics
 */

import { PageLayout } from "@/components/layout";
import { APIRootContent } from "@/components/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { handleApiError, bc } from "@/utils";

export default async function Page() {
  // Fetch API Root data
  const response = await mailchimpDAL.fetchApiRoot();

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("API Info")]}
      title="API Root"
      description="View Mailchimp API metadata and account information"
      skeleton={<div>Loading...</div>}
    >
      {data && <APIRootContent data={data} errorCode={response.errorCode} />}
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

export { generateApiRootMetadata as generateMetadata } from "@/utils/metadata";
