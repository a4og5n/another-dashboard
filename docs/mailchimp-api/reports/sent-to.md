# Sent To Recipients

## Overview

Retrieves a list of members who were sent a specific campaign, including delivery status and member information. This endpoint helps analyze campaign reach and delivery success rates.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}/sent-to`
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
| count          | number | No       | 10      | Number of records to return (1-1000)                        |
| offset         | number | No       | 0       | Number of records to skip for pagination                    |

## Response Schema

### Success Response

The response contains a list of members who were sent the campaign:

- **sent_to** (array): List of campaign recipients
  - **email_id** (string): Unique email ID (MD5 hash of lowercase email)
  - **email_address** (string): Email address of the recipient
  - **merge_fields** (object): Custom merge fields (key-value pairs)
    - Can contain strings, numbers, or address objects
    - Address objects have: addr1, addr2 (optional), city, state, zip, country (optional)
  - **vip** (boolean): Whether the member is marked as VIP
  - **status** (string): Delivery status (`sent`, `hard`, `soft`)
  - **open_count** (number): Number of times the email was opened
  - **last_open** (string, optional): ISO 8601 datetime of last open
  - **click_count** (number): Number of clicks
  - **last_click** (string, optional): ISO 8601 datetime of last click
  - **campaign_id** (string): Campaign ID
  - **list_id** (string): List ID
  - **list_is_active** (boolean): Whether the list is active
  - **contact_status** (string): Member status (`subscribed`, `unsubscribed`, `cleaned`, `pending`)
  - **\_links** (array, optional): HATEOAS links
- **campaign_id** (string): Campaign ID
- **total_items** (number): Total number of recipients

### Pagination

- **\_links** (array): HATEOAS links for pagination
  - **rel** (string): Relation type (self, next, prev, parent)
  - **href** (string): URL
  - **method** (string): HTTP method
  - **targetSchema** (string, optional): Target schema
  - **schema** (string, optional): Schema

## Example Response

```json
{
  "sent_to": [
    {
      "email_id": "a1b2c3d4e5f6",
      "email_address": "subscriber@example.com",
      "merge_fields": {
        "FNAME": "Jane",
        "LNAME": "Doe",
        "COMPANY": "Example Corp"
      },
      "vip": true,
      "status": "sent",
      "open_count": 3,
      "last_open": "2025-10-20T15:30:00+00:00",
      "click_count": 2,
      "last_click": "2025-10-20T15:35:00+00:00",
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "contact_status": "subscribed",
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/sent-to/a1b2c3d4e5f6",
          "method": "GET"
        }
      ]
    },
    {
      "email_id": "f6e5d4c3b2a1",
      "email_address": "member@example.com",
      "merge_fields": {
        "FNAME": "John",
        "LNAME": "Smith",
        "ADDRESS": {
          "addr1": "456 Oak Ave",
          "city": "Portland",
          "state": "OR",
          "zip": "97201",
          "country": "US"
        }
      },
      "vip": false,
      "status": "sent",
      "open_count": 1,
      "last_open": "2025-10-19T10:15:00+00:00",
      "click_count": 0,
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "contact_status": "subscribed"
    },
    {
      "email_id": "z9y8x7w6v5u4",
      "email_address": "bounced@example.com",
      "merge_fields": {
        "FNAME": "Bob",
        "LNAME": "Johnson"
      },
      "vip": false,
      "status": "hard",
      "open_count": 0,
      "click_count": 0,
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "contact_status": "cleaned"
    }
  ],
  "campaign_id": "42694e9e57",
  "total_items": 1247,
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/sent-to?count=10&offset=0",
      "method": "GET"
    },
    {
      "rel": "parent",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57",
      "method": "GET"
    },
    {
      "rel": "next",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/sent-to?count=10&offset=10",
      "method": "GET"
    }
  ]
}
```

## Implementation Notes

- Schema location: `/src/schemas/mailchimp/sent-to-success.schema.ts`
- Params location: `/src/schemas/mailchimp/sent-to-params.schema.ts`
- Error schema: `/src/schemas/mailchimp/sent-to-error.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/sent-to/page.tsx`
- Implemented: No (in progress)

## Status Field Values

- **sent**: Email was successfully delivered
- **hard**: Hard bounce (permanent delivery failure)
- **soft**: Soft bounce (temporary delivery failure)

## Contact Status Field Values

- **subscribed**: Active subscriber
- **unsubscribed**: Opted out
- **cleaned**: Removed due to bounces
- **pending**: Pending confirmation

## Use Cases

- View all recipients of a campaign
- Analyze delivery success rates
- Track engagement metrics per recipient
- Identify bounced emails
- Filter by VIP status or contact status

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/sent-to-reports/list-campaign-recipients/
