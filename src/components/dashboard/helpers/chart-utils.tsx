/**
 * Chart utility functions and components for Recharts
 *
 * Provides reusable chart components and helpers to maintain consistency
 * and reduce code duplication across dashboard charts.
 */

import type {
  CustomChartTooltipProps,
  ChartColorScheme,
} from "@/types/components/dashboard";

/**
 * Custom tooltip component for Recharts
 * Provides consistent styling and formatting across all charts
 *
 * @example
 * ```tsx
 * <LineChart data={data}>
 *   <Tooltip content={<CustomChartTooltip />} />
 * </LineChart>
 * ```
 */
export function CustomChartTooltip<T = Record<string, unknown>>({
  active,
  payload,
  label,
  valueFormatter = (value) => String(value),
  labelFormatter = (label) => label,
}: CustomChartTooltipProps<T>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
      {label && (
        <p className="text-sm font-medium mb-2 text-foreground">
          {labelFormatter(label)}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}:</span>
            <span className="text-sm font-medium text-foreground">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Default chart color scheme matching dashboard theme
 */
export const defaultChartColors: ChartColorScheme = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142, 76%, 36%)", // green-600
  warning: "hsl(38, 92%, 50%)", // orange-500
  error: "hsl(0, 84%, 60%)", // red-500
  neutral: "hsl(215, 16%, 47%)", // gray-600
};

/**
 * Format a number as a localized string with thousand separators
 *
 * @param value - The number to format
 * @returns Formatted number string
 *
 * @example
 * formatChartNumber(1234567) // "1,234,567"
 */
export function formatChartNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString();
}

/**
 * Format a decimal value as a percentage for chart display
 *
 * @param value - The decimal value (e.g., 0.234 for 23.4%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 *
 * @example
 * formatChartPercentage(0.234) // "23.4%"
 */
export function formatChartPercentage(
  value: number | string,
  decimals: number = 1,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format a date for chart axis labels
 *
 * @param date - Date string or Date object
 * @returns Formatted date string (MMM DD)
 *
 * @example
 * formatChartDate("2024-01-15") // "Jan 15"
 */
export function formatChartDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
