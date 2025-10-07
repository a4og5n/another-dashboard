# Another Dashboard

A modern, production-ready Next.js application for unified marketing analytics. Connect your Mailchimp account via OAuth 2.0 and view campaigns, audiences, and performance metrics in one beautiful dashboard.

## ✨ Features

### Core Functionality

- **OAuth 2.0 Authentication** - Secure user-scoped Mailchimp connections
- **Multi-User Support** - Each user connects their own Mailchimp account
- **Encrypted Token Storage** - AES-256-GCM encryption for OAuth tokens at rest
- **Mailchimp Integration** - Full API access to campaigns, audiences, and reports
- **Real-Time Updates** - Live polling with user controls
- **Connection Management** - Easy connect/disconnect at `/settings/integrations`

### Technical Stack

- **Next.js 15** with App Router architecture
- **TypeScript** with strict mode configuration
- **Neon Postgres** - Serverless database via Vercel integration
- **Drizzle ORM** - Type-safe database queries
- **Kinde Auth** - User authentication and management
- **Tailwind CSS v4** with shadcn/ui components
- **Zod** for comprehensive schema validation
- **Vitest** with React Testing Library

### Developer Experience

- **HTTPS development server** with Turbopack
- **Pre-commit hooks** - Automatic formatting, linting, type-checking, and testing
- **Import aliases** for clean, maintainable code
- **Accessibility testing** with axe-core integration
- **Performance monitoring** with Web Vitals tracking
- **Comprehensive documentation** with TypeDoc

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages, layouts, and API routes
│   ├── mailchimp/    # Mailchimp dashboard and related pages
│   ├── settings/     # Settings and integrations pages
│   └── api/          # API routes (including OAuth endpoints)
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui base components
│   ├── dashboard/    # Dashboard-specific components
│   ├── mailchimp/    # Mailchimp-specific components (empty states, banners)
│   ├── settings/     # Settings page components (integration cards)
│   ├── layout/       # Layout components (header, sidebar, footer)
│   ├── accessibility/ # A11y testing components
│   └── performance/  # Performance monitoring components
├── db/               # Database layer
│   ├── schema.ts     # Drizzle ORM schema definitions
│   ├── repositories/ # Repository pattern for data access
│   └── index.ts      # Database client exports
├── lib/              # Library utilities and configurations
│   ├── config.ts     # Environment validation with Zod
│   ├── encryption.ts # AES-256-GCM token encryption
│   ├── mailchimp.ts  # OAuth-based Mailchimp client
│   └── validate-mailchimp-connection.ts # Token validation middleware
├── services/         # API service layer
│   ├── mailchimp.service.ts # User-scoped Mailchimp API calls
│   └── mailchimp-oauth.service.ts # OAuth flow logic
├── actions/          # Server actions and business logic
├── types/            # TypeScript type definitions
│   └── mailchimp/    # Mailchimp-specific types (OAuth, campaigns, reports)
├── schemas/          # Zod validation schemas
│   └── mailchimp/    # Mailchimp API schemas
├── utils/            # Helper functions and utilities
├── hooks/            # Custom React hooks
└── test/             # Test utilities, helpers, and mocks
    ├── setup.ts      # Test setup configuration
    ├── mocks/        # Test mocks (OAuth, Mailchimp)
    └── architectural-enforcement/ # Architectural pattern tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js v24.7.0 or later
- pnpm v10.15.0 or later
- A Vercel account (for database hosting)
- A Mailchimp account (for OAuth app registration)
- A Kinde account (for user authentication)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd another-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create Neon database via Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Storage
   - Click "Create Database" → Select "Neon" (Serverless Postgres)
   - Vercel automatically adds environment variables

4. **Pull environment variables**

   ```bash
   vercel env pull .env.local
   ```

5. **Register Mailchimp OAuth app**
   - Login to Mailchimp → Account → Extras → API Keys → "Register an App"
   - App Name: `Another Dashboard`
   - Redirect URI (local): `https://127.0.0.1:3000/api/auth/mailchimp/callback`
   - Copy Client ID and Client Secret

6. **Configure environment variables**

   ```bash
   # Add to .env.local
   MAILCHIMP_CLIENT_ID=your_client_id
   MAILCHIMP_CLIENT_SECRET=your_client_secret
   MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback

   # Generate encryption key
   openssl rand -base64 32
   ENCRYPTION_KEY=<paste-generated-key>

   # Add Kinde credentials (from your Kinde dashboard)
   KINDE_CLIENT_ID=your_kinde_client_id
   KINDE_CLIENT_SECRET=your_kinde_client_secret
   KINDE_ISSUER_URL=https://your_subdomain.kinde.com
   KINDE_SITE_URL=https://127.0.0.1:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=https://127.0.0.1:3000
   KINDE_POST_LOGIN_REDIRECT_URL=https://127.0.0.1:3000/mailchimp
   ```

7. **Push database schema**

   ```bash
   pnpm db:push
   ```

8. **Start development server**

   ```bash
   pnpm dev
   ```

9. **Connect your Mailchimp account**
   - Visit `https://127.0.0.1:3000/mailchimp`
   - Click "Connect Mailchimp"
   - Authorize access in Mailchimp
   - You'll be redirected back with an active connection

### Quick Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build production version
- `pnpm test` - Run all tests
- `pnpm type-check` - Check TypeScript types
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm pre-commit` - Run full validation suite
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

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

### 📊 Mailchimp OAuth Integration

Comprehensive Mailchimp OAuth 2.0 integration with user-scoped API access:

#### 🔐 OAuth Authentication

Secure OAuth 2.0 flow with encrypted token storage:

- **User-scoped connections** - Each user connects their own Mailchimp account
- **AES-256-GCM encryption** - OAuth tokens encrypted at rest in database
- **CSRF protection** - State parameter validation for security
- **Automatic token validation** - Hourly health checks with auto-deactivation
- **Connection management** - Easy connect/disconnect at `/settings/integrations`

#### 📧 Campaigns & Reports

Full campaign analytics and reporting:

- **Campaign dashboard** at `/mailchimp` with tabbed interface
- **Reports page** at `/mailchimp/reports` with detailed analytics
- **Server-side pagination** for efficient data loading
- **Real-time updates** with configurable polling
- **Comprehensive metrics** - opens, clicks, bounces, deliverability

#### 👥 Audiences

Audience management and insights:

- **Audience listing** at `/mailchimp/lists` with filtering
- **Member statistics** and engagement metrics
- **Growth tracking** and audience health

#### Architecture & Security

**OAuth Flow:**

```
User Authentication (Kinde)
    ↓
OAuth Authorization (Mailchimp)
    ↓
Token Exchange & Encryption
    ↓
Secure Storage (Neon Postgres)
    ↓
User-Scoped API Calls
```

**Key Components:**

- **OAuth Service:** [mailchimp-oauth.service.ts](src/services/mailchimp-oauth.service.ts)
- **Token Encryption:** [encryption.ts](src/lib/encryption.ts)
- **Database Repository:** [mailchimp-connection.ts](src/db/repositories/mailchimp-connection.ts)
- **User-Scoped Client:** [mailchimp.ts](src/lib/mailchimp.ts)
- **Service Layer:** [mailchimp.service.ts](src/services/mailchimp.service.ts)

**API Endpoints:**

- `POST /api/auth/mailchimp/authorize` - Initiate OAuth flow
- `GET /api/auth/mailchimp/callback` - Handle OAuth callback
- `POST /api/auth/mailchimp/disconnect` - Disconnect account
- `GET /api/auth/mailchimp/status` - Check connection status

#### Usage Example

**Server Action with OAuth:**

```typescript
import { getMailchimpReports } from "@/actions/mailchimp-reports";

// User must be authenticated (Kinde) and have active Mailchimp connection
const result = await getMailchimpReports({
  count: 10,
  offset: 0,
  type: "regular",
});

if (result.success) {
  console.log(`Found ${result.data.total_items} reports`);
  result.data.reports.forEach((report) => {
    console.log(`${report.campaign_title}: ${report.emails_sent} sent`);
  });
} else {
  // Handles "mailchimp_not_connected" error automatically
  console.error(result.error);
}
```

**Error Handling:**

```json
{
  "success": false,
  "error": "mailchimp_not_connected"
}
```

Common error codes:

- `mailchimp_not_connected` - User hasn't connected Mailchimp
- `mailchimp_connection_inactive` - Connection deactivated (token expired)
- `mailchimp_token_invalid` - Token validation failed

See [docs/mailchimp-oauth-migration.md](docs/mailchimp-oauth-migration.md) for complete setup guide.

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
