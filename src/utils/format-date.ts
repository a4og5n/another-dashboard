import { format, parseISO } from "date-fns";

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

/**
 * Formats a date string in short format: Mon Day, Year
 * Example: Jan 1, 2024
 * @param dateString - ISO date string or date string
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date string with time in short format: Mon Day, Year at HH:MM AM/PM
 * Example: Jan 1, 2024 at 2:30 PM
 * @param dateString - ISO date string or date string
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a date string with error handling using date-fns format
 * Returns "Invalid Date" if parsing fails
 * Uses format: "MMM d, yyyy h:mm a" (e.g., "Jan 1, 2024 2:30 PM")
 * @param dateString - ISO date string or date string
 */
export function formatDateTimeSafe(dateString: string): string {
  if (!dateString) return "N/A";

  try {
    return format(parseISO(dateString), "MMM d, yyyy h:mm a");
  } catch {
    return "Invalid Date";
  }
}

/**
 * Formats a GMT offset number to display as a timezone string
 * Examples: 0 -> "GMT+00:00", -5.5 -> "GMT-05:30", 2 -> "GMT+02:00"
 * @param offset - GMT offset as a number (e.g., -5, 0, 2.5)
 * @returns Formatted timezone string (e.g., "GMT-05:00")
 */
export function formatTimezone(offset: number): string {
  const sign = offset >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset));
  const minutes = Math.round((Math.abs(offset) - hours) * 60);

  return `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Formats a date string in long format with error handling
 * Returns the original string if parsing fails
 * Uses format: "Month Day, Year" (e.g., "January 1, 2024")
 * @param dateString - ISO date string or date string
 */
export function formatDateLongSafe(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
