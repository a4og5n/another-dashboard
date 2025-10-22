# Click Details

## Overview

Retrieves detailed statistics about which URLs were clicked in a campaign, including click counts, percentages, and A/B split test data. This endpoint provides insights into link engagement and click behavior.

## Endpoint Details

- **Method**: GET
- **Path**: `/reports/{campaign_id}/click-details`
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
| sort_field     | string | No       | -       | Field to sort by: `total_clicks` or `unique_clicks`         |
| sort_dir       | string | No       | -       | Sort direction: `ASC` or `DESC`                             |

## Response Schema

### Success Response

The response contains click statistics for each URL in the campaign:

- **urls_clicked** (array): List of URLs that were clicked
  - **id** (string): Unique ID for this URL
  - **url** (string): The clicked URL
  - **total_clicks** (number): Total number of clicks on this URL
  - **click_percentage** (number): Percentage of total clicks (0-100)
  - **unique_clicks** (number): Number of unique members who clicked
  - **unique_click_percentage** (number): Percentage of unique clicks (0-100)
  - **last_click** (string): ISO 8601 datetime of last click, or empty string if never clicked
  - **ab_split** (object, optional): A/B split test data (only for A/B campaigns)
    - **a** (object): Group A metrics
      - **total_clicks_a** (number): Total clicks in group A
      - **click_percentage_a** (number): Click percentage in group A (0-100)
      - **unique_clicks_a** (number): Unique clicks in group A
      - **unique_click_percentage_a** (number): Unique click percentage in group A (0-100)
    - **b** (object): Group B metrics
      - **total_clicks_b** (number): Total clicks in group B
      - **click_percentage_b** (number): Click percentage in group B (0-100)
      - **unique_clicks_b** (number): Unique clicks in group B
      - **unique_click_percentage_b** (number): Unique click percentage in group B (0-100)
  - **campaign_id** (string): Campaign ID
  - **\_links** (array, optional): HATEOAS links for this URL
- **campaign_id** (string): Campaign ID
- **total_items** (number): Total number of clicked URLs

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
  "urls_clicked": [
    {
      "id": "abc123",
      "url": "https://example.com/product/special-offer",
      "total_clicks": 456,
      "click_percentage": 52.11,
      "unique_clicks": 387,
      "unique_click_percentage": 52.58,
      "last_click": "2025-10-20T14:52:33+00:00",
      "campaign_id": "42694e9e57",
      "_links": [
        {
          "rel": "self",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/click-details/abc123",
          "method": "GET"
        },
        {
          "rel": "members",
          "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/click-details/abc123/members",
          "method": "GET"
        }
      ]
    },
    {
      "id": "def456",
      "url": "https://example.com/blog/latest-news",
      "total_clicks": 234,
      "click_percentage": 26.71,
      "unique_clicks": 198,
      "unique_click_percentage": 26.9,
      "last_click": "2025-10-19T16:23:11+00:00",
      "campaign_id": "42694e9e57"
    },
    {
      "id": "ghi789",
      "url": "https://example.com/unsubscribe",
      "total_clicks": 186,
      "click_percentage": 21.23,
      "unique_clicks": 152,
      "unique_click_percentage": 20.65,
      "last_click": "2025-10-18T11:45:22+00:00",
      "ab_split": {
        "a": {
          "total_clicks_a": 98,
          "click_percentage_a": 52.69,
          "unique_clicks_a": 81,
          "unique_click_percentage_a": 53.29
        },
        "b": {
          "total_clicks_b": 88,
          "click_percentage_b": 47.31,
          "unique_clicks_b": 71,
          "unique_click_percentage_b": 46.71
        }
      },
      "campaign_id": "42694e9e57"
    }
  ],
  "campaign_id": "42694e9e57",
  "total_items": 12,
  "_links": [
    {
      "rel": "self",
      "href": "https://us1.api.mailchimp.com/3.0/reports/42694e9e57/click-details?count=10&offset=0",
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

- Schema location: `/src/schemas/mailchimp/report-click-details-success.schema.ts`
- Params location: `/src/schemas/mailchimp/report-click-details-params.schema.ts`
- Error schema: `/src/schemas/mailchimp/report-click-details-error.schema.ts`
- Page location: `/src/app/mailchimp/reports/[id]/clicks/page.tsx`
- Implemented: Yes

## Mailchimp API Reference

https://mailchimp.com/developer/marketing/api/click-reports/list-campaign-click-details/
