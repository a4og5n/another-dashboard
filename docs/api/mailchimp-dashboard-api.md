## Mailchimp Audience Schemas

All Mailchimp Audience schemas are defined in `src/schemas/mailchimp` and exported via `index.ts` using path aliases.

- **MailchimpAudienceSchema**: Validates Mailchimp Audience objects. [API Reference](https://mailchimp.com/developer/marketing/api/audiences/get-a-list-of-audiences/)
- **MailchimpAudienceQuerySchema**: Validates query parameters for audience API requests.
- **MailchimpAudienceResponseSchema**: Validates the success response from the audience API.
- **mailchimpAudienceErrorResponseSchema**: Extends the shared error schema for audience-specific errors.

### Usage Example

```typescript
import { MailchimpAudienceSchema } from "@/schemas/mailchimp";

const result = MailchimpAudienceSchema.safeParse(audienceData);
if (!result.success) {
  // Handle validation errors
}
```

### Error Response Strategy

- Compare all error response fields to the shared schema.
- Use the shared schema if fields match exactly.
- Extend the shared schema if there are additional/different fields.
- Create a custom schema if the structure is fundamentally different.

### Path Aliases

All imports/exports use path aliases as defined in `tsconfig.json` for maintainability and clarity.

# Mailchimp Dashboard API Documentation

## Endpoint

`GET /api/mailchimp/dashboard`

Returns summarized campaign and audience data for the dashboard.

---

## Query Parameters

- `limit` (number, optional): Number of campaigns to return (default: 25, min: 1, max: 100)
- `page` (number, optional): Page number for pagination (default: 1, min: 1)
- `type` (string, optional): Campaign type filter
- `startDate` (string, optional): Start date in `yyyy-mm-dd` format
- `endDate` (string, optional): End date in `yyyy-mm-dd` format

---

## Validation & Error Handling

# Mailchimp Dashboard API Schema Modularization

## Schema Folder Structure & Conventions

All Mailchimp-related schemas are stored in `src/schemas/mailchimp/`.

Each major API resource (campaigns, audiences, reports, members, templates) has its own schema file:

- `campaign.schema.ts`
- `audience.schema.ts`
- `report.schema.ts`
- `member.schema.ts`
- `template.schema.ts`

An `index.ts` re-exports all schemas for easy imports and enforces a single import point for Mailchimp validation logic.

### Naming Conventions

- Use PascalCase for Zod schema constants (e.g., `MailchimpCampaignSchema`).
- Use ALL_CAPS for enums/constants (e.g., `MAILCHIMP_CAMPAIGN_STATUS`).

### Rationale & Template for Other Data Sources

This folder structure and naming convention is now the standard for all future data source integrations (Mailjet, Wordpress, etc.).
Each new integration should:

- Create a subfolder in `src/schemas/` (e.g., `mailjet/`, `wordpress/`)
- Use atomic schema files per API resource
- Re-export all schemas from an `index.ts`
- Follow the same naming conventions for Zod schemas and enums

### Benefits

- Atomic, maintainable schema files
- Strict validation and type safety
- Easy extension for new resources and platforms
- Consistent developer experience and onboarding

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

```json
{
  "error": "string",
  "details": "string | Array<{ path: string[], message: string }>"
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

Example error response for invalid date:

```json
{
  "error": "Invalid query parameters",
  "details": [
    {
      "path": ["startDate"],
      "message": "Invalid date format or value"
    }
  ]
}
```

---

# Mailchimp Campaigns API Documentation

## Endpoint

`GET /api/mailchimp/campaigns`

Returns campaign reports and details. Supports filtering, pagination, and metadata in response.

---

## Query Parameters

- `fields` (string, optional): Comma-separated list of fields to include in response
- `exclude_fields` (string, optional): Comma-separated list of fields to exclude from response
- `count` (string, optional): Number of records to return (0–1000)
- `offset` (string, optional): Number of records to skip (>= 0)
- `type` (string, optional): Campaign type (`regular`, `plaintext`, `absplit`, `rss`, `automation`, `variate`)
- `before_send_time` (string, optional): ISO8601 date string, campaigns sent before this time
- `since_send_time` (string, optional): ISO8601 date string, campaigns sent after this time
- `reports` (string, optional): If `true`, returns campaign reports

---

## Validation & Error Handling

- All parameters are validated using Zod schema ([src/schemas/mailchimp-campaigns.ts])
- Returns HTTP 400 for invalid parameters with detailed error messages
- Returns HTTP 500 for internal server errors
- Uses custom error classes for clear error responses ([src/actions/mailchimp-campaigns.ts])

Example error response:

```json
{
  "error": "Invalid query parameters",
  "details": [
    { "path": ["count"], "message": "count must be between 0 and 1000" }
  ]
}
```

---

## Response

### Success (200)

```json
{
  "reports": [ ... ],
  "metadata": {
    "fields": ["id", "type"],
    "count": 10,
    "lastUpdated": "2025-08-26T20:00:00Z",
    "rateLimit": { ... }
  }
}
```

### Error (400, 500)

```json
{
  "error": "string",
  "details": "string | Array<{ path: string[], message: string }>"
}
```

---

## Notes

- All validation and error handling follows project standards ([.github/copilot-instructions.md])
- See [src/types/mailchimp-campaigns.ts] for TypeScript types
- See [src/app/api/mailchimp/campaigns/route.ts] for implementation
- See [README.md] and [docs/api-implementation-summary.md] for usage and integration details
