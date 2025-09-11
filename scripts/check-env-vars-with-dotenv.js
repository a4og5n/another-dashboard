/**
 * Environment Variables Test Script with dotenv
 * Run this script to check if environment variables are correctly loaded from .env.local
 */

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

console.log("Checking environment variables...");
console.log("NODE_ENV:", process.env.NODE_ENV);

// Check authentication credentials without logging them
const hasCredentials = !!process.env.MAILCHIMP_API_KEY;
console.log(
  "Authentication credentials:",
  hasCredentials ? "Present" : "Missing",
);

console.log("MAILCHIMP_SERVER_PREFIX:", process.env.MAILCHIMP_SERVER_PREFIX);
console.log("ENABLE_MOCK_DATA:", process.env.ENABLE_MOCK_DATA);

// Check if the MAILCHIMP_API_KEY is correctly formatted
const apiKey = process.env.MAILCHIMP_API_KEY || "";
if (!apiKey.includes("-")) {
  console.error("ERROR: MAILCHIMP_API_KEY does not contain a hyphen");
}
if (apiKey.length < 10) {
  console.error("ERROR: MAILCHIMP_API_KEY is too short");
}
