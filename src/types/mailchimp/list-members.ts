/**
 * TypeScript types for List Members endpoint
 * Generated from Zod schemas in src/schemas/mailchimp/lists/members/
 *
 * @see src/schemas/mailchimp/lists/members/params.schema.ts
 * @see src/schemas/mailchimp/lists/members/success.schema.ts
 * @see src/schemas/mailchimp/lists/members/error.schema.ts
 * @see src/schemas/mailchimp/common/list-member.schema.ts
 */

import type { z } from "zod";
import type {
  listMembersPathParamsSchema,
  listMembersQueryParamsSchema,
} from "@/schemas/mailchimp/lists/members/params.schema";
import type { listMembersSuccessSchema } from "@/schemas/mailchimp/lists/members/success.schema";
import type {
  listMemberSchema,
  memberStatsSchema,
  memberLocationSchema,
  marketingPermissionSchema,
  memberTagSchema,
  memberNoteSchema,
  lastNoteSchema,
} from "@/schemas/mailchimp/common/list-member.schema";
import type { listMembersErrorSchema } from "@/schemas/mailchimp/lists/members/error.schema";

/**
 * Path parameters for list members endpoint
 */
export type ListMembersPathParams = z.infer<typeof listMembersPathParamsSchema>;

/**
 * Query parameters for list members endpoint
 */
export type ListMembersQueryParams = z.infer<
  typeof listMembersQueryParamsSchema
>;

/**
 * Combined params (path + query)
 */
export type ListMembersParams = ListMembersPathParams & ListMembersQueryParams;

/**
 * Success response from list members endpoint
 */
export type ListMembersResponse = z.infer<typeof listMembersSuccessSchema>;

/**
 * Individual list member data
 */
export type ListMember = z.infer<typeof listMemberSchema>;

/**
 * Member engagement statistics
 */
export type MemberStats = z.infer<typeof memberStatsSchema>;

/**
 * Member location data
 */
export type MemberLocation = z.infer<typeof memberLocationSchema>;

/**
 * Marketing permission for a member
 */
export type MarketingPermission = z.infer<typeof marketingPermissionSchema>;

/**
 * Tag applied to a member
 */
export type MemberTag = z.infer<typeof memberTagSchema>;

/**
 * Note attached to a member
 */
export type MemberNote = z.infer<typeof memberNoteSchema>;

/**
 * Most recent note for a member
 */
export type LastNote = z.infer<typeof lastNoteSchema>;

/**
 * Error response from list members endpoint
 */
export type ListMembersError = z.infer<typeof listMembersErrorSchema>;
