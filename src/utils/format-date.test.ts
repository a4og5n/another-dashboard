import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatDateTimeSafe,
  formatDateLongSafe,
  formatTimezone,
} from "./format-date";

describe("formatDate", () => {
  it("formats a date correctly", () => {
    const date = new Date(2024, 0, 1); // January 1, 2024
    expect(formatDate(date)).toBe("January 1, 2024");
  });

  it("handles different months", () => {
    const date = new Date(2024, 5, 15); // June 15, 2024
    expect(formatDate(date)).toBe("June 15, 2024");
  });
});

describe("formatDateShort", () => {
  it("formats a date string correctly in short format", () => {
    const dateString = "2024-01-01T12:00:00Z";
    expect(formatDateShort(dateString)).toBe("Jan 1, 2024");
  });

  it("handles different months in short format", () => {
    const dateString = "2024-06-15T12:00:00Z";
    expect(formatDateShort(dateString)).toBe("Jun 15, 2024");
  });

  it("handles ISO date strings", () => {
    // Use a date that works consistently across timezones
    const dateString = "2024-12-25T12:00:00Z";
    expect(formatDateShort(dateString)).toBe("Dec 25, 2024");
  });
});

describe("formatDateTime", () => {
  it("formats a date string with time correctly", () => {
    const dateString = "2024-01-01T14:30:00Z";
    // Note: The exact format may vary based on timezone, so we'll test the structure
    const result = formatDateTime(dateString);
    expect(result).toMatch(/Jan 1, 2024/);
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it("handles different times", () => {
    const dateString = "2024-06-15T09:15:00Z";
    const result = formatDateTime(dateString);
    expect(result).toMatch(/Jun 15, 2024/);
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });
});

describe("formatDateTimeSafe", () => {
  it("formats a valid date string correctly", () => {
    const dateString = "2024-01-01T14:30:00Z";
    const result = formatDateTimeSafe(dateString);
    expect(result).toMatch(/Jan 1, 2024/);
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it("handles empty string", () => {
    expect(formatDateTimeSafe("")).toBe("N/A");
  });

  it("handles invalid date string", () => {
    expect(formatDateTimeSafe("invalid-date")).toBe("Invalid Date");
  });
});

describe("formatDateLongSafe", () => {
  it("formats a valid date string correctly", () => {
    const dateString = "2024-01-01T12:00:00Z";
    const result = formatDateLongSafe(dateString);
    expect(result).toMatch(/January 1, 2024/);
  });

  it("handles invalid date string by returning original", () => {
    const invalidDate = "invalid-date";
    expect(formatDateLongSafe(invalidDate)).toBe(invalidDate);
  });
});

describe("formatTimezone", () => {
  it("formats positive GMT offset correctly", () => {
    expect(formatTimezone(0)).toBe("GMT+00:00");
    expect(formatTimezone(2)).toBe("GMT+02:00");
    expect(formatTimezone(5)).toBe("GMT+05:00");
    expect(formatTimezone(12)).toBe("GMT+12:00");
  });

  it("formats negative GMT offset correctly", () => {
    expect(formatTimezone(-5)).toBe("GMT-05:00");
    expect(formatTimezone(-8)).toBe("GMT-08:00");
    expect(formatTimezone(-12)).toBe("GMT-12:00");
  });

  it("formats fractional GMT offset correctly", () => {
    expect(formatTimezone(5.5)).toBe("GMT+05:30");
    expect(formatTimezone(-5.5)).toBe("GMT-05:30");
    expect(formatTimezone(9.5)).toBe("GMT+09:30");
    expect(formatTimezone(-3.5)).toBe("GMT-03:30");
  });

  it("formats quarter-hour offsets correctly", () => {
    expect(formatTimezone(5.25)).toBe("GMT+05:15");
    expect(formatTimezone(-5.25)).toBe("GMT-05:15");
    expect(formatTimezone(5.75)).toBe("GMT+05:45");
    expect(formatTimezone(-5.75)).toBe("GMT-05:45");
  });

  it("handles edge cases correctly", () => {
    expect(formatTimezone(0.5)).toBe("GMT+00:30");
    expect(formatTimezone(-0.5)).toBe("GMT-00:30");
    expect(formatTimezone(14)).toBe("GMT+14:00");
    expect(formatTimezone(-11)).toBe("GMT-11:00");
  });

  it("pads single digit hours and minutes with zeros", () => {
    expect(formatTimezone(1)).toBe("GMT+01:00");
    expect(formatTimezone(-1)).toBe("GMT-01:00");
    expect(formatTimezone(0.1)).toBe("GMT+00:06"); // 0.1 * 60 = 6 minutes
    expect(formatTimezone(-0.1)).toBe("GMT-00:06");
  });
});
