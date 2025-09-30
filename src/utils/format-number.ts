/**
 * Format a number with proper thousands separators
 * @param num The number to format
 * @returns Formatted number string with locale-specific thousands separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
