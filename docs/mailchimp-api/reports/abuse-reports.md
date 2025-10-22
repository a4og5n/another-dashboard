# Abuse Reports

## Overview

Retrieves a list of abuse complaints (spam reports) for a specific campaign. This endpoint provides information about members who marked the campaign as spam, including their contact details and the date of the complaint.

**Note**: The Mailchimp API endpoint is `/reports/{campaign_id}/abuse-reports` but the internal API path uses `abuse-complaints`. Both terms refer to the same data.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}/abuse-reports`
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

The response contains a list of abuse reports:

- **abuse_reports** (array): List of abuse complaints
  - **id** (number): Unique ID for the abuse report
  - **campaign_id** (string): Campaign ID
  - **list_id** (string): List ID
  - **list_is_active** (boolean): Whether the list is active
  - **email_id** (string): Unique email ID
  - **email_address** (string): Email address of the reporter
  - **merge_fields** (object, optional): Custom merge fields (key-value pairs)
    - Can contain strings, numbers, or address objects
    - Address objects have: addr1, addr2 (optional), city, state, zip, country (optional)
  - **vip** (boolean): Whether the member is marked as VIP
  - **date** (string): ISO 8601 datetime when the abuse report was filed
  - **\_links** (array): HATEOAS links
- **campaign_id** (string): Campaign ID
- **total_items** (number): Total number of abuse reports

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
  "abuse_reports": [
    {
      "id": 12345,
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "email_id": "f1e2d3c4b5a6",
      "email_address": "reporter@example.com",
      "merge_fields": {
        "FNAME": "John",
        "LNAME": "Doe",
        "PHONE": "555-0123"
      },
      "vip": false,
      "date": "2025-10-15T16:45:22+00:00",
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/abuse-reports/12345",
          "method": "GET"
        },
        {
          "rel": "parent",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/abuse-reports",
          "method": "GET"
        },
        {
          "rel": "campaign",
          "href": "https://us1.api.mailchimp.com/3.0/campaigns/42694e9e57",
          "method": "GET"
        }
      ]
    },
    {
      "id": 12346,
      "campaign_id": "42694e9e57",
      "list_id": "a1b2c3d4e5",
      "list_is_active": true,
      "email_id": "a6b5c4d3e2f1",
      "email_address": "another.reporter@example.com",
      "merge_fields": {
        "FNAME": "Jane",
        "LNAME": "Smith",
        "COMPANY": "Acme Corp"
      },
      "vip": false,
      "date": "2025-10-16T10:23:11+00:00",
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/abuse-reports/12346",
          "method": "GET"
        },
        {
          "rel": "parent",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/abuse-reports",
          "method": "GET"
        },
        {
          "rel": "campaign",
          "href": "https://us1.api.mailchimp.com/3.0/campaigns/42694e9e57",
          "method": "GET"
        }
      ]
    }
  ],
  "campaign_id": "42694e9e57",
  "total_items": 2,
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/abuse-reports",
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

- Schema location: `/src/schemas/mailchimp/abuse-reports-success.schema.ts`, `/src/schemas/mailchimp/common/report-list-member.schema.ts`
- Params location: `/src/schemas/mailchimp/abuse-reports-params.schema.ts`
- Error schema: `/src/schemas/mailchimp/abuse-reports-error.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/abuse-reports/page.tsx`
- Implemented: Yes
- Note: Unlike other report endpoints, this endpoint does not support pagination parameters (count/offset) - it returns all abuse reports for the campaign

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/campaign-abuse/list-abuse-reports/
