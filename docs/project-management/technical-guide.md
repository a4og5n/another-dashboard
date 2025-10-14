# Technical Implementation Guide

**Project:** Another Dashboard MVP  
**Created:** August 25, 2025  
**Purpose:** Detailed technical steps and architecture decisions

---

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Testing:** Vitest + React Testing Library + jest-axe
- **Deployment:** Vercel with preview deployments
- **Package Manager:** pnpm

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── dashboard/        # Dashboard-specific components
│   └── layout/           # Layout components
├── lib/                   # Utilities and configurations
│   ├── api/              # API service layer
│   ├── types/            # TypeScript definitions
│   └── utils.ts          # Utility functions
├── hooks/                 # Custom React hooks
└── constants/            # Application constants
```

---

## 🚀 Phase 1: Foundation Implementation

### Step 1: Project Initialization

#### 1.1 Create Next.js Project

```bash
# Use the latest Next.js 15 with all recommended options
npx create-next-app@latest another-dashboard \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd another-dashboard
```

#### 1.2 Install Core Dependencies

```bash
# UI and styling
npx shadcn-ui@latest init
pnpm add lucide-react class-variance-authority clsx tailwind-merge

# Charts and data visualization
pnpm add recharts

# Development dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jest-axe
pnpm add -D eslint-plugin-jsx-a11y
pnpm add -D prettier husky lint-staged

# API and data handling
pnpm add zod
pnpm add @tanstack/react-query  # For API state management
```

#### 1.3 Configure Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 2: Development Toolchain Setup

#### 2.1 ESLint Configuration (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
```

#### 2.2 Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### 2.3 Vitest Configuration (vitest.config.ts)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Step 3: Basic UI Foundation

#### 3.1 Install shadcn/ui Components

```bash
# Essential components for dashboard
npx shadcn-ui@latest add button card input select navigation-menu
npx shadcn-ui@latest add avatar badge dialog dropdown-menu
npx shadcn-ui@latest add table tabs tooltip switch
```

#### 3.2 Create Theme Provider (components/theme-provider.tsx)

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'dashboard-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
```

#### 3.3 Create Main Layout Structure

**app/layout.tsx:**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Another Dashboard',
  description: 'Unified analytics and content management dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 📊 Phase 2: API Data Access Layer (DAL)

### Step 4: Type Definitions

#### 4.1 Create Base Types (lib/types/index.ts)

```typescript
// Base API response structure
export interface ApiResponse<T = any> {
  data: T;
  status: "success" | "error";
  message?: string;
  timestamp: string;
}

// Common dashboard metrics
export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  format?: "number" | "currency" | "percentage" | "duration";
}

// Time range for data filtering
export interface TimeRange {
  start: Date;
  end: Date;
  preset?: "today" | "7days" | "30days" | "90days" | "year" | "custom";
}

// Chart data structure
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
```

#### 4.2 Google Analytics Types (lib/types/google-analytics.ts)

```typescript
export interface GAMetrics {
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  newUsers: number;
  returningUsers: number;
}

export interface GATrafficSource {
  source: string;
  medium: string;
  sessions: number;
  percentage: number;
}

export interface GAPageData {
  path: string;
  pageViews: number;
  uniquePageViews: number;
  bounceRate: number;
  avgTimeOnPage: number;
}
```

### Step 5: API Service Implementation

#### 5.1 Base API Client (lib/api/client.ts)

```typescript
import { z } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      timeout: 10000,
      ...config,
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>,
  ): Promise<T> {
    const url = this.config.baseURL
      ? `${this.config.baseURL}${endpoint}`
      : endpoint;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...this.config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();

      if (schema) {
        return schema.parse(data);
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, "TIMEOUT");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
```

---

## 🎯 Implementation Priorities

### Week 1 Focus:

1. ✅ Complete project initialization
2. ✅ Set up all toolchain components
3. ✅ Create basic layout structure
4. ✅ Implement theme system
5. ✅ Test deployment pipeline

### Week 2 Focus:

1. 🔄 Define all TypeScript interfaces
2. 🔄 Build API service layer
3. 🔄 Create navigation components
4. 🔄 Set up error handling
5. 🔄 Prepare for first API integration

### Decision Log:

- **Chart Library:** Chose Recharts for better React integration
- **State Management:** Using React Query for API state management
- **Theme System:** Implemented with CSS variables and localStorage persistence
- **Testing:** Vitest + React Testing Library + jest-axe for comprehensive testing

---

## 🔍 Testing Strategy

### Unit Tests

- All utility functions
- Custom hooks
- Component logic

### Integration Tests

- API service layer
- Dashboard data flow
- Navigation functionality

### Accessibility Tests

- All interactive components
- Keyboard navigation
- Screen reader compatibility

### Performance Tests

- Bundle size monitoring
- Core Web Vitals tracking
- API response time validation

---

## 📚 Resources & References

### Documentation Links

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [React Query Documentation](https://tanstack.com/query/latest)

### API References

- [Google Analytics Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4)
- [YouTube Analytics API](https://developers.google.com/youtube/analytics)
- [Meta Graph API](https://developers.facebook.com/docs/graph-api)
- [Mailchimp API](https://mailchimp.com/developer/marketing/)

---

**Last Updated:** August 25, 2025  
**Next Review:** August 31, 2025
