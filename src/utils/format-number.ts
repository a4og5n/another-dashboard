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

/**
 * Format a decimal value as a percentage with specified decimal places
 * Converts decimal to percentage (e.g., 0.235 → "23.5%")
 *
 * @param value The decimal value to format (e.g., 0.235 for 23.5%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "23.5%")
 *
 * @example
 * formatPercentage(0.235) // "23.5%"
 * formatPercentage(0.235, 2) // "23.50%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format an already-converted percentage value for display
 * Use this when you already have a percentage value (e.g., 23.5 for 23.5%)
 *
 * @param value The percentage value (e.g., 23.5 for 23.5%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "23.5")
 *
 * @example
 * formatPercentageValue(23.456) // "23.5"
 * formatPercentageValue(23.456, 2) // "23.46"
 */
export function formatPercentageValue(
  value: number,
  decimals: number = 1,
): string {
  return value.toFixed(decimals);
}

/**
 * Format a value for display (adds thousand separators for numbers, passes through strings)
 *
 * @param val The value to format (string or number)
 * @returns Formatted string value
 *
 * @example
 * formatValue(12500) // "12,500"
 * formatValue("Custom") // "Custom"
 */
export function formatValue(val: string | number): string {
  return typeof val === "number" ? val.toLocaleString() : val;
}
