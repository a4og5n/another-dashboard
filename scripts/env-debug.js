/**
 * Environment Debug Script
 * This script provides comprehensive debugging information for environment variables
 * and simulates the validation in config.ts
 */

import { config } from "dotenv";
import { z } from "zod";

// Load environment variables from .env.local
config({ path: ".env.local" });

console.log("=== ENVIRONMENT DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);

// Display all environment variables (sanitized)
console.log("\n=== ALL ENV VARIABLES ===");
const allEnvKeys = Object.keys(process.env).sort();
allEnvKeys.forEach((key) => {
  const value = process.env[key];
  if (
    key.includes("KEY") ||
    key.includes("SECRET") ||
    key.includes("TOKEN") ||
    key.includes("PASSWORD")
  ) {
    console.log(`${key}: ${value ? "[REDACTED]" : "undefined"}`);
  } else {
    console.log(`${key}: ${value || "undefined"}`);
  }
});

// Recreate the full environment schema from config.ts
const fullEnvSchema = z.object({
  // Core application
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Mailchimp Marketing API (Primary Integration)
  MAILCHIMP_API_KEY: z
    .string()
    .min(1, "Mailchimp API key is required")
    .default(
      process.env.NODE_ENV === "test" || process.env.CI === "true"
        ? "dummy-key-us1"
        : "",
    )
    .refine(
      (val) => val.includes("-") && val.length > 10,
      "Mailchimp API key should contain a datacenter suffix (e.g., abc123-us1)",
    ),
  MAILCHIMP_SERVER_PREFIX: z
    .string()
    .min(1, "Mailchimp server prefix is required")
    .default(
      process.env.NODE_ENV === "test" || process.env.CI === "true" ? "us1" : "",
    )
    .refine(
      (val) => /^[a-z]{2,4}\d*$/.test(val),
      "Mailchimp server prefix should be like: us1, us19, etc.",
    ),

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

  // Optional variables (add any additional variables from the schema)
  GA4_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GA4_PROPERTY_ID: z.string().optional(),
  GA4_CLIENT_EMAIL: z.string().email().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_ACCESS_TOKEN: z.string().optional(),
  WORDPRESS_API_URL: z.string().url().optional(),
  WORDPRESS_USERNAME: z.string().optional(),
  WORDPRESS_APP_PASSWORD: z.string().optional(),
  GSC_SERVICE_ACCOUNT_KEY_PATH: z.string().optional(),
  GSC_CLIENT_EMAIL: z.string().email().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

// Test each key individually
console.log("\n=== INDIVIDUAL VALIDATION ===");
allEnvKeys.forEach((key) => {
  try {
    const singleSchema = z.object({ [key]: z.any() });
    singleSchema.parse({ [key]: process.env[key] });
    console.log(`✅ ${key}: Valid`);
  } catch (error) {
    console.log(`❌ ${key}: Invalid`, error.message);
  }
});

// Test full schema validation
console.log("\n=== FULL SCHEMA VALIDATION ===");
try {
  const result = fullEnvSchema.safeParse(process.env);
  if (result.success) {
    console.log("✅ Schema validation PASSED");

    // Check transformed values
    const data = result.data;
    console.log("\nTransformed Values:");
    console.log(
      "DEBUG_API_CALLS:",
      typeof data.DEBUG_API_CALLS,
      data.DEBUG_API_CALLS,
    );
    console.log(
      "ENABLE_MOCK_DATA:",
      typeof data.ENABLE_MOCK_DATA,
      data.ENABLE_MOCK_DATA,
    );
    console.log(
      "NEXT_PUBLIC_VERCEL_ANALYTICS:",
      typeof data.NEXT_PUBLIC_VERCEL_ANALYTICS,
      data.NEXT_PUBLIC_VERCEL_ANALYTICS,
    );
  } else {
    console.log("❌ Schema validation FAILED");
    console.log(
      "\nError details:",
      JSON.stringify(result.error.format(), null, 2),
    );
  }
} catch (error) {
  console.log("❌ Schema validation FAILED with exception:", error);
}

console.log("\n=== END DEBUG ===");
