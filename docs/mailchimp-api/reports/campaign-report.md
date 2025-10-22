# Campaign Report Summary

## Overview

Retrieves detailed analytics and performance metrics for a specific email campaign. This endpoint provides comprehensive statistics including opens, clicks, bounces, unsubscribes, and revenue data for the specified campaign.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}`
- **Authentication**: OAuth 2.0 required

## Path Parameters

| Parameter   | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| campaign_id | string | Yes      | The unique ID for the campaign |

## Query Parameters

| Parameter      | Type   | Required | Default | Description                                                 |
| -------------- | ------ | -------- | ------- | ----------------------------------------------------------- |
| fields         | string | No       | -       | Comma-separated list of fields to include in the response   |
| exclude_fields | string | No       | -       | Comma-separated list of fields to exclude from the response |

## Response Schema

### Success Response

The response contains comprehensive campaign analytics data:

- **id** (string): Campaign ID
- **campaign_title** (string): Campaign title
- **type** (string): Campaign type - one of: `regular`, `plain-text`, `ab_split`, `rss`, `automation`, `variate`, `auto`
- **list_id** (string): Associated list ID
- **list_is_active** (boolean): Whether the list is active
- **list_name** (string): List name
- **subject_line** (string): Campaign subject line
- **preview_text** (string): Preview text shown in email clients
- **emails_sent** (number): Total emails sent
- **abuse_reports** (number): Number of abuse reports
- **unsubscribed** (number): Number of unsubscribes
- **send_time** (string): ISO 8601 datetime when campaign was sent
- **rss_last_send** (string, optional): ISO 8601 datetime of last RSS send
- **bounces** (object):
  - **hard_bounces** (number): Hard bounce count
  - **soft_bounces** (number): Soft bounce count
  - **syntax_errors** (number): Syntax error count
- **forwards** (object):
  - **forwards_count** (number): Number of forwards
  - **forwards_opens** (number): Opens from forwarded emails
- **opens** (object):
  - **opens_total** (number): Total opens
  - **proxy_excluded_opens** (number, optional): Opens excluding proxy opens
  - **unique_opens** (number): Unique opens
  - **proxy_excluded_unique_opens** (number, optional): Unique opens excluding proxy
  - **open_rate** (number): Open rate percentage (0-100)
  - **proxy_excluded_open_rate** (number, optional): Open rate excluding proxy (0-100)
  - **last_open** (string): ISO 8601 datetime of last open
- **clicks** (object):
  - **clicks_total** (number): Total clicks
  - **unique_clicks** (number): Unique clicks
  - **unique_subscriber_clicks** (number): Unique subscriber clicks
  - **click_rate** (number): Click rate percentage (0-100)
  - **last_click** (string): ISO 8601 datetime of last click
- **facebook_likes** (object):
  - **recipient_likes** (number): Recipient likes
  - **unique_likes** (number): Unique likes
  - **facebook_likes** (number): Facebook likes
- **industry_stats** (object):
  - **type** (string): Industry type
  - **open_rate** (number): Industry average open rate
  - **click_rate** (number): Industry average click rate
  - **bounce_rate** (number): Industry average bounce rate
  - **unopen_rate** (number): Industry average unopen rate
  - **unsub_rate** (number): Industry average unsubscribe rate
  - **abuse_rate** (number): Industry average abuse rate
- **list_stats** (object):
  - **sub_rate** (number): List subscription rate
  - **unsub_rate** (number): List unsubscribe rate
  - **open_rate** (number): List open rate
  - **proxy_excluded_open_rate** (number, optional): List open rate excluding proxy
  - **click_rate** (number): List click rate
- **ab_split** (object, optional): A/B split test data (only for A/B campaigns)
  - **a** (object): Group A metrics
    - **bounces** (number)
    - **abuse_reports** (number)
    - **unsubs** (number)
    - **recipient_clicks** (number)
    - **forwards** (number)
    - **forwards_opens** (number)
    - **opens** (number)
    - **last_open** (string): ISO 8601 datetime
    - **unique_opens** (number)
  - **b** (object): Group B metrics (same structure as Group A)
- **timewarp** (array, optional): Timewarp data for different time zones
  - **gmt_offset** (number): GMT offset
  - **opens** (number)
  - **last_open** (string): ISO 8601 datetime
  - **unique_opens** (number)
  - **clicks** (number)
  - **last_click** (string): ISO 8601 datetime
  - **unique_clicks** (number)
  - **bounces** (number)
- **timeseries** (array, optional): Time series data
  - **timestamp** (string): ISO 8601 datetime
  - **emails_sent** (number)
  - **unique_opens** (number)
  - **proxy_excluded_unique_opens** (number)
  - **recipients_clicks** (number)
- **share_report** (object):
  - **share_url** (string): URL to share the report
  - **share_password** (string): Password for shared report
- **ecommerce** (object):
  - **total_orders** (number): Total orders
  - **total_spent** (number): Total amount spent
  - **total_revenue** (number): Total revenue
  - **currency_code** (string, optional): Currency code
- **delivery_status** (object):
  - **enabled** (boolean): Whether delivery status is enabled
  - **can_cancel** (boolean): Whether campaign can be canceled
  - **status** (string): One of: `delivering`, `delivered`, `canceling`, `canceled`
  - **emails_sent** (number): Number of emails sent
  - **emails_canceled** (number): Number of emails canceled

### Pagination

- **\_links** (array, optional): HATEOAS links for API navigation
  - **rel** (string): Relation type
  - **href** (string): URL
  - **method** (string): HTTP method
  - **targetSchema** (string, optional): Target schema
  - **schema** (string, optional): Schema

## Example Response

```json
{
  "id": "42694e9e57",
  "campaign_title": "Weekly Newsletter - October 2025",
  "type": "regular",
  "list_id": "a1b2c3d4e5",
  "list_is_active": true,
  "list_name": "Newsletter Subscribers",
  "subject_line": "Your Weekly Update is Here!",
  "preview_text": "Check out this week's top stories",
  "emails_sent": 10000,
  "abuse_reports": 2,
  "unsubscribed": 15,
  "send_time": "2025-10-15T10:00:00+00:00",
  "bounces": {
    "hard_bounces": 45,
    "soft_bounces": 23,
    "syntax_errors": 3
  },
  "forwards": {
    "forwards_count": 127,
    "forwards_opens": 89
  },
  "opens": {
    "opens_total": 3245,
    "unique_opens": 2891,
    "proxy_excluded_unique_opens": 2654,
    "open_rate": 28.91,
    "proxy_excluded_open_rate": 26.54,
    "last_open": "2025-10-20T15:23:11+00:00"
  },
  "clicks": {
    "clicks_total": 876,
    "unique_clicks": 743,
    "unique_subscriber_clicks": 721,
    "click_rate": 7.43,
    "last_click": "2025-10-20T14:52:33+00:00"
  },
  "facebook_likes": {
    "recipient_likes": 34,
    "unique_likes": 32,
    "facebook_likes": 32
  },
  "industry_stats": {
    "type": "Marketing and Advertising",
    "open_rate": 17.92,
    "click_rate": 2.1,
    "bounce_rate": 0.63,
    "unopen_rate": 82.08,
    "unsub_rate": 0.29,
    "abuse_rate": 0.01
  },
  "list_stats": {
    "sub_rate": 5.2,
    "unsub_rate": 0.15,
    "open_rate": 28.91,
    "proxy_excluded_open_rate": 26.54,
    "click_rate": 7.43
  },
  "share_report": {
    "share_url": "https://mailchi.mp/example/report-42694e9e57",
    "share_password": "abc123xyz"
  },
  "ecommerce": {
    "total_orders": 45,
    "total_spent": 2340.5,
    "total_revenue": 2340.5,
    "currency_code": "USD"
  },
  "delivery_status": {
    "enabled": true,
    "can_cancel": false,
    "status": "delivered",
    "emails_sent": 10000,
    "emails_canceled": 0
  },
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57",
      "method": "GET"
    },
    {
      "rel": "campaign",
      "href": "https://us1.api.mailchimp.com/3.0/campaigns/42694e9e57",
      "method": "GET"
    }
  ]
}
```

## Implementation Notes

- Schema location: `/src/schemas/mailchimp/report-success.schema.ts`, `/src/schemas/mailchimp/common/report.schema.ts`
- Params location: `/src/schemas/mailchimp/report-params.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/page.tsx`
- Implemented: Yes

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/reports/get-campaign-report/
