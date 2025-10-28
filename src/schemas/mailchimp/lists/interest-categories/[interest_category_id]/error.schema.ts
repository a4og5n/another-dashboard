/**
 * Get Interest Category Info Error Response Schema
 * Validates error responses from the get interest category info endpoint
 *
 * Endpoint: GET /lists/{list_id}/interest-categories/{interest_category_id}
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const interestCategoryInfoErrorSchema = errorSchema;
