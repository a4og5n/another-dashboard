/**
 * TypeScript types for Member Info endpoint
 * Generated from Zod schemas in src/schemas/mailchimp/lists/member-info/
 *
 * @see src/schemas/mailchimp/lists/member-info/params.schema.ts
 * @see src/schemas/mailchimp/lists/member-info/success.schema.ts
 * @see src/schemas/mailchimp/lists/member-info/error.schema.ts
 * @see src/schemas/mailchimp/common/list-member.schema.ts
 */

import type { z } from "zod";
import type {
  memberInfoPathParamsSchema,
  memberInfoQueryParamsSchema,
} from "@/schemas/mailchimp/lists/member-info/params.schema";
import type { memberInfoSuccessSchema } from "@/schemas/mailchimp/lists/member-info/success.schema";
import type {
  listMemberSchema,
  memberStatsSchema,
  memberLocationSchema,
  marketingPermissionSchema,
  memberTagSchema,
  memberNoteSchema,
  lastNoteSchema,
} from "@/schemas/mailchimp/common/list-member.schema";
import type { memberInfoErrorSchema } from "@/schemas/mailchimp/lists/member-info/error.schema";

/**
 * Path parameters for member info endpoint
 */
export type MemberInfoPathParams = z.infer<typeof memberInfoPathParamsSchema>;

/**
 * Query parameters for member info endpoint
 */
export type MemberInfoQueryParams = z.infer<typeof memberInfoQueryParamsSchema>;

/**
 * Combined params (path + query)
 */
export type MemberInfoParams = MemberInfoPathParams & MemberInfoQueryParams;

/**
 * Success response from member info endpoint
 * Returns complete member profile
 */
export type MemberInfoResponse = z.infer<typeof memberInfoSuccessSchema>;

/**
 * Individual list member data (alias for consistency)
 */
export type MemberProfile = z.infer<typeof listMemberSchema>;

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
 * Error response from member info endpoint
 */
export type MemberInfoError = z.infer<typeof memberInfoErrorSchema>;
