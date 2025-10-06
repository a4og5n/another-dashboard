# Mailchimp OAuth2 Migration Guide

## Overview

This project has migrated from API key authentication to OAuth 2.0 for Mailchimp integration.

## For Existing Users

### What Changed

- **Before:** One API key shared by all users
- **After:** Each user connects their own Mailchimp account

### Migration Steps

1. Visit `/settings/integrations` or `/mailchimp`
2. Click "Connect Mailchimp"
3. Log in to Mailchimp and approve access
4. Your personal dashboard will load

## For Developers

### Environment Variables

**Removed:**

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX`

**Added:**

- `MAILCHIMP_CLIENT_ID`
- `MAILCHIMP_CLIENT_SECRET`
- `MAILCHIMP_REDIRECT_URI`
- `DATABASE_URL` (from Neon)
- `POSTGRES_PRISMA_URL` (from Neon)
- `POSTGRES_URL` (from Neon)
- `ENCRYPTION_KEY`

### Database Setup

```bash
# Install dependencies
pnpm install

# Push schema to Neon Postgres
pnpm db:push

# Verify tables created
# Option 1: Neon Console (https://console.neon.tech)
# Option 2: Vercel Dashboard → Storage → Database → Data
```

### Local Development

1. Create Neon database via Vercel integration (Storage tab)
2. Pull environment variables: `vercel env pull .env.local`
3. Register Mailchimp OAuth app (use `https://127.0.0.1:3000/api/auth/mailchimp/callback`)
4. Generate encryption key: `openssl rand -base64 32`
5. Update `.env.local` with Mailchimp OAuth credentials and encryption key
6. Push database schema: `pnpm db:push`
7. Start dev server: `pnpm dev`
8. Visit `https://127.0.0.1:3000/mailchimp` and connect

## Security

- Tokens encrypted at rest in database using AES-256-GCM
- CSRF protection via state parameter
- HTTPS-only redirects in production
- HTTP-only cookies for OAuth state
- Tokens never logged or exposed to client
- Hourly token validation with auto-deactivation

## Troubleshooting

### "Mailchimp not connected" error

**Solution:** Visit `/settings/integrations` and click "Connect Mailchimp"

### "Invalid state" error

**Causes:**

- Cookie expired (OAuth flow took > 10 minutes)
- CSRF validation failed

**Solution:**

- Clear cookies and try OAuth flow again
- Ensure redirect URI matches exactly in Mailchimp app settings
- Check that cookies are enabled in browser

### Database connection errors

**Solution:**

- Verify `DATABASE_URL` or `POSTGRES_PRISMA_URL` in environment variables
- Check Neon database is active in [Neon Console](https://console.neon.tech)
- Verify Vercel integration is properly connected
- Run `pnpm db:push` to ensure schema is up to date

### Token encryption errors

**Causes:**

- Missing or invalid `ENCRYPTION_KEY`
- Wrong key length (must be 32 bytes base64 encoded)

**Solution:**

- Generate new key: `openssl rand -base64 32`
- Add to `.env.local` and Vercel environment variables
- Verify key is exactly 44 characters (32 bytes base64 encoded)

### Mailchimp OAuth app registration

**Important Notes:**

- **DO NOT use `localhost`** - Mailchimp requires `127.0.0.1` for local development
- Add multiple redirect URIs for different environments:
  - Local: `https://127.0.0.1:3000/api/auth/mailchimp/callback`
  - Production: `https://your-domain.vercel.app/api/auth/mailchimp/callback`
  - Preview: `https://*-your-project.vercel.app/api/auth/mailchimp/callback`

## Architecture Changes

### Before (API Key)

```
User → Next.js App → Mailchimp API (shared API key)
```

### After (OAuth 2.0)

```
User (Kinde Auth)
    ↓
Next.js App (Vercel)
    ↓
OAuth Flow → Mailchimp (user-specific token)
    ↓
Encrypted Tokens → Neon Postgres
    ↓
User-Scoped API Calls
```

## Testing

### Automated Tests

```bash
# Run all tests
pnpm test

# Run repository tests (requires database)
pnpm test src/db/repositories/mailchimp-connection.test.ts

# Run OAuth route tests
pnpm test src/app/api/auth/mailchimp/authorize/route.test.ts
```

### Manual Testing

See [docs/oauth-manual-testing-checklist.md](oauth-manual-testing-checklist.md) for comprehensive test cases.

## Migration Timeline

**Completed Phases:**

- ✅ Phase 1: Database setup (Neon Postgres + Drizzle ORM)
- ✅ Phase 2: Token encryption & management (AES-256-GCM)
- ✅ Phase 3: OAuth2 flow implementation
- ✅ Phase 4: Service layer migration to user-scoped tokens
- ✅ Phase 5: UI components with empty states
- ✅ Phase 6: Settings/Integrations page
- ✅ Phase 7: Testing & validation
- ✅ Phase 8: Migration & cleanup

## Additional Resources

- **Main Migration Plan:** [docs/mailchimp-oauth2-migration-plan.md](mailchimp-oauth2-migration-plan.md)
- **Progress Tracking:** [docs/oauth-migration-progress.md](oauth-migration-progress.md)
- **Testing Checklist:** [docs/oauth-manual-testing-checklist.md](oauth-manual-testing-checklist.md)
- **CLAUDE.md:** Project setup and development guidelines

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the migration plan and progress documents
3. Check existing GitHub issues
4. Create a new issue with detailed error logs and steps to reproduce
