# Mailchimp Reports API Endpoints Reference

Complete list of all Reports API endpoints from the official Mailchimp Marketing API.

**Source:** https://mailchimp.com/developer/marketing/api/reports/
**Last Updated:** 2025-01-22

---

## Reports

### List campaign reports

`GET /reports`

### Get campaign report

`GET /reports/{campaign_id}`

---

## Campaign Abuse

### List abuse reports

`GET /reports/{campaign_id}/abuse-reports`

### Get abuse report

`GET /reports/{campaign_id}/abuse-reports/{report_id}`

---

## Campaign Advice

### List campaign feedback

`GET /reports/{campaign_id}/advice`

---

## Campaign Open Reports

### List campaign open details

`GET /reports/{campaign_id}/open-details`

### Get opened campaign subscriber

`GET /reports/{campaign_id}/open-details/{subscriber_hash}`

---

## Click Reports

### List campaign details

`GET /reports/{campaign_id}/click-details`

### Get campaign link details

`GET /reports/{campaign_id}/click-details/{link_id}`

---

## Click Reports Members

### List clicked link subscribers

`GET /reports/{campaign_id}/click-details/{link_id}/members`

### Get clicked link subscriber

`GET /reports/{campaign_id}/click-details/{link_id}/members/{subscriber_hash}`

---

## Domain Performance

### List domain performance stats

`GET /reports/{campaign_id}/domain-performance`

---

## Ecommerce Product Activity

### List campaign product activity

`GET /reports/{campaign_id}/ecommerce-product-activity`

---

## EepURL Reports

### List EepURL activity

`GET /reports/{campaign_id}/eepurl`

---

## Email Activity

### List email activity

`GET /reports/{campaign_id}/email-activity`

### Get subscriber email activity

`GET /reports/{campaign_id}/email-activity/{subscriber_hash}`

---

## Location

### List top open activities

`GET /reports/{campaign_id}/locations`

---

## Sent To

### List campaign recipients

`GET /reports/{campaign_id}/sent-to`

### Get campaign recipient info

`GET /reports/{campaign_id}/sent-to/{subscriber_hash}`

---

## Sub-Reports

### List child campaign reports

`GET /reports/{campaign_id}/sub-reports`

---

## Unsubscribes

### List unsubscribed members

`GET /reports/{campaign_id}/unsubscribed`

### Get unsubscribed member

`GET /reports/{campaign_id}/unsubscribed/{subscriber_hash}`

---

## Implementation Status

Track which endpoints have been implemented in `/docs/api-coverage.md`.

**Implemented (✅):**

- Campaign Reports (list and detail)
- Campaign Opens
- Campaign Clicks
- Campaign Unsubscribes
- Campaign Email Activity
- Campaign Recipients (Sent To)
- Campaign Locations
- Campaign Abuse Reports

**Next Priority:**

- Campaign Advice
- Domain Performance
- Sub-Reports

**Future:**

- Ecommerce Product Activity
- EepURL Reports
- Individual subscriber detail endpoints
