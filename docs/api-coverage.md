# Mailchimp API Coverage

This file tracks which Mailchimp API endpoints have been implemented in the Fichaz dashboard.

**Legend:**

- ✅ Implemented and working
- 🚧 In progress
- ⭐ Priority for next implementation
- 📋 Planned
- 🔒 Requires authentication/write permissions (future consideration)

---

## API Root

Core API information endpoint.

- 📋 **API Root** - `GET /`
  - Features: API version, health status, account info
  - **Priority 3:** API information

---

## Account Exports

Account data export endpoints.

- 📋 **List Account Exports** - `GET /account-exports`
  - Features: List of all account exports
  - **Priority 4:** Data export feature

- 🔒 **Add Export** - `POST /account-exports`
  - **Priority 5:** Write operation (future)

- 📋 **Get Account Export Info** - `GET /account-exports/{export_id}`
  - Features: Individual export status and details
  - **Priority 4:** Data export feature

---

## Audiences (BETA)

Beta audience management endpoints.

- 📋 **List Audiences** - `GET /audiences` ⚠️ **BETA**
  - Features: Beta audience list
  - **Priority 4:** Beta feature

- 📋 **Get Audience** - `GET /audiences/{audience_id}` ⚠️ **BETA**
  - Features: Beta audience details
  - **Priority 4:** Beta feature

---

## Authorized Apps

OAuth application management endpoints.

- 📋 **List Authorized Apps** - `GET /authorized-apps`
  - Features: List of authorized OAuth applications
  - **Priority 4:** Security/integration tracking

- 📋 **Get Authorized App Info** - `GET /authorized-apps/{app_id}`
  - Features: Individual app authorization details
  - **Priority 4:** Security tracking

---

## Automation Flows (Customer Journeys)

Customer journey automation endpoints.

- 📋 **List Customer Journeys** - `GET /customer-journeys/journeys`
  - Features: Customer journey automation workflows
  - **Priority 3:** Modern automation feature

---

## Batch Operations

Batch operation management endpoints.

- 📋 **List Batch Requests** - `GET /batches`
  - Features: Track batch operations
  - **Priority 4:** Batch operation management

- 🔒 **Start Batch Operation** - `POST /batches`
  - **Priority 5:** Write operation (future)

- 📋 **Get Batch Operation Status** - `GET /batches/{batch_id}`
  - Features: Individual batch operation status
  - **Priority 4:** Batch tracking

- 🔒 **Delete Batch Request** - `DELETE /batches/{batch_id}`
  - **Priority 5:** Write operation (future)

---

## Batch Webhooks

Batch webhook management endpoints.

- 📋 **List Batch Webhooks** - `GET /batch-webhooks`
  - Features: Webhook batch subscriptions
  - **Priority 4:** Integration feature

- 🔒 **Add Batch Webhook** - `POST /batch-webhooks`
  - **Priority 5:** Write operation (future)

- 📋 **Get Batch Webhook Info** - `GET /batch-webhooks/{batch_webhook_id}`
  - Features: Individual batch webhook details
  - **Priority 4:** Integration tracking

- 🔒 **Update Batch Webhook** - `PATCH /batch-webhooks/{batch_webhook_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Batch Webhook** - `DELETE /batch-webhooks/{batch_webhook_id}`
  - **Priority 5:** Write operation (future)

---

## Campaign Folders

Campaign organization endpoints.

- 📋 **List Campaign Folders** - `GET /campaign-folders`
  - Features: Campaign folder organization
  - **Priority 3:** Campaign management

- 🔒 **Add Campaign Folder** - `POST /campaign-folders`
  - **Priority 5:** Write operation (future)

- 📋 **Get Campaign Folder** - `GET /campaign-folders/{folder_id}`
  - Features: Individual folder details
  - **Priority 4:** Campaign organization

- 🔒 **Update Campaign Folder** - `PATCH /campaign-folders/{folder_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Campaign Folder** - `DELETE /campaign-folders/{folder_id}`
  - **Priority 5:** Write operation (future)

---

## Campaigns API

Campaign management and operations endpoints.

### Campaign Management

- 📋 **List Campaigns** - `GET /campaigns`
  - Features: Campaign list with filtering and pagination
  - **Priority 3:** Campaign management

- 🔒 **Add Campaign** - `POST /campaigns`
  - **Priority 5:** Write operation (future)

- 📋 **Get Campaign Info** - `GET /campaigns/{campaign_id}`
  - Features: Campaign details and settings
  - **Priority 3:** Campaign analytics

- 🔒 **Update Campaign Settings** - `PATCH /campaigns/{campaign_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Campaign** - `DELETE /campaigns/{campaign_id}`
  - **Priority 5:** Write operation (future)

### Campaign Actions

- 🔒 **Cancel Campaign** - `POST /campaigns/{campaign_id}/actions/cancel-send`
  - **Priority 5:** Write operation (future)

- 🔒 **Send Campaign** - `POST /campaigns/{campaign_id}/actions/send`
  - **Priority 5:** Write operation (future)

- 🔒 **Schedule Campaign** - `POST /campaigns/{campaign_id}/actions/schedule`
  - **Priority 5:** Write operation (future)

- 🔒 **Unschedule Campaign** - `POST /campaigns/{campaign_id}/actions/unschedule`
  - **Priority 5:** Write operation (future)

- 🔒 **Pause RSS Campaign** - `POST /campaigns/{campaign_id}/actions/pause`
  - **Priority 5:** Write operation (future)

- 🔒 **Resume RSS Campaign** - `POST /campaigns/{campaign_id}/actions/resume`
  - **Priority 5:** Write operation (future)

- 🔒 **Replicate Campaign** - `POST /campaigns/{campaign_id}/actions/replicate`
  - **Priority 5:** Write operation (future)

### Campaign Content

- 📋 **Get Campaign Content** - `GET /campaigns/{campaign_id}/content`
  - Features: Campaign HTML content
  - **Priority 3:** Content preview

- 🔒 **Set Campaign Content** - `PUT /campaigns/{campaign_id}/content`
  - **Priority 5:** Write operation (future)

### Campaign Send Checklist

- 📋 **Get Campaign Send Checklist** - `GET /campaigns/{campaign_id}/send-checklist`
  - Features: Pre-send validation checklist
  - **Priority 3:** Campaign validation

---

## Chimp Chatter Activity

Activity feed and notifications endpoints.

- 📋 **Get Latest Chimp Chatter** - `GET /activity-feed/chimp-chatter`
  - Features: Recent activity feed
  - **Priority 4:** Dashboard widget

---

## Classic Automations API

Marketing automation workflow endpoints.

### Automation Management

- 📋 **List Automations** - `GET /automations`
  - Features: List all automation workflows
  - **Priority 3:** Automation management

- 🔒 **Add Automation** - `POST /automations`
  - **Priority 5:** Write operation (future)

- 📋 **Get Automation Info** - `GET /automations/{workflow_id}`
  - Features: Individual automation workflow details
  - **Priority 3:** Automation analytics

- 🔒 **Start Automation Emails** - `POST /automations/{workflow_id}/actions/start-all-emails`
  - **Priority 5:** Write operation (future)

- 🔒 **Pause Automation Emails** - `POST /automations/{workflow_id}/actions/pause-all-emails`
  - **Priority 5:** Write operation (future)

- 🔒 **Archive Automation** - `POST /automations/{workflow_id}/actions/archive`
  - **Priority 5:** Write operation (future)

### Automated Emails

- 📋 **List Automated Emails** - `GET /automations/{workflow_id}/emails`
  - Features: Emails within automation workflow
  - **Priority 3:** Automation management

- 📋 **Get Workflow Email Info** - `GET /automations/{workflow_id}/emails/{workflow_email_id}`
  - Features: Individual automated email details
  - **Priority 4:** Low priority

- 🔒 **Delete Workflow Email** - `DELETE /automations/{workflow_id}/emails/{workflow_email_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Workflow Email** - `PATCH /automations/{workflow_id}/emails/{workflow_email_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Pause Automated Email** - `POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/pause`
  - **Priority 5:** Write operation (future)

- 🔒 **Start Automated Email** - `POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/start`
  - **Priority 5:** Write operation (future)

### Automation Queue

- 📋 **View Automation Queue** - `GET /automations/{workflow_id}/emails/{workflow_email_id}/queue`
  - Features: View queued automation emails
  - **Priority 4:** Advanced automation feature

- 📋 **Get Automation Email Subscriber** - `GET /automations/{workflow_id}/emails/{workflow_email_id}/queue/{subscriber_hash}`
  - Features: Individual subscriber queue details
  - **Priority 4:** Low priority

### Removed Subscribers

- 📋 **List Automation Removed Subscribers** - `GET /automations/{workflow_id}/removed-subscribers`
  - Features: Subscribers removed from automation
  - **Priority 4:** Automation management

- 🔒 **Remove Subscriber from Workflow** - `POST /automations/{workflow_id}/removed-subscribers`
  - **Priority 5:** Write operation (future)

---

## Connected Sites API

Website tracking and connected site management.

- 📋 **List Connected Sites** - `GET /connected-sites`
  - Features: Sites connected for tracking
  - **Priority 4:** Integration feature

- 🔒 **Add Connected Site** - `POST /connected-sites`
  - **Priority 5:** Write operation (future)

- 📋 **Get Connected Site** - `GET /connected-sites/{connected_site_id}`
  - Features: Individual site connection details
  - **Priority 4:** Low priority

- 🔒 **Delete Connected Site** - `DELETE /connected-sites/{connected_site_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Verify Connected Site Script** - `POST /connected-sites/{connected_site_id}/actions/verify-script-installation`
  - **Priority 5:** Write operation (future)

---

## Conversations API (Deprecated)

**Note:** These endpoints are deprecated by Mailchimp. Listed for completeness only.

- 📋 **List Conversations** - `GET /conversations` ⚠️ **DEPRECATED**
  - Features: List conversation threads
  - **Priority 5:** Deprecated API

- 📋 **Get Conversation** - `GET /conversations/{conversation_id}` ⚠️ **DEPRECATED**
  - Features: Individual conversation details
  - **Priority 5:** Deprecated API

### Conversation Messages (Deprecated)

- 📋 **List Messages** - `GET /conversations/{conversation_id}/messages` ⚠️ **DEPRECATED**
  - Features: Messages in conversation thread
  - **Priority 5:** Deprecated API

- 📋 **Get Message** - `GET /conversations/{conversation_id}/messages/{message_id}` ⚠️ **DEPRECATED**
  - Features: Individual message details
  - **Priority 5:** Deprecated API

---

## File Manager API

File storage and asset management endpoints.

### File Manager Files

- 📋 **List Stored Files** - `GET /file-manager/files`
  - Features: File library, asset management
  - **Priority 4:** Asset management feature

- 🔒 **Add File** - `POST /file-manager/files`
  - **Priority 5:** Write operation (future)

- 📋 **Get File** - `GET /file-manager/files/{file_id}`
  - Features: Individual file details
  - **Priority 4:** Asset management

- 🔒 **Update File** - `PATCH /file-manager/files/{file_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete File** - `DELETE /file-manager/files/{file_id}`
  - **Priority 5:** Write operation (future)

### File Manager Folders

- 📋 **List Folders** - `GET /file-manager/folders`
  - Features: Folder organization
  - **Priority 4:** Asset management

- 🔒 **Add Folder** - `POST /file-manager/folders`
  - **Priority 5:** Write operation (future)

- 📋 **Get Folder** - `GET /file-manager/folders/{folder_id}`
  - Features: Folder details
  - **Priority 4:** Asset management

- 🔒 **Update Folder** - `PATCH /file-manager/folders/{folder_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Folder** - `DELETE /file-manager/folders/{folder_id}`
  - **Priority 5:** Write operation (future)

### Files in Folder

- 📋 **List Stored Files in Folder** - `GET /file-manager/folders/{folder_id}/files`
  - Features: Folder-specific file list
  - **Priority 4:** Asset management

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

- ✅ **List Interest Categories** - `GET /lists/{list_id}/interest-categories`
  - Route: `/mailchimp/lists/[id]/interest-categories`
  - Features: Subscription preference groups, Category types (checkboxes/dropdown/radio/hidden), Display order
  - **Priority 3:** Segmentation feature
  - **Implemented:** Issue #288, PR #289

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

- ✅ **List Locations** - `GET /lists/{list_id}/locations`
  - Route: `/mailchimp/lists/[id]/locations`
  - Features: Geographic member distribution, Country-based subscriber analytics
  - **Priority 3:** Analytics insight
  - **Implemented:** Issue #278, PR #279

### Member Activity

- 📋 **View Recent Activity 50** - `GET /lists/{list_id}/members/{subscriber_hash}/activity`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/activity`
  - Features: Last 50 member activities
  - **Priority 3:** Member details

### Member Activity Feed

- ✅ **View Recent Activity** - `GET /lists/{list_id}/members/{subscriber_hash}/activity-feed`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/activity`
  - Features: Complete activity timeline, discriminated union schemas for 7+ activity types, smart pagination, clickable campaign titles, timezone-aware date filtering
  - **Priority 3:** Member details
  - **Implemented:** Issue #268, PR #270

### Member Goals

- ✅ **List Member Goal Events** - `GET /lists/{list_id}/members/{subscriber_hash}/goals`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/goals`
  - Features: Goal completion tracking
  - **Priority 2:** Member management
  - **Implemented:** Issue #276, PR #279

### Member Notes

- ✅ **List Recent Member Notes** - `GET /lists/{list_id}/members/{subscriber_hash}/notes`
  - **Priority 3:** Member management
  - **Route:** `/mailchimp/lists/[id]/members/[subscriber_hash]/notes`
  - **Features:** Pagination, Note display, Chronological timeline

- 🔒 **Add Member Note** - `POST /lists/{list_id}/members/{subscriber_hash}/notes`
  - **Priority 5:** Write operation (future)

- 📋 **Get Member Note** - `GET /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 4:** Low priority

- 🔒 **Update Note** - `PATCH /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Note** - `DELETE /lists/{list_id}/members/{subscriber_hash}/notes/{note_id}`
  - **Priority 5:** Write operation (future)

### Member Tags

- ✅ **List Member Tags** - `GET /lists/{list_id}/members/{subscriber_hash}/tags`
  - Route: `/mailchimp/lists/[id]/members/[subscriber_hash]/tags`
  - Features: Pagination, tag display with ID/name/date, member tagging history
  - **Implemented:** Issue #247, PR #254

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

- ✅ **List Members in Segment** - `GET /lists/{list_id}/segments/{segment_id}/members`
  - Route: `/mailchimp/lists/[id]/segments/[segment_id]/members`
  - Features: View members in a specific segment, Pagination, Member details
  - **Implemented:** Issue #250, PR #253

- 🔒 **Add Member to Segment** - `POST /lists/{list_id}/segments/{segment_id}/members`
  - **Priority 5:** Write operation (future)

- 🔒 **Remove List Member from Segment** - `DELETE /lists/{list_id}/segments/{segment_id}/members/{subscriber_hash}`
  - **Priority 5:** Write operation (future)

### Segments

- ✅ **List Segments** - `GET /lists/{list_id}/segments`
  - Route: `/mailchimp/lists/[id]/segments`
  - Features: Pagination, segment types (saved/static/predicted), member counts, condition display

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

- ✅ **Search Members** - `GET /search-members`
  - Route: `/mailchimp/search/members`
  - Features: Search across all list members by email, first name, or last name
  - Returns: Exact matches and full-text search results
  - **Priority 2:** Member discovery
  - **Status:** Implemented (Issue #246)

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

## E-commerce Stores API

E-commerce integration endpoints.

### E-commerce Stores

- 📋 **List Stores** - `GET /ecommerce/stores`
  - Features: E-commerce store list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Store** - `POST /ecommerce/stores`
  - **Priority 5:** Write operation (future)

- 📋 **Get Store Info** - `GET /ecommerce/stores/{store_id}`
  - Features: Store details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Store** - `PATCH /ecommerce/stores/{store_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Store** - `DELETE /ecommerce/stores/{store_id}`
  - **Priority 5:** Write operation (future)

### Cart Lines

- 📋 **List Cart Line Items** - `GET /ecommerce/stores/{store_id}/carts/{cart_id}/lines`
  - Features: Cart line items
  - **Priority 4:** E-commerce integration

- 🔒 **Add Cart Line Item** - `POST /ecommerce/stores/{store_id}/carts/{cart_id}/lines`
  - **Priority 5:** Write operation (future)

- 📋 **Get Cart Line Item** - `GET /ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}`
  - Features: Individual line item details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Cart Line Item** - `PATCH /ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Cart Line Item** - `DELETE /ecommerce/stores/{store_id}/carts/{cart_id}/lines/{line_id}`
  - **Priority 5:** Write operation (future)

### Carts

- 📋 **List Carts** - `GET /ecommerce/stores/{store_id}/carts`
  - Features: Shopping carts list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Cart** - `POST /ecommerce/stores/{store_id}/carts`
  - **Priority 5:** Write operation (future)

- 📋 **Get Cart Info** - `GET /ecommerce/stores/{store_id}/carts/{cart_id}`
  - Features: Individual cart details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Cart** - `PATCH /ecommerce/stores/{store_id}/carts/{cart_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Cart** - `DELETE /ecommerce/stores/{store_id}/carts/{cart_id}`
  - **Priority 5:** Write operation (future)

### Customers

- 📋 **List Customers** - `GET /ecommerce/stores/{store_id}/customers`
  - Features: E-commerce customer list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Customer** - `POST /ecommerce/stores/{store_id}/customers`
  - **Priority 5:** Write operation (future)

- 📋 **Get Customer Info** - `GET /ecommerce/stores/{store_id}/customers/{customer_id}`
  - Features: Individual customer details
  - **Priority 4:** E-commerce integration

- 🔒 **Add or Update Customer** - `PUT /ecommerce/stores/{store_id}/customers/{customer_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Customer** - `PATCH /ecommerce/stores/{store_id}/customers/{customer_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Customer** - `DELETE /ecommerce/stores/{store_id}/customers/{customer_id}`
  - **Priority 5:** Write operation (future)

### Order Lines

- 📋 **List Order Line Items** - `GET /ecommerce/stores/{store_id}/orders/{order_id}/lines`
  - Features: Order line items
  - **Priority 4:** E-commerce integration

- 🔒 **Add Order Line Item** - `POST /ecommerce/stores/{store_id}/orders/{order_id}/lines`
  - **Priority 5:** Write operation (future)

- 📋 **Get Order Line Item** - `GET /ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}`
  - Features: Individual order line details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Order Line Item** - `PATCH /ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Order Line Item** - `DELETE /ecommerce/stores/{store_id}/orders/{order_id}/lines/{line_id}`
  - **Priority 5:** Write operation (future)

### Orders

- 📋 **List Account Orders** - `GET /ecommerce/orders`
  - Features: All account orders across stores
  - **Priority 4:** E-commerce integration

- 📋 **List Orders** - `GET /ecommerce/stores/{store_id}/orders`
  - Features: Store-specific orders list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Order** - `POST /ecommerce/stores/{store_id}/orders`
  - **Priority 5:** Write operation (future)

- 📋 **Get Order Info** - `GET /ecommerce/stores/{store_id}/orders/{order_id}`
  - Features: Individual order details
  - **Priority 4:** E-commerce integration

- 🔒 **Add or Update Order** - `PUT /ecommerce/stores/{store_id}/orders/{order_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Order** - `PATCH /ecommerce/stores/{store_id}/orders/{order_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Order** - `DELETE /ecommerce/stores/{store_id}/orders/{order_id}`
  - **Priority 5:** Write operation (future)

### Product Images

- 📋 **List Product Images** - `GET /ecommerce/stores/{store_id}/products/{product_id}/images`
  - Features: Product image gallery
  - **Priority 4:** E-commerce integration

- 🔒 **Add Product Image** - `POST /ecommerce/stores/{store_id}/products/{product_id}/images`
  - **Priority 5:** Write operation (future)

- 📋 **Get Product Image Info** - `GET /ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}`
  - Features: Individual product image details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Product Image** - `PATCH /ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Product Image** - `DELETE /ecommerce/stores/{store_id}/products/{product_id}/images/{image_id}`
  - **Priority 5:** Write operation (future)

### Product Variants

- 📋 **List Product Variants** - `GET /ecommerce/stores/{store_id}/products/{product_id}/variants`
  - Features: Product variant options
  - **Priority 4:** E-commerce integration

- 🔒 **Add Product Variant** - `POST /ecommerce/stores/{store_id}/products/{product_id}/variants`
  - **Priority 5:** Write operation (future)

- 📋 **Get Product Variant Info** - `GET /ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}`
  - Features: Individual variant details
  - **Priority 4:** E-commerce integration

- 🔒 **Add or Update Product Variant** - `PUT /ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Update Product Variant** - `PATCH /ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Product Variant** - `DELETE /ecommerce/stores/{store_id}/products/{product_id}/variants/{variant_id}`
  - **Priority 5:** Write operation (future)

### Products

- 📋 **List Products** - `GET /ecommerce/stores/{store_id}/products`
  - Features: E-commerce product catalog
  - **Priority 4:** E-commerce integration

- 🔒 **Add Product** - `POST /ecommerce/stores/{store_id}/products`
  - **Priority 5:** Write operation (future)

- 📋 **Get Product Info** - `GET /ecommerce/stores/{store_id}/products/{product_id}`
  - Features: Individual product details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Product** - `PATCH /ecommerce/stores/{store_id}/products/{product_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Product** - `DELETE /ecommerce/stores/{store_id}/products/{product_id}`
  - **Priority 5:** Write operation (future)

### Promo Codes

- 📋 **List Promo Codes** - `GET /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes`
  - Features: Promotional code list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Promo Code** - `POST /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes`
  - **Priority 5:** Write operation (future)

- 📋 **Get Promo Code** - `GET /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}`
  - Features: Individual promo code details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Promo Code** - `PATCH /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Promo Code** - `DELETE /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}/promo-codes/{promo_code_id}`
  - **Priority 5:** Write operation (future)

### Promo Rules

- 📋 **List Promo Rules** - `GET /ecommerce/stores/{store_id}/promo-rules`
  - Features: Promotional rules list
  - **Priority 4:** E-commerce integration

- 🔒 **Add Promo Rule** - `POST /ecommerce/stores/{store_id}/promo-rules`
  - **Priority 5:** Write operation (future)

- 📋 **Get Promo Rule** - `GET /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}`
  - Features: Individual promo rule details
  - **Priority 4:** E-commerce integration

- 🔒 **Update Promo Rule** - `PATCH /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}`
  - **Priority 5:** Write operation (future)

- 🔒 **Delete Promo Rule** - `DELETE /ecommerce/stores/{store_id}/promo-rules/{promo_rule_id}`
  - **Priority 5:** Write operation (future)

---

## Facebook Ads API

Facebook advertising integration endpoints.

- 📋 **List Facebook Ads** - `GET /facebook-ads`
  - Features: Facebook Ads list
  - **Priority 4:** Social media integration

- 📋 **Get Facebook Ad Info** - `GET /facebook-ads/{outreach_id}`
  - Features: Individual Facebook Ad details
  - **Priority 4:** Social media integration

---

## Implementation Stats

**Current Coverage (Read-Only Endpoints):**

- ✅ Implemented: 27 endpoints
- ⭐ Priority 3: ~50 endpoints (Campaigns, member details, analytics, landing pages, automations, customer journeys)
- 📋 Priority 4: ~170 endpoints (surveys, templates, webhooks, e-commerce, drill-downs, file management, connected sites, batch operations, exports, authorized apps)
- 🔒 Write Operations: ~150 endpoints (future consideration)
- ⚠️ Deprecated: ~4 endpoints (Conversations API - not planned for implementation)

**Total Progress (Read-Only):** 27/244 read endpoints (~11.1%)

**Recent Implementations:**

- **List Interest Categories** (subscription preference groups with category types - Issue #288, PR #289)
- **List Locations** (geographic member distribution - Issue #278, PR #279)
- **Member Goals** (goal completion tracking for list members - Issue #276, PR #279)
- **Member Activity Feed** (complete engagement timeline with discriminated union schemas for 7+ activity types - Issue #268, PR #270)
- **Member Notes** (view notes for list members - chronological timeline with pagination)
- **Member Tags** (view tags assigned to list members - Issue #247, PR #254)
- **Segment Members** (view members in audience segments - Issue #250, PR #253)
- Search Members (global member search across all lists - Issue #246, PR #251)
- List Segments (audience segmentation with saved/static/predicted types)
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

- API Root: 0/1 endpoint (0%)
- Account Exports: 0/3 endpoints (0%)
- Audiences (BETA): 0/2 endpoints (0%)
- Authorized Apps: 0/2 endpoints (0%)
- Automation Flows (Customer Journeys): 0/1 endpoint (0%)
- Batch Operations: 0/4 endpoints (0%)
- Batch Webhooks: 0/5 endpoints (0%)
- Campaign Folders: 0/5 endpoints (0%)
- Campaigns API: 0/17 endpoints (0%)
- Chimp Chatter Activity: 0/1 endpoint (0%)
- Classic Automations: 0/14 endpoints (0%)
- Connected Sites: 0/5 endpoints (0%)
- Conversations (Deprecated): 0/4 endpoints (0% - not planned)
- E-commerce Stores: 0/62 endpoints (0%)
- Facebook Ads: 0/2 endpoints (0%)
- File Manager: 0/11 endpoints (0%)
- Landing Pages: 0/9 endpoints (0%)
- Lists API: 12/45 endpoints (27%)
- Ping API: 0/1 endpoint (0%)
- Reporting API: 0/15 endpoints (0%)
- Reports API: 12/28 endpoints (43%)
- Search API: 1/2 endpoints (50%)
- Template Folders: 0/5 endpoints (0%)
- Templates: 0/7 endpoints (0%)
- Verified Domains: 0/5 endpoints (0%)

---

## Recommended Next Implementation

### 🎯 Status Update: Core Member Management Complete ✅

The following foundational endpoints are now implemented:

- ✅ List Members (`GET /lists/{list_id}/members`)
- ✅ Get Member Info (`GET /lists/{list_id}/members/{subscriber_hash}`)
- ✅ List Segments (`GET /lists/{list_id}/segments`)
- ✅ Segment Members (`GET /lists/{list_id}/segments/{segment_id}/members`)
- ✅ Member Tags (`GET /lists/{list_id}/members/{subscriber_hash}/tags`)
- ✅ Member Notes (`GET /lists/{list_id}/members/{subscriber_hash}/notes`)
- ✅ Member Activity Feed (`GET /lists/{list_id}/members/{subscriber_hash}/activity-feed`)
- ✅ Search Members (`GET /search-members`)

### 🎯 Next Priority Endpoints:

**Option 1: Complete Member Detail Features** ⭐⭐⭐

**1. Member Goals** (`GET /lists/{list_id}/members/{subscriber_hash}/goals`)

- **Value:** Track goal completions for members
- **Complexity:** Medium (goal tracking, completion status, timestamps)
- **User Benefit:** See conversion tracking and goal progress
- **Route:** `/mailchimp/lists/[id]/members/[subscriber_hash]/activity-feed` (note: different from activity)
- **Why Important:** Completes member profile features

**Option 2: List Analytics & Geographic Data** ⭐⭐

**2. List Locations** (`GET /lists/{list_id}/locations`)

- **Value:** Geographic distribution of list members
- **Complexity:** Low (simple table display, country/region breakdown)
- **User Benefit:** Understand audience geography
- **Route:** `/mailchimp/lists/[id]/locations`
- **Why Important:** Quick win - similar pattern to Campaign Locations (already implemented)
- **Quick Win:** Reuse existing components and patterns

**3. List Interest Categories** (`GET /lists/{list_id}/interest-categories`)

- **Value:** View interest groups/categories for list segmentation
- **Complexity:** Medium (category hierarchy, member counts)
- **User Benefit:** Understand how list is organized by interests
- **Route:** `/mailchimp/lists/[id]/interest-categories`
- **Why Important:** Foundation for Interest Groups endpoint

**Option 3: Campaign Management** ⭐

**4. List Campaigns** (`GET /campaigns`)

- **Value:** View all campaigns with filtering and search
- **Complexity:** High (comprehensive campaign list, multiple statuses, filtering)
- **User Benefit:** Central campaign management view
- **Route:** `/mailchimp/campaigns`
- **Why Important:** Foundation for campaign CRUD operations (future)
- **Note:** Would unlock ~17 campaign management endpoints

**Option 4: Landing Pages** ⭐

**6. List Landing Pages** (`GET /landing-pages`)

- **Value:** View all landing pages with performance metrics
- **Complexity:** Medium (landing page list, publication status, visit tracking)
- **User Benefit:** Track landing page performance
- **Route:** `/mailchimp/landing-pages`
- **Why Important:** New feature area for conversion tracking
- **Would Unlock:** ~9 landing page endpoints

### 💡 Recommendation:

**Top Choice: Member Activity** (`GET /lists/{list_id}/members/{subscriber_hash}/activity`)

**Rationale:**

1. **Natural progression:** Completes member detail view after notes and tags
2. **User value:** High - users want to see member engagement timeline
3. **Complexity:** Medium - similar pattern to Campaign Email Activity (already done)
4. **Quick win:** Reuse existing activity feed patterns and components

**Second Choice: List Locations** (`GET /lists/{list_id}/locations`)

**Rationale:**

1. **Quick win:** Very similar to Campaign Locations (already implemented)
2. **Low complexity:** Reuse existing table components and geographic display
3. **High value:** Users want to know where their audience is located
4. **Analytics completion:** Rounds out list analytics features

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

**Last Updated:** 2025-10-26 (Complete Mailchimp API endpoint catalog)
**Maintained By:** Development team + AI assistants

---

## Summary of Recent Updates

### Update 2025-10-26: Complete API Catalog

Added comprehensive coverage of ALL Mailchimp API endpoints:

**New Sections:**

- **API Root** - 1 endpoint for API information
- **Account Exports** - 3 endpoints for data export
- **Audiences (BETA)** - 2 endpoints for beta audience features
- **Authorized Apps** - 2 endpoints for OAuth app management
- **Automation Flows (Customer Journeys)** - 1 endpoint for modern automation
- **Batch Operations** - 4 endpoints for batch processing
- **Batch Webhooks** - 5 endpoints for webhook batch subscriptions
- **Campaign Folders** - 5 endpoints for campaign organization

**Enhanced Sections:**

- **Campaigns API** - Added Campaign Content (2 endpoints) and Campaign Send Checklist (1 endpoint)
  - Total: 17 endpoints (was 15)

**Stats Updated:**

- Total documented endpoints: 230+ → 280+ endpoints
- Read-only endpoints: 230+ → 244 endpoints
- Write operations: 120+ → 150+ endpoints
- Total API sections: 17 → 25 sections
- Implementation coverage: ~8% → ~7.8% (denominator increased with new discoveries)

**Impact:**

This update provides the first complete catalog of ALL available Mailchimp API endpoints, giving us a full picture of the API surface area and enabling better prioritization for future implementations.

### Update 2025-10-25 (Part 2): Campaigns API & Search Members

Added Campaigns API section and marked Search Members as implemented:

**New Sections:**

- **Campaigns API** - 15 endpoints for campaign management
  - Campaign management (list, add, get, update, delete)
  - Campaign actions (send, schedule, cancel, pause/resume, replicate)

**Implemented Endpoints:**

- **Search Members** (`GET /search-members`) - ✅ Implemented (Issue #246)
  - Route: `/mailchimp/search/members`
  - Features: Global member search across all lists
  - Returns: Exact matches and full-text search results

**Stats Updated:**

- Total implemented: 17 → 18 endpoints
- Search API coverage: 0/2 → 1/2 (50%)
- Total tracked endpoints: 215+ → 230+

### Update 2025-10-25 (Part 1): Automation & Connected Sites

Added comprehensive coverage of automation and website tracking endpoints:

**New Sections:**

- **Classic Automations API** - 14 endpoints for marketing automation workflows
  - Automation management (list, get, start/pause/archive)
  - Automated emails (list, get, update, delete, pause/start)
  - Automation queue (view queue, get subscriber)
  - Removed subscribers (list, remove from workflow)

- **Connected Sites API** - 5 endpoints for website tracking
  - Site management (list, add, get, delete)
  - Script verification

- **Conversations API (Deprecated)** - 4 endpoints marked as deprecated
  - Conversations (list, get)
  - Messages (list, get)
  - **Note:** Not planned for implementation due to deprecation

**Total New Endpoints Documented:** +23 endpoints

These additions bring the total tracked API surface to **215+ endpoints** (100+ read-only, 110+ write operations, 4 deprecated).

### Previous Update 2025-01-24: E-commerce & Ads

- **E-commerce Stores API** - 62 endpoints for e-commerce integration
- **Facebook Ads API** - 2 endpoints for Facebook advertising
- **File Manager API** - 11 endpoints for asset management
- **Landing Pages API** - 9 endpoints for landing page management
- **Reporting API** - 15 endpoints for survey reporting
