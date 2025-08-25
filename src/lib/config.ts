import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Core application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Mailchimp Marketing API (Primary Integration)
  MAILCHIMP_API_KEY: z
    .string()
    .min(1, 'Mailchimp API key is required')
    .regex(
      /^[a-f0-9]{32}-[a-z]{2,4}\d+$/,
      'Mailchimp API key must be in format: key-datacenter (e.g., abc123-us1)'
    ),
  MAILCHIMP_SERVER_PREFIX: z
    .string()
    .min(1, 'Mailchimp server prefix is required')
    .regex(/^[a-z]{2,4}\d+$/, 'Invalid Mailchimp server prefix format'),

  // Google Analytics 4 (Future - Optional for now)
  GA4_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GA4_PROPERTY_ID: z.string().optional(),
  GA4_CLIENT_EMAIL: z.string().email().optional(),

  // YouTube Analytics API (Future - Optional for now)
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),

  // Meta Graph API (Future - Optional for now)
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_ACCESS_TOKEN: z.string().optional(),

  // WordPress REST API (Future - Optional for now)
  WORDPRESS_API_URL: z.string().url().optional(),
  WORDPRESS_USERNAME: z.string().optional(),
  WORDPRESS_APP_PASSWORD: z.string().optional(),

  // Google Search Console API (Future - Optional for now)
  GSC_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GSC_CLIENT_EMAIL: z.string().email().optional(),

  // Performance & Monitoring
  NEXT_PUBLIC_VERCEL_ANALYTICS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((val) => val === 'true'),
  NEXT_PUBLIC_ANALYTICS_ENDPOINT: z.string().default('/api/analytics'),

  // Development & Debugging
  DEBUG_API_CALLS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
  ENABLE_MOCK_DATA: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),

  // Optional: Error tracking (future)
  SENTRY_DSN: z.string().url().optional(),
});

/**
 * Validated environment variables
 * This ensures type safety throughout the application
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws an error if validation fails
 */
function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
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
export const isDev = env.NODE_ENV === 'development';

/**
 * Helper function to check if we're in production mode
 */
export const isProd = env.NODE_ENV === 'production';

/**
 * Helper function to check if mock data should be used
 * Useful when API keys are not available in development
 */
export const shouldUseMockData = env.ENABLE_MOCK_DATA || (isDev && !env.MAILCHIMP_API_KEY);

/**
 * Helper function to get the Mailchimp API base URL
 */
export const getMailchimpBaseUrl = () => {
  return `https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
};

/**
 * Development-only function to log environment status
 */
export const logEnvStatus = () => {
  if (!isDev) return;
  
  console.log('🔧 Environment Status:');
  console.log(`  - Mode: ${env.NODE_ENV}`);
  console.log(`  - App URL: ${env.NEXT_PUBLIC_APP_URL}`);
  console.log(`  - Mailchimp: ${env.MAILCHIMP_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`  - Mock Data: ${shouldUseMockData ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  - Debug API: ${env.DEBUG_API_CALLS ? '✅ Enabled' : '❌ Disabled'}`);
};
