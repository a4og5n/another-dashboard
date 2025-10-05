import { describe, it, expect } from "vitest";
import { formatNumber } from "@/utils";

describe("formatNumber", () => {
  it("formats numbers less than 1000 with locale string", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(123)).toBe("123");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with locale string", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234)).toBe("1,234");
    expect(formatNumber(12345)).toBe("12,345");
    expect(formatNumber(999999)).toBe("999,999");
  });

  it("formats millions with locale string", () => {
    expect(formatNumber(1_000_000)).toBe("1,000,000");
    expect(formatNumber(1_234_567)).toBe("1,234,567");
    expect(formatNumber(12_345_678)).toBe("12,345,678");
    expect(formatNumber(999_999_999)).toBe("999,999,999");
  });

  it("formats billions with locale string", () => {
    expect(formatNumber(1_000_000_000)).toBe("1,000,000,000");
    expect(formatNumber(1_234_567_890)).toBe("1,234,567,890");
    expect(formatNumber(12_345_678_900)).toBe("12,345,678,900");
  });

  it("handles edge cases", () => {
    expect(formatNumber(-1000)).toBe("-1,000");
    expect(formatNumber(-1_000_000)).toBe("-1,000,000");
    expect(formatNumber(0.5)).toBe("0.5"); // toLocaleString preserves decimal
  });
});
