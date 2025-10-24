# Mailchimp API Coverage

This file tracks which Mailchimp API endpoints have been implemented in the Fichaz dashboard.

**Legend:**

- ✅ Implemented and working
- 🚧 In progress
- ⭐ Priority for next implementation
- 📋 Planned
- 🔒 Requires authentication/write permissions (future consideration)

---

## File Manager API

File storage and asset management endpoints.

- 📋 **List Stored Files** - `GET /file-manager/files`
  - Features: File library, asset management
  - **Priority 4:** Asset management feature

---

## Landing Pages API

Landing page creation and management endpoints.

- 📋 **List Landing Pages** - `GET /landing-pages`
  - Features: Landing page list
  - **Priority 3:** Landing page management

- 🔒 **Add Landing Page** - `POST /landing-pages`
  - **Priority 5:** Write operation (future)

- 📋 **Get Landing Page Info** - `GET /landing-pages/{page_id}`
  - Features: Landing page details
  - **Priority 3:** Landing page analytics

- 🔒 **Update Landing Page** - `PATCH /landing-pages/{page_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Landing Page** - `DELETE /landing-pages/{page_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Publish Landing Page** - `POST /landing-pages/{page_id}/actions/publish`
  - **Priority 5:** Write operation (future)

- 🔒 **Unpublish Landing Page** - `POST /landing-pages/{page_id}/actions/unpublish`
  - **Priority 5:** Write operation (future)

### Landing Page Content

- 📋 **Get Landing Page Content** - `GET /landing-pages/{page_id}/content`
  - Features: Landing page HTML content
  - **Priority 4:** Content preview

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

- ✅ **List Domain Performance Stats** - `GET /reports/{campaign_id}/domain-performance`
  - Route: `/mailchimp/reports/[id]/domain-performance`
  - Features: Email provider performance breakdown (Gmail, Outlook, etc.)

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

- 🔒 **Add List** - `POST /lists`
  - Features: Create new audience list
  - **Priority 5:** Write operation (future)

- ✅ **Get List Info** - `GET /lists/{list_id}`
  - Route: `/mailchimp/lists/[id]`
  - Features: Detailed list information, stats

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

- ✅ **List Recent Activity** - `GET /lists/{list_id}/activity`
  - Route: `/mailchimp/lists/[id]/activity`
  - Features: Recent list activity timeline, pagination, daily metrics

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

- ✅ **List Growth History Data** - `GET /lists/{list_id}/growth-history`
  - Route: `/mailchimp/lists/[id]/growth-history`
  - Features: Historical growth data, monthly metrics, pagination

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

- ✅ **List Members Info** - `GET /lists/{list_id}/members`
  - Route: `/mailchimp/lists/[id]/members`
  - Features: Pagination, filtering, member details, engagement stats
  - Status tracking with badges, star ratings, VIP indicators

- 🔒 **Add Member to List** - `POST /lists/{list_id}/members`
  - **Priority 5:** Write operation (future)

- ✅ **Get Member Info** - `GET /lists/{list_id}/members/{subscriber_hash}`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]`
  - Features: Complete member profile, subscription status, engagement statistics, tags, marketing permissions, location data
  - Member rating display, VIP indicators, timeline view

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

## Reporting API

Facebook Ads, Landing Pages, and Survey reporting.

### Facebook Ads

- 📋 **List Facebook Ads Reports** - `GET /reporting/facebook-ads`
  - Features: Facebook Ads campaign reporting
  - **Priority 4:** Social media integration

- 📋 **Get Facebook Ad Report** - `GET /reporting/facebook-ads/{outreach_id}`
  - Features: Individual Facebook Ad report
  - **Priority 4:** Low priority

- 📋 **List Facebook Ecommerce Report** - `GET /reporting/facebook-ads/{outreach_id}/ecommerce-product-activity`
  - Features: Facebook Ads ecommerce product performance
  - **Priority 4:** E-commerce integration

### Landing Pages

- 📋 **List Landing Pages Reports** - `GET /reporting/landing-pages`
  - Features: Landing page performance
  - **Priority 3:** Conversion tracking

- 📋 **Get Landing Page Report** - `GET /reporting/landing-pages/{outreach_id}`
  - Features: Individual landing page report
  - **Priority 3:** Drill-down details

### Survey Question Answers

- 📋 **List Answers for Question** - `GET /reporting/surveys/{survey_id}/questions/{question_id}/answers`
  - Features: Survey question responses
  - **Priority 4:** Survey analytics

### Survey Questions

- 📋 **List Survey Question Reports** - `GET /reporting/surveys/{survey_id}/questions`
  - Features: Survey questions list
  - **Priority 4:** Survey analytics

- 📋 **Get Survey Question Report** - `GET /reporting/surveys/{survey_id}/questions/{question_id}`
  - Features: Individual question report
  - **Priority 4:** Survey analytics

### Survey Responses

- 📋 **List Survey Responses** - `GET /reporting/surveys/{survey_id}/responses`
  - Features: Survey response data
  - **Priority 4:** Survey analytics

- 📋 **Get Survey Response** - `GET /reporting/surveys/{survey_id}/responses/{response_id}`
  - Features: Individual survey response
  - **Priority 4:** Survey analytics

### Surveys

- 📋 **List Survey Reports** - `GET /reporting/surveys`
  - Features: All survey reports
  - **Priority 4:** Survey analytics

- 📋 **Get Survey Report** - `GET /reporting/surveys/{survey_id}`
  - Features: Survey summary statistics
  - **Priority 4:** Survey analytics

---

## Search API

Search endpoints for campaigns and members.

### Search Campaigns

- 📋 **Search Campaigns** - `GET /search-campaigns`
  - Features: Search across all campaigns
  - **Priority 3:** Campaign discovery

### Search Members

- 📋 **Search Members** - `GET /search-members`
  - Features: Search across all list members
  - **Priority 2:** Member discovery

---

## Template Folders API

Template organization endpoints.

- 📋 **List Template Folders** - `GET /template-folders`
  - Features: Template folder list
  - **Priority 4:** Template management

- 🔒 **Create Template Folder** - `POST /template-folders`
  - **Priority 5:** Write operation (future)

- 📋 **Get Template Folder** - `GET /template-folders/{folder_id}`
  - Features: Template folder details
  - **Priority 4:** Low priority

- 🔒 **Update Template Folder** - `PATCH /template-folders/{folder_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Template Folder** - `DELETE /template-folders/{folder_id}`
  - **Priority 5:** Write operation (future)

---

## Templates API

Email template management endpoints.

- 📋 **List Templates** - `GET /templates`
  - Features: Template library
  - **Priority 3:** Template management

- 🔒 **Create Template** - `POST /templates`
  - **Priority 5:** Write operation (future)

- 📋 **Get Template Info** - `GET /templates/{template_id}`
  - Features: Template details
  - **Priority 4:** Low priority

- 🔒 **Update Template** - `PATCH /templates/{template_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Template** - `DELETE /templates/{template_id}`
  - **Priority 5:** Write operation (future)

- 📋 **View Default Content** - `GET /templates/{template_id}/default-content`
  - Features: Template default content
  - **Priority 4:** Low priority

---

## Verified Domains API

Domain verification and management.

- 📋 **List Verified Domains** - `GET /verified-domains`
  - Features: Verified sending domains
  - **Priority 3:** Deliverability tracking

- 🔒 **Add Domain to Account** - `POST /verified-domains`
  - **Priority 5:** Write operation (future)

- 📋 **Get Domain Info** - `GET /verified-domains/{domain_name}`
  - Features: Domain verification status
  - **Priority 4:** Low priority

- 🔒 **Delete Domain** - `DELETE /verified-domains/{domain_name}`
  - **Priority 5:** Write operation (future)

- 🔒 **Verify Domain** - `POST /verified-domains/{domain_name}/actions/verify`
  - **Priority 5:** Write operation (future)

---

## Implementation Stats

**Current Coverage (Read-Only Endpoints):**

- ✅ Implemented: 16 endpoints
- ⭐ Priority 1 (Next): 1 endpoint (List Segments)
- ⭐ Priority 2: ~5 endpoints (Search members, member tags, notes, goals)
- ⭐ Priority 3: ~23 endpoints (Member details, analytics, landing pages)
- 📋 Priority 4: ~45 endpoints (surveys, templates, webhooks, drill-downs)
- 🔒 Write Operations: ~50 endpoints (future consideration)

**Total Progress (Read-Only):** 16/100+ read endpoints (~16%)

**Recent Implementations:**

- Get Member Info (complete member profile with engagement stats and timeline)
- List Members (view and manage list members with filtering and engagement stats)
- List Growth History (monthly subscriber growth trends and metrics)
- List Activity (daily activity timeline with engagement metrics)
- Domain Performance (email provider performance breakdown)
- Campaign Advice (performance recommendations with sentiment icons)
- Campaign Locations (geographic engagement data)
- Campaign Recipients/Sent To (recipient delivery status)
- Campaign Email Activity (subscriber activity timeline)
- Campaign Unsubscribes (unsubscribe tracking)

**Focus Areas:**

1. **Current Sprint:** Core list management (Members, Member Details, Segments)
2. **Next Sprint:** Search functionality, Landing pages, List analytics
3. **Future Sprint:** Templates, Survey reporting, Advanced member features
4. **Long-term:** Drill-down details, write operations, advanced features

**API Coverage by Section:**

- Reports API: 12/28 endpoints (43%)
- Lists API: 6/45 endpoints (13%)
- Reporting API: 0/15 endpoints (0%)
- Search API: 0/2 endpoints (0%)
- Landing Pages: 0/8 endpoints (0%)
- Template Folders: 0/5 endpoints (0%)
- Templates: 0/6 endpoints (0%)
- Verified Domains: 0/5 endpoints (0%)
- File Manager: 0/1 endpoint (0%)
- Ping API: 0/1 endpoint (0%)

---

## Recommended Next Implementation

### 🎯 Top Priority Endpoints:

**1. List Members** (`GET /lists/{list_id}/members`) ⭐⭐⭐

- **Value:** Core member management - browse, search, filter list members
- **Complexity:** High (filtering, search, pagination, status management)
- **User Benefit:** Essential for audience management and member lookup
- **Route:** `/mailchimp/lists/[id]/members`
- **Status:** Not yet implemented
- **Why Important:** Foundation for 10+ member-related endpoints (details, activity, tags, notes, goals)
- **Unlocks:** Member detail pages, member activity tracking, tag management, segmentation

**After List Members - Logical Progression:**

**2. Get Member Info** (`GET /lists/{list_id}/members/{subscriber_hash}`) ⭐⭐

- **Value:** Member detail page with full profile
- **Complexity:** Medium (profile display, merge fields, status history)
- **Depends On:** List Members (drill-down from members table)
- **Route:** `/mailchimp/lists/[id]/members/[subscriber_hash]`

**3. List Segments** (`GET /lists/{list_id}/segments`) ⭐⭐

- **Value:** Audience segmentation for targeted campaigns
- **Complexity:** Medium (segment list, member counts, conditions)
- **Route:** `/mailchimp/lists/[id]/segments`
- **Why Important:** Core feature for audience targeting

**Alternative Considerations:**

**Landing Pages** (`GET /landing-pages`) - NEW from endpoint review

- Interesting feature for conversion tracking
- Lower priority than member management
- Can be implemented after Lists section is complete

**Search Members** (`GET /search-members`)

- Global search across all lists
- Complements List Members but not essential first
- Better after member detail pages exist

**List Locations** (`GET /lists/{list_id}/locations`)

- Geographic distribution analytics
- Similar pattern to campaign locations (already implemented)
- Could be quick win for analytics

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

**Last Updated:** 2025-01-23 (Added File Manager, Landing Pages, expanded Reporting API sections)
**Maintained By:** Development team + AI assistants

---

## Summary of New Endpoints Added

This update adds comprehensive coverage of previously undocumented Mailchimp API endpoints:

**New Sections:**

- **File Manager API** - 1 endpoint for asset management
- **Landing Pages API** - 8 endpoints for landing page creation and management

**Expanded Sections:**

- **Reporting API** - Added 8 survey-related endpoints (questions, responses, answers)
- **Facebook Ads** - Added ecommerce product activity endpoint

**Total New Endpoints Documented:** +18 endpoints

These additions bring the total tracked API surface to **115+ endpoints** (65 read-only, 50+ write operations).
