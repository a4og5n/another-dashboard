/**
 * Environment Variables Diagnostic Script
 *
 * This script helps identify issues with environment variable validation
 * by checking each validation rule individually.
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { z } from "zod";
config({ path: ".env.local" });

console.log("=== ENV DIAGNOSTICS ===");

// Check authentication credentials
const apiKey = process.env.MAILCHIMP_API_KEY || "";
console.log("Authentication credentials check:");
console.log("- Exists:", !!apiKey);
console.log("- Length check:", apiKey.length > 0 ? "Has length" : "Empty");
console.log("- Contains required delimiter:", apiKey.includes("-"));
console.log("- Passes minimum length check:", apiKey.length > 10);

// Check individual validation rules
const apiKeySchema = z
  .string()
  .min(1, "Mailchimp API key is required")
  .refine(
    (val) => val.includes("-") && val.length > 10,
    "Mailchimp API key should contain a datacenter suffix",
  );

const apiKeyResult = apiKeySchema.safeParse(apiKey);
console.log("API Key validation:", apiKeyResult.success ? "PASSED" : "FAILED");
if (!apiKeyResult.success) {
  console.log("API Key validation error:", apiKeyResult.error.errors);
}

// Check MAILCHIMP_SERVER_PREFIX
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || "";
console.log("\nMAILCHIMP_SERVER_PREFIX:", serverPrefix);
console.log("Matches pattern:", /^[a-z]{2,4}\d*$/.test(serverPrefix));

const serverPrefixSchema = z
  .string()
  .min(1, "Mailchimp server prefix is required")
  .refine(
    (val) => /^[a-z]{2,4}\d*$/.test(val),
    "Mailchimp server prefix should be like: us1, us19, etc.",
  );

const serverPrefixResult = serverPrefixSchema.safeParse(serverPrefix);
console.log(
  "Server Prefix validation:",
  serverPrefixResult.success ? "PASSED" : "FAILED",
);
if (!serverPrefixResult.success) {
  console.log(
    "Server Prefix validation error:",
    serverPrefixResult.error.errors,
  );
}

// Check NEXT_PUBLIC_APP_URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
console.log("\nNEXT_PUBLIC_APP_URL:", appUrl);

try {
  const urlSchema = z.string().url();
  const urlResult = urlSchema.safeParse(appUrl);
  console.log("URL validation:", urlResult.success ? "PASSED" : "FAILED");
  if (!urlResult.success) {
    console.log("URL validation error:", urlResult.error.errors);
  }
} catch (error) {
  console.log("URL validation error:", error);
}

console.log("\n=== END DIAGNOSTICS ===");
