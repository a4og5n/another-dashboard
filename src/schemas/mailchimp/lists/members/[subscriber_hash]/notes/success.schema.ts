/**
 * List Member Notes - Success Response Schema
 *
 * Defines the structure for successful GET /lists/{list_id}/members/{subscriber_hash}/notes responses
 *
 * ⚠️ ASSUMED FIELDS - Based on Mailchimp API patterns
 * Pattern based on: Member Tags, Activity endpoints
 * Verification required: Test with real API response during implementation
 *
 * Expected structure:
 * - Array of notes with ID, text, author, timestamps
 * - Total count
 * - Links array for pagination
 *
 * @see https://mailchimp.com/developer/marketing/api/list-member-notes/list-recent-member-notes/
 */

import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Individual member note schema
 *
 * Represents a single note added to a list member
 */
export const memberNoteSchema = z.object({
  /**
   * Unique ID for the note
   */
  id: z.number().int().min(0),

  /**
   * Note text content
   */
  note: z.string(),

  /**
   * User who created the note
   */
  created_by: z.string(),

  /**
   * Timestamp when note was created
   */
  created_at: z.iso.datetime({ offset: true }),

  /**
   * Timestamp when note was last updated
   */
  updated_at: z.iso.datetime({ offset: true }),

  /**
   * ID of the list
   */
  list_id: z.string().min(1),

  /**
   * Email address of the member
   */
  email_id: z.string().min(1),

  /**
   * A unique identifier for the contact
   */
  contact_id: z.string().min(1).optional(),

  /**
   * Pagination and related resource links
   */
  _links: z.array(linkSchema).optional(),
});

/**
 * Success response schema for member notes list
 *
 * Contains array of notes with pagination metadata
 */
export const memberNotesSuccessSchema = z.object({
  /**
   * Email address of the member
   */
  email_id: z.string().min(1),

  /**
   * List ID
   */
  list_id: z.string().min(1),

  /**
   * Array of member notes
   */
  notes: z.array(memberNoteSchema),

  /**
   * Total number of notes for this member
   */
  total_items: z.number().int().min(0),

  /**
   * Pagination and related resource links
   */
  _links: z.array(linkSchema).optional(),
});
