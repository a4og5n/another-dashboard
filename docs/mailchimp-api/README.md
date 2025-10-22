# Mailchimp API Reference

Local documentation for Mailchimp Marketing API endpoints used in Fichaz.

## Purpose

This directory contains human-readable, AI-friendly documentation for Mailchimp API endpoints. Benefits:

- **Fast Development** - No web fetching during schema creation
- **Accurate Documentation** - Clarified ambiguities from official docs
- **Version Controlled** - Track implementation progress
- **Offline Access** - Work without internet dependency
- **AI-Optimized** - Structured for Claude Code workflow

## Documentation Status

### Reports API

- ✅ [Campaign Report Summary](./reports/campaign-report.md) - `GET /reports/{id}`
- ✅ [Email Activity](./reports/email-activity.md) - `GET /reports/{id}/email-activity`
- ✅ [Open Details](./reports/open-details.md) - `GET /reports/{id}/open-details`
- ✅ [Click Details](./reports/click-details.md) - `GET /reports/{id}/click-details`
- ✅ [Unsubscribed Members](./reports/unsubscribed.md) - `GET /reports/{id}/unsubscribed`
- ✅ [Abuse Reports](./reports/abuse-reports.md) - `GET /reports/{id}/abuse-reports`
- 📋 [Bounces](./reports/bounces.md) - `GET /reports/{id}/bounces` (planned)

### Lists API

- ✅ [All Lists](./lists/all-lists.md) - `GET /lists`
- ✅ [List Details](./lists/list-details.md) - `GET /lists/{id}`
- 📋 [List Members](./lists/list-members.md) - `GET /lists/{id}/members` (planned)
- 📋 [Growth History](./lists/growth-history.md) - `GET /lists/{id}/growth-history` (planned)

### Campaigns API

- ✅ [All Campaigns](./campaigns/all-campaigns.md) - `GET /campaigns`

## Documentation Format

Each endpoint document follows this structure:

````markdown
# Endpoint Name

## Overview

Brief description of what the endpoint does

## Endpoint Details

- **Method**: GET/POST/etc
- **Path**: /path/to/endpoint
- **Authentication**: OAuth 2.0 required

## Path Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

## Query Parameters

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |

## Response Schema

Detailed nested structure with types

## Example Response

```json
{
  "field": "value"
}
```
````

## Notes

- Special cases
- Gotchas
- Implementation tips

```

## How to Use

### For AI Assistants

When implementing a new endpoint:
1. Read the corresponding markdown file
2. Use the documented schema to create Zod schemas
3. Reference example responses for validation

### For Developers

- Reference when debugging API issues
- Validate response structures
- Understand parameter constraints

## Maintenance

- Update when Mailchimp API changes
- Add notes for discovered edge cases
- Document new endpoints as implemented

---

**Last Updated**: 2025-10-22
**Mailchimp API Version**: 3.0
```
