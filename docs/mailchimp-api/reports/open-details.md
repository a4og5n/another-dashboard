# Open Details

## Overview

Retrieves detailed information about members who opened a specific campaign, including individual open timestamps and whether opens were detected via proxy. This endpoint supports pagination and filtering to analyze email open behavior.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}/open-details`
- **Authentication**: OAuth 2.0 required

## Path Parameters

| Parameter   | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| campaign_id | string | Yes      | The unique ID for the campaign |

## Query Parameters

| Parameter      | Type   | Required | Default | Description                                                    |
| -------------- | ------ | -------- | ------- | -------------------------------------------------------------- |
| fields         | string | No       | -       | Comma-separated list of fields to include in the response      |
| exclude_fields | string | No       | -       | Comma-separated list of fields to exclude from the response    |
| count          | number | No       | 10      | Number of records to return (1-1000)                           |
| offset         | number | No       | 0       | Number of records to skip for pagination                       |
| since          | string | No       | -       | ISO 8601 datetime to restrict results to opens since this time |
| sort_field     | string | No       | -       | Field to sort by                                               |
| sort_dir       | string | No       | -       | Sort direction: `ASC` or `DESC`                                |

## Response Schema

### Success Response

The response contains a list of members who opened the campaign:

- **members** (array): List of members who opened the campaign
  - **campaign_id** (string): Campaign ID
  - **list_id** (string): List ID
  - **list_is_active** (boolean): Whether the list is active
  - **contact_status** (string): Contact status
  - **email_id** (string): Unique email ID
  - **email_address** (string): Email address
  - **merge_fields** (object): Custom merge fields (key-value pairs)
    - Can contain strings, numbers, or address objects
    - Address objects have: addr1, addr2 (optional), city, state, zip, country (optional)
  - **vip** (boolean): Whether the member is marked as VIP
  - **opens_count** (number): Total number of opens by this member
  - **proxy_excluded_opens_count** (number): Opens excluding proxy opens
  - **opens** (array): Individual open events
    - **timestamp** (string): ISO 8601 datetime of the open
    - **is_proxy_open** (boolean): Whether this was detected as a proxy open
  - **\_links** (array, optional): HATEOAS links
- **campaign_id** (string): Campaign ID
- **total_opens** (number): Total number of opens across all members
- **total_proxy_excluded_opens** (number): Total opens excluding proxy opens
- **total_items** (number): Total number of members who opened

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
  "members": [
    {
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "contact_status": "subscribed",
      "email_id": "f1e2d3c4b5a6",
      "email_address": "subscriber@example.com",
      "merge_fields": {
        "FNAME": "John",
        "LNAME": "Doe",
        "PHONE": "555-0123"
      },
      "vip": false,
      "opens_count": 3,
      "proxy_excluded_opens_count": 2,
      "opens": [
        {
          "timestamp": "2025-10-15T11:23:45+00:00",
          "is_proxy_open": false
        },
        {
          "timestamp": "2025-10-15T14:12:33+00:00",
          "is_proxy_open": true
        },
        {
          "timestamp": "2025-10-16T09:45:21+00:00",
          "is_proxy_open": false
        }
      ],
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/open-details/f1e2d3c4b5a6",
          "method": "GET"
        }
      ]
    },
    {
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "contact_status": "subscribed",
      "email_id": "a6b5c4d3e2f1",
      "email_address": "another@example.com",
      "merge_fields": {
        "FNAME": "Jane",
        "LNAME": "Smith",
        "COMPANY": "Acme Corp"
      },
      "vip": true,
      "opens_count": 1,
      "proxy_excluded_opens_count": 1,
      "opens": [
        {
          "timestamp": "2025-10-15T10:15:00+00:00",
          "is_proxy_open": false
        }
      ]
    }
  ],
  "campaign_id": "42694e9e57",
  "total_opens": 3245,
  "total_proxy_excluded_opens": 2891,
  "total_items": 1456,
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/open-details?count=10&offset=0",
      "method": "GET"
    },
    {
      "rel": "next",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/open-details?count=10&offset=10",
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

- Schema location: `/src/schemas/mailchimp/report-open-details-success.schema.ts`, `/src/schemas/mailchimp/common/report-list-member.schema.ts`
- Params location: `/src/schemas/mailchimp/report-open-details-params.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/opens/page.tsx`
- Implemented: Yes

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/open-reports/list-campaign-open-details/
