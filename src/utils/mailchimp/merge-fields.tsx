/**
 * Mailchimp Merge Fields Utility
 * Utilities for formatting and displaying Mailchimp merge fields (custom subscriber data)
 */

/**
 * Formats merge fields for display in table cells
 * Handles both simple values (strings/numbers) and complex objects (addresses)
 *
 * @param mergeFields - Record of merge field key-value pairs from Mailchimp API
 * @returns JSX element displaying formatted merge fields, or em dash if empty
 *
 * @example
 * ```tsx
 * // Simple fields
 * <TableCell>{formatMergeFields({ FNAME: "John", LNAME: "Doe" })}</TableCell>
 *
 * // With address object
 * <TableCell>{formatMergeFields({
 *   ADDRESS: { addr1: "123 Main St", city: "Boston", state: "MA", zip: "02101" }
 * })}</TableCell>
 * ```
 */
export function formatMergeFields(
  mergeFields?: Record<string, string | number | unknown>,
) {
  if (!mergeFields || Object.keys(mergeFields).length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <div className="space-y-1 max-w-xs">
      {Object.entries(mergeFields).map(([key, value]) => {
        // Handle address objects
        if (typeof value === "object" && value !== null) {
          const addr = value as Record<string, string>;
          const addressStr = [addr.addr1, addr.city, addr.state, addr.zip]
            .filter(Boolean)
            .join(", ");
          return (
            <div key={key} className="text-xs">
              <span className="font-medium">{key}:</span>{" "}
              <span className="text-muted-foreground">{addressStr}</span>
            </div>
          );
        }

        // Handle string/number values
        return (
          <div key={key} className="text-xs">
            <span className="font-medium">{key}:</span>{" "}
            <span className="text-muted-foreground">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
