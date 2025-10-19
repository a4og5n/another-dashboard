import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercent,
  formatPercentage,
  formatPercentageValue,
  formatValue,
} from "@/utils";

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

describe("formatPercent", () => {
  it("formats percentage values with one decimal place", () => {
    expect(formatPercent(23.456)).toBe("23.5%");
    expect(formatPercent(100)).toBe("100.0%");
    expect(formatPercent(50.5)).toBe("50.5%");
  });

  it("handles null and undefined values", () => {
    expect(formatPercent(null)).toBe("N/A");
    expect(formatPercent(undefined)).toBe("N/A");
  });

  it("handles zero correctly", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("handles negative percentages", () => {
    expect(formatPercent(-5.2)).toBe("-5.2%");
  });

  it("handles very large percentages", () => {
    expect(formatPercent(999.999)).toBe("1000.0%");
  });
});

describe("formatPercentage", () => {
  it("converts decimal to percentage with default decimals", () => {
    expect(formatPercentage(0.235)).toBe("23.5%");
    expect(formatPercentage(0.1)).toBe("10.0%");
    expect(formatPercentage(1)).toBe("100.0%");
  });

  it("respects custom decimal places", () => {
    expect(formatPercentage(0.23456, 2)).toBe("23.46%");
    expect(formatPercentage(0.23456, 0)).toBe("23%");
    expect(formatPercentage(0.23456, 3)).toBe("23.456%");
  });

  it("handles zero correctly", () => {
    expect(formatPercentage(0)).toBe("0.0%");
    expect(formatPercentage(0, 2)).toBe("0.00%");
  });

  it("handles very small decimals", () => {
    expect(formatPercentage(0.001)).toBe("0.1%");
    expect(formatPercentage(0.001, 2)).toBe("0.10%");
    expect(formatPercentage(0.0001, 2)).toBe("0.01%");
  });

  it("handles values greater than 1 (>100%)", () => {
    expect(formatPercentage(1.5)).toBe("150.0%");
    expect(formatPercentage(2.456, 2)).toBe("245.60%");
  });

  it("handles negative decimals", () => {
    expect(formatPercentage(-0.05)).toBe("-5.0%");
    expect(formatPercentage(-0.123, 2)).toBe("-12.30%");
  });
});

describe("formatPercentageValue", () => {
  it("formats already-converted percentage values", () => {
    expect(formatPercentageValue(23.456)).toBe("23.5");
    expect(formatPercentageValue(100)).toBe("100.0");
    expect(formatPercentageValue(50.5)).toBe("50.5");
  });

  it("respects custom decimal places", () => {
    expect(formatPercentageValue(23.456, 2)).toBe("23.46");
    expect(formatPercentageValue(23.456, 0)).toBe("23");
    expect(formatPercentageValue(23.456, 3)).toBe("23.456");
  });

  it("handles zero correctly", () => {
    expect(formatPercentageValue(0)).toBe("0.0");
    expect(formatPercentageValue(0, 2)).toBe("0.00");
  });

  it("handles negative percentages", () => {
    expect(formatPercentageValue(-5.2)).toBe("-5.2");
    expect(formatPercentageValue(-10.456, 2)).toBe("-10.46");
  });

  it("handles very large percentages", () => {
    expect(formatPercentageValue(999.999)).toBe("1000.0");
    expect(formatPercentageValue(1234.5678, 2)).toBe("1234.57");
  });
});

describe("formatValue", () => {
  it("formats numbers with thousands separators", () => {
    expect(formatValue(12500)).toBe("12,500");
    expect(formatValue(1234567)).toBe("1,234,567");
    expect(formatValue(1000)).toBe("1,000");
  });

  it("passes through strings unchanged", () => {
    expect(formatValue("Custom")).toBe("Custom");
    expect(formatValue("N/A")).toBe("N/A");
    expect(formatValue("23.5%")).toBe("23.5%");
  });

  it("handles zero correctly", () => {
    expect(formatValue(0)).toBe("0");
  });

  it("handles empty string", () => {
    expect(formatValue("")).toBe("");
  });

  it("handles negative numbers", () => {
    expect(formatValue(-1234)).toBe("-1,234");
  });

  it("handles small numbers", () => {
    expect(formatValue(42)).toBe("42");
    expect(formatValue(999)).toBe("999");
  });
});
