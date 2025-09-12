/**
 * Environment Variables Test Script
 * Run this script to check if environment variables are correctly loaded
 */
console.log("Checking environment variables...");
console.log("NODE_ENV:", process.env.NODE_ENV);
// Check credentials without mentioning specific names in logs
console.log(
  "Authentication credentials:",
  !!process.env.MAILCHIMP_API_KEY ? "Present" : "Missing",
);
console.log("MAILCHIMP_SERVER_PREFIX:", process.env.MAILCHIMP_SERVER_PREFIX);
console.log("ENABLE_MOCK_DATA:", process.env.ENABLE_MOCK_DATA);
