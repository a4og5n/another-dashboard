# All Lists

## Overview

Retrieves information about all lists (audiences) in the account. This endpoint provides comprehensive data about each list including contact information, campaign defaults, statistics, and configuration settings. Lists can be filtered and paginated.

## Endpoint Details

- **Method**: GET
- **Path**: `/lists`
- **Authentication**: OAuth 2.0 required

## Query Parameters

| Parameter                 | Type    | Required | Default | Description                                                                             |
| ------------------------- | ------- | -------- | ------- | --------------------------------------------------------------------------------------- |
| fields                    | string  | No       | -       | Comma-separated list of fields to include in the response                               |
| exclude_fields            | string  | No       | -       | Comma-separated list of fields to exclude from the response                             |
| count                     | number  | No       | 10      | Number of records to return (1-1000)                                                    |
| offset                    | number  | No       | 0       | Number of records to skip for pagination                                                |
| before_date_created       | string  | No       | -       | ISO 8601 datetime to restrict results to lists created before this date                 |
| since_date_created        | string  | No       | -       | ISO 8601 datetime to restrict results to lists created after this date                  |
| before_campaign_last_sent | string  | No       | -       | ISO 8601 datetime to restrict results to lists with last campaign sent before this date |
| since_campaign_last_sent  | string  | No       | -       | ISO 8601 datetime to restrict results to lists with last campaign sent after this date  |
| email                     | string  | No       | -       | Email address to restrict results to lists containing this subscriber                   |
| sort_field                | string  | No       | -       | Sort field (only `date_created` is supported)                                           |
| sort_dir                  | string  | No       | -       | Sort direction: `ASC` or `DESC`                                                         |
| has_ecommerce_store       | boolean | No       | -       | Filter by whether the list has an ecommerce store                                       |
| include_total_contacts    | boolean | No       | -       | Include total_contacts in the stats object                                              |

## Response Schema

### Success Response

The response contains a list of audiences:

- **lists** (array): Array of list objects
  - **id** (string): Unique list ID
  - **web_id** (number): Web-based ID for the list
  - **name** (string): List name
  - **contact** (object): Contact information for the list
    - **company** (string): Company name
    - **address1** (string): Address line 1
    - **address2** (string, optional): Address line 2
    - **city** (string): City
    - **state** (string): State/province
    - **zip** (string): Postal code
    - **country** (string): Country code
    - **phone** (string, optional): Phone number
  - **permission_reminder** (string): Permission reminder message
  - **use_archive_bar** (boolean): Whether to use archive bar
  - **campaign_defaults** (object): Default campaign settings
    - **from_name** (string): Default from name
    - **from_email** (string): Default from email address
    - **subject** (string): Default subject line
    - **language** (string): Default language code
  - **notify_on_subscribe** (string, optional): Email to notify on new subscribes
  - **notify_on_unsubscribe** (string, optional): Email to notify on unsubscribes
  - **date_created** (string): ISO 8601 datetime when list was created
  - **list_rating** (number): Auto-generated activity score (0-5)
  - **email_type_option** (boolean): Whether email type option is enabled
  - **subscribe_url_short** (string): Short subscription URL
  - **subscribe_url_long** (string): Long subscription URL
  - **beamer_address** (string): Beamer email address for the list
  - **visibility** (string): List visibility: `pub` (public) or `prv` (private)
  - **double_optin** (boolean): Whether double opt-in is enabled
  - **has_welcome** (boolean): Whether welcome automation is enabled
  - **marketing_permissions** (boolean): Whether marketing permissions are enabled
  - **modules** (array, optional): Array of module names
  - **stats** (object): List statistics
    - **member_count** (number): Current number of members
    - **total_contacts** (number, optional): Total contacts (if include_total_contacts=true)
    - **unsubscribe_count** (number): Number of unsubscribes
    - **cleaned_count** (number): Number of cleaned contacts
    - **member_count_since_send** (number): New members since last send
    - **unsubscribe_count_since_send** (number): Unsubscribes since last send
    - **cleaned_count_since_send** (number): Cleaned since last send
    - **campaign_count** (number): Number of campaigns sent
    - **campaign_last_sent** (string, optional): ISO 8601 datetime of last campaign
    - **merge_field_count** (number): Number of merge fields
    - **avg_sub_rate** (number, optional): Average subscription rate
    - **avg_unsub_rate** (number, optional): Average unsubscribe rate
    - **target_sub_rate** (number, optional): Target subscription rate
    - **open_rate** (number, optional): Average open rate (0-100)
    - **click_rate** (number, optional): Average click rate (0-100)
    - **last_sub_date** (string, optional): ISO 8601 datetime of last subscribe
    - **last_unsub_date** (string, optional): ISO 8601 datetime of last unsubscribe
  - **\_links** (array, optional): HATEOAS links
- **total_items** (number): Total number of lists
- **constraints** (object): Account-level list constraints
  - **may_create** (boolean): Whether new lists can be created
  - **max_instances** (number): Maximum number of lists allowed (-1 for unlimited)
  - **current_total_instances** (number): Current number of lists (-1 for unlimited)

### Pagination

- **\_links** (array, optional): HATEOAS links for pagination
  - **rel** (string): Relation type (self, next, prev)
  - **href** (string): URL
  - **method** (string): HTTP method
  - **targetSchema** (string, optional): Target schema
  - **schema** (string, optional): Schema

## Example Response

```json
{
  "lists": [
    {
      "id": "a1b2c3d4e5",
      "web_id": 123456,
      "name": "Newsletter Subscribers",
      "contact": {
        "company": "Example Corp",
        "address1": "123 Main Street",
        "address2": "Suite 100",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94102",
        "country": "US",
        "phone": "555-0100"
      },
      "permission_reminder": "You signed up for our newsletter at example.com",
      "use_archive_bar": true,
      "campaign_defaults": {
        "from_name": "Example Corp",
        "from_email": "newsletter@example.com",
        "subject": "Latest News",
        "language": "en"
      },
      "notify_on_subscribe": "admin@example.com",
      "notify_on_unsubscribe": "admin@example.com",
      "date_created": "2024-01-15T10:30:00+00:00",
      "list_rating": 4,
      "email_type_option": true,
      "subscribe_url_short": "https://eepurl.com/abc123",
      "subscribe_url_long": "https://example.us1.list-manage.com/subscribe?u=abc123&id=def456",
      "beamer_address": "us1-abc123-def456@inbound.mailchimp.com",
      "visibility": "pub",
      "double_optin": true,
      "has_welcome": true,
      "marketing_permissions": false,
      "modules": [],
      "stats": {
        "member_count": 5432,
        "total_contacts": 5678,
        "unsubscribe_count": 234,
        "cleaned_count": 12,
        "member_count_since_send": 45,
        "unsubscribe_count_since_send": 3,
        "cleaned_count_since_send": 0,
        "campaign_count": 89,
        "campaign_last_sent": "2025-10-15T10:00:00+00:00",
        "merge_field_count": 4,
        "avg_sub_rate": 5.2,
        "avg_unsub_rate": 0.15,
        "target_sub_rate": 6.0,
        "open_rate": 28.91,
        "click_rate": 7.43,
        "last_sub_date": "2025-10-20T14:23:11+00:00",
        "last_unsub_date": "2025-10-19T09:45:33+00:00"
      },
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/lists/a1b2c3d4e5",
          "method": "GET"
        },
        {
          "rel": "members",
          "href": "https://us1.api.mailchimp.com/3.0/lists/a1b2c3d4e5/members",
          "method": "GET"
        }
      ]
    },
    {
      "id": "f6g7h8i9j0",
      "web_id": 789012,
      "name": "Product Updates",
      "contact": {
        "company": "Example Corp",
        "address1": "123 Main Street",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94102",
        "country": "US"
      },
      "permission_reminder": "You opted in for product updates",
      "use_archive_bar": false,
      "campaign_defaults": {
        "from_name": "Example Products",
        "from_email": "products@example.com",
        "subject": "New Product Release",
        "language": "en"
      },
      "date_created": "2024-06-20T15:45:00+00:00",
      "list_rating": 3,
      "email_type_option": true,
      "subscribe_url_short": "https://eepurl.com/xyz789",
      "subscribe_url_long": "https://example.us1.list-manage.com/subscribe?u=xyz789&id=uvw456",
      "beamer_address": "us1-xyz789-uvw456@inbound.mailchimp.com",
      "visibility": "prv",
      "double_optin": false,
      "has_welcome": false,
      "marketing_permissions": true,
      "stats": {
        "member_count": 1234,
        "unsubscribe_count": 56,
        "cleaned_count": 4,
        "member_count_since_send": 12,
        "unsubscribe_count_since_send": 1,
        "cleaned_count_since_send": 0,
        "campaign_count": 23,
        "campaign_last_sent": "2025-10-10T09:00:00+00:00",
        "merge_field_count": 3,
        "avg_sub_rate": 3.5,
        "avg_unsub_rate": 0.12,
        "open_rate": 32.45,
        "click_rate": 9.12,
        "last_sub_date": "2025-10-18T11:15:22+00:00",
        "last_unsub_date": "2025-10-17T16:30:44+00:00"
      }
    }
  ],
  "total_items": 2,
  "constraints": {
    "may_create": true,
    "max_instances": 100,
    "current_total_instances": 2
  },
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/lists?count=10&offset=0",
      "method": "GET"
    }
  ]
}
```

## Implementation Notes

- Schema location: `/src/schemas/mailchimp/lists-success.schema.ts`
- Params location: `/src/schemas/mailchimp/lists-params.schema.ts`
- Error schema: `/src/schemas/mailchimp/lists-error.schema.ts`
- Page location: `/src/app/mailchimp/lists/page.tsx`
- Implemented: Yes

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/lists/get-lists-info/
