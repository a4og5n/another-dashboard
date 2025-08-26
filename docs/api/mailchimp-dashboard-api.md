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
  campaigns: { ... },
  audiences: { ... },
  appliedFilters: {
    dateRange: { startDate, endDate },
    hasActiveFilters: boolean
  },
  metadata: {
    lastUpdated: string,
    rateLimit: number
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
