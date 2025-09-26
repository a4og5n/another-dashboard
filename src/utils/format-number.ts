/**
 * Format a number with abbreviated suffixes (K, M, B)
 * @param num The number to format
 * @returns Formatted number string with appropriate suffix
 */
export function formatNumber(num: number): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1_000_000_000)
    return `${sign}${(absNum / 1_000_000_000).toFixed(1)}B`;
  if (absNum >= 1_000_000) return `${sign}${(absNum / 1_000_000).toFixed(1)}M`;
  if (absNum >= 1_000) return `${sign}${(absNum / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}
