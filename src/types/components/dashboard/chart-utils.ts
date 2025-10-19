/**
 * Types for chart utility components and helpers
 *
 * Used for Recharts custom tooltips and chart formatting utilities
 */

/**
 * Props for the CustomChartTooltip component
 * Generic type T represents the data payload structure
 */
export interface CustomChartTooltipProps<T = Record<string, unknown>> {
  /** Whether the tooltip is active (hovering over chart) */
  active?: boolean;
  /** Payload containing the chart data for the hovered point */
  payload?: Array<{
    /** The data point value */
    value: number | string;
    /** Name/key of the data series */
    name?: string;
    /** Color of the data series */
    color?: string;
    /** Full data payload for this point */
    payload?: T;
  }>;
  /** Label for the tooltip (usually x-axis value) */
  label?: string;
  /** Optional formatter function for values */
  valueFormatter?: (value: number | string) => string;
  /** Optional formatter function for labels */
  labelFormatter?: (label: string) => string;
}

/**
 * Chart color scheme configuration
 */
export interface ChartColorScheme {
  /** Primary color for main data series */
  primary: string;
  /** Secondary color for comparison data */
  secondary: string;
  /** Success/positive color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error/negative color */
  error: string;
  /** Neutral/gray color */
  neutral: string;
}
