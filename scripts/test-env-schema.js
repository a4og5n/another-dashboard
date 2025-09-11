/**
 * Environment Schema Test Script
 *
 * This script replicates the environment variable validation from config.ts
 * to identify exactly what's failing.
 */

import { config } from "dotenv";
import { z } from "zod";
config({ path: ".env.local" });

// Replicate the envSchema from config.ts
const envSchema = z.object({
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

  // Development & Debugging
  DEBUG_API_CALLS: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
  ENABLE_MOCK_DATA: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
});

// Replicate the parseEnv function
function parseEnv() {
  // Filter out any key that contains sensitive information before logging
  console.log(
    "Process env keys:",
    Object.keys(process.env).filter(
      (key) =>
        !key.includes("KEY") &&
        !key.includes("SECRET") &&
        !key.includes("TOKEN"),
    ),
  );
  console.log("NODE_ENV:", process.env.NODE_ENV);
  // Check auth credentials without mentioning specific variable names
  console.log(
    "Authentication credentials present:",
    !!process.env.MAILCHIMP_API_KEY,
  );
  console.log("MAILCHIMP_SERVER_PREFIX:", process.env.MAILCHIMP_SERVER_PREFIX);

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    return null;
  }

  return parsed.data;
}

const env = parseEnv();
console.log("Validation result:", env ? "SUCCESS" : "FAILED");
if (env) {
  console.log("Validated env:", {
    NODE_ENV: env.NODE_ENV,
    // Omit sensitive keys completely from logs
    AuthCredentials: env.MAILCHIMP_API_KEY ? "present" : "missing",
    MAILCHIMP_SERVER_PREFIX: env.MAILCHIMP_SERVER_PREFIX,
    DEBUG_API_CALLS: env.DEBUG_API_CALLS,
    ENABLE_MOCK_DATA: env.ENABLE_MOCK_DATA,
  });
}
