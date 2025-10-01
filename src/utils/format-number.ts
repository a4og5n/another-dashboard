/**
 * Format a number with proper thousands separators
 * @param num The number to format
 * @returns Formatted number string with locale-specific thousands separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a number as a percentage with one decimal place
 * @param value The number to format (can be null or undefined)
 * @returns Formatted percentage string (e.g., "45.3%") or "N/A" if value is null/undefined
 */
export function formatPercent(value: number | null | undefined): string {
  return value != null ? `${value.toFixed(1)}%` : "N/A";
}
