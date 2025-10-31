/**
 * Get Campaign Send Checklist Success Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}/send-checklist
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-checklist/get-campaign-send-checklist/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Checklist item types
 * - "success": Item passed validation
 * - "error": Item failed validation (must be fixed before sending)
 * - "warning": Item has a warning (can be sent but should be reviewed)
 */
export const CHECKLIST_ITEM_TYPES = ["success", "error", "warning"] as const;

/**
 * Individual checklist item schema
 * Represents a single pre-send validation check
 */
export const checklistItemSchema = z.object({
  /**
   * The type of checklist item
   */
  type: z.enum(CHECKLIST_ITEM_TYPES),

  /**
   * The ID for the specific item
   * Used to identify which validation check this represents
   */
  id: z.number(),

  /**
   * The heading for the specific item
   * Category or section of the checklist (e.g., "List", "Subject", "Content")
   */
  heading: z.string(),

  /**
   * Details about the specific feedback item
   * Describes what needs to be addressed or what passed
   */
  details: z.string(),
});

/**
 * Success response schema for Get Campaign Send Checklist endpoint
 *
 * Returns a checklist of items to review before sending a campaign, including:
 * - Overall readiness status
 * - Individual checklist items (subject, content, recipients, etc.)
 * - Validation errors that must be resolved
 * - HATEOAS navigation links
 */
export const campaignSendChecklistSuccessSchema = z
  .object({
    /**
     * Whether the campaign is ready to send
     * True if all checklist items have type "success"
     */
    is_ready: z.boolean(),

    /**
     * The checklist items for this campaign
     * Array of validation checks that must pass before sending
     */
    items: z.array(checklistItemSchema),

    /**
     * A list of link types and descriptions for the API schema documents
     */
    _links: z.array(linkSchema).optional(),
  })
  .strict(); // Ensures no additional properties are allowed
