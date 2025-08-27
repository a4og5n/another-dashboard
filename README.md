# NextJS Project

A modern, production-ready Next.js application with TypeScript, Tailwind CSS, shadcn/ui components, and comprehensive development tooling.

## ✨ Features

- **Next.js 15** with App Router
- **TypeScript** with strict mode configuration
- **Tailwind CSS v4** with default imports only
- **shadcn/ui** components with neutral base color
- **ESLint** with Next.js recommended rules
- **TypeDoc** for documentation generation
- **Zod** for schema validation
- **Lucide React** for icons
- **HTTPS development server** with Turbopack
- **Standardized folder structure** with kebab-case naming
- **Import aliases** for clean imports
- **Error handling** with React Error Boundaries
- **Data Access Layer (DAL)** structure
- **Accessibility (a11y) testing** with axe-core integration
- **Performance monitoring** with Web Vitals tracking
- **Comprehensive testing setup** with Vitest and React Testing Library

## 📁 Project Structure

```
src/
├── app/              # App Router pages and layouts
├── components/       # Reusable UI components
│   ├── accessibility/ # A11y testing components
│   └── performance/  # Performance monitoring components
├── actions/          # Server actions and API routes
├── types/           # TypeScript type definitions
├── schemas/         # Zod schemas for validation
├── utils/           # Helper functions and utilities
├── lib/             # Library utilities and configurations
│   └── web-vitals.ts # Web Vitals tracking utilities
├── test/            # Test utilities and helpers
│   ├── setup.ts     # Test setup configuration
│   ├── test-utils.tsx # Custom render functions
│   └── axe-helper.tsx # Accessibility testing helpers
└── dal/              # Data Access Layer
    ├── models/       # Data models and schemas
    ├── repositories/ # Data access patterns
    └── services/     # Business logic services
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and update values
4. Start development server: `pnpm dev`

## 📖 Documentation

Run `pnpm docs` to generate and view the documentation.

## 🧪 Type Checking

Run `pnpm type-check` to verify types across the project.

## 🧪 Testing

This project includes a complete testing setup using Vitest and React Testing Library:

- Run all tests: `pnpm test`
- Watch mode: `pnpm test:watch`
- Test UI interface: `pnpm test:ui`
- Test coverage: `pnpm test:coverage`
- **Accessibility tests**: `pnpm test:a11y`

### 🔍 Accessibility Testing

This template includes comprehensive accessibility testing tools:

- **axe-core** integration for automated a11y testing
- **Development components** for real-time accessibility checking
- **Test helpers** for accessibility validation in unit tests

#### Development Mode A11y Checking

Add the A11yProvider to your root layout for development-time accessibility checking:

```tsx
import { A11yProvider } from "@/components/accessibility/a11y-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <A11yProvider enableInDevelopment>{children}</A11yProvider>
      </body>
    </html>
  );
}
```

#### Testing Components for Accessibility

Example accessibility test pattern:

```tsx
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";

it("should be accessible", async () => {
  const { renderResult } = await renderWithA11y(<MyComponent />);
  await expectNoA11yViolations(renderResult.container);
});
```

### 📈 Performance Monitoring

This template includes comprehensive Web Vitals tracking and performance monitoring:

- **Core Web Vitals tracking** with real-time analytics integration
- **Multiple analytics providers** support (Google Analytics, Vercel, custom endpoints)
- **Performance hooks** for component-level monitoring
- **Development tools** for performance debugging

#### Basic Performance Monitoring Setup

Add the WebVitalsReporter to your root layout:

```tsx
import { WebVitalsReporter } from "@/components/performance/web-vitals-reporter";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitalsReporter
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          logToConsole={process.env.NODE_ENV === "development"}
        />
        {children}
      </body>
    </html>
  );
}
```

#### Using Performance Hooks

Monitor performance in your components:

```tsx
import {
  useWebVitals,
  usePageLoadPerformance,
} from "@/components/performance/use-performance";

function PerformanceDashboard() {
  const { metrics, loading } = useWebVitals();
  const { loadTime } = usePageLoadPerformance();

  return (
    <div>
      <p>LCP: {metrics.lcp?.toFixed(2)}ms</p>
      <p>Page Load: {loadTime?.toFixed(2)}ms</p>
    </div>
  );
}
```

### 📊 Mailchimp Campaigns API

Robust API route for Mailchimp campaign reports and details, featuring:

- Strict query parameter validation using Zod schemas
- Centralized error handling with custom error classes
- Comprehensive unit, integration, and accessibility test coverage
- Example usage: `GET api/mailchimp/campaigns?fields=id,type&count=10&reports=true`
- Response includes: campaign reports, metadata (fields, count, lastUpdated, rateLimit)
- Returns 400 for invalid query, 500 for server errors

See `src/app/api/mailchimp/campaigns/route.ts` and related actions/schemas for implementation details.

### Example Tests

Example tests are provided for:

- UI components with a11y testing (`src/components/ui/button.test.tsx`)
- Utility functions (`src/utils/format-date.test.ts`)
- API integrations (`src/actions/example.test.ts`)

Follow these patterns when creating new tests.

## 🎨 Code Style

- Run `pnpm format` to format code with Prettier
- Run `pnpm lint:fix` to fix ESLint issues

## 📦 Building for Production

1. Run `pnpm build` to create production build
2. Run `pnpm start` to start production server

## 📄 License

MIT
