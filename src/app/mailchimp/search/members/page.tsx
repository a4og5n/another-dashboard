/**
 * Search Members
 * Search for members across all lists by email, first name, or last name
 *
 * @route /mailchimp/search/members
 * @requires Mailchimp connection
 * @features Global search, Exact matches, Full-text search, Member details
 */

import { PageLayout } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { SearchMembersSkeleton } from "@/skeletons/mailchimp";
import { mailchimpDAL } from "@/dal/mailchimp.dal";
import { SearchMembersContent } from "@/components/mailchimp/search/search-members-content";
import { handleApiError, bc } from "@/utils";
import { searchMembersQueryParamsSchema } from "@/schemas/mailchimp/search-members-params.schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Members | Fichaz",
  description:
    "Search for members across all Mailchimp lists by email, first name, or last name",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get search params
  const rawSearchParams = await searchParams;
  const query =
    typeof rawSearchParams.query === "string" ? rawSearchParams.query : "";
  const listId =
    typeof rawSearchParams.list_id === "string"
      ? rawSearchParams.list_id
      : undefined;

  // Initialize response variable
  let response = null;
  let hasSearched = false;

  // Only fetch if query is provided
  if (query) {
    hasSearched = true;
    const apiParams = searchMembersQueryParamsSchema.parse({
      query,
      list_id: listId,
    });

    // Fetch data
    response = await mailchimpDAL.searchMembers(apiParams);

    // Handle API errors (auto-triggers notFound() for 404s)
    handleApiError(response);
  }

  // Extract data safely
  const data = response?.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("Search Members")]}
      title="Search Members"
      description="Search for members across all lists by email, first name, or last name"
      skeleton={<SearchMembersSkeleton />}
    >
      <MailchimpConnectionGuard errorCode={response?.errorCode}>
        <SearchMembersContent
          data={data ?? null}
          query={query}
          listId={listId}
          hasSearched={hasSearched}
        />
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
