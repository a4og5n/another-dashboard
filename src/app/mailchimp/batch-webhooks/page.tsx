/**
 * Batch Webhooks Page
 * Manage batch webhooks for batch operations API responses (max 20 webhooks)
 *
 * @route /mailchimp/batch-webhooks
 * @requires Mailchimp connection
 * @features Webhook URL configuration, Enable/disable webhooks, HATEOAS navigation
 */

import { PageLayout } from "@/components/layout";
import { BatchWebhooksSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { BatchWebhooksContent } from "@/components/mailchimp/batch-webhooks/batch-webhooks-content";
import { handleApiError, bc } from "@/utils";
import { batchWebhooksQueryParamsSchema } from "@/schemas/mailchimp/batch-webhooks/batch-webhooks-params.schema";
import { generateBatchWebhooksMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generateBatchWebhooksMetadata();
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse and validate query parameters
  const validatedParams = batchWebhooksQueryParamsSchema.safeParse(params);
  const apiParams = validatedParams.success ? validatedParams.data : undefined;

  // Fetch batch webhooks
  const response = await mailchimpDAL.fetchBatchWebhooks(apiParams);

  // Handle API errors (throws and redirects on fatal errors)
  handleApiError(response);

  const data = response.success ? response.data : null;

  if (!data) {
    throw new Error("Failed to fetch batch webhooks data");
  }

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.batchWebhooks]}
      title="Batch Webhooks"
      description="Manage batch webhooks for batch operations API responses (max 20 webhooks)"
      skeleton={<BatchWebhooksSkeleton />}
    >
      <BatchWebhooksContent data={data} errorCode={response.errorCode} />
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
