import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Core application
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default(
      process.env.NODE_ENV === "development"
        ? "https://localhost:3000"
        : "http://localhost:3000",
    ),

  // Neon Postgres Database (via Vercel)
  DATABASE_URL: z.url("Database connection URL required").optional(),
  DATABASE_URL_UNPOOLED: z.url().optional(), // Direct connection
  POSTGRES_PRISMA_URL: z.url("Postgres connection URL required").optional(),
  POSTGRES_URL: z.url().optional(), // Pooled connection

  // Mailchimp OAuth2 Configuration
  MAILCHIMP_CLIENT_ID: z
    .string()
    .min(1, "Mailchimp Client ID is required")
    .optional(),
  MAILCHIMP_CLIENT_SECRET: z
    .string()
    .min(1, "Mailchimp Client Secret is required")
    .optional(),
  MAILCHIMP_REDIRECT_URI: z
    .url("Mailchimp Redirect URI must be a valid URL")
    .optional(),

  // Encryption key for tokens (generate with: openssl rand -base64 32)
  ENCRYPTION_KEY: z
    .string()
    .length(44, "Encryption key must be 32 bytes base64 encoded")
    .optional(),

  // Google Analytics 4 (Future - Optional for now)
  GA4_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GA4_PROPERTY_ID: z.string().optional(),
  GA4_CLIENT_EMAIL: z.email().optional(),

  // YouTube Analytics API (Future - Optional for now)
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),

  // Meta Graph API (Future - Optional for now)
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_ACCESS_TOKEN: z.string().optional(),

  // WordPress REST API (Future - Optional for now)
  WORDPRESS_API_URL: z.url().optional(),
  WORDPRESS_USERNAME: z.string().optional(),
  WORDPRESS_APP_PASSWORD: z.string().optional(),

  // Google Search Console API (Future - Optional for now)
  GSC_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GSC_CLIENT_EMAIL: z.email().optional(),

  // Performance & Monitoring
  NEXT_PUBLIC_VERCEL_ANALYTICS: z
    .enum(["true", "false"])
    .default("true")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_ANALYTICS_ENDPOINT: z.string().default("/api/analytics"),

  // Development & Debugging
  DEBUG_API_CALLS: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
  ENABLE_MOCK_DATA: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),

  // Kinde Authentication
  KINDE_CLIENT_ID: z.string().optional(),
  KINDE_CLIENT_SECRET: z.string().optional(),
  KINDE_ISSUER_URL: z.url().optional(),
  KINDE_SITE_URL: z.url().optional(),
  KINDE_POST_LOGOUT_REDIRECT_URL: z.url().optional(),
  KINDE_POST_LOGIN_REDIRECT_URL: z.url().optional(),
  KINDE_GOOGLE_CONNECTION_ID: z
    .string()
    .min(1, "Google Connection ID required for OAuth")
    .optional(),

  // Optional: Error tracking (future)
  SENTRY_DSN: z.url().optional(),
});

/**
 * Validated environment variables
 * This ensures type safety throughout the application
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * In development mode, will provide default values when needed
 * In production, will throw an error if validation fails
 */
function parseEnv(): Env {
  // Check if ENABLE_MOCK_DATA is set to true before validation
  const enableMockData = process.env.ENABLE_MOCK_DATA === "true";

  // If mock data is enabled or we're in test/CI mode, provide default values
  if (
    enableMockData ||
    process.env.NODE_ENV === "test" ||
    process.env.CI === "true"
  ) {
    // Only log this in CI or test environments, not in development
    if (process.env.NODE_ENV === "test" || process.env.CI === "true") {
      console.log("📋 Using mock data for environment variables");
    }

    // Create a new process.env-like object with default values for required fields
    const mockEnv = {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "development",
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL: process.env.POSTGRES_URL,
      MAILCHIMP_CLIENT_ID: process.env.MAILCHIMP_CLIENT_ID,
      MAILCHIMP_CLIENT_SECRET: process.env.MAILCHIMP_CLIENT_SECRET,
      MAILCHIMP_REDIRECT_URI: process.env.MAILCHIMP_REDIRECT_URI,
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
      DEBUG_API_CALLS: process.env.DEBUG_API_CALLS || "true",
      ENABLE_MOCK_DATA: "true",
      NEXT_PUBLIC_VERCEL_ANALYTICS:
        process.env.NEXT_PUBLIC_VERCEL_ANALYTICS || "false",
      NEXT_PUBLIC_ANALYTICS_ENDPOINT:
        process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "/api/analytics",
    };

    const parsed = envSchema.safeParse(mockEnv);

    if (parsed.success) {
      return parsed.data;
    }
    // If still failing even with mock data, continue to error reporting
  }

  // Normal validation flow
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // In development, provide fallback values to keep the app running without errors
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === undefined
    ) {
      console.warn(
        "⚠️ Using fallback values for development. NOT SUITABLE FOR PRODUCTION!",
      );

      // Skip showing error messages in development mode since we'll use fallbacks
      if (process.env.DEBUG_API_CALLS === "true") {
        // Only show detailed errors if DEBUG_API_CALLS is enabled
        console.warn(
          "Environment validation issues (suppressed in normal development):",
        );
        console.warn(parsed.error.flatten().fieldErrors);
      }

      // Create fallback environment
      // Create a more comprehensive fallback environment
      const fallbackEnv = {
        NODE_ENV: "development",
        NEXT_PUBLIC_APP_URL: "https://localhost:3000",
        DATABASE_URL: undefined,
        DATABASE_URL_UNPOOLED: undefined,
        POSTGRES_PRISMA_URL: undefined,
        POSTGRES_URL: undefined,
        MAILCHIMP_CLIENT_ID: undefined,
        MAILCHIMP_CLIENT_SECRET: undefined,
        MAILCHIMP_REDIRECT_URI: undefined,
        ENCRYPTION_KEY: undefined,
        DEBUG_API_CALLS: true,
        ENABLE_MOCK_DATA: true,
        NEXT_PUBLIC_VERCEL_ANALYTICS: false,
        NEXT_PUBLIC_ANALYTICS_ENDPOINT: "/api/analytics",
        // Optional fallbacks that might be needed
        GA4_SERVICE_ACCOUNT_KEY_PATH: undefined,
        GA4_PROPERTY_ID: undefined,
        GA4_CLIENT_EMAIL: undefined,
        YOUTUBE_API_KEY: undefined,
        YOUTUBE_CLIENT_ID: undefined,
        YOUTUBE_CLIENT_SECRET: undefined,
        META_APP_ID: undefined,
        META_APP_SECRET: undefined,
        META_ACCESS_TOKEN: undefined,
        WORDPRESS_API_URL: undefined,
        WORDPRESS_USERNAME: undefined,
        WORDPRESS_APP_PASSWORD: undefined,
        GSC_SERVICE_ACCOUNT_KEY_PATH: undefined,
        GSC_CLIENT_EMAIL: undefined,
        // Kinde Authentication (optional)
        KINDE_CLIENT_ID: undefined,
        KINDE_CLIENT_SECRET: undefined,
        KINDE_ISSUER_URL: undefined,
        KINDE_SITE_URL: undefined,
        KINDE_POST_LOGOUT_REDIRECT_URL: undefined,
        KINDE_POST_LOGIN_REDIRECT_URL: undefined,
        KINDE_GOOGLE_CONNECTION_ID: undefined,
        SENTRY_DSN: undefined,
      };

      return fallbackEnv as Env;
    } else {
      // In production, show detailed error and throw
      console.error("\n❌ Environment validation failed in production mode!");
      console.error(
        "The following environment variables are invalid or missing:",
      );
      console.error(parsed.error.flatten().fieldErrors);

      throw new Error("Invalid environment variables");
    }
  }

  return parsed.data;
}

/**
 * Validated and typed environment variables
 * Use this throughout the application instead of process.env
 */
export const env = parseEnv();

/**
 * Helper function to check if we're in development mode
 */
export const isDev = env.NODE_ENV === "development";

/**
 * Helper function to check if we're in production mode
 */
export const isProd = env.NODE_ENV === "production";

/**
 * Helper function to check if mock data should be used
 * Useful when database is not available in development or CI
 */
export const shouldUseMockData =
  env.ENABLE_MOCK_DATA || process.env.CI === "true";

/**
 * Development-only function to log environment status
 */
export const logEnvStatus = () => {
  if (!isDev || !env.DEBUG_API_CALLS) return;

  console.log("🔧 Environment Status:");
  console.log(`  - Mode: ${env.NODE_ENV}`);
  console.log(`  - App URL: ${env.NEXT_PUBLIC_APP_URL}`);
  console.log(
    `  - Database: ${env.POSTGRES_PRISMA_URL || env.DATABASE_URL ? "✅ Configured" : "❌ Missing"}`,
  );
  console.log(
    `  - Mailchimp OAuth: ${env.MAILCHIMP_CLIENT_ID ? "✅ Configured" : "❌ Missing"}`,
  );
  console.log(
    `  - Mock Data: ${shouldUseMockData ? "✅ Enabled" : "❌ Disabled"}`,
  );
  console.log(
    `  - Debug API: ${env.DEBUG_API_CALLS ? "✅ Enabled" : "❌ Disabled"}`,
  );
};
