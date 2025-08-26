"use client";

import { useEffect, useState, useCallback } from "react";
import { getCurrentWebVitals } from "@/lib/web-vitals";

/**
 * Hook to get current Web Vitals metrics
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<{
    cls?: number;
    fid?: number;
    fcp?: number;
    lcp?: number;
    ttfb?: number;
  }>({});

  const [loading, setLoading] = useState(true);

  const refreshMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const currentMetrics = await getCurrentWebVitals();
      setMetrics(currentMetrics);
    } catch (error) {
      console.error("Error fetching Web Vitals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  return { metrics, loading, refreshMetrics };
}

/**
 * Hook to observe performance entries
 */
export function usePerformanceObserver(
  callback: (entries: PerformanceEntry[]) => void,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    // Create a performance observer instead of using observePerformance from web-vitals
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    observer.observe({
      entryTypes: ["navigation", "resource", "measure", "mark"],
    });

    return () => observer.disconnect();
  }, [callback, enabled]);
}

/**
 * Hook to track page load performance
 */
export function usePageLoadPerformance() {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [domContentLoaded, setDomContentLoaded] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLoad = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        setLoadTime(navigation.loadEventEnd - navigation.loadEventStart);
        setDomContentLoaded(
          navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
        );
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }

    // Return an empty cleanup function for the case where readyState is 'complete'
    return () => {};
  }, []);

  return { loadTime, domContentLoaded };
}

/**
 * Hook to measure component render time
 */
export function useRenderTime(componentName?: string) {
  const [renderTime, setRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setRenderTime(duration);

      if (componentName && process.env.NODE_ENV === "development") {
        console.log(`[Render Time] ${componentName}: ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return renderTime;
}
