/**
 * Formats a date as a string in the format: Month Day, Year
 * Example: January 1, 2024
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
