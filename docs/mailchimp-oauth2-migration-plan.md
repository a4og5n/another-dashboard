# Mailchimp OAuth2 Migration - Detailed Implementation Plan

**Project**: Another Dashboard - OAuth2 Migration
**Target Completion**: 2-3 days
**Database**: Neon Postgres (via Vercel) + Drizzle ORM
**Authentication**: Kinde (existing)
**Hosting**: Vercel

---

## Phase 1: Foundation Setup (4-5 hours)

### Section 1.1: Neon Postgres Setup via Vercel (15 minutes)

**Tasks:**

1. **Create Neon Database via Vercel Integration**
   - Go to your Vercel project dashboard
   - Navigate to **Storage** tab
   - Click **"Create Database"**
   - Select **"Neon"** (Serverless Postgres) - should be already selected
   - Click **"Continue"**
   - In Neon setup:
     - Database name: Accept default or customize
     - Region: Choose closest to your Vercel deployment region
   - Click **"Create"** or **"Connect"**
   - Wait for provisioning (~1-2 minutes)
   - **Important:** Vercel automatically adds environment variables to your project

2. **Verify Environment Variables in Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify these were automatically added by Neon integration:
     - `DATABASE_URL` - Pooled connection string (default)
     - `POSTGRES_URL` - Full connection string
     - `POSTGRES_PRISMA_URL` - Direct connection (we'll use this with Drizzle)
     - `POSTGRES_URL_NON_POOLING` - Direct connection without pooling
     - Other vars: `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`
   - These should be set for: Production, Preview, Development

3. **Pull Environment Variables to Local Development**

   ```bash
   # Use Vercel CLI to pull environment variables
   vercel env pull .env.local

   # This will download all environment variables to .env.local
   ```

   **Alternative (Manual):**
   - Copy `POSTGRES_PRISMA_URL` from Vercel Dashboard
   - Add to `.env.local` (see step 4 below)

4. **Update Environment Variables**

   ```bash
   # Add to .env.local (if not using vercel env pull)
   POSTGRES_PRISMA_URL=postgres://user:password@host/database

   # Mailchimp OAuth (register app first - see Section 1.3)
   MAILCHIMP_CLIENT_ID=your-client-id
   MAILCHIMP_CLIENT_SECRET=your-client-secret
   MAILCHIMP_REDIRECT_URI=https://your-domain.vercel.app/api/auth/mailchimp/callback

   # Keep existing Kinde vars
   KINDE_CLIENT_ID=...
   KINDE_CLIENT_SECRET=...
   # ... (rest of Kinde config)
   ```

5. **Update Vercel Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add all Supabase and Mailchimp OAuth variables
   - Set for: Production, Preview, Development

---

### Section 1.2: Install Dependencies (15 minutes)

**Install packages:**

```bash
# Database - Neon Postgres with Drizzle ORM
pnpm add @neondatabase/serverless drizzle-orm
pnpm add -D drizzle-kit

# Alternative: Use standard postgres client (also works with Neon)
# pnpm add postgres drizzle-orm

# Encryption for tokens
pnpm add jose  # For JWT and encryption (lightweight, edge-compatible)

# OAuth utilities
pnpm add nanoid  # For generating secure state parameters
```

**Note:** Neon provides `@neondatabase/serverless` which is optimized for edge/serverless environments and works over HTTP. It's compatible with Vercel Edge Runtime.

**Update `package.json` scripts:**

```json
{
  "scripts": {
    // ... existing scripts
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

### Section 1.3: Register Mailchimp OAuth App (20 minutes)

**Steps:**

1. **Navigate to Mailchimp Account**
   - Login to Mailchimp → Account → Extras → API Keys
   - Click "Register and Manage Your Apps"
   - Click "Register an App"

2. **Fill Registration Form**

   ```
   App Name: Another Dashboard
   App Description: Unified marketing analytics dashboard
   Company/Organization: [Your Company Name]
   App Website: https://your-domain.vercel.app (use your production Vercel URL)
   Redirect URI: https://127.0.0.1:3000/api/auth/mailchimp/callback
   ```

   **Important Notes:**
   - **App Website**: Use your production Vercel URL (e.g., `https://another-dashboard-eight.vercel.app`)
   - **Redirect URI**: Use `https://127.0.0.1:3000/api/auth/mailchimp/callback` for local development
   - **DO NOT use `localhost`** - Mailchimp requires `127.0.0.1` instead of `localhost` for local development

3. **Save Credentials**
   - Copy `Client ID` and `Client Secret` (shown only once!)
   - Add to `.env.local` and Vercel environment variables

4. **Add Production Redirect URI (After Initial Setup)**
   - Go back to your registered app in Mailchimp
   - Add additional redirect URI: `https://your-domain.vercel.app/api/auth/mailchimp/callback`
   - Optional: Add preview deployment URI: `https://*-your-username.vercel.app/api/auth/mailchimp/callback`
   - Mailchimp allows multiple redirect URIs per app

---

### Section 1.4: Database Schema Setup (1.5 hours)

**Create Drizzle configuration:**

**File: `drizzle.config.ts`** (project root)

```typescript
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_PRISMA_URL!,
  },
  verbose: true,
  strict: true,
});
```

**File: `src/db/schema.ts`** (new file)

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Mailchimp OAuth Connections
 * Links Kinde users to their Mailchimp accounts via OAuth tokens
 */
export const mailchimpConnections = pgTable("mailchimp_connections", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Link to Kinde user
  kindeUserId: text("kinde_user_id").notNull().unique(),

  // OAuth tokens (encrypted at application layer)
  accessToken: text("access_token").notNull(),
  serverPrefix: text("server_prefix").notNull(), // us1, us19, etc.

  // Mailchimp account metadata
  accountId: text("account_id"),
  email: text("email"),
  username: text("username"),

  // Connection status
  isActive: boolean("is_active").default(true).notNull(),

  // Metadata from Mailchimp (store full response for reference)
  metadata: jsonb("metadata").$type<{
    dc: string;
    role?: string;
    accountName?: string;
    login?: { email?: string; login_id?: string };
  }>(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastValidatedAt: timestamp("last_validated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertMailchimpConnectionSchema = createInsertSchema(
  mailchimpConnections,
  {
    kindeUserId: z.string().min(1, "Kinde user ID is required"),
    accessToken: z.string().min(1, "Access token is required"),
    serverPrefix: z.string().regex(/^[a-z]{2,4}\d*$/, "Invalid server prefix"),
    email: z.string().email().optional(),
  },
);

export const selectMailchimpConnectionSchema =
  createSelectSchema(mailchimpConnections);

// TypeScript types
export type MailchimpConnection = typeof mailchimpConnections.$inferSelect;
export type NewMailchimpConnection = typeof mailchimpConnections.$inferInsert;

// Future: Add tables for other integrations (Google Analytics, YouTube, etc.)
// export const googleAnalyticsConnections = pgTable(...);
// export const youtubeConnections = pgTable(...);
```

**Create database client:**

**File: `src/db/index.ts`** (new file)

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Neon Postgres connection with Drizzle ORM
 * Uses Neon's serverless driver optimized for edge/serverless environments
 * Works over HTTP with automatic connection pooling
 */

// Get connection string from environment
const connectionString =
  process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL or POSTGRES_PRISMA_URL environment variable is not set",
  );
}

// Create Neon client
const sql = neon(connectionString);

// Create Drizzle instance
export const db = drizzle(sql, { schema });

// Export schema for queries
export { schema };
```

**Run migration:**

```bash
# Generate migration SQL
pnpm db:generate

# Push schema to Supabase
pnpm db:push

# Verify in Supabase Dashboard → Table Editor
```

**Expected output:**

- Table: `mailchimp_connections` with all columns
- Indexes: Primary key on `id`, unique on `kinde_user_id`

**Verify in Neon Console:**

- Go to Neon Console (https://console.neon.tech)
- Select your project
- Navigate to Tables
- Should see `mailchimp_connections` table

**Alternative: Verify via Vercel:**

- Go to Vercel Dashboard → Storage → Your Database → Data
- Should see `mailchimp_connections` table

---

### Section 1.5: Update Environment Config (45 minutes)

**Update `src/lib/config.ts`:**

```typescript
// Add to existing envSchema
const envSchema = z.object({
  // ... existing fields (NODE_ENV, NEXT_PUBLIC_APP_URL, etc.)

  // Remove old Mailchimp API key fields
  // MAILCHIMP_API_KEY: z.string()... ❌ DELETE
  // MAILCHIMP_SERVER_PREFIX: z.string()... ❌ DELETE

  // Add Neon Postgres (via Vercel)
  DATABASE_URL: z.string().url("Database connection URL required").optional(),
  POSTGRES_PRISMA_URL: z
    .string()
    .url("Postgres connection URL required")
    .optional(),
  // At least one must be present
  POSTGRES_URL: z.string().url().optional(), // Pooled connection

  // Add Mailchimp OAuth
  MAILCHIMP_CLIENT_ID: z.string().min(1, "Mailchimp Client ID is required"),
  MAILCHIMP_CLIENT_SECRET: z
    .string()
    .min(1, "Mailchimp Client Secret is required"),
  MAILCHIMP_REDIRECT_URI: z
    .string()
    .url("Mailchimp Redirect URI must be a valid URL"),

  // Encryption key for tokens (generate with: openssl rand -base64 32)
  ENCRYPTION_KEY: z
    .string()
    .length(44, "Encryption key must be 32 bytes base64 encoded"),

  // ... rest of existing fields (GA4, YouTube, Meta, etc.)
});
```

**Generate encryption key:**

```bash
# Run in terminal
openssl rand -base64 32

# Copy output and add to .env.local
ENCRYPTION_KEY=your-generated-key-here
```

**Update `.env.local.template`:**

```bash
# Neon Postgres Configuration (via Vercel integration)
DATABASE_URL=postgres://user:password@host/database
POSTGRES_PRISMA_URL=postgres://user:password@host/database
POSTGRES_URL=postgres://user:password@host/database

# Mailchimp OAuth Configuration
MAILCHIMP_CLIENT_ID=your-mailchimp-client-id
MAILCHIMP_CLIENT_SECRET=your-mailchimp-client-secret
MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback

# Encryption (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your-encryption-key-here

# Kinde Authentication (existing)
KINDE_CLIENT_ID=...
# ... (keep existing Kinde vars)

# Development Settings
NODE_ENV=development
DEBUG_API_CALLS=true
```

---

## Phase 2: Token Encryption & Management (2 hours)

### Section 2.1: Token Encryption Utility (1 hour)

**File: `src/lib/encryption.ts`** (new file)

```typescript
import { jwtEncrypt, jwtDecrypt } from "jose";
import { env } from "@/lib/config";

/**
 * Token Encryption/Decryption using JWT + AES
 * Ensures tokens are encrypted at rest in database
 */

// Convert base64 encryption key to Uint8Array
const SECRET_KEY = new TextEncoder().encode(env.ENCRYPTION_KEY);

/**
 * Encrypt a token (access token, refresh token, etc.)
 * @param plaintext - Token to encrypt
 * @returns Encrypted JWT string
 */
export async function encryptToken(plaintext: string): Promise<string> {
  try {
    const jwt = await new jwtEncrypt({ data: plaintext })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .encrypt(SECRET_KEY);

    return jwt;
  } catch (error) {
    console.error("Token encryption failed:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt a token
 * @param encrypted - Encrypted JWT string
 * @returns Decrypted plaintext token
 */
export async function decryptToken(encrypted: string): Promise<string> {
  try {
    const { payload } = await jwtDecrypt(encrypted, SECRET_KEY);
    return payload.data as string;
  } catch (error) {
    console.error("Token decryption failed:", error);
    throw new Error("Failed to decrypt token");
  }
}

/**
 * Test encryption/decryption (development only)
 */
export async function testEncryption() {
  if (env.NODE_ENV !== "development") return;

  const testToken = "test-token-123-abc";
  const encrypted = await encryptToken(testToken);
  const decrypted = await decryptToken(encrypted);

  console.assert(testToken === decrypted, "Encryption test failed!");
  console.log("✅ Encryption test passed");
}
```

**Test encryption:**

```typescript
// Add to src/app/api/test-encryption/route.ts (temporary, delete after testing)
import { testEncryption } from "@/lib/encryption";

export async function GET() {
  await testEncryption();
  return Response.json({ success: true });
}

// Visit: https://localhost:3000/api/test-encryption
// Should see: ✅ Encryption test passed
```

---

### Section 2.2: Connection Repository (1 hour)

**File: `src/repositories/mailchimp-connection.repository.ts`** (new file)

```typescript
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { encryptToken, decryptToken } from "@/lib/encryption";
import type { MailchimpConnection, NewMailchimpConnection } from "@/db/schema";

/**
 * Repository pattern for Mailchimp connections
 * Handles all database operations + encryption/decryption
 */

export class MailchimpConnectionRepository {
  /**
   * Find connection by Kinde user ID
   */
  async findByKindeUserId(
    kindeUserId: string,
  ): Promise<MailchimpConnection | null> {
    const [connection] = await db
      .select()
      .from(schema.mailchimpConnections)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId))
      .limit(1);

    return connection || null;
  }

  /**
   * Get decrypted access token for user
   */
  async getDecryptedToken(kindeUserId: string): Promise<{
    accessToken: string;
    serverPrefix: string;
    isActive: boolean;
  } | null> {
    const connection = await this.findByKindeUserId(kindeUserId);

    if (!connection) return null;
    if (!connection.isActive) return null;

    try {
      const accessToken = await decryptToken(connection.accessToken);
      return {
        accessToken,
        serverPrefix: connection.serverPrefix,
        isActive: connection.isActive,
      };
    } catch (error) {
      console.error("Failed to decrypt token:", error);
      return null;
    }
  }

  /**
   * Create new connection (encrypts token before saving)
   */
  async create(data: {
    kindeUserId: string;
    accessToken: string;
    serverPrefix: string;
    accountId?: string;
    email?: string;
    username?: string;
    metadata?: Record<string, unknown>;
  }): Promise<MailchimpConnection> {
    const encryptedToken = await encryptToken(data.accessToken);

    const [connection] = await db
      .insert(schema.mailchimpConnections)
      .values({
        kindeUserId: data.kindeUserId,
        accessToken: encryptedToken,
        serverPrefix: data.serverPrefix,
        accountId: data.accountId,
        email: data.email,
        username: data.username,
        metadata: data.metadata,
        isActive: true,
        lastValidatedAt: new Date(),
      })
      .returning();

    return connection;
  }

  /**
   * Update connection (re-encrypt token if provided)
   */
  async update(
    kindeUserId: string,
    data: Partial<{
      accessToken: string;
      serverPrefix: string;
      isActive: boolean;
      lastValidatedAt: Date;
      metadata: Record<string, unknown>;
    }>,
  ): Promise<MailchimpConnection | null> {
    const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };

    // Re-encrypt token if updating
    if (data.accessToken) {
      updates.accessToken = await encryptToken(data.accessToken);
    }

    const [updated] = await db
      .update(schema.mailchimpConnections)
      .set(updates)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId))
      .returning();

    return updated || null;
  }

  /**
   * Mark connection as inactive (soft delete)
   */
  async deactivate(kindeUserId: string): Promise<boolean> {
    const result = await db
      .update(schema.mailchimpConnections)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));

    return result.rowCount > 0;
  }

  /**
   * Hard delete connection (for GDPR/user deletion)
   */
  async delete(kindeUserId: string): Promise<boolean> {
    const result = await db
      .delete(schema.mailchimpConnections)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));

    return result.rowCount > 0;
  }

  /**
   * Update last validated timestamp (for token health checks)
   */
  async touchValidation(kindeUserId: string): Promise<void> {
    await db
      .update(schema.mailchimpConnections)
      .set({ lastValidatedAt: new Date() })
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));
  }
}

// Singleton instance
export const mailchimpConnectionRepo = new MailchimpConnectionRepository();
```

---

## Phase 3: OAuth2 Flow Implementation (4 hours)

### Section 3.1: OAuth Types & Schemas (30 minutes)

**File: `src/types/mailchimp/oauth.ts`** (new file)

```typescript
import { z } from "zod";

/**
 * Mailchimp OAuth2 Types
 * Based on: https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/
 */

// Authorization URL parameters
export const OAuthAuthorizationParamsSchema = z.object({
  response_type: z.literal("code"),
  client_id: z.string(),
  redirect_uri: z.string().url(),
  state: z.string().optional(), // CSRF protection
});

export type OAuthAuthorizationParams = z.infer<
  typeof OAuthAuthorizationParamsSchema
>;

// Token exchange request
export const OAuthTokenRequestSchema = z.object({
  grant_type: z.literal("authorization_code"),
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uri: z.string().url(),
  code: z.string(),
});

export type OAuthTokenRequest = z.infer<typeof OAuthTokenRequestSchema>;

// Token response from Mailchimp
export const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
  scope: z.string().optional(),
});

export type OAuthTokenResponse = z.infer<typeof OAuthTokenResponseSchema>;

// Metadata response (to get server prefix)
export const OAuthMetadataResponseSchema = z.object({
  dc: z.string(), // Data center / server prefix
  role: z.string().optional(),
  accountname: z.string().optional(),
  user_id: z.number().optional(),
  login: z
    .object({
      email: z.string().email().optional(),
      avatar: z.string().url().optional(),
      login_id: z.string().optional(),
      login_name: z.string().optional(),
      login_email: z.string().email().optional(),
    })
    .optional(),
  api_endpoint: z.string().url(),
});

export type OAuthMetadataResponse = z.infer<typeof OAuthMetadataResponseSchema>;

// Callback query parameters
export const OAuthCallbackParamsSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export type OAuthCallbackParams = z.infer<typeof OAuthCallbackParamsSchema>;
```

**Update `src/types/mailchimp/index.ts`:**

```typescript
// Add to existing exports
export * from "@/types/mailchimp/oauth";
```

---

### Section 3.2: OAuth Service (1.5 hours)

**File: `src/services/mailchimp-oauth.service.ts`** (new file)

```typescript
import { env } from "@/lib/config";
import { nanoid } from "nanoid";
import type {
  OAuthTokenResponse,
  OAuthMetadataResponse,
} from "@/types/mailchimp";

/**
 * Mailchimp OAuth2 Service
 * Handles authorization flow, token exchange, and metadata retrieval
 */

export class MailchimpOAuthService {
  private readonly clientId = env.MAILCHIMP_CLIENT_ID;
  private readonly clientSecret = env.MAILCHIMP_CLIENT_SECRET;
  private readonly redirectUri = env.MAILCHIMP_REDIRECT_URI;

  private readonly authorizationUrl =
    "https://login.mailchimp.com/oauth2/authorize";
  private readonly tokenUrl = "https://login.mailchimp.com/oauth2/token";
  private readonly metadataUrl = "https://login.mailchimp.com/oauth2/metadata";

  /**
   * Generate authorization URL with CSRF protection
   * @returns { url, state } - Redirect URL and state parameter to verify callback
   */
  generateAuthorizationUrl(): { url: string; state: string } {
    const state = nanoid(32); // Cryptographically secure random string

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
    });

    const url = `${this.authorizationUrl}?${params.toString()}`;

    return { url, state };
  }

  /**
   * Exchange authorization code for access token
   * @param code - Authorization code from callback
   */
  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
    });

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token exchange failed:", error);
      throw new Error(
        `Failed to exchange code for token: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data as OAuthTokenResponse;
  }

  /**
   * Get account metadata (server prefix, account info)
   * @param accessToken - OAuth access token
   */
  async getMetadata(accessToken: string): Promise<OAuthMetadataResponse> {
    const response = await fetch(this.metadataUrl, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Metadata fetch failed:", error);
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const data = await response.json();
    return data as OAuthMetadataResponse;
  }

  /**
   * Complete OAuth flow: exchange code → get metadata
   * @param code - Authorization code from callback
   * @returns Combined token and metadata
   */
  async completeOAuthFlow(code: string): Promise<{
    accessToken: string;
    serverPrefix: string;
    metadata: OAuthMetadataResponse;
  }> {
    // Step 1: Exchange code for access token
    const tokenResponse = await this.exchangeCodeForToken(code);

    // Step 2: Get server prefix and account metadata
    const metadata = await this.getMetadata(tokenResponse.access_token);

    return {
      accessToken: tokenResponse.access_token,
      serverPrefix: metadata.dc,
      metadata,
    };
  }
}

// Singleton instance
export const mailchimpOAuthService = new MailchimpOAuthService();
```

---

### Section 3.3: OAuth API Routes (2 hours)

**File: `src/app/api/auth/mailchimp/authorize/route.ts`** (new file)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { cookies } from "next/headers";

/**
 * POST /api/auth/mailchimp/authorize
 * Initiates Mailchimp OAuth flow
 *
 * Flow:
 * 1. Check user is authenticated (Kinde)
 * 2. Generate authorization URL with state parameter
 * 3. Store state in cookie for CSRF verification
 * 4. Redirect user to Mailchimp authorization page
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    // 2. Generate authorization URL
    const { url, state } = mailchimpOAuthService.generateAuthorizationUrl();

    // 3. Store state in secure HTTP-only cookie for CSRF verification
    const cookieStore = await cookies();
    cookieStore.set("mailchimp_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    // 4. Return authorization URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("OAuth authorization error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 },
    );
  }
}
```

**File: `src/app/api/auth/mailchimp/callback/route.ts`** (new file)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpOAuthService } from "@/services/mailchimp-oauth.service";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";
import { cookies } from "next/headers";

/**
 * GET /api/auth/mailchimp/callback
 * OAuth callback endpoint - Mailchimp redirects here after authorization
 *
 * Flow:
 * 1. Verify CSRF state parameter
 * 2. Exchange authorization code for access token
 * 3. Get account metadata (server prefix, email, etc.)
 * 4. Save encrypted connection to database
 * 5. Redirect to dashboard
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  try {
    // 1. Handle OAuth errors (user denied, etc.)
    if (error) {
      console.error("OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/mailchimp?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    // 2. Verify required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=missing_parameters", request.url),
      );
    }

    // 3. Verify CSRF state
    const cookieStore = await cookies();
    const storedState = cookieStore.get("mailchimp_oauth_state")?.value;

    if (!storedState || storedState !== state) {
      console.error("State mismatch:", { storedState, receivedState: state });
      return NextResponse.redirect(
        new URL("/mailchimp?error=invalid_state", request.url),
      );
    }

    // 4. Verify user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.redirect(
        new URL("/mailchimp?error=unauthorized", request.url),
      );
    }

    // 5. Complete OAuth flow (exchange code + get metadata)
    const { accessToken, serverPrefix, metadata } =
      await mailchimpOAuthService.completeOAuthFlow(code);

    // 6. Check if connection already exists
    const existingConnection = await mailchimpConnectionRepo.findByKindeUserId(
      user.id,
    );

    if (existingConnection) {
      // Update existing connection
      await mailchimpConnectionRepo.update(user.id, {
        accessToken,
        serverPrefix,
        isActive: true,
        lastValidatedAt: new Date(),
        metadata: {
          dc: metadata.dc,
          role: metadata.role,
          accountName: metadata.accountname,
          login: metadata.login,
        },
      });
    } else {
      // Create new connection
      await mailchimpConnectionRepo.create({
        kindeUserId: user.id,
        accessToken,
        serverPrefix,
        accountId: metadata.user_id?.toString(),
        email: metadata.login?.login_email || metadata.login?.email,
        username: metadata.login?.login_name,
        metadata: {
          dc: metadata.dc,
          role: metadata.role,
          accountName: metadata.accountname,
          login: metadata.login,
        },
      });
    }

    // 7. Clear state cookie
    cookieStore.delete("mailchimp_oauth_state");

    // 8. Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL("/mailchimp?connected=true", request.url),
    );
  } catch (error) {
    console.error("OAuth callback error:", error);

    // Clear state cookie on error
    const cookieStore = await cookies();
    cookieStore.delete("mailchimp_oauth_state");

    return NextResponse.redirect(
      new URL("/mailchimp?error=connection_failed", request.url),
    );
  }
}
```

**File: `src/app/api/auth/mailchimp/disconnect/route.ts`** (new file)

```typescript
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";

/**
 * POST /api/auth/mailchimp/disconnect
 * Disconnect Mailchimp account (soft delete - mark inactive)
 */
export async function POST() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await mailchimpConnectionRepo.deactivate(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 },
    );
  }
}
```

**File: `src/app/api/auth/mailchimp/status/route.ts`** (new file)

```typescript
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";

/**
 * GET /api/auth/mailchimp/status
 * Check if user has active Mailchimp connection
 */
export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ connected: false });
    }

    const connection = await mailchimpConnectionRepo.findByKindeUserId(user.id);

    return NextResponse.json({
      connected: !!connection && connection.isActive,
      email: connection?.email,
      accountId: connection?.accountId,
      lastValidated: connection?.lastValidatedAt,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ connected: false });
  }
}
```

---

## Phase 4: Update Mailchimp Service Layer (2 hours)

### Section 4.1: Create User-Scoped Mailchimp Client (1.5 hours)

**Update `src/lib/mailchimp.ts`:**

```typescript
/**
 * User-Scoped Mailchimp SDK Setup
 * Creates Mailchimp client instances per user based on OAuth tokens
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import mailchimp from "@mailchimp/mailchimp_marketing";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";
import type { ApiResponse } from "@/types/api-errors";

/**
 * Get user-specific Mailchimp client
 * Retrieves OAuth token from database and configures SDK
 */
export async function getUserMailchimpClient() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  // Get decrypted token from database
  const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

  if (!connection) {
    throw new Error("Mailchimp not connected. Please connect your account.");
  }

  if (!connection.isActive) {
    throw new Error("Mailchimp connection is inactive. Please reconnect.");
  }

  // Create new client instance with user's token
  const client = mailchimp.setConfig({
    accessToken: connection.accessToken,
    server: connection.serverPrefix,
  });

  return client;
}

/**
 * Simple error formatter for SDK responses
 */
function formatError(error: any): string {
  if (error.response?.body?.detail) {
    return error.response.body.detail;
  }
  if (error.response?.body?.title) {
    return error.response.body.title;
  }
  if (error.message) {
    return error.message;
  }
  return "An unknown error occurred";
}

/**
 * Wrapper for SDK calls with user-scoped client and error handling
 */
export async function mailchimpCall<T>(
  sdkCall: (client: typeof mailchimp) => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const client = await getUserMailchimpClient();
    const data = await sdkCall(client);
    return { success: true, data };
  } catch (error: any) {
    // Handle connection errors
    if (
      error.message?.includes("not connected") ||
      error.message?.includes("inactive")
    ) {
      return { success: false, error: error.message };
    }

    return { success: false, error: formatError(error) };
  }
}

// Remove global SDK export - now user-scoped
// export { mailchimp }; ❌ DELETE
```

**Update `src/services/mailchimp.service.ts`:**

```typescript
/**
 * Mailchimp Service Layer (OAuth-based)
 * All methods now use user-scoped OAuth tokens
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { mailchimpCall } from "@/lib/mailchimp";
import type { ApiResponse } from "@/types/api-errors";
import type {
  Report,
  ReportListSuccess,
  ReportSuccess,
  RootSuccess,
  ListsSuccess,
  ListsParams,
  ReportListParams,
  OpenListQueryParams,
} from "@/types/mailchimp";

export type { Report as CampaignReport };

export class MailchimpService {
  /**
   * List Operations
   */
  async getLists(params: ListsParams): Promise<ApiResponse<ListsSuccess>> {
    return mailchimpCall((client) => (client as any).lists.getAllLists(params));
  }

  async getList(listId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).lists.getList(listId));
  }

  /**
   * Campaign Operations
   */
  async getCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).campaigns.list(params));
  }

  async getCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).campaigns.get(campaignId));
  }

  /**
   * Campaign Report Operations
   */
  async getCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpCall((client) =>
      (client as any).reports.getAllCampaignReports(params),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpCall((client) =>
      (client as any).reports.getCampaignReport(campaignId),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) =>
      (client as any).reports.getCampaignOpenDetails(campaignId, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpCall((client) => (client as any).root.getRoot(params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpCall((client) => (client as any).ping.get());
  }
}

/**
 * Singleton instance - now uses OAuth tokens per request
 */
export const mailchimpService = new MailchimpService();
```

---

### Section 4.2: Token Validation Middleware (30 minutes)

**File: `src/lib/validate-mailchimp-connection.ts`** (new file)

```typescript
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";
import { mailchimpService } from "@/services/mailchimp.service";

/**
 * Validate Mailchimp connection and token health
 * Call this in server components/actions before making API calls
 */
export async function validateMailchimpConnection(): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return { isValid: false, error: "User not authenticated" };
    }

    const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

    if (!connection) {
      return { isValid: false, error: "mailchimp_not_connected" };
    }

    if (!connection.isActive) {
      return { isValid: false, error: "mailchimp_connection_inactive" };
    }

    // Optional: Validate token with lightweight API call
    // Only do this once per session/hour to avoid rate limits
    const lastValidated = await mailchimpConnectionRepo.findByKindeUserId(
      user.id,
    );
    const hoursSinceValidation = lastValidated?.lastValidatedAt
      ? (Date.now() - lastValidated.lastValidatedAt.getTime()) /
        (1000 * 60 * 60)
      : 999;

    if (hoursSinceValidation > 1) {
      // Validate with ping endpoint
      const pingResult = await mailchimpService.healthCheck();

      if (!pingResult.success) {
        // Token invalid - mark connection inactive
        await mailchimpConnectionRepo.update(user.id, { isActive: false });
        return { isValid: false, error: "mailchimp_token_invalid" };
      }

      // Update last validated timestamp
      await mailchimpConnectionRepo.touchValidation(user.id);
    }

    return { isValid: true };
  } catch (error) {
    console.error("Connection validation error:", error);
    return { isValid: false, error: "validation_failed" };
  }
}
```

---

## Phase 5: UI Components & Empty States (3 hours)

### Section 5.1: Empty State Component (1 hour)

**File: `src/components/mailchimp/mailchimp-empty-state.tsx`** (new file)

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

/**
 * Empty state shown when user hasn't connected Mailchimp
 * Prompts OAuth connection flow
 */

interface MailchimpEmptyStateProps {
  error?: string | null;
}

export function MailchimpEmptyState({ error }: MailchimpEmptyStateProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  async function handleConnect() {
    setIsConnecting(true);

    try {
      // Call authorize endpoint to get OAuth URL
      const response = await fetch("/api/auth/mailchimp/authorize", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate connection");
      }

      const { url } = await response.json();

      // Redirect to Mailchimp OAuth page
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to Mailchimp. Please try again.");
      setIsConnecting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Connect Your Mailchimp Account</CardTitle>
          <CardDescription className="text-base mt-2">
            View campaign analytics, audience insights, and performance metrics
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {getErrorMessage(error)}
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            size="lg"
            className="w-full"
          >
            {isConnecting ? (
              <>Connecting...</>
            ) : (
              <>
                Connect Mailchimp
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-muted-foreground">
              <strong className="text-foreground">Safe & Secure:</strong> We use OAuth 2.0
              for authentication. You can revoke access anytime from your Mailchimp account settings.
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By connecting, you authorize Another Dashboard to access your Mailchimp data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    access_denied: "You denied access to Mailchimp. Please try again if you'd like to connect.",
    invalid_state: "Security validation failed. Please try connecting again.",
    unauthorized: "Please log in to connect your Mailchimp account.",
    connection_failed: "Failed to establish connection. Please try again.",
    missing_parameters: "Invalid OAuth response. Please try again.",
  };

  return messages[error] || "An error occurred. Please try again.";
}
```

---

### Section 5.2: Connection Banner (30 minutes)

**File: `src/components/mailchimp/mailchimp-connection-banner.tsx`** (new file)

```typescript
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, X } from "lucide-react";

/**
 * Banner shown after OAuth connection (success or error)
 * Auto-dismisses after 5 seconds
 */

interface MailchimpConnectionBannerProps {
  connected?: boolean;
  error?: string | null;
}

export function MailchimpConnectionBanner({
  connected,
  error
}: MailchimpConnectionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (connected || error) {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connected, error]);

  if (!isVisible || (!connected && !error)) return null;

  return (
    <Alert variant={connected ? "default" : "destructive"} className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription>
                <strong>Mailchimp connected successfully!</strong> Your dashboard is now loading...
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                <strong>Connection failed.</strong> {error}
              </AlertDescription>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
```

---

### Section 5.3: Update Dashboard Page (1.5 hours)

**Update `src/app/mailchimp/page.tsx`:**

```typescript
import { Suspense } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { validateMailchimpConnection } from "@/lib/validate-mailchimp-connection";
import { MailchimpEmptyState } from "@/components/mailchimp/mailchimp-empty-state";
import { MailchimpConnectionBanner } from "@/components/mailchimp/mailchimp-connection-banner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MailchimpDashboardSkeleton } from "@/skeletons/mailchimp/MailchimpDashboardSkeleton";

// Import existing dashboard component
import { MailchimpDashboard } from "@/components/mailchimp/mailchimp-dashboard"; // Your existing component

interface MailchimpPageProps {
  searchParams: Promise<{
    connected?: string;
    error?: string;
  }>;
}

export default async function MailchimpPage({ searchParams }: MailchimpPageProps) {
  // 1. Check user authentication (Kinde)
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/api/auth/login?post_login_redirect_url=/mailchimp");
  }

  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  // 2. Check Mailchimp connection
  const connectionStatus = await validateMailchimpConnection();

  // 3. Get URL parameters for success/error messages
  const params = await searchParams;
  const showConnectedBanner = params.connected === "true";
  const errorParam = params.error;

  // 4. Show empty state if not connected
  if (!connectionStatus.isValid) {
    return (
      <DashboardLayout>
        <MailchimpEmptyState error={errorParam || connectionStatus.error} />
      </DashboardLayout>
    );
  }

  // 5. Show connected dashboard
  return (
    <DashboardLayout>
      {showConnectedBanner && <MailchimpConnectionBanner connected />}
      {errorParam && <MailchimpConnectionBanner error={errorParam} />}

      <Suspense fallback={<MailchimpDashboardSkeleton />}>
        <MailchimpDashboard />
      </Suspense>
    </DashboardLayout>
  );
}
```

---

## Phase 6: Settings/Integrations Page (2 hours)

### Section 6.1: Integrations Settings Page (2 hours)

**File: `src/app/settings/integrations/page.tsx`** (new file)

```typescript
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { mailchimpConnectionRepo } from "@/repositories/mailchimp-connection.repository";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MailchimpIntegrationCard } from "@/components/settings/mailchimp-integration-card";

export default async function IntegrationsPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    redirect("/api/auth/login?post_login_redirect_url=/settings/integrations");
  }

  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  // Get Mailchimp connection status
  const mailchimpConnection = await mailchimpConnectionRepo.findByKindeUserId(user.id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your connected data sources and API integrations
          </p>
        </div>

        <div className="grid gap-6">
          <MailchimpIntegrationCard connection={mailchimpConnection} />

          {/* Future integrations */}
          {/* <GoogleAnalyticsIntegrationCard /> */}
          {/* <YouTubeIntegrationCard /> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

**File: `src/components/settings/mailchimp-integration-card.tsx`** (new file)

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Unplug, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { MailchimpConnection } from "@/db/schema";

interface MailchimpIntegrationCardProps {
  connection: MailchimpConnection | null;
}

export function MailchimpIntegrationCard({ connection }: MailchimpIntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = connection && connection.isActive;

  async function handleConnect() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mailchimp/authorize", { method: "POST" });
      if (!response.ok) throw new Error("Failed to connect");

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to connect Mailchimp");
      setIsLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("Are you sure you want to disconnect Mailchimp? You'll need to reconnect to view your dashboard.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mailchimp/disconnect", { method: "POST" });
      if (!response.ok) throw new Error("Failed to disconnect");

      toast.success("Mailchimp disconnected successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to disconnect Mailchimp");
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Mailchimp
                {isConnected && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Email marketing and campaign analytics</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Email:</span>
                <span className="font-medium">{connection.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-mono text-xs">{connection.accountId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server:</span>
                <span className="font-mono text-xs">{connection.serverPrefix}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected:</span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(connection.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Validated:</span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(connection.lastValidatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Connection
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                <Unplug className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Connect your Mailchimp account to view campaign analytics, audience insights, and performance metrics.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Connecting..."
              ) : (
                <>
                  Connect Mailchimp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

**Update navigation sidebar** (`src/components/layout/dashboard-sidebar.tsx`):

```typescript
// Add Settings menu item
{
  title: "Settings",
  icon: Settings, // Import from lucide-react
  href: "/settings/integrations",
}
```

---

## Phase 7: Testing & Validation (3 hours)

### Section 7.1: Repository Tests (1 hour)

**File: `src/repositories/mailchimp-connection.repository.test.ts`** (new file)

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { db } from "@/db";
import { mailchimpConnectionRepo } from "./mailchimp-connection.repository";
import { eq } from "drizzle-orm";
import { schema } from "@/db";

describe("MailchimpConnectionRepository", () => {
  const testKindeUserId = "test_kinde_user_123";
  const testAccessToken = "test_access_token_abc";

  // Clean up test data after each test
  afterEach(async () => {
    await db
      .delete(schema.mailchimpConnections)
      .where(eq(schema.mailchimpConnections.kindeUserId, testKindeUserId));
  });

  describe("create", () => {
    it("should create new connection with encrypted token", async () => {
      const connection = await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
        email: "test@example.com",
      });

      expect(connection.kindeUserId).toBe(testKindeUserId);
      expect(connection.serverPrefix).toBe("us1");
      expect(connection.email).toBe("test@example.com");
      expect(connection.accessToken).not.toBe(testAccessToken); // Should be encrypted
      expect(connection.isActive).toBe(true);
    });
  });

  describe("findByKindeUserId", () => {
    it("should find existing connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const found =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(found).not.toBeNull();
      expect(found?.kindeUserId).toBe(testKindeUserId);
    });

    it("should return null for non-existent user", async () => {
      const found =
        await mailchimpConnectionRepo.findByKindeUserId("nonexistent");
      expect(found).toBeNull();
    });
  });

  describe("getDecryptedToken", () => {
    it("should decrypt token correctly", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result).not.toBeNull();
      expect(result?.accessToken).toBe(testAccessToken);
      expect(result?.serverPrefix).toBe("us1");
    });

    it("should return null for inactive connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.deactivate(testKindeUserId);

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update connection and re-encrypt token", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const newToken = "new_token_xyz";
      await mailchimpConnectionRepo.update(testKindeUserId, {
        accessToken: newToken,
        serverPrefix: "us19",
      });

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result?.accessToken).toBe(newToken);
      expect(result?.serverPrefix).toBe("us19");
    });
  });

  describe("deactivate", () => {
    it("should mark connection as inactive", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.deactivate(testKindeUserId);

      const connection =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(connection?.isActive).toBe(false);
    });
  });

  describe("delete", () => {
    it("should permanently delete connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.delete(testKindeUserId);

      const connection =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(connection).toBeNull();
    });
  });
});
```

---

### Section 7.2: OAuth Flow Integration Tests (1 hour)

**File: `src/app/api/auth/mailchimp/authorize/route.test.ts`** (new file)

```typescript
import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock Kinde auth
vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({
    getUser: vi
      .fn()
      .mockResolvedValue({ id: "test_user_123", email: "test@example.com" }),
  }),
}));

describe("POST /api/auth/mailchimp/authorize", () => {
  it("should return authorization URL for authenticated user", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/mailchimp/authorize",
      {
        method: "POST",
      },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toContain("https://login.mailchimp.com/oauth2/authorize");
    expect(data.url).toContain("client_id");
    expect(data.url).toContain("redirect_uri");
    expect(data.url).toContain("state");
  });

  it("should return 401 for unauthenticated user", async () => {
    // Mock unauthenticated user
    vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
      getKindeServerSession: () => ({
        getUser: vi.fn().mockResolvedValue(null),
      }),
    }));

    const request = new NextRequest(
      "http://localhost:3000/api/auth/mailchimp/authorize",
      {
        method: "POST",
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
```

---

### Section 7.3: Manual Testing Checklist (1 hour)

**Manual Testing Steps:**

1. **OAuth Authorization Flow**
   - [ ] Visit `/mailchimp` (not connected)
   - [ ] See empty state with "Connect Mailchimp" button
   - [ ] Click button → Redirects to Mailchimp login
   - [ ] Log in and approve access
   - [ ] Redirects back to `/mailchimp?connected=true`
   - [ ] See success banner
   - [ ] Dashboard loads with user's Mailchimp data

2. **Settings/Integrations Page**
   - [ ] Visit `/settings/integrations`
   - [ ] See Mailchimp card with "Connected" badge
   - [ ] Verify account email, server prefix displayed
   - [ ] Click "Disconnect" → Confirmation dialog
   - [ ] Confirm → Connection removed
   - [ ] Return to `/mailchimp` → Shows empty state

3. **Error Handling**
   - [ ] Start OAuth flow but deny permission
   - [ ] Redirects to `/mailchimp?error=access_denied`
   - [ ] See error message banner
   - [ ] Manually disconnect in Mailchimp dashboard
   - [ ] Try loading `/mailchimp` → Shows reconnect banner

4. **CSRF Protection**
   - [ ] Intercept OAuth callback with invalid state
   - [ ] Should redirect to error page

5. **Multi-User Isolation**
   - [ ] User A connects Mailchimp
   - [ ] Log out, log in as User B
   - [ ] User B sees empty state (not User A's connection)
   - [ ] User B connects own Mailchimp
   - [ ] Both users see only their own data

6. **Token Encryption**
   - [ ] Check database via Supabase dashboard
   - [ ] Verify `access_token` field is encrypted (JWT format)
   - [ ] Should not see plaintext tokens

---

## Phase 8: Migration & Cleanup (2 hours)

### Section 8.1: Remove Old API Key Auth (1 hour)

**Files to Update/Delete:**

1. **Update `.env.local.template`**

   ```bash
   # Remove these lines:
   # MAILCHIMP_API_KEY=your_api_key_here
   # MAILCHIMP_SERVER_PREFIX=us1
   ```

2. **Update `src/lib/config.ts`**

   ```typescript
   // Remove from envSchema:
   // MAILCHIMP_API_KEY: z.string()...
   // MAILCHIMP_SERVER_PREFIX: z.string()...

   // Remove helper:
   // export const getMailchimpBaseUrl = () => { ... }
   ```

3. **Update Documentation**
   - Update `CLAUDE.md` → Remove API key setup instructions
   - Update `README.md` → Add OAuth setup instructions
   - Update `.env.local.template` → Remove API key references

**Test after migration:**

```bash
# Ensure app starts without API key env vars
pnpm dev

# Should see no errors about missing MAILCHIMP_API_KEY
```

---

### Section 8.2: Update Documentation (1 hour)

**Update `CLAUDE.md`:**

```markdown
### Mailchimp Integration (OAuth2)

**Authentication Method:** OAuth 2.0 (user-scoped tokens)

**Setup:**

1. Register OAuth app at Mailchimp: Account → Extras → API Keys → Register App
2. Add credentials to `.env.local`:
```

MAILCHIMP_CLIENT_ID=your-client-id
MAILCHIMP_CLIENT_SECRET=your-client-secret
MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback

```
3. Users connect their Mailchimp accounts via `/mailchimp` or `/settings/integrations`

**Database:**
- Neon Postgres (via Vercel) stores encrypted OAuth tokens
- Drizzle ORM for type-safe queries
- Table: `mailchimp_connections` links Kinde user IDs to Mailchimp tokens

**Token Security:**
- Tokens encrypted at rest using AES-256-GCM
- CSRF protection via state parameter
- HTTPS-only in production

**API Endpoints:**
- `POST /api/auth/mailchimp/authorize` - Initiate OAuth flow
- `GET /api/auth/mailchimp/callback` - OAuth callback handler
- `POST /api/auth/mailchimp/disconnect` - Disconnect account
- `GET /api/auth/mailchimp/status` - Check connection status
```

**Create migration guide:**

**File: `docs/mailchimp-oauth-migration.md`** (new file)

````markdown
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
````

### Local Development

1. Create Neon database via Vercel integration (Storage tab)
2. Pull environment variables: `vercel env pull .env.local`
3. Register Mailchimp OAuth app (use `https://127.0.0.1:3000/api/auth/mailchimp/callback`)
4. Update `.env.local` with Mailchimp OAuth credentials
5. Start dev server: `pnpm dev`
6. Visit `https://127.0.0.1:3000/mailchimp` and connect

## Security

- Tokens encrypted at rest in database
- CSRF protection via state parameter
- HTTPS-only redirects in production
- Tokens never logged or exposed to client

## Troubleshooting

**"Mailchimp not connected" error:**

- Visit `/settings/integrations` and click "Connect Mailchimp"

**"Invalid state" error:**

- Clear cookies and try OAuth flow again
- Ensure redirect URI matches exactly in Mailchimp app settings

**Database connection errors:**

- Verify DATABASE_URL or POSTGRES_PRISMA_URL in environment variables
- Check Neon database is active in Neon Console (https://console.neon.tech)
- Verify Vercel integration is properly connected

````

---

## Phase 9: Deployment (1 hour)

### Section 9.1: Vercel Configuration

**Deploy to Vercel:**

1. **Set Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Neon Postgres variables should already be set from database creation
   - Verify present: `DATABASE_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`
   - Add remaining vars: Mailchimp OAuth, Kinde (existing), Encryption Key
   - Set for: Production, Preview, Development

2. **Update Mailchimp OAuth App**
   - Add production redirect URI: `https://your-domain.vercel.app/api/auth/mailchimp/callback`
   - Add preview redirect URI: `https://*-your-project.vercel.app/api/auth/mailchimp/callback`

3. **Deploy**
   ```bash
   git add .
   git commit -m "feat: migrate to Mailchimp OAuth2 with Supabase"
   git push origin main

   # Vercel auto-deploys on push
````

4. **Verify Deployment**
   - [ ] Visit production URL
   - [ ] Test OAuth flow end-to-end
   - [ ] Check database connections
   - [ ] Verify token encryption

---

## Estimated Timeline Summary

| Phase                              | Tasks                                         | Time            |
| ---------------------------------- | --------------------------------------------- | --------------- |
| **Phase 1:** Foundation Setup      | Supabase, dependencies, schema, config        | 4-5 hours       |
| **Phase 2:** Token Encryption      | Encryption utility, repository pattern        | 2 hours         |
| **Phase 3:** OAuth Flow            | API routes, OAuth service                     | 4 hours         |
| **Phase 4:** Service Layer Updates | User-scoped client, validation                | 2 hours         |
| **Phase 5:** UI Components         | Empty states, banners, dashboard              | 3 hours         |
| **Phase 6:** Settings Page         | Integrations management UI                    | 2 hours         |
| **Phase 7:** Testing               | Unit tests, integration tests, manual testing | 3 hours         |
| **Phase 8:** Migration             | Remove old auth, update docs                  | 2 hours         |
| **Phase 9:** Deployment            | Vercel setup, production deployment           | 1 hour          |
| **Total**                          |                                               | **23-24 hours** |

**Realistic Schedule:** 2-3 days with focused work

---

## Success Criteria

✅ **Complete when:**

- [ ] Users can connect Mailchimp via OAuth without API keys
- [ ] Tokens encrypted in Supabase database
- [ ] Empty state shown for users without connections
- [ ] Settings page displays connection status
- [ ] Multiple users have isolated connections (tested)
- [ ] All existing dashboard features work with OAuth
- [ ] Tests passing (unit + integration)
- [ ] Documentation updated
- [ ] Deployed to production successfully

---

## Architecture Overview

### Tech Stack Confirmed:

- ✅ **Database**: Neon Postgres (via Vercel) + Drizzle ORM
- ✅ **Auth**: Kinde (existing) + OAuth2 for Mailchimp
- ✅ **Hosting**: Vercel
- ✅ **Security**: AES-256-GCM encryption for tokens

### Key Features:

- Multi-user OAuth (each user connects their own Mailchimp)
- Token encryption at rest
- CSRF protection with state parameters
- Empty state onboarding flow
- Settings/integrations management page
- Comprehensive testing strategy

### Data Flow:

```
User (Kinde Auth)
    ↓
Next.js App (Vercel)
    ↓
OAuth Flow → Mailchimp
    ↓
Encrypted Tokens → Neon Postgres
    ↓
User-Scoped API Calls
```

---

## Recommendations Summary

| Decision                 | Recommendation                         | Reasoning                                                                   |
| ------------------------ | -------------------------------------- | --------------------------------------------------------------------------- |
| **Database**             | Neon Postgres                          | Seamless Vercel integration, serverless, minimal lock-in, automatic pooling |
| **OAuth Scope**          | Multi-User (each connects own)         | Future-proof, scalable, aligns with PRD Phase 7                             |
| **Token Strategy**       | Validate on first use per session      | Balance security & performance                                              |
| **UX - Primary Entry**   | Empty state on `/mailchimp`            | Immediate discovery, seamless onboarding                                    |
| **UX - Secondary Entry** | Settings page `/settings/integrations` | Manage connections centrally                                                |
| **Security**             | PKCE + state param + encrypted storage | Industry best practices                                                     |

---

**Document Created:** 2025-10-04
**Status:** Ready for Implementation
