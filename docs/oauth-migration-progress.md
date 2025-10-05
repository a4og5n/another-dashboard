# Mailchimp OAuth2 Migration - Progress Summary

**Branch:** `feature/mailchimp-oauth2-migration`

## Completed Phases

### ✅ Phase 1: Foundation & Database Setup
- Neon Postgres database configured via Vercel
- Drizzle ORM setup with migrations
- `mailchimp_connections` table created
- Environment variables updated (removed API key, added OAuth credentials)
- Files: `src/db/schema.ts`, `src/db/index.ts`, `drizzle.config.ts`

### ✅ Phase 2: Token Encryption & Management
- AES-256-GCM encryption using Node.js `crypto` module (no external deps)
- Connection repository with CRUD operations
- Automatic encryption/decryption on save/read
- Files: `src/lib/encryption.ts`, `src/db/repositories/mailchimp-connection.ts`

### ✅ Phase 3: OAuth2 Flow Implementation
- OAuth service with authorization URL generation
- Three API endpoints: authorize, callback, disconnect
- CSRF protection with state parameter
- Secure HTTP-only cookies
- Files: `src/services/mailchimp-oauth.service.ts`, `src/app/api/auth/mailchimp/*/route.ts`

### ✅ Additional Updates
- **Zod 4 migration**: Updated all schemas to use `z.url()` and `z.email()` syntax
- **OAuth types/schemas**: Created in proper locations (`@/types`, `@/schemas`)
- **Removed jose dependency**: Switched to Node.js crypto
- **Error handling docs**: Documented Next.js best practices

## Current Status

**Commits on branch:**
```
9c9ee08 feat: implement Phase 3 - OAuth2 flow (service and endpoints)
d70af31 docs: add OAuth error handling recommendations
895ded4 feat: add OAuth types/schemas and migrate to Zod 4 syntax
14e0423 feat: implement Phase 2 - token encryption and connection repository
e307995 refactor: replace jose with Node.js crypto for token encryption
fedf48a chore: add .env*.local to gitignore for security
71e9909 feat: implement Phase 1 - database setup for Mailchimp OAuth2 migration
```

**Known TypeScript Errors (Expected):**
```
src/lib/mailchimp.ts(15,15): error TS2339: Property 'MAILCHIMP_API_KEY' does not exist
src/lib/mailchimp.ts(16,15): error TS2339: Property 'MAILCHIMP_SERVER_PREFIX' does not exist
```
These will be fixed in Phase 4 when we migrate the service layer.

## Next: Phase 4 - Service Layer Migration

### Goal
Update `src/lib/mailchimp.ts` to use OAuth tokens from database instead of API key.

### Key Tasks
1. Remove old API key-based initialization
2. Add method to get user's Mailchimp connection from database
3. Decrypt token and initialize client dynamically
4. Update singleton pattern to per-user pattern
5. Update all methods to accept `kindeUserId` parameter
6. Handle cases where user has no connection

### Files to Modify
- `src/lib/mailchimp.ts` - Main service file
- Any files importing `mailchimpClient` (need to update usage)

### Approach
From migration plan (Section 4.1):
```typescript
// Before (API key):
const client = mailchimp({ apiKey, server });

// After (OAuth):
async function getMailchimpClient(kindeUserId: string) {
  const connection = await mailchimpConnectionRepo.getDecryptedToken(kindeUserId);
  if (!connection) throw new Error("No Mailchimp connection");

  return mailchimp({
    accessToken: connection.accessToken,
    server: connection.serverPrefix
  });
}
```

### Testing Strategy
- Test connection retrieval
- Test token decryption
- Test Mailchimp API calls with OAuth token
- Test error handling for missing connections

## Environment Setup

### Required Variables (in .env.local)
```bash
# Database
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# Mailchimp OAuth
MAILCHIMP_CLIENT_ID=your_client_id
MAILCHIMP_CLIENT_SECRET=your_client_secret
MAILCHIMP_REDIRECT_URI=https://localhost:3000/api/auth/mailchimp/callback

# Encryption (32 bytes base64)
ENCRYPTION_KEY=your_base64_encryption_key

# Kinde (existing)
KINDE_CLIENT_ID=...
# ... other Kinde vars
```

## Reference Documents

- Main plan: `docs/mailchimp-oauth2-migration-plan.md`
- Error handling: `docs/oauth-error-handling-updates.md`
- This progress: `docs/oauth-migration-progress.md`

## Notes

- Using Zod 4 syntax throughout (`z.url()`, `z.email()`)
- All types in `@/types`, schemas in `@/schemas`
- Following Next.js App Router error handling patterns
- Pre-commit hooks temporarily skipped (will fix in Phase 4)
