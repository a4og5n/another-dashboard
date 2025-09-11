/**
 * Mailchimp Report Utilities
 * Helper functions for report components
 */

/**
 * Formats date for display in report header
 */
export function formatHeaderDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long", 
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Gets campaign type badge variant
 */
export function getTypeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type.toLowerCase()) {
    case "regular":
      return "default";
    case "ab_split":
      return "secondary";
    default:
      return "outline";
  }
}
