/**
 * Text Utility Functions
 * Common text manipulation functions for use across the application
 */

/**
 * Capitalizes the first letter of a string
 *
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
