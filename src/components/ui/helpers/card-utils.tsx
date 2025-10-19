/**
 * Card utility functions for trend indicators and value formatting
 *
 * These utilities are shared across multiple card components to maintain
 * consistency and reduce code duplication.
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReactNode } from "react";
import type { StatTrend } from "@/types/components/ui";

/**
 * Get the appropriate icon for a trend direction
 *
 * @param trend - The trend direction (up, down, or neutral)
 * @returns React node with the appropriate icon component
 */
export function getTrendIcon(trend?: StatTrend): ReactNode {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
}

/**
 * Get the appropriate color class for a trend direction
 *
 * @param trend - The trend direction (up, down, or neutral)
 * @returns Tailwind CSS text color class
 */
export function getTrendColor(trend?: StatTrend): string {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Format a value for display (adds thousand separators for numbers)
 *
 * @param val - The value to format (string or number)
 * @returns Formatted string value
 */
export function formatValue(val: string | number): string {
  return typeof val === "number" ? val.toLocaleString() : val;
}

/**
 * Format a number with thousand separators
 *
 * @param num - The number to format
 * @returns Formatted string with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a decimal value as a percentage
 *
 * @param value - The decimal value to format (e.g., 0.156 for 15.6%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "15.6%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
