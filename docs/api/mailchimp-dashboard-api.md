# Mailchimp Dashboard API Documentation

## Endpoint

`GET /api/mailchimp/dashboard`

Returns summarized campaign and audience data for the dashboard.

---

## Query Parameters

- `limit` (number, optional): Number of campaigns to return (default: 10, min: 1, max: 100)
- `page` (number, optional): Page number for pagination (default: 1, min: 1)
- `type` (string, optional): Campaign type filter
- `startDate` (string, optional): Start date in `yyyy-mm-dd` format
- `endDate` (string, optional): End date in `yyyy-mm-dd` format

---

## Validation & Error Handling

- All parameters are validated explicitly.
- Date parameters must match `yyyy-mm-dd` format.
- Returns HTTP 400 for invalid parameters.
- Returns HTTP 502 for Mailchimp API errors.
- Returns HTTP 500 for unexpected errors.
- Uses custom error classes for clear error responses.

---

## Response

### Success (200)

```
{
  "campaigns": [
    {
      "id": "string",
      "title": "string",
      "status": "string",
      "emailsSent": 123,
      "openRate": 0.45,
      "clickRate": 0.12,
      "sendTime": "2025-08-26T12:00:00Z"
    }
    // ... up to `limit` campaigns
  ],
  "audiences": { /* audience summary data */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 57,
    "totalPages": 6
  },
  "appliedFilters": {
    "dateRange": {
      "startDate": "2025-08-01T00:00:00.000Z",
      "endDate": "2025-08-26T23:59:59.999Z"
    },
    "hasActiveFilters": true
  },
  "metadata": {
    "lastUpdated": "2025-08-26T14:00:00.000Z",
    "rateLimit": 1000
  }
}
```

### Error (400, 502, 500)

```
{
  error: string,
  details?: string
}
```

---

## Notes

- Pagination is applied only to campaign data.
- Audience data is always returned in full.
- All date filters must use ISO format (yyyy-mm-dd).

---

## Example Request

```
GET /api/mailchimp/dashboard?limit=20&page=2&type=regular&startDate=2025-08-01&endDate=2025-08-15
```

---

## Related Files

- `src/app/api/mailchimp/dashboard/route.ts`
- `src/types/api-errors.ts`
- `src/types/campaign-filters.ts`

---

## Notes

- Follows Next.js App Router and project best practices for error handling and validation.
- See PRD.md and copilot-instructions.md for architectural and quality requirements.
