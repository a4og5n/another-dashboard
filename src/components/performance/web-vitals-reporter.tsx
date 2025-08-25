'use client';

import { useEffect } from 'react';
import { observePerformance, WebVitalsMetric, reportWebVitals } from '@/lib/web-vitals';

interface WebVitalsReporterProps {
  /** Enable console logging in development */
  logToConsole?: boolean;
  /** Google Analytics measurement ID */
  googleAnalyticsId?: string;
  /** Custom analytics endpoint URL */
  customEndpoint?: string;
  /** Enable Vercel Analytics */
  vercelAnalytics?: boolean;
  /** Custom metric handler */
  onMetric?: (metric: WebVitalsMetric) => void;
  /** Only run in specific environments */
  enabledInEnvironments?: string[];
}

/**
 * Web Vitals Reporter Component
 * 
 * This component initializes Web Vitals tracking when mounted.
 * Add it to your root layout or specific pages where you want to track performance.
 * 
 * Usage in layout.tsx:
 * ```tsx
 * import { WebVitalsReporter } from '@/components/performance/web-vitals-reporter';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <WebVitalsReporter 
 *           googleAnalyticsId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
 *           vercelAnalytics
 *         />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function WebVitalsReporter({
  logToConsole,
  googleAnalyticsId,
  customEndpoint,
  vercelAnalytics,
  onMetric,
  enabledInEnvironments = ['production', 'development'],
}: WebVitalsReporterProps) {
  useEffect(() => {
    // Check if we should run in current environment
    if (!enabledInEnvironments.includes(process.env.NODE_ENV || 'development')) {
      return;
    }

    // Set up Web Vitals observation
    observePerformance((metric) => {
      // Log to console if enabled
      if (logToConsole) {
        console.log('Web Vitals:', metric);
      }

      // Send to Vercel Analytics
      if (vercelAnalytics) {
        reportWebVitals(metric);
      }

      // Send to Google Analytics 4 if configured
      if (googleAnalyticsId && typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as Window & { gtag?: (event: string, action: string, parameters: Record<string, unknown>) => void }).gtag;
        gtag?.('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          metric_id: metric.id,
          metric_rating: metric.rating,
        });
      }

      // Send to custom endpoint if configured
      if (customEndpoint) {
        fetch(customEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metric),
        }).catch((error) => {
          console.warn('Failed to send metric to custom endpoint:', error);
        });
      }

      // Call custom callback if provided
      if (onMetric) {
        onMetric(metric);
      }
    });
  }, [logToConsole, googleAnalyticsId, customEndpoint, vercelAnalytics, onMetric, enabledInEnvironments]);

  // This component renders nothing
  return null;
}
