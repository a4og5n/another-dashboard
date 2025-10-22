# Unsubscribed Members

## Overview

Retrieves a list of members who unsubscribed from a specific campaign, including their contact information, unsubscribe timestamp, and optional reason. This endpoint helps analyze unsubscribe patterns and reasons.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}/unsubscribed`
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

The response contains a list of members who unsubscribed:

- **unsubscribes** (array): List of unsubscribed members
  - **email_id** (string): Unique email ID
  - **email_address** (string): Email address
  - **merge_fields** (object): Custom merge fields (key-value pairs)
    - Can contain strings, numbers, or address objects
    - Address objects have: addr1, addr2 (optional), city, state, zip, country (optional)
  - **vip** (boolean): Whether the member is marked as VIP
  - **timestamp** (string): ISO 8601 datetime when the member unsubscribed
  - **reason** (string, optional): Unsubscribe reason provided by the member
  - **campaign_id** (string): Campaign ID
  - **list_id** (string): List ID
  - **list_is_active** (boolean): Whether the list is active
  - **\_links** (array, optional): HATEOAS links
- **campaign_id** (string): Campaign ID
- **total_items** (number): Total number of unsubscribes

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
  "unsubscribes": [
    {
      "email_id": "f1e2d3c4b5a6",
      "email_address": "unsubscriber@example.com",
      "merge_fields": {
        "FNAME": "John",
        "LNAME": "Doe",
        "PHONE": "555-0123"
      },
      "vip": false,
      "timestamp": "2025-10-15T14:32:11+00:00",
      "reason": "Too many emails",
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/unsubscribed/f1e2d3c4b5a6",
          "method": "GET"
        }
      ]
    },
    {
      "email_id": "a6b5c4d3e2f1",
      "email_address": "another.unsubscriber@example.com",
      "merge_fields": {
        "FNAME": "Jane",
        "LNAME": "Smith",
        "COMPANY": "Acme Corp",
        "ADDRESS": {
          "addr1": "123 Main St",
          "city": "Springfield",
          "state": "IL",
          "zip": "62701",
          "country": "US"
        }
      },
      "vip": false,
      "timestamp": "2025-10-16T09:15:44+00:00",
      "reason": "Not interested anymore",
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true
    },
    {
      "email_id": "z9y8x7w6v5u4",
      "email_address": "no-reason@example.com",
      "merge_fields": {
        "FNAME": "Bob",
        "LNAME": "Johnson"
      },
      "vip": true,
      "timestamp": "2025-10-17T11:42:33+00:00",
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true
    }
  ],
  "campaign_id": "42694e9e57",
  "total_items": 15,
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/unsubscribed?count=10&offset=0",
      "method": "GET"
    },
    {
      "rel": "parent",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57",
      "method": "GET"
    }
  ]
}
```

## Implementation Notes

- Schema location: `/src/schemas/mailchimp/unsubscribes-success.schema.ts`, `/src/schemas/mailchimp/common/report-list-member.schema.ts`
- Params location: `/src/schemas/mailchimp/unsubscribes-params.schema.ts`
- Error schema: `/src/schemas/mailchimp/unsubscribes-error.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/unsubscribes/page.tsx`
- Implemented: Yes

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/unsub-reports/list-unsubscribed-members/
