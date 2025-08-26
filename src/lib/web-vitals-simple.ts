import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from "web-vitals";

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
  timestamp?: number;
}

/**
 * Convert web-vitals Metric to our WebVitalsMetric format
 */
function convertMetric(metric: Metric): WebVitalsMetric {
  const getThreshold = (
    name: string,
    value: number,
  ): WebVitalsMetric["rating"] => {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      INP: { good: 200, poor: 500 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return "good";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  };

  return {
    name: metric.name,
    value: metric.value,
    rating: getThreshold(metric.name, metric.value),
    id: metric.id,
    timestamp: Date.now(),
  };
}

/**
 * Observe and report Core Web Vitals
 */
export function observePerformance(
  onMetric: (metric: WebVitalsMetric) => void,
) {
  if (typeof window === "undefined") return;

  const handleMetric = (metric: Metric) => {
    onMetric(convertMetric(metric));
  };

  // Observe all Core Web Vitals
  onCLS(handleMetric);
  onFCP(handleMetric);
  onINP(handleMetric); // INP replaces FID in web-vitals v5
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

/**
 * Send Web Vitals to Vercel Analytics
 */
export function sendToVercelAnalytics(metric: WebVitalsMetric) {
  // Use Vercel Analytics if available
  if (typeof window !== "undefined" && "va" in window) {
    const va = (
      window as Window & {
        va?: (event: string, properties: Record<string, unknown>) => void;
      }
    ).va;
    va?.("Web Vitals", {
      [metric.name]: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

/**
 * Get current Core Web Vitals metrics (simplified for v5)
 */
export async function getCurrentWebVitals(): Promise<{
  cls?: number;
  inp?: number; // Changed from fid to inp
  fcp?: number;
  lcp?: number;
  ttfb?: number;
}> {
  // For web-vitals v5, we can't get metrics synchronously
  // This would need to be implemented with callbacks
  return {};
}

/**
 * Report Web Vitals to multiple analytics services
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Send to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vitals:", metric);
  }

  // Send to Vercel Analytics
  sendToVercelAnalytics(metric);

  // You can add other analytics services here
  // sendToGoogleAnalytics(metric);
  // sendToSentry(metric);
}
