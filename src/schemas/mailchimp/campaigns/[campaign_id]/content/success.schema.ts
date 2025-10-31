/**
 * Get Campaign Content Success Response Schema
 *
 * Mailchimp API: GET /campaigns/{campaign_id}/content
 * Documentation: https://mailchimp.com/developer/marketing/api/campaign-content/get-campaign-content/
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
import { z } from "zod";
import { linkSchema } from "@/schemas/mailchimp/common/link.schema";

/**
 * Variate content schema for multivariate campaigns
 * Describes different content variations used in the campaign
 */
export const variateContentSchema = z.object({
  /**
   * Label identifying the content variation
   */
  content_label: z.string().optional(),

  /**
   * The HTML content for this variation
   */
  html: z.string().optional(),

  /**
   * The plain-text content for this variation
   */
  plain_text: z.string().optional(),
});

/**
 * Success response schema for Get Campaign Content endpoint
 *
 * Returns the HTML and plain-text content for a campaign, including:
 * - Campaign HTML content
 * - Plain-text version
 * - Archive HTML (if available)
 * - Variate content (for multivariate campaigns)
 * - HATEOAS navigation links
 */
export const campaignContentSuccessSchema = z
  .object({
    /**
     * Content for multivariate campaigns
     * Contains different content variations
     */
    variate_contents: z.array(variateContentSchema).optional(),

    /**
     * The HTML content of the campaign
     * May contain merge tags and template variables
     */
    html: z.string().optional(),

    /**
     * The plain-text portion of the campaign
     * Automatically generated from HTML if not explicitly set
     */
    plain_text: z.string().optional(),

    /**
     * The Archive HTML for the campaign
     * This is the rendered HTML that will be archived
     */
    archive_html: z.string().optional(),

    /**
     * A list of link types and descriptions for the API schema documents
     */
    _links: z.array(linkSchema).optional(),
  })
  .strict(); // Ensures no additional properties are allowed
