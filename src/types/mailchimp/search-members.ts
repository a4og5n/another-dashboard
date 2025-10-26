/**
 * Search Members Types
 * Type definitions for the Mailchimp Search Members endpoint
 *
 * Endpoint: GET /search-members
 * Source: https://mailchimp.com/developer/marketing/api/search-members/
 */

import { z } from "zod";
import { searchMembersQueryParamsSchema } from "@/schemas/mailchimp/search-members-params.schema";
import { searchMembersSuccessSchema } from "@/schemas/mailchimp/search-members-success.schema";
import { searchMembersErrorSchema } from "@/schemas/mailchimp/search-members-error.schema";

/**
 * Search Members query parameters
 */
export type SearchMembersQueryParams = z.infer<
  typeof searchMembersQueryParamsSchema
>;

/**
 * Search Members success response
 */
export type SearchMembersSuccess = z.infer<typeof searchMembersSuccessSchema>;

/**
 * Individual member result in search response
 */
export type SearchMemberResult = NonNullable<
  SearchMembersSuccess["exact_matches"]
>["members"][number];

/**
 * Search Members error response
 */
export type SearchMembersError = z.infer<typeof searchMembersErrorSchema>;
