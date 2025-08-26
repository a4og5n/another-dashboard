# API Integration Planning

**Project:** Another Dashboard MVP  
**Created:** August 25, 2025  
**Purpose:** Detailed planning for each API integration

---

## 📋 Integration Overview

### Priority Order (Based on PRD Analysis)

1. **Google Analytics 4** - Foundation web metrics (Week 3)
2. **YouTube Analytics** - Video content performance (Week 4)
3. **Meta Graph API** - Social media insights (Week 5)
4. **Mailchimp API** - Email marketing metrics (Week 6)
5. **WordPress REST API** - Content management metrics (Week 8)
6. **Google Search Console** - SEO performance (Week 8)

---

## 🎯 Google Analytics 4 Integration (Week 3)

### Prerequisites

- [ ] Google Cloud Project with Analytics Reporting API enabled
- [ ] Service Account with Analytics Read permissions
- [ ] GA4 Property ID and measurement credentials

### Implementation Steps

#### Day 1-2: Setup & Authentication

```typescript
// lib/api/google-analytics.ts
interface GA4Config {
  propertyId: string;
  keyFilePath: string; // For service account
  scopes: string[];
}

export class GoogleAnalyticsService {
  private analyticsReporting: any;
  private propertyId: string;

  constructor(config: GA4Config) {
    // Initialize Google Analytics Reporting API
    // Set up service account authentication
  }

  async getBasicMetrics(dateRange: TimeRange): Promise<GAMetrics> {
    // Fetch core metrics: sessions, pageViews, bounceRate, etc.
  }

  async getTrafficSources(dateRange: TimeRange): Promise<GATrafficSource[]> {
    // Fetch traffic source breakdown
  }

  async getTopPages(dateRange: TimeRange): Promise<GAPageData[]> {
    // Fetch top performing pages
  }
}
```

#### Key Metrics to Track

- **Overview Metrics:** Sessions, Page Views, Bounce Rate, Avg Session Duration
- **User Metrics:** New Users, Returning Users, User Engagement
- **Traffic Sources:** Organic Search, Direct, Referral, Social, Email
- **Page Performance:** Top Pages, Page Views, Time on Page
- **Conversion Tracking:** Goals, Events, E-commerce (if applicable)

#### Day 3-5: Dashboard Components

```typescript
// components/dashboard/google-analytics/overview-cards.tsx
interface OverviewCardsProps {
  metrics: GAMetrics;
  isLoading: boolean;
}

// components/dashboard/google-analytics/traffic-sources-chart.tsx
interface TrafficSourcesChartProps {
  data: GATrafficSource[];
  isLoading: boolean;
}

// components/dashboard/google-analytics/pages-table.tsx
interface PagesTableProps {
  pages: GAPageData[];
  isLoading: boolean;
}
```

### Testing Strategy

- [ ] Mock API responses for development
- [ ] Test error handling for API failures
- [ ] Validate data transformation accuracy
- [ ] Performance test with large datasets

---

## 📺 YouTube Analytics Integration (Week 4)

### Prerequisites

- [ ] YouTube Data API v3 enabled in Google Cloud
- [ ] YouTube Analytics API access
- [ ] Channel ID and authentication credentials

### Key Metrics to Track

- **Overview:** Views, Watch Time, Subscribers, Revenue
- **Video Performance:** Top Videos, Engagement Rate, Retention
- **Audience:** Demographics, Geography, Device Types
- **Revenue:** Ad Revenue, Channel Memberships, Super Chat

### Implementation Plan

```typescript
// lib/api/youtube-analytics.ts
export class YouTubeAnalyticsService {
  async getChannelMetrics(dateRange: TimeRange): Promise<YouTubeMetrics> {
    // Channel-level metrics
  }

  async getVideoPerformance(dateRange: TimeRange): Promise<VideoData[]> {
    // Individual video performance
  }

  async getAudienceInsights(dateRange: TimeRange): Promise<AudienceData> {
    // Audience demographics and behavior
  }
}
```

---

## 📘 Meta Graph API Integration (Week 5)

### Prerequisites

- [ ] Facebook Developer App created
- [ ] Page Access Token with insights permissions
- [ ] Page ID for the Facebook page to analyze

### Key Metrics to Track

- **Page Insights:** Page Views, Post Reach, Page Likes, Engagement
- **Post Performance:** Individual post metrics, engagement rates
- **Audience:** Demographics, online times, location data
- **Ad Performance:** If running Facebook ads

### Implementation Plan

```typescript
// lib/api/meta-graph.ts
export class MetaGraphService {
  async getPageInsights(dateRange: TimeRange): Promise<PageInsights> {
    // Page-level metrics
  }

  async getPostMetrics(dateRange: TimeRange): Promise<PostMetric[]> {
    // Individual post performance
  }

  async getAudienceData(): Promise<AudienceData> {
    // Audience demographics
  }
}
```

### Rate Limits & Considerations

- Facebook Graph API has strict rate limiting
- Need to handle pagination for large datasets
- Different metrics have different availability windows

---

## 📧 Mailchimp API Integration (Week 6)

### Prerequisites

- [ ] Mailchimp API Key with read permissions
- [ ] List IDs for email lists to track
- [ ] Campaign access permissions

### Key Metrics to Track

- **List Growth:** Subscribers, Unsubscribes, Growth Rate
- **Campaign Performance:** Open Rate, Click Rate, Bounce Rate
- **Audience:** Subscriber demographics, engagement levels
- **Automation:** Automation performance, conversion tracking

### Implementation Plan

```typescript
// lib/api/mailchimp.ts
export class MailchimpService {
  async getListMetrics(listId: string): Promise<ListMetrics> {
    // List growth and engagement metrics
  }

  async getCampaignMetrics(dateRange: TimeRange): Promise<CampaignMetric[]> {
    // Campaign performance data
  }

  async getAudienceInsights(listId: string): Promise<AudienceInsights> {
    // Subscriber demographics and behavior
  }
}
```

---

## 📝 WordPress REST API Integration (Week 8)

### Prerequisites

- [ ] WordPress site with REST API enabled
- [ ] Authentication credentials (Application Password or JWT)
- [ ] Plugin for advanced analytics (if needed)

### Key Metrics to Track

- **Content Performance:** Post views, comments, engagement
- **Site Activity:** New posts, updates, user activity
- **SEO Metrics:** If using SEO plugins like Yoast
- **User Engagement:** Comments, shares, time on site

### Implementation Plan

```typescript
// lib/api/wordpress.ts
export class WordPressService {
  async getPostMetrics(dateRange: TimeRange): Promise<PostMetrics[]> {
    // Individual post performance
  }

  async getSiteActivity(dateRange: TimeRange): Promise<SiteActivity> {
    // Overall site activity metrics
  }

  async getContentInsights(): Promise<ContentInsights> {
    // Content performance insights
  }
}
```

---

## 🔍 Google Search Console Integration (Week 8)

### Prerequisites

- [ ] Google Search Console property verified
- [ ] Search Console API enabled
- [ ] Service account with Search Console permissions

### Key Metrics to Track

- **Search Performance:** Impressions, Clicks, CTR, Average Position
- **Index Status:** Indexed pages, crawl errors, sitemap status
- **Core Web Vitals:** LCP, FID, CLS performance data
- **Mobile Usability:** Mobile-friendly issues

### Implementation Plan

```typescript
// lib/api/search-console.ts
export class SearchConsoleService {
  async getSearchMetrics(dateRange: TimeRange): Promise<SearchMetrics> {
    // Search performance data
  }

  async getIndexStatus(): Promise<IndexStatus> {
    // Index coverage and issues
  }

  async getCoreWebVitals(): Promise<WebVitalsData> {
    // Core Web Vitals metrics
  }
}
```

---

## 🛠️ Common Implementation Patterns

### Error Handling Strategy

```typescript
export enum ApiErrorCode {
  RATE_LIMIT = "RATE_LIMIT",
  AUTH_FAILED = "AUTH_FAILED",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public status?: number,
    public retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

### Caching Strategy

```typescript
// lib/cache/api-cache.ts
interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache size
}

export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();

  get<T>(key: string, ttl: number): T | null {
    // Return cached data if still valid
  }

  set<T>(key: string, data: T): void {
    // Store data with timestamp
  }
}
```

### Rate Limiting

```typescript
// lib/api/rate-limiter.ts
export class RateLimiter {
  private requests = new Map<string, number[]>();

  async checkLimit(
    apiKey: string,
    maxRequests: number,
    windowMs: number,
  ): Promise<boolean> {
    // Check if request is within rate limits
  }

  async waitForSlot(apiKey: string): Promise<void> {
    // Wait until next request slot is available
  }
}
```

---

## 📊 Data Transformation & Normalization

### Common Data Structure

```typescript
// lib/types/normalized-data.ts
export interface NormalizedMetric {
  source:
    | "ga4"
    | "youtube"
    | "meta"
    | "mailchimp"
    | "wordpress"
    | "search-console";
  category: "traffic" | "engagement" | "conversion" | "content" | "revenue";
  name: string;
  value: number;
  unit: "count" | "percentage" | "currency" | "duration" | "rate";
  period: TimeRange;
  change?: {
    value: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
}

export interface DashboardData {
  source: string;
  lastUpdated: Date;
  metrics: NormalizedMetric[];
  charts: ChartData[];
  status: "loading" | "success" | "error";
  error?: ApiError;
}
```

---

## 🔄 Integration Testing Plan

### API Testing Strategy

1. **Unit Tests:** Test each service class independently
2. **Integration Tests:** Test API connections with mock responses
3. **E2E Tests:** Test full dashboard data flow
4. **Error Handling Tests:** Test various failure scenarios

### Mock Data Strategy

```typescript
// lib/api/mocks/google-analytics-mock.ts
export const mockGAMetrics: GAMetrics = {
  sessions: 12543,
  pageViews: 25086,
  bounceRate: 0.42,
  avgSessionDuration: 142,
  newUsers: 8234,
  returningUsers: 4309,
};

export const mockGAService = {
  getBasicMetrics: jest.fn().mockResolvedValue(mockGAMetrics),
  getTrafficSources: jest.fn().mockResolvedValue([]),
  getTopPages: jest.fn().mockResolvedValue([]),
};
```

---

## ⚡ Performance Considerations

### API Optimization

- **Caching:** Cache API responses for 5-15 minutes depending on data freshness needs
- **Batching:** Batch multiple metric requests where APIs support it
- **Parallel Requests:** Fetch data from multiple sources simultaneously
- **Lazy Loading:** Load dashboard data as needed, not all at once

### Error Recovery

- **Retry Logic:** Exponential backoff for transient failures
- **Fallback Data:** Show cached data when APIs are unavailable
- **Graceful Degradation:** Hide unavailable sections rather than breaking entire dashboard
- **User Feedback:** Clear status indicators for each data source

---

**Last Updated:** August 25, 2025  
**Next Review:** September 1, 2025 (Before Week 3 implementation starts)
