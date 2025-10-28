/**
 * Mailchimp API List Interests in Category Error Response Schema
 * Validates error responses from the list interests in category endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}/interests
 * Documentation: https://mailchimp.com/developer/marketing/api/interests/list-interests-in-category/
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const listInterestsErrorSchema = errorSchema;
