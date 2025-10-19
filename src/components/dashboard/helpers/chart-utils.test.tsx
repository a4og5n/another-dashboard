import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CustomChartTooltip,
  defaultChartColors,
  formatChartNumber,
  formatChartPercentage,
  formatChartDate,
} from "./chart-utils";

describe("CustomChartTooltip", () => {
  it("renders nothing when not active", () => {
    const { container } = render(
      <CustomChartTooltip active={false} payload={[]} label="Test" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when payload is empty", () => {
    const { container } = render(
      <CustomChartTooltip active={true} payload={[]} label="Test" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders tooltip with label and single data point", () => {
    const payload = [
      {
        value: 100,
        name: "Sales",
        color: "#8884d8",
      },
    ];

    render(<CustomChartTooltip active={true} payload={payload} label="Jan 1" />);

    expect(screen.getByText("Jan 1")).toBeInTheDocument();
    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders tooltip with multiple data points", () => {
    const payload = [
      { value: 100, name: "Sales", color: "#8884d8" },
      { value: 200, name: "Revenue", color: "#82ca9d" },
    ];

    render(<CustomChartTooltip active={true} payload={payload} label="Jan 1" />);

    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Revenue:")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("applies custom value formatter", () => {
    const payload = [{ value: 1234, name: "Sales", color: "#8884d8" }];
    const valueFormatter = (value: number | string) =>
      `$${Number(value).toLocaleString()}`;

    render(
      <CustomChartTooltip
        active={true}
        payload={payload}
        label="Jan 1"
        valueFormatter={valueFormatter}
      />,
    );

    expect(screen.getByText("$1,234")).toBeInTheDocument();
  });

  it("applies custom label formatter", () => {
    const payload = [{ value: 100, name: "Sales", color: "#8884d8" }];
    const labelFormatter = (label: string) => `Date: ${label}`;

    render(
      <CustomChartTooltip
        active={true}
        payload={payload}
        label="Jan 1"
        labelFormatter={labelFormatter}
      />,
    );

    expect(screen.getByText("Date: Jan 1")).toBeInTheDocument();
  });

  it("renders without label when not provided", () => {
    const payload = [{ value: 100, name: "Sales", color: "#8884d8" }];

    render(<CustomChartTooltip active={true} payload={payload} />);

    expect(screen.getByText("Sales:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});

describe("defaultChartColors", () => {
  it("has all required color properties", () => {
    expect(defaultChartColors).toHaveProperty("primary");
    expect(defaultChartColors).toHaveProperty("secondary");
    expect(defaultChartColors).toHaveProperty("success");
    expect(defaultChartColors).toHaveProperty("warning");
    expect(defaultChartColors).toHaveProperty("error");
    expect(defaultChartColors).toHaveProperty("neutral");
  });

  it("has valid color values", () => {
    expect(defaultChartColors.primary).toBeTruthy();
    expect(defaultChartColors.secondary).toBeTruthy();
    expect(defaultChartColors.success).toBeTruthy();
  });
});

describe("formatChartNumber", () => {
  it("formats numbers with thousand separators", () => {
    expect(formatChartNumber(1234567)).toBe("1,234,567");
    expect(formatChartNumber(1000)).toBe("1,000");
    expect(formatChartNumber(999)).toBe("999");
  });

  it("handles string input", () => {
    expect(formatChartNumber("12345")).toBe("12,345");
  });

  it("handles zero", () => {
    expect(formatChartNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatChartNumber(-1234)).toBe("-1,234");
  });

  it("handles invalid input", () => {
    expect(formatChartNumber("invalid")).toBe("invalid");
  });
});

describe("formatChartPercentage", () => {
  it("converts decimal to percentage with default decimals", () => {
    expect(formatChartPercentage(0.234)).toBe("23.4%");
    expect(formatChartPercentage(0.5)).toBe("50.0%");
    expect(formatChartPercentage(1)).toBe("100.0%");
  });

  it("respects custom decimal places", () => {
    expect(formatChartPercentage(0.23456, 2)).toBe("23.46%");
    expect(formatChartPercentage(0.23456, 0)).toBe("23%");
  });

  it("handles string input", () => {
    expect(formatChartPercentage("0.234")).toBe("23.4%");
  });

  it("handles zero", () => {
    expect(formatChartPercentage(0)).toBe("0.0%");
  });

  it("handles invalid input", () => {
    expect(formatChartPercentage("invalid")).toBe("invalid");
  });
});

describe("formatChartDate", () => {
  it("formats date string in MMM DD format", () => {
    // Use ISO format with time to avoid timezone issues
    expect(formatChartDate("2024-01-15T12:00:00Z")).toBe("Jan 15");
    expect(formatChartDate("2024-12-25T12:00:00Z")).toBe("Dec 25");
  });

  it("formats Date object", () => {
    const date = new Date("2024-01-15T12:00:00Z");
    expect(formatChartDate(date)).toBe("Jan 15");
  });
});
