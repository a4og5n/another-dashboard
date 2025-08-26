# Performance Monitoring Components

This directory contains components and utilities for performance monitoring and Web Vitals tracking.

## Components

### WebVitalsReporter

A component that initializes Web Vitals tracking for your application.

### Hooks

- `useWebVitals` - Get current Web Vitals metrics
- `usePerformanceObserver` - Observe performance entries
- `usePageLoadPerformance` - Track page load metrics
- `useRenderTime` - Measure component render time

## Usage

### Basic Setup (Root Layout)

```tsx
import { WebVitalsReporter } from "@/components/performance/web-vitals-reporter";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitalsReporter
          logToConsole={process.env.NODE_ENV === "development"}
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
        {children}
      </body>
    </html>
  );
}
```

### With Multiple Analytics Providers

```tsx
<WebVitalsReporter
  googleAnalyticsId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
  vercelAnalytics
  customEndpoint="/api/analytics"
  onMetric={(metric) => {
    // Custom handling
    console.log("Custom metric:", metric);
  }}
/>
```

### Using Hooks

```tsx
import {
  useWebVitals,
  usePageLoadPerformance,
} from "@/components/performance/use-performance";

function PerformanceDashboard() {
  const { metrics, loading, refreshMetrics } = useWebVitals();
  const { loadTime, domContentLoaded } = usePageLoadPerformance();

  return (
    <div>
      <h2>Performance Metrics</h2>
      {!loading && (
        <div>
          <p>LCP: {metrics.lcp?.toFixed(2)}ms</p>
          <p>FID: {metrics.fid?.toFixed(2)}ms</p>
          <p>CLS: {metrics.cls?.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}
```

## Analytics Integration

### Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in your environment variables:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Vercel Analytics

Install `@vercel/analytics` and add the script to your layout:

```bash
pnpm add @vercel/analytics
```

### Custom Analytics

Provide a custom endpoint that accepts POST requests with Web Vitals data:

```tsx
<WebVitalsReporter customEndpoint="/api/analytics/web-vitals" />
```

## Core Web Vitals Explained

- **LCP (Largest Contentful Paint)**: Loading performance. Good < 2.5s
- **FID (First Input Delay)**: Interactivity. Good < 100ms
- **CLS (Cumulative Layout Shift)**: Visual stability. Good < 0.1

## Environment Variables

Add these to your `.env.local`:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your-api-secret

# Custom Analytics
NEXT_PUBLIC_ANALYTICS_ENDPOINT=/api/analytics
```

## Best Practices

1. **Monitor in Production** - Web Vitals are most meaningful in production
2. **Track Trends** - Look at performance over time, not single measurements
3. **Segment by Page** - Different pages may have different performance characteristics
4. **Consider User Context** - Device type, connection speed, etc. affect metrics
5. **Set Performance Budgets** - Define acceptable thresholds for your app

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/vitals/#core-web-vitals)
- [Next.js Analytics](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
