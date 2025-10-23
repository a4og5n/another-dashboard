# Mailchimp API Coverage

This file tracks which Mailchimp API endpoints have been implemented in the Fichaz dashboard.

**Legend:**

- ✅ Implemented and working
- 🚧 In progress
- ⭐ Priority for next implementation
- 📋 Planned
- 🔒 Requires authentication/write permissions (future consideration)

---

## Reports API

Campaign reporting and analytics endpoints.

### Campaign Reports

- ✅ **List Campaign Reports** - `GET /reports`
  - Route: `/mailchimp/reports`
  - Features: Campaign list, pagination, filtering by status

- ✅ **Get Campaign Report** - `GET /reports/{campaign_id}`
  - Route: `/mailchimp/reports/[id]`
  - Features: Campaign metrics, performance overview

### Campaign Open Reports

- ✅ **List Campaign Open Details** - `GET /reports/{campaign_id}/open-details`
  - Route: `/mailchimp/reports/[id]/opens`
  - Features: Pagination, member details, open tracking

- 📋 **Get Opened Campaign Subscriber** - `GET /reports/{campaign_id}/open-details/{subscriber_hash}`
  - Route: `/mailchimp/reports/[id]/opens/[subscriber_hash]`
  - Features: Individual subscriber open details
  - **Priority 3:** Drill-down details

### Campaign Abuse

- ✅ **List Abuse Reports** - `GET /reports/{campaign_id}/abuse-reports`
  - Route: `/mailchimp/reports/[id]/abuse-reports`
  - Features: Pagination, abuse complaint tracking

- 📋 **Get Abuse Report** - `GET /reports/{campaign_id}/abuse-reports/{report_id}`
  - Route: `/mailchimp/reports/[id]/abuse-reports/[report_id]`
  - Features: Individual abuse report details
  - **Priority 4:** Low priority (rare use case)

### Campaign Advice

- ✅ **List Campaign Feedback** - `GET /reports/{campaign_id}/advice`
  - Route: `/mailchimp/reports/[id]/advice`
  - Features: Campaign feedback, Performance recommendations, Sentiment icons

### Click Reports

- ✅ **List Campaign Click Details** - `GET /reports/{campaign_id}/click-details`
  - Route: `/mailchimp/reports/[id]/clicks`
  - Features: Pagination, URL tracking, click metrics per link

- 📋 **Get Campaign Link Details** - `GET /reports/{campaign_id}/click-details/{link_id}`
  - Route: `/mailchimp/reports/[id]/clicks/[link_id]`
  - Features: Detailed click tracking for specific link
  - **Priority 3:** Drill-down details

### Click Reports Members

- 📋 **List Clicked Link Subscribers** - `GET /reports/{campaign_id}/click-details/{link_id}/members`
  - Route: `/mailchimp/reports/[id]/clicks/[link_id]/members`
  - Features: Members who clicked specific link
  - **Priority 3:** Advanced analytics

- 📋 **Get Clicked Link Subscriber** - `GET /reports/{campaign_id}/click-details/{link_id}/members/{subscriber_hash}`
  - Route: `/mailchimp/reports/[id]/clicks/[link_id]/members/[subscriber_hash]`
  - Features: Individual member click details
  - **Priority 4:** Low priority

### Domain Performance

- ⭐ **List Domain Performance Stats** - `GET /reports/{campaign_id}/domain-performance`
  - Route: `/mailchimp/reports/[id]/domain-performance`
  - Features: Email provider performance breakdown (Gmail, Outlook, etc.)
  - **Priority 1:** High value analytics

### Ecommerce Product Activity

- 📋 **List Campaign Product Activity** - `GET /reports/{campaign_id}/ecommerce-product-activity`
  - Route: `/mailchimp/reports/[id]/ecommerce`
  - Features: Product performance tracking
  - **Priority 4:** E-commerce specific

### EepURL Reports

- 📋 **List EepURL Activity** - `GET /reports/{campaign_id}/eepurl`
  - Route: `/mailchimp/reports/[id]/eepurl`
  - Features: Mailchimp short link tracking
  - **Priority 4:** Niche feature

### Email Activity

- ✅ **List Email Activity** - `GET /reports/{campaign_id}/email-activity`
  - Route: `/mailchimp/reports/[id]/email-activity`
  - Features: Pagination, detailed email activity per subscriber, action timeline

- 📋 **Get Subscriber Email Activity** - `GET /reports/{campaign_id}/email-activity/{subscriber_hash}`
  - Route: `/mailchimp/reports/[id]/email-activity/[subscriber_hash]`
  - Features: Individual subscriber activity timeline
  - **Priority 3:** Drill-down details

### Location

- ✅ **List Top Open Activities** - `GET /reports/{campaign_id}/locations`
  - Route: `/mailchimp/reports/[id]/locations`
  - Features: Pagination, geographic engagement data, flag emojis

### Sent To

- ✅ **List Campaign Recipients** - `GET /reports/{campaign_id}/sent-to`
  - Route: `/mailchimp/reports/[id]/sent-to`
  - Features: Pagination, recipient details, delivery status

- 📋 **Get Campaign Recipient Info** - `GET /reports/{campaign_id}/sent-to/{subscriber_hash}`
  - Route: `/mailchimp/reports/[id]/sent-to/[subscriber_hash]`
  - Features: Individual recipient details
  - **Priority 3:** Drill-down details

### Sub-Reports

- 📋 **List Child Campaign Reports** - `GET /reports/{campaign_id}/sub-reports`
  - Route: `/mailchimp/reports/[id]/sub-reports`
  - Features: A/B test variant reports
  - **Priority 3:** A/B testing analytics

### Unsubscribes

- ✅ **List Unsubscribed Members** - `GET /reports/{campaign_id}/unsubscribed`
  - Route: `/mailchimp/reports/[id]/unsubscribes`
  - Features: Pagination, unsubscribe tracking, campaign/list reasons

- 📋 **Get Unsubscribed Member** - `GET /reports/{campaign_id}/unsubscribed/{subscriber_hash}`
  - Route: `/mailchimp/reports/[id]/unsubscribes/[subscriber_hash]`
  - Features: Individual unsubscribe details
  - **Priority 4:** Low priority

---

## Lists API

Audience list management endpoints.

### List Management

- ✅ **Get Lists Info** - `GET /lists`
  - Route: `/mailchimp/lists`
  - Features: Pagination, all audience lists

- ✅ **Get List Info** - `GET /lists/{list_id}`
  - Route: `/mailchimp/lists/[id]`
  - Features: Detailed list information, stats

- 🔒 **Add List** - `POST /lists`
  - Features: Create new audience list
  - **Priority 5:** Write operation (future)

- 🔒 **Update Lists** - `PATCH /lists/{list_id}`
  - Features: Modify list settings
  - **Priority 5:** Write operation (future)

- 🔒 **Delete List** - `DELETE /lists/{list_id}`
  - Features: Remove audience list
  - **Priority 5:** Write operation (future)

- 🔒 **Batch Subscribe or Unsubscribe** - `POST /lists/{list_id}`
  - Features: Bulk member operations
  - **Priority 5:** Write operation (future)

### Abuse Reports

- 📋 **List Abuse Reports** - `GET /lists/{list_id}/abuse-reports`
  - Route: `/mailchimp/lists/[id]/abuse-reports`
  - Features: List-level abuse complaints
  - **Priority 3:** Compliance tracking

- 📋 **Get Abuse Report** - `GET /lists/{list_id}/abuse-reports/{report_id}`
  - Route: `/mailchimp/lists/[id]/abuse-reports/[report_id]`
  - Features: Individual abuse report details
  - **Priority 4:** Low priority

### Activity

- ⭐ **List Recent Activity** - `GET /lists/{list_id}/activity`
  - Route: `/mailchimp/lists/[id]/activity`
  - Features: Recent list activity timeline
  - **Priority 1:** High value overview

### Clients

- 📋 **List Top Email Clients** - `GET /lists/{list_id}/clients`
  - Route: `/mailchimp/lists/[id]/clients`
  - Features: Email client usage breakdown
  - **Priority 3:** Analytics insight

### Events

- 📋 **List Member Events** - `GET /lists/{list_id}/members/{subscriber_hash}/events`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/events`
  - Features: Custom event tracking
  - **Priority 4:** Advanced feature

- 🔒 **Add Event** - `POST /lists/{list_id}/members/{subscriber_hash}/events`
  - Features: Track custom events
  - **Priority 5:** Write operation (future)

### Growth History

- ⭐ **List Growth History Data** - `GET /lists/{list_id}/growth-history`
  - Route: `/mailchimp/lists/[id]/growth-history`
  - Features: Historical growth data, charts
  - **Priority 1:** Analytics visualization

- 📋 **Get Growth History by Month** - `GET /lists/{list_id}/growth-history/{month}`
  - Route: `/mailchimp/lists/[id]/growth-history/[month]`
  - Features: Month-specific growth details
  - **Priority 3:** Drill-down details

### Interest Categories

- 📋 **List Interest Categories** - `GET /lists/{list_id}/interest-categories`
  - Route: `/mailchimp/lists/[id]/interest-categories`
  - Features: Subscription preferences
  - **Priority 3:** Segmentation feature

- 🔒 **Add Interest Category** - `POST /lists/{list_id}/interest-categories`
  - **Priority 5:** Write operation (future)

- 📋 **Get Interest Category Info** - `GET /lists/{list_id}/interest-categories/{interest_category_id}`
  - **Priority 4:** Low priority

- 🔒 **Update Interest Category** - `PATCH /lists/{list_id}/interest-categories/{interest_category_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Interest Category** - `DELETE /lists/{list_id}/interest-categories/{interest_category_id}`
  - **Priority 5:** Write operation (future)

### Interests

- 📋 **List Interests in Category** - `GET /lists/{list_id}/interest-categories/{interest_category_id}/interests`
  - **Priority 3:** Segmentation feature

- 🔒 **Add Interest in Category** - `POST /lists/{list_id}/interest-categories/{interest_category_id}/interests`
  - **Priority 5:** Write operation (future)

- 📋 **Get Interest in Category** - `GET /lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}`
  - **Priority 4:** Low priority

- 🔒 **Update Interest in Category** - `PATCH /lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Interest in Category** - `DELETE /lists/{list_id}/interest-categories/{interest_category_id}/interests/{interest_id}`
  - **Priority 5:** Write operation (future)

### Locations

- 📋 **List Locations** - `GET /lists/{list_id}/locations`
  - Route: `/mailchimp/lists/[id]/locations`
  - Features: Geographic member distribution
  - **Priority 3:** Analytics insight

### Member Activity

- 📋 **View Recent Activity 50** - `GET /lists/{list_id}/members/{subscriber_hash}/activity`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/activity`
  - Features: Last 50 member activities
  - **Priority 3:** Member details

### Member Activity Feed

- 📋 **View Recent Activity** - `GET /lists/{list_id}/members/{subscriber_hash}/activity-feed`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/activity-feed`
  - Features: Complete activity timeline
  - **Priority 3:** Member details

### Member Goals

- 📋 **List Member Goal Events** - `GET /lists/{list_id}/members/{subscriber_hash}/goals`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/goals`
  - Features: Goal completion tracking
  - **Priority 4:** Advanced feature

### Member Notes

- 📋 **List Recent Member Notes** - `GET /lists/{list_id}/members/{subscriber_hash}/notes`
  - **Priority 3:** Member management

- 🔒 **Add Member Note** - `POST /lists/{list_id}/members/{subscriber_hash}/notes`
  - **Priority 5:** Write operation (future)

- 📋 **Get Member Note** - `GET /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 4:** Low priority

- 🔒 **Update Note** - `PATCH /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Note** - `DELETE /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 5:** Write operation (future)

### Member Tags

- 📋 **List Member Tags** - `GET /lists/{list_id}/members/{subscriber_hash}/tags`
  - **Priority 3:** Segmentation feature

- 🔒 **Add or Remove Member Tags** - `POST /lists/{list_id}/members/{subscriber_hash}/tags`
  - **Priority 5:** Write operation (future)

### Members

- ⭐ **List Members Info** - `GET /lists/{list_id}/members`
  - Route: `/mailchimp/lists/[id]/members`
  - Features: Pagination, filtering, search
  - **Priority 1:** Core member management

- 🔒 **Add Member to List** - `POST /lists/{list_id}/members`
  - **Priority 5:** Write operation (future)

- 📋 **Get Member Info** - `GET /lists/{list_id}/members/{subscriber_hash}`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]`
  - Features: Individual member details
  - **Priority 2:** Member profile page

- 🔒 **Add or Update List Member** - `PUT /lists/{list_id}/members/{subscriber_hash}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update List Member** - `PATCH /lists/{list_id}/members/{subscriber_hash}`
  - **Priority 5:** Write operation (future)

- 🔒 **Archive List Member** - `DELETE /lists/{list_id}/members/{subscriber_hash}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete List Member** - `POST /lists/{list_id}/members/{subscriber_hash}/actions/delete-permanent`
  - **Priority 5:** Write operation (future)

### Merge Fields

- 📋 **List Merge Fields** - `GET /lists/{list_id}/merge-fields`
  - **Priority 3:** Data customization

- 🔒 **Add Merge Field** - `POST /lists/{list_id}/merge-fields`
  - **Priority 5:** Write operation (future)

- 📋 **Get Merge Field** - `GET /lists/{list_id}/merge-fields/{merge_id}`
  - **Priority 4:** Low priority

- 🔒 **Update Merge Field** - `PATCH /lists/{list_id}/merge-fields/{merge_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Merge Field** - `DELETE /lists/{list_id}/merge-fields/{merge_id}`
  - **Priority 5:** Write operation (future)

### Segment Members

- 📋 **List Members in Segment** - `GET /lists/{list_id}/segments/{segment_id}/members`
  - **Priority 3:** Segmentation feature

- 🔒 **Add Member to Segment** - `POST /lists/{list_id}/segments/{segment_id}/members`
  - **Priority 5:** Write operation (future)

- 🔒 **Remove List Member from Segment** - `DELETE /lists/{list_id}/segments/{segment_id}/members/{subscriber_hash}`
  - **Priority 5:** Write operation (future)

### Segments

- 📋 **List Segments** - `GET /lists/{list_id}/segments`
  - Route: `/mailchimp/lists/[id]/segments`
  - Features: Audience segmentation
  - **Priority 2:** Segmentation overview

- 🔒 **Add Segment** - `POST /lists/{list_id}/segments`
  - **Priority 5:** Write operation (future)

- 📋 **Get Segment Info** - `GET /lists/{list_id}/segments/{segment_id}`
  - **Priority 3:** Segment details

- 🔒 **Delete Segment** - `DELETE /lists/{list_id}/segments/{segment_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Segment** - `PATCH /lists/{list_id}/segments/{segment_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Batch Add or Remove Members** - `POST /lists/{list_id}/segments/{segment_id}`
  - **Priority 5:** Write operation (future)

### Signup Forms

- 📋 **List Signup Forms** - `GET /lists/{list_id}/signup-forms`
  - **Priority 4:** Form management

- 🔒 **Customize Signup Form** - `POST /lists/{list_id}/signup-forms`
  - **Priority 5:** Write operation (future)

### Surveys

- 📋 **Get All Surveys for List** - `GET /lists/{list_id}/surveys`
  - **Priority 4:** Survey feature

- 📋 **Get Survey** - `GET /lists/{list_id}/surveys/{survey_id}`
  - **Priority 4:** Survey details

- 🔒 **Publish a Survey** - `POST /lists/{list_id}/surveys/{survey_id}/actions/publish`
  - **Priority 5:** Write operation (future)

- 🔒 **Unpublish a Survey** - `POST /lists/{list_id}/surveys/{survey_id}/actions/unpublish`
  - **Priority 5:** Write operation (future)

- 🔒 **Create a Survey Campaign** - `POST /lists/{list_id}/surveys/{survey_id}/actions/create-email`
  - **Priority 5:** Write operation (future)

### Tag Search

- 📋 **Search for Tags on List** - `GET /lists/{list_id}/tag-search`
  - **Priority 3:** Tag management

### Webhooks

- 📋 **List Webhooks** - `GET /lists/{list_id}/webhooks`
  - **Priority 4:** Integration feature

- 🔒 **Add Webhook** - `POST /lists/{list_id}/webhooks`
  - **Priority 5:** Write operation (future)

- 📋 **Get Webhook Info** - `GET /lists/{list_id}/webhooks/{webhook_id}`
  - **Priority 4:** Low priority

- 🔒 **Delete Webhook** - `DELETE /lists/{list_id}/webhooks/{webhook_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Webhook** - `PATCH /lists/{list_id}/webhooks/{webhook_id}`
  - **Priority 5:** Write operation (future)

---

## Ping API

Health check endpoint.

- 📋 **Ping** - `GET /ping`
  - Route: `/api/mailchimp/ping`
  - Features: API connectivity test
  - **Priority 3:** Health monitoring

---

## Implementation Stats

**Current Coverage (Read-Only Endpoints):**

- ✅ Implemented: 11 endpoints
- ⭐ Priority 1 (Next): 3 endpoints (Domain Performance, List Activity, Growth History, List Members)
- 📋 Priority 2-4: 40+ endpoints
- 🔒 Write Operations: 30+ endpoints (future consideration)

**Total Progress (Read-Only):** 11/54+ read endpoints (~20%)

**Recent Implementations:**

- Campaign Advice (performance recommendations with sentiment icons)
- Campaign Locations (geographic engagement data)
- Campaign Recipients/Sent To (recipient delivery status)
- Campaign Email Activity (subscriber activity timeline)
- Campaign Unsubscribes (unsubscribe tracking)
- Campaign Clicks (click tracking per link)

**Focus Areas:**

1. **Current Sprint:** Complete high-value Reports endpoints (Domain Performance)
2. **Next Sprint:** Lists API analytics (Activity, Growth History, Members)
3. **Future:** Drill-down details, write operations, advanced features

---

## Recommended Next Implementation

### 🎯 Top 3 Priority Endpoints:

**1. Domain Performance** (`GET /reports/{campaign_id}/domain-performance`) ⭐⭐⭐

- **Value:** Shows which email providers perform best (Gmail vs Outlook vs Yahoo)
- **Complexity:** Low (similar to locations endpoint)
- **User Benefit:** Critical insight for email deliverability optimization
- **Route:** `/mailchimp/reports/[id]/domain-performance`

**2. List Activity** (`GET /lists/{list_id}/activity`) ⭐⭐⭐

- **Value:** Recent activity timeline for list (subscribes, unsubscribes, profile updates)
- **Complexity:** Medium (timeline display)
- **User Benefit:** Quick overview of list health and engagement
- **Route:** `/mailchimp/lists/[id]/activity`

**3. List Growth History** (`GET /lists/{list_id}/growth-history`) ⭐⭐⭐

- **Value:** Historical growth data with charts
- **Complexity:** Medium (data visualization with charts)
- **User Benefit:** Track audience growth trends over time
- **Route:** `/mailchimp/lists/[id]/growth-history`

**4. List Members** (`GET /lists/{list_id}/members`) ⭐⭐

- **Value:** Core member management and search
- **Complexity:** High (filtering, search, pagination)
- **User Benefit:** Essential for audience management
- **Route:** `/mailchimp/lists/[id]/members`

---

## AI-First Workflow

When implementing a new endpoint, follow the improved workflow in CLAUDE.md:

### Phase 1: Schema Creation & Review ✋

1. AI analyzes Mailchimp API docs for the endpoint
2. AI creates Zod schemas (params, success, error)
3. AI presents schemas for review
4. **⏸️ STOP** - User reviews and approves

### Phase 2: Page Generation 🚀

5. AI adds PageConfig to registry
6. AI runs generator programmatically
7. AI implements proper types and components
8. AI runs validation (type-check, lint, tests)

### Phase 2.5: Commit Phase 2 (LOCAL ONLY) ⏸️

9. AI commits to LOCAL branch only
10. **⏸️ STOP** - Present commit to user

### Phase 2.75: User Review & Testing (REQUIRED) ⏸️

11. User tests page with real Mailchimp data
12. User verifies schemas match actual API responses
13. User identifies improvements (if needed)
14. AI implements improvements on LOCAL branch
15. Repeat until user says "ready to push"

### Phase 3: Push & Create PR (After Explicit Approval)

16. AI pushes to origin and creates PR
17. AI presents PR for user review

---

## Quick Commands

```bash
# Generate a new page (interactive)
pnpm generate:page

# Run tests after implementation
pnpm test

# Type-check
pnpm type-check

# Format code
pnpm format

# Pre-commit validation
pnpm pre-commit
```

---

**Last Updated:** 2025-10-23
**Maintained By:** Development team + AI assistants
