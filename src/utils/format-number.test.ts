import { describe, it, expect } from "vitest";
import { formatNumber } from "./format-number";

describe("formatNumber", () => {
  it("formats numbers less than 1000 with locale string", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(123)).toBe("123");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with K suffix", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(1234)).toBe("1.2K");
    expect(formatNumber(12345)).toBe("12.3K");
    expect(formatNumber(999999)).toBe("1000.0K");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(1_000_000)).toBe("1.0M");
    expect(formatNumber(1_234_567)).toBe("1.2M");
    expect(formatNumber(12_345_678)).toBe("12.3M");
    expect(formatNumber(999_999_999)).toBe("1000.0M");
  });

  it("formats billions with B suffix", () => {
    expect(formatNumber(1_000_000_000)).toBe("1.0B");
    expect(formatNumber(1_234_567_890)).toBe("1.2B");
    expect(formatNumber(12_345_678_900)).toBe("12.3B");
  });

  it("handles edge cases", () => {
    expect(formatNumber(-1000)).toBe("-1.0K");
    expect(formatNumber(-1_000_000)).toBe("-1.0M");
    expect(formatNumber(0.5)).toBe("1"); // toLocaleString rounds
  });
});
