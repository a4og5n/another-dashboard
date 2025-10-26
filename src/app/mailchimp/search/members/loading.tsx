/**
 * Loading State for Search Members Page
 * Displays skeleton UI while the search results are loading
 */

import { PageLayout } from "@/components/layout";
import { SearchMembersSkeleton } from "@/skeletons/mailchimp";
import { bc } from "@/utils";

export default function Loading() {
  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("Search Members")]}
      title="Search Members"
      description="Search for members across all lists by email, first name, or last name"
      skeleton={<SearchMembersSkeleton />}
    >
      <SearchMembersSkeleton />
    </PageLayout>
  );
}
