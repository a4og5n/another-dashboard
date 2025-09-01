### TypeScript Types Folder Structure & Guidelines

**Folder Structure Recommendation:**

```
src/types/
   ├── index.ts                # Central export for all shared types
   ├── mailchimp/              # Feature or integration-specific types
   │     ├── campaign.ts
   │     ├── audience.ts
   │     ├── report.ts
   │     ├── member.ts
   │     ├── template.ts
   │     └── index.ts          # Central export for mailchimp types
   ├── api-errors.ts           # Shared error types
   ├── campaign-filters.ts     # Shared filter types
   ├── ...                     # Other feature or domain-specific types
```

**Error Response Schema Strategy:**

- Always compare all fields of the error response to the shared error schema.
- If the fields are an exact match, use the shared schema.
- If there are additional or different fields, extend the shared schema with `.extend({ ... })`.
- If the error response structure is fundamentally different, create a custom schema for that API.

**API Naming Consistency for Schemas:**

- Always use the same object/property names as the API when defining Zod schemas and TypeScript types. This ensures clarity, maintainability, and easier mapping between API responses and your codebase.

**Enum Pattern for Zod Schemas:**

- Always define enum values as a constant array (e.g., `export const VISIBILITY = ["pub", "prv"] as const;`) and use that constant in `z.enum(VISIBILITY)`.
- This pattern ensures maintainability, type safety, and reusability for both Zod and TypeScript.

**Guidelines:**

- Organize by feature/integration (e.g., `mailchimp/`, `user/`, `dashboard/`).
- Use an `index.ts` in each subfolder for re-exports.
- Store only TypeScript type/interface definitions here—no logic or schemas.
- Use path aliases for imports/exports.
- Avoid inline type definitions in components or actions; always import from `types`.

This structure supports scalability, maintainability, and clear separation of concerns.

# Product Requirements Document (PRD)

## Another Dashboard

**Version:** 1.0  
**Date:** August 24, 2025  
**Status:** Draft  
**Author:** Alvaro Gurdian  
**Stakeholders:** [List key stakeholders]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [User Research & Personas](#user-research--personas)
4. [Features & Requirements](#features--requirements)
5. [Technical Requirements](#technical-requirements)
6. [User Experience & Design](#user-experience--design)
7. [Performance & Accessibility](#performance--accessibility)
8. [Success Metrics](#success-metrics)
9. [Timeline & Milestones](#timeline--milestones)
10. [Risks & Mitigation](#risks--mitigation)
11. [Future Considerations](#future-considerations)

---

## Executive Summary

<!-- 📝 STAGE 1: Fill this out first -->

### Problem Statement

Content creators, marketers, and revenue teams currently rely on a fragmented set of tools—such as Mailchimp, Mailjet, Wordpress, OneSignal, Google Analytics, Google Search Console, YouTube Studio, Meta's Page Insights, and more—to create, publish, monitor their content, and track revenue performance. This fragmentation leads to inefficiencies, manual data aggregation, and missed opportunities for actionable insights across both content and revenue streams. There is no unified platform that consolidates data from these sources and provides automated, actionable insights in one place.

### Solution Overview

This dashboard provides a unified platform that aggregates data from multiple content, marketing, analytics, and revenue tools—including Mailchimp, Mailjet, Wordpress, OneSignal, Google Analytics, Google Search Console, YouTube Studio, Meta's Page Insights, and others. It automatically consolidates, visualizes, and analyzes data, delivering actionable insights and recommendations based on our business goals in one place. The solution streamlines workflows, reduces manual effort, and empowers users to make data-driven decisions faster for both content and revenue growth.

### Key Objectives

**Primary Objective:**  
Eliminate manual data gathering and reporting by automating the collection, visualization, and generation of tailored actionable insights across content and revenue streams, tailored to our business goals.

#### 1. Automate Data Gathering

- Aggregate data from diverse sources (content, marketing, analytics, revenue) into a single dashboard
- Support scalable integrations for new platforms, via APIs, webhooks and MCP Servers
- Ensure secure, reliable, and real-time data collection
- Remove the need for manual data import/export tasks

#### 2. Automate Reporting

- Automatically generate visualizations and reports for key metrics
- Provide customizable dashboards and reports for different user roles
- Enable scheduled and on-demand reporting
- Eliminate manual compilation and sharing of reports

#### 3. Automate Insights

- Deliver actionable, automated insights and recommendations for both content and revenue, based on defined business goals
- Surface trends, anomalies, and opportunities proactively
- Enable faster, data-driven decision-making for teams
- Provide real-time monitoring and alerts for key metrics
- Improve decision-making speed and accuracy for content and revenue teams

### Success Criteria

- **Unified Key Metrics**
  - Data from all integrated platforms is aggregated and mapped to a small set of simple, clearly defined key metrics that are easy for the team to understand and act on.
- **Eliminate Manual Data Gathering**
  - All key platforms used by the team are integrated and actively syncing data, so team members no longer need to manually collect or import data.

## Project Overview

<!-- 📝 STAGE 1: Define the basics -->

### Project Goals

#### Primary Goals

- Unify data sources by integrating all key content, marketing, analytics, and revenue platforms into a single dashboard.
- Eliminate manual data gathering by automating the collection and syncing of data from all platforms.
- Simplify key metrics by aggregating and mapping data from all sources into a small set of clear, actionable metrics for the team.
- Automate reporting to generate and deliver visualizations and reports tailored to user roles and needs.
- Deliver actionable insights through automated recommendations and alerts to help the team make faster, data-driven decisions.

#### Secondary Goals

- Enhance collaboration by enabling team members to share dashboards, reports, and insights easily.
- Support role-based access control to ensure data privacy and appropriate feature access.
- Provide export options for data and reports in multiple formats (CSV, PDF, etc.).
- Integrate with notification systems (email, Slack, etc.) for automated alerts and updates.
- Enable customization of dashboard layouts and widgets for individual preferences.
- Ensure mobile responsiveness for access on any device.
- Facilitate onboarding with guided tours and contextual help.
- Maintain high security standards for data protection and compliance.
- Support historical data analysis and trend visualization.
- Allow for easy addition of new data sources and integrations as team needs evolve.

### Target Users

#### Primary Users (Internal Team Members)

_Roles are not mutually exclusive; users can be assigned multiple roles._

- **Editor:** Manages and reviews content before publication.
- **Reporter:** Tracks and analyzes performance metrics, generates reports.
- **Contributor:** Adds new content and data to the system.
- **Accountant:** Monitors revenue, expenses, and financial metrics.
- **IT:** Maintains integrations, security, and system reliability.
- **Design:** Ensures visual consistency and accessibility of dashboards.
- **Executives:** Oversees overall performance, makes strategic decisions.

#### Secondary Users (External Clients)

- **Client:** Accesses selected dashboards and reports, reviews performance and insights relevant to their business.

### Use Cases

6. **Business Goal Configuration**
   - **Actors:** Executive, Reporter
   - **Goal:** Define and update business goals to tailor insights and recommendations.
   - **Steps:**
     1. Access business goal management section
     2. Set or update business objectives
     3. Save changes
     4. Insights and recommendations update accordingly

#### Primary Use Cases

1. **Daily Performance Monitoring**
   - **Actors:** Reporter, Executive, Client
   - **Goal:** Review unified key metrics for content and revenue across all platforms.
   - **Steps:**
     1. Log in to dashboard
     2. Select relevant time period
     3. View aggregated metrics and trends
     4. Identify anomalies or opportunities

2. **Automated Report Generation**
   - **Actors:** Reporter, Accountant, Executive
   - **Goal:** Receive scheduled or on-demand reports with visualizations and insights.
   - **Steps:**
     1. Configure report schedule or request on-demand
     2. Select metrics and platforms
     3. Receive report via dashboard or email
     4. Share report with team or clients

3. **Content & Revenue Insights**
   - **Actors:** Editor, Contributor, Executive
   - **Goal:** Get automated recommendations for improving content performance and revenue.
   - **Steps:**
     1. Access insights section
     2. Review actionable recommendations
     3. Apply suggested changes
     4. Monitor impact over time

4. **Custom Dashboard Configuration**
   - **Actors:** All internal roles
   - **Goal:** Personalize dashboard layout and widgets to match individual or team needs.
   - **Steps:**
     1. Access dashboard settings
     2. Add/remove widgets
     3. Save custom layout
     4. Share configuration with other users

5. **Client Access to Reports**
   - **Actors:** Client
   - **Goal:** View selected dashboards and reports relevant to their business.
   - **Steps:**
     1. Log in as client
     2. Access shared dashboards/reports
     3. Review performance and insights
     4. Request additional data or clarification if needed

---

## User Research & Personas

<!-- 📝 STAGE 2: User research and personas -->

### Research Findings

[Summary of user research, interviews, surveys, etc.]

### User Personas

#### Persona 1: Editor

- **Demographics:** Content Manager
- **Goals:** Ensure all published content meets quality standards and is optimized for engagement and revenue.
- **Pain Points:** Wastes time gathering performance data from multiple sources; struggles to quickly identify which content needs improvement.
- **Tech Comfort:** High; comfortable with dashboards and analytics tools.
- **Usage Patterns:** Logs in daily to review content metrics, approve new posts, and check automated recommendations.

#### Persona 2: Reporter

- **Demographics:** Data Analyst
- **Goals:** Generate accurate, timely reports on content and revenue; track financial KPIs.
- **Pain Points:** Manual reporting is tedious; data definitions differ across platforms.
- **Tech Comfort:** Medium-high; prefers automated reporting and clear, unified metrics.
- **Usage Patterns:** Uses dashboard weekly to schedule reports, review financial trends, and share insights with executives.

#### Persona 3: Contributor

- **Demographics:** Content Creator
- **Goals:** Add new content and data to the system efficiently.
- **Pain Points:** Needs clear feedback on content performance; dislikes manual data entry.
- **Tech Comfort:** Medium; prefers simple, guided workflows.
- **Usage Patterns:** Logs in as needed to submit content and review performance.

#### Persona 4: Accountant

- **Demographics:** Finance Specialist
- **Goals:** Monitor revenue, expenses, and financial metrics.
- **Pain Points:** Difficulty reconciling data from multiple sources; wants reliable, automated financial reports.
- **Tech Comfort:** Medium; comfortable with spreadsheets and dashboards.
- **Usage Patterns:** Uses dashboard weekly to review financial summaries and export reports.

#### Persona 5: IT

- **Demographics:** Systems Administrator
- **Goals:** Maintain integrations, security, and system reliability.
- **Pain Points:** Integrating new platforms is complex; ensuring accessibility for all users.
- **Tech Comfort:** High; skilled in integrations and troubleshooting.
- **Usage Patterns:** Uses dashboard as needed to manage integrations and troubleshoot issues.

#### Persona 6: Design

- **Demographics:** Designer
- **Goals:** Ensure visual consistency and accessibility of dashboards.
- **Pain Points:** Needs flexible design tools; wants to ensure accessibility standards are met.
- **Tech Comfort:** High; experienced with design and prototyping tools.
- **Usage Patterns:** Uses dashboard as needed to update design elements and review accessibility.

#### Persona 7: Executive

- **Demographics:** CEO
- **Goals:** Oversee business performance, make strategic decisions, and ensure team alignment with business goals.
- **Pain Points:** Needs quick access to unified, actionable insights; dislikes fragmented data views.
- **Tech Comfort:** Medium; values simplicity and clarity.
- **Usage Patterns:** Logs in several times a week to review high-level metrics, business goal progress, and receive alerts.

#### Persona 8: Client (External User)

- **Demographics:** Marketing Director at client company
- **Goals:** Access relevant dashboards and reports; understand campaign performance and ROI.
- **Pain Points:** Limited visibility into unified metrics; wants clear, actionable insights.
- **Tech Comfort:** Medium; prefers intuitive interfaces.
- **Usage Patterns:** Logs in monthly to review shared reports and request additional data.

### User Journey Map

[Key touchpoints and interactions users will have with the dashboard]

---

## Features & Requirements

<!-- 📝 STAGE 3: Detailed features -->

### Core Features (MVP)

#### MVP Features (Local Development, Single-User, Read-Only)

1. **Multi-Platform Data Connections**
   - Connect to various content, marketing, analytics, and revenue platforms via their APIs.
   - No local database; data is retrieved live from each source.
   - **Immediate Priority:** Modularize Mailchimp schemas in `src/schemas/mailchimp/` as a template for all future data sources (Mailjet, Wordpress, etc.).

2. **Independent Dashboards**
   - Display a separate dashboard for each data source.
   - Minimal data processing—only basic formatting and normalization for readability.

3. **Main Menu Navigation**
   - Provide a main menu to switch between available dashboards/reports.

4. **Breadcrumb Navigation**
   - Show a breadcrumb trail to indicate the current location within the dashboard hierarchy.

5. **Read-Only Mode**
   - All dashboards are view-only; no editing, goal-setting, or data storage.

6. **Local Development, Single-User**
   - The MVP is designed for local development and use by a single user; no authentication or multi-user support required at this stage.

7. **Basic Error Handling**
   - Display clear error messages if data retrieval fails or APIs are unavailable.

8. **Loading States**
   - Show loading indicators while fetching data from external sources.

9. **Simple Configuration**
   - Allow the user to easily add or remove data sources via a local config file or environment variables.

10. **Minimal Theming**

- Provide a basic light/dark mode toggle for usability.

11. **Documentation**

- Include a simple README or help section explaining setup, usage, and supported data sources.

### Advanced Features (Future Releases)

#### Feature A: Multi-User Support with SSO

- Enable multiple users to access the platform, with Single Sign-On (SSO) for secure authentication and role-based permissions.

#### Feature B: Dashboard Customization

- Allow users to customize dashboard layouts, widgets, and views to fit their individual or team needs.

#### Feature C: Multi-Company Support

- Support adding multiple companies, each with its own suite of services and data sources to connect and manage independently.

### Functional Requirements

#### Data Management

- [ ] Support live data retrieval from connected platforms via APIs (no local storage for MVP)
- [ ] Normalize and format data for consistent display across dashboards
- [ ] Handle API errors gracefully and display user-friendly error messages
- [ ] Allow configuration of data sources via local config file or environment variables
- [ ] Ensure secure handling of API keys and credentials

#### User Management

- [ ] Single-user mode for MVP (no authentication required)
- [ ] Prepare for future multi-user support with role-based permissions and SSO integration
- [ ] Allow assignment of multiple roles to a single user (for future releases)
- [ ] Support user preferences for dashboard layout and theming (for future releases)

#### Visualization

- [ ] Display independent dashboards for each data source
- [ ] Provide basic charting and tabular views for key metrics
- [ ] Implement main menu and breadcrumb navigation for easy access
- [ ] Support minimal theming (light/dark mode)
- [ ] Ensure dashboards are mobile-responsive and accessible

---

## Technical Requirements

<!-- 📝 STAGE 4: Technical specifications -->

### Technology Stack

**Frontend:** Next.js 15+ with React 18+, TypeScript
**Styling:** Tailwind CSS with shadcn/ui components
**Backend:** Supabase (Postgres) with Drizzle ORM
**Data Storage & Analytics:** Google BigQuery for storing and querying large datasets; backend will interact with BigQuery for data aggregation and reporting
**Authentication:** Kinde (SSO, user management)
**Hosting:** Vercel (Next.js optimized, serverless deployment)
**Version Management:** GitHub (source control, collaboration)
**CI/CD:** Vercel Deployment (automatic build, preview, and production deploys on push/PR)
**Analytics:** Web Vitals monitoring, performance tracking
**Testing:** Vitest (test runner), React Testing Library (component testing), MSW (API mocking), jest-axe (accessibility testing)
**Documentation:** TypeDoc (API and developer documentation), Storybook (UI/component documentation), Markdown-based guides for user documentation
**Internationalization (i18n):** next-intl or i18next for multi-language support
**Accessibility Tools:** jest-axe (testing), Storybook a11y addon, real-time accessibility checks
**Package Management:** pnpm for fast, efficient dependency management
**Code Quality:** ESLint (linting), Prettier (formatting), Husky (git hooks)
**Import Path Aliases:**
**Export Path Aliases:**

- Apply the same path alias strategy to exports of shared, deeply nested, or frequently imported modules.
- Ensure that all exports from these modules use aliases for consistency and maintainability.
- This applies to both import and export statements throughout the codebase.
  **Deployment Preview:** Vercel Preview Deployments for PRs and branches
  **Environment Management:** dotenv (local development), Vercel Environment Variables (cloud deployment)
  **Mobile/Responsive Testing:** BrowserStack or Percy for cross-device and visual regression testing

### Architecture Requirements

#### 1. Modular, Scalable Structure

- Feature-based, atomic design for UI components and folders
- Separation of concerns: UI, data fetching, business logic, configuration, and tests

#### 2. Serverless & Edge-Ready

- Deploy on Vercel’s serverless platform (API routes, edge functions)
- No local database for MVP; live API data only

#### 3. API-First Integration

- Integrate with external APIs using secure, typed fetchers
- Centralize API configuration and error handling

#### 4. Type Safety & Validation

- Strict TypeScript usage throughout
- Zod schemas for input validation and API responses

#### 5. Environment & Secrets Management

- dotenv for local development, Vercel Environment Variables for cloud
- Never commit secrets; use environment variables for API keys and sensitive config

#### 6. Accessibility & Internationalization

- All components must meet accessibility standards (ARIA, keyboard navigation, color contrast)
- Support multiple languages via next-intl or i18next

#### 7. Automated Testing & Quality Gates

- Require passing unit, integration, and accessibility tests before deploy
- Use Vitest, React Testing Library, MSW, jest-axe

#### 8. Performance Optimization

- Optimize for Core Web Vitals (LCP, FID, CLS)
- Code splitting, lazy loading, Next.js Image for assets
- Page load time < 2 seconds (LCP)
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- 95+ Lighthouse Performance score

#### 9. CI/CD & Preview Deployments

- Vercel for automatic builds, previews, and production deploys
- Preview every PR/branch before merging

#### 10. Documentation & Developer Experience

- Maintain up-to-date developer docs (TypeDoc, Storybook)
- Document API endpoints, environment variables, and setup steps

#### 11. Responsive & Mobile-First Design

- All UI must be responsive and tested across devices (BrowserStack/Percy)
- Support Chrome 100+, Firefox 100+, Safari 15+, Edge 100+, iOS Safari, Chrome Mobile

#### 12. Error Handling & Monitoring

- Centralized error boundaries and logging
- Integrate with Vercel Analytics and optional error tracking (Sentry)

#### 13. Security

- Input validation with Zod schemas
- CSRF protection
- Secure authentication
- Data encryption at rest and in transit

#### 14. Scalability

- Support for [X] concurrent users
- Handle [X] data points per visualization
- [X]% uptime SLA

#### 15. Integration Requirements

- **Data Sources:** External APIs for content, marketing, analytics, and revenue platforms
- **Authentication:** API keys, OAuth 2.0, service accounts
- **Analytics:** GA4, custom analytics, error tracking
- **Monitoring:** Vercel Analytics, optional Sentry integration

#### 16. API Integration Specifications

##### 16.1 Mailchimp Marketing API

**Purpose:** Email marketing campaign performance and audience insights

**API Documentation:** https://mailchimp.com/developer/marketing/api/reports/
**Base URL:** `https://[dc].api.mailchimp.com/3.0/`
**Authentication:** API Key

**Key Endpoints:**

- `GET /reports` - Campaign reports overview
- `GET /reports/{campaign_id}` - Detailed campaign performance
- `GET /reports/{campaign_id}/email-activity` - Email activity tracking
- `GET /reports/{campaign_id}/open-details` - Open rate details
- `GET /reports/{campaign_id}/click-details` - Click tracking details
- `GET /lists/{list_id}/members` - Audience member details
- `GET /campaigns` - Campaign list and basic stats

**Key Metrics:**

- Campaign performance: open rates, click rates, bounce rates
- Audience growth: subscribers, unsubscribes, engagement
- Revenue tracking: e-commerce integration data
- Geographic and demographic insights
- A/B testing results

**Environment Variables:**

```
MAILCHIMP_API_KEY="your-api-key-datacenter"
MAILCHIMP_SERVER_PREFIX="us1" # extracted from API key
```

**Rate Limits:** 10 requests per second per API key
**Data Retention:** Real-time API calls only, no local caching for MVP

**Intentionally Excluded Endpoints:**

- `GET /lists/{list_id}` - Single audience detail
  - **Rationale:** Returns identical data to the list audiences endpoint (`GET /lists`)
  - **Decision:** Not implemented to maintain MVP focus and avoid redundant complexity
  - **Future Consideration:** If individual audience detail pages become necessary, prioritize endpoints that provide actual additional value (member management, campaign history, growth analytics)

##### 16.2 Google Analytics 4 (Future Implementation)

**Purpose:** Website traffic, user behavior, and conversion tracking
**API Documentation:** https://developers.google.com/analytics/devguides/reporting/data/v1
**Authentication:** Service Account JSON key

##### 16.3 YouTube Analytics API (Future Implementation)

**Purpose:** Video performance, subscriber growth, revenue metrics
**API Documentation:** https://developers.google.com/youtube/analytics
**Authentication:** OAuth 2.0

##### 16.4 Meta Graph API (Future Implementation)

**Purpose:** Social media insights, page performance, audience engagement
**API Documentation:** https://developers.facebook.com/docs/graph-api
**Authentication:** App Access Token

##### 16.5 WordPress REST API (Future Implementation)

**Purpose:** Content performance, post analytics, SEO insights
**API Documentation:** https://developer.wordpress.org/rest-api/
**Authentication:** Application Passwords or JWT

##### 16.6 Google Search Console API (Future Implementation)

**Purpose:** Search performance, SEO insights, indexing status
**API Documentation:** https://developers.google.com/webmaster-tools/search-console-api-original
**Authentication:** Service Account JSON key

---

## User Experience & Design

<!-- 📝 STAGE 5: UX/UI requirements -->

### Design Principles

1. **Clarity & Simplicity**
   - Prioritize clear, concise presentation of key metrics and insights.
   - Use plain language and intuitive layouts to minimize cognitive load.

2. **Efficiency & Focus**
   - Streamline workflows so users can accomplish tasks quickly.
   - Surface the most relevant information and actions for each user role.

3. **Consistency**
   - Maintain uniform navigation, visual styles, and interaction patterns across all dashboards and features.
   - Reuse UI components and design tokens for a cohesive experience.

4. **Accessibility**
   - Ensure all features are usable by people with disabilities (WCAG 2.1 AA).
   - Support keyboard navigation, screen readers, and high-contrast modes.

5. **Responsiveness**
   - Design for mobile-first, ensuring usability across devices and screen sizes.

6. **Customizability**
   - Allow users to personalize dashboard layouts and widgets to fit their needs.

7. **Feedback & Guidance**
   - Provide immediate, clear feedback for user actions (loading, errors, success).
   - Offer contextual help, tooltips, and onboarding guides.

8. **Security & Trust**
   - Visually communicate data privacy and security, especially around sensitive information.

9. **Scalability**
   - Design components and layouts to gracefully handle increasing data, users, and features.

10. **Delight**
    - Incorporate subtle animations, micro-interactions, and thoughtful details to make the experience enjoyable.

### UI Requirements

#### Layout

- [ ] Modular dashboard layouts supporting future customization (widgets, panels)
      ✅ Persistent navigation (main menu, breadcrumbs) for easy orientation
- [ ] Clear sectioning and whitespace to guide attention and reduce clutter
- [ ] Support multi-dashboard views for users with access to multiple data sources
- [ ] Responsive design (mobile-first approach)
- [ ] Consistent navigation across all pages
- [ ] Clear information hierarchy
      ✅ Customizable dashboard layouts

#### Visual Design

- [ ] Scalable design system (e.g., shadcn/ui) for consistent UI elements
- [ ] Support both light and dark themes, with user preference persistence
- [ ] Visual cues (icons, badges, color) to indicate status, alerts, and actionable items
- [ ] All charts and tables are visually accessible and readable
- [ ] Consistent color palette and typography
- [ ] High contrast ratios for accessibility (4.5:1 minimum)
- [ ] Clear visual feedback for interactions
- [ ] Loading states and error handling
- [ ] Use Tailwind CSS theme variables for colors, spacing, and typography
- [ ] Minimize use of inline styles; prefer utility classes and theme variables for maintainability
- [ ] Prioritize the use of the Lucide icon library for all icons

### Interaction Patterns

- [ ] Keyboard navigation support
- [ ] Keyboard shortcuts for power users (e.g., navigation, actions)
- [ ] Touch-friendly mobile interactions
- [ ] Drag-and-drop functionality (where applicable)
- [ ] Undo/redo for configurable dashboard actions
- [ ] Progressive disclosure for advanced features (hide complexity for basic users)
- [ ] Inline editing and quick actions where appropriate (future releases)
- [ ] Clear focus states and ARIA roles for all interactive elements
- [ ] Contextual help and tooltips

### Feedback & Guidance

- [ ] Contextual help, onboarding guides, and tooltips for new users
- [ ] Real-time feedback for loading, errors, and successful actions
- [ ] Skeleton screens or shimmer effects for loading states

### Accessibility

- [ ] All UI elements accessible via keyboard and screen readers
- [ ] High-contrast mode and text scaling support
- [ ] Color contrast and focus indicators validated in all components

---

### Responsiveness

- [ ] Optimized layouts for mobile, tablet, and desktop
- [ ] Tested and supported on major browsers and devices as listed in technical requirements

### Security & Privacy

- [ ] Visual indication of secure areas and sensitive data
- [ ] Clear feedback for authentication and permission errors

## Performance & Accessibility

<!-- 📝 STAGE 6: Quality requirements -->

### Performance Requirements

#### Core Web Vitals Targets

- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

#### Additional Metrics

- First Contentful Paint (FCP): < 1.8s
- Time to Interactive (TTI): < 3.5s
- Bundle size: < 500KB initial load
- API response time: < 500ms for dashboard data
- Dashboard render time: < 1s after data load

#### General Requirements

- Use Next.js Image component for optimized image delivery
- Implement code splitting and lazy loading for large modules
- Cache API responses where possible (client/server)
- Minimize third-party script impact on load and interactivity
- Monitor and optimize bundle size regularly
- Use performance hooks and analytics (Web Vitals, Vercel Analytics)
- Support real-time updates for key metrics with minimal latency
- Ensure smooth transitions and animations (no jank)
- Test performance across supported browsers/devices
- Set up alerts for performance regressions (CI/CD integration)

### Accessibility Requirements (WCAG 2.1 AA)

#### General Requirements

- Adhere to WCAG 2.1 AA standards for all UI and content
- Test accessibility using automated tools (jest-axe, Storybook a11y addon) and manual audits
- Include accessibility checks in CI/CD pipelines

#### Perceivable

- Provide descriptive alt text for all images and icons
- Ensure sufficient color contrast (minimum 4.5:1 for text)
- Support text resizing up to 200% without loss of content or functionality
- Use captions and transcripts for multimedia content

#### Operable

- Ensure full keyboard navigation for all interactive elements
- Avoid content that can trigger seizures (no flashing, strobing)
- Provide clear focus indicators for all actionable items
- Support skip navigation links for screen readers

#### Understandable

- Use clear, simple language throughout the UI
- Ensure consistent navigation and predictable interactions
- Provide error messages that are easy to understand and actionable

#### Robust

- Use semantic HTML and ARIA roles/attributes appropriately
- Ensure compatibility with major screen readers (VoiceOver, NVDA, JAWS)
- Test across supported browsers and devices

#### Specific Features

- High contrast mode toggle
- ARIA labels and descriptions for all controls
- Live region announcements for dynamic content updates
- Accessible forms with labels, instructions, and error feedback
- Support for keyboard shortcuts and alternative input methods

#### Monitoring & Feedback

- Collect user feedback on accessibility issues
- Track accessibility metrics and improvements over time

---

## Success Metrics

<!-- 📝 STAGE 7: How we measure success -->

### Key Performance Indicators (KPIs)

#### User Engagement

- [ ] **Daily Active Users (DAU):** [Target number]
- [ ] **Session Duration:** [Target time]
- [ ] **Feature Adoption Rate:** [Target percentage]
- [ ] **User Retention:** [Target percentage after 30 days]

#### Performance

##### Performance KPIs (MVP)

- [ ] Page Load Speed: < 2 seconds for initial dashboard load
- [ ] API Response Time: < 500ms for all dashboard data requests
- [ ] Dashboard Render Time: < 1 second after data is received
- [ ] Error Rate: < 1% failed API requests or UI errors
- [ ] Uptime: 99.9% availability during development/testing
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Bundle Size: < 500KB for initial load
- [ ] Performance Score: 95+ Lighthouse score for performance
- [ ] Loading State Duration: < 1s for visible loading indicators
- [ ] Resource Usage: Monitor and minimize memory and CPU usage in browser

#### Business Impact

- [ ] **Time to Insight:** [Reduction in time to get insights]
- [ ] **User Satisfaction:** [Target satisfaction score]
- [ ] **Cost Reduction:** [Target savings vs. current solution]

### Analytics & Monitoring

- [ ] Google Analytics 4 implementation
- [ ] Custom event tracking for feature usage
- [ ] Performance monitoring with Web Vitals
- [ ] Error tracking and alerting
- [ ] User feedback collection system

---

### Timeline & Milestones

- **August/September 2025:** Modularize Mailchimp schemas in `src/schemas/mailchimp/` and document conventions for other data sources. Use this as a template for future integrations.
  [...existing content...]

### Development Phases

#### Phase 1: Foundation (Weeks 1-2)

- Set up project repository, CI/CD, and environment management (Vercel, dotenv, pnpm)
- Establish code quality gates (ESLint, Prettier, Husky)
- Implement basic UI shell with shadcn/ui and Tailwind theme variables
- Configure real API connections for key data sources (no mock endpoints)
- **Deliverable:** Working basic layout, real API data connections, and code quality pipeline

#### Phase 2: Core Features (Weeks 3-6)

- Build modular dashboard layouts and navigation (main menu, breadcrumbs)
- Implement independent dashboards for each data source (read-only, live API fetch)
- Add basic charting and tabular views for key metrics
- Integrate error handling, loading states, and minimal theming (light/dark mode)
- Document setup and usage (README, Storybook, TypeDoc)
- **Deliverable:** MVP dashboard with core features, tested and documented

#### Phase 3: Enhancement (Weeks 7-8)

- Optimize performance (Core Web Vitals, bundle size, API response time)
- Improve accessibility (WCAG 2.1 AA, jest-axe, Storybook a11y)
- Add mobile responsiveness and cross-browser/device testing (BrowserStack/Percy)
- Prepare for multi-language support (next-intl/i18next)
- **Deliverable:** Feature-complete, performant, and accessible dashboard

#### Phase 4: Polish & Launch (Weeks 9-10)

- Conduct user testing and collect feedback
- Refine UI/UX, fix bugs, and finalize documentation
- Set up analytics and monitoring (Web Vitals, GA4, error tracking)
- Prepare training materials and onboarding guides
- **Deliverable:** Production-ready application, ready for launch

---

### Advanced Features (Post-MVP)

#### Phase 5: Multi-User & Customization (Weeks 11-14)

- Implement multi-user support with SSO and role-based permissions
- Enable dashboard customization (layouts, widgets, user preferences)
- Add export options (CSV, PDF) and notification integrations (email, Slack)
- **Deliverable:** Multi-user, customizable dashboards with enhanced collaboration

#### Phase 6: Multi-Company & Advanced Integrations (Weeks 15+)

- Support multi-company architecture and independent data source management
- Integrate additional platforms and advanced analytics (AI-powered insights, trend analysis)
- Enable white-labeling and API for third-party integrations
- **Deliverable:** Scalable, extensible platform supporting advanced use cases

#### Phase 1: Foundation (Weeks 1-2)

- [ ] Project setup and architecture
- [ ] Basic UI components and design system
- [ ] Authentication implementation
- [ ] **Deliverable:** Working authentication and basic layout

#### Phase 2: Core Features (Weeks 3-6)

- [ ] Dashboard layout and navigation
- [ ] Data visualization components
- [ ] Core dashboard functionality
- [ ] **Deliverable:** MVP dashboard with key features

#### Phase 3: Enhancement (Weeks 7-8)

- [ ] Advanced features
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] **Deliverable:** Feature-complete dashboard

#### Phase 4: Polish & Launch (Weeks 9-10)

- [ ] User testing and feedback
- [ ] Bug fixes and refinements
- [ ] Documentation and training materials
- [ ] **Deliverable:** Production-ready application

### Key Milestones

- [ ] **Week 2:** Foundation complete
- [ ] **Week 4:** Core features demo
- [ ] **Week 6:** MVP ready for testing
- [ ] **Week 8:** Feature-complete version
- [ ] **Week 10:** Production launch

---

## Risks & Mitigation

<!-- 📝 STAGE 9: Risk management -->

### Technical Risks

#### Risk 1: Data Source Integration Complexity

- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Prioritize integration of platforms with robust APIs first; allocate buffer time for poorly documented or unstable APIs; use typed fetchers and centralized error handling; maintain clear API documentation.

#### Risk 2: API Rate Limits and Data Availability

- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Implement caching and retry logic; monitor API usage; communicate with platform providers for increased limits if needed; provide fallback messaging for unavailable data.

#### Risk 3: Performance Bottlenecks (Dashboard Load, API Response)

- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Optimize data fetching and rendering; use code splitting, lazy loading, and caching; monitor Core Web Vitals; set up performance alerts in CI/CD.

#### Risk 4: Accessibility Compliance

- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Integrate automated accessibility testing (jest-axe, Storybook a11y); conduct manual audits; include accessibility checks in CI/CD pipeline.

---

### Business Risks

#### Risk 1: Low User Adoption or Engagement

- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Conduct early user testing and feedback sessions; iterate on UI/UX; provide onboarding guides and contextual help; track feature adoption and satisfaction metrics.

#### Risk 2: Changing Requirements or Scope Creep

- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Maintain a clear MVP scope; use agile planning and regular stakeholder reviews; document and prioritize new requests for future phases.

#### Risk 3: Data Privacy and Security Breaches

- **Impact:** High
- **Probability:** Low
- **Mitigation:** Use environment variables for secrets; validate inputs with Zod; follow best practices for authentication and encryption; conduct regular security reviews.

---

### Resource Risks

#### Risk 1: Timeline Delays Due to Integration or Testing Issues

- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Build in buffer time for integration and QA; parallelize development where possible; automate testing and deployment; monitor progress against milestones.

#### Risk 2: Limited Team Capacity or Skill Gaps

- **Impact:** Medium
- **Probability:** Low
- **Mitigation:** Provide clear documentation and onboarding for new contributors; leverage open-source tools and community support; allocate time for learning and upskilling.

---

## Future Considerations

<!-- 📝 STAGE 10: Long-term vision -->

### Advanced Analytics & AI

- Implement predictive analytics and machine learning models for forecasting trends and identifying opportunities.
- Integrate AI-powered insights and recommendations for content and revenue optimization.
- Explore natural language processing for automated report generation and sentiment analysis.

### Data Source Expansion

- Add support for additional platforms (e.g., TikTok, LinkedIn, Shopify, Stripe, custom APIs).
- Enable plug-and-play integration for new data sources via configuration or marketplace.

### Multi-Tenancy & White-Labeling

- Architect for multi-tenant deployments to support multiple organizations with isolated data.
- Develop white-label capabilities for custom branding and client-specific dashboards.

### Internationalization & Localization

- Expand language support and localization for global user bases.
- Adapt UI and reporting formats for regional compliance and preferences.

### API & Extensibility

- Provide public APIs for third-party integrations and custom widgets.
- Build a developer portal with documentation and sandbox environments.

### Mobile & Offline Support

- Develop native mobile apps or progressive web app (PWA) features for enhanced mobile experience.
- Explore offline data access and sync for field teams or remote users.

### Security & Compliance

- Prepare for advanced compliance needs (GDPR, SOC2, HIPAA, etc.).
- Implement advanced audit logging, data retention policies, and user activity tracking.

### Performance & Scalability

- Plan for horizontal scaling and distributed data processing.
- Monitor and optimize for high concurrency and large datasets.

### User Experience Enhancements

- Add advanced customization (drag-and-drop, dashboard templates, automation rules).
- Integrate voice commands or chat-based interfaces for accessibility and productivity.

### Community & Ecosystem

- Build a community forum or feedback portal for user-driven feature requests.
- Launch a plugin or extension marketplace for custom dashboard modules.

---

## Appendices

[The following items are suggested for comprehensive project documentation and future reference.]

### A. Research Data

- User research summaries, interview notes, survey results
- Competitive analysis and market research
- Links to relevant industry reports and benchmarks

### B. Technical Specifications

- Detailed API specifications and endpoint documentation
- Data models and schema diagrams
- Integration guides for supported platforms
- Environment variable reference
- Architecture diagrams and infrastructure notes

### C. Design Assets

- Wireframes, mockups, and prototypes
- Design system documentation (tokens, components, patterns)
- Accessibility audit reports
- Branding guidelines and icon library references

### D. Stakeholder Feedback

- Meeting notes and decision logs from stakeholder reviews
- User testing feedback and action items
- Feature request backlog and prioritization notes

### E. Testing & QA

- Test plans and coverage reports (unit, integration, accessibility)
- Manual QA checklists and bug reports
- CI/CD pipeline configuration and status logs

### F. Deployment & Operations

- Deployment guides and runbooks
- Monitoring and alerting setup documentation
- Performance and analytics dashboards
- Security review and compliance documentation

---

**Document History:**

- v1.0 (Aug 24, 2025): Initial PRD structure created
- [Future versions will be tracked here]
