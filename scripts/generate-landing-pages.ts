#!/usr/bin/env tsx
/**
 * Landing Pages Page Generator Script
 * Generates complete page infrastructure for the Landing Pages endpoint
 *
 * Usage: npx tsx scripts/generate-landing-pages.ts
 */

import { generatePageFromConfig } from "./generators/api";
import { getPageConfig } from "../src/generation/page-configs";

async function main() {
  console.log("🚀 Generating Landing Pages page...\n");

  try {
    // Get the landing pages config
    const config = getPageConfig("landing-pages-list");

    // Generate the page
    const result = await generatePageFromConfig(config, "landing-pages-list");

    // Report results
    console.log("\n✅ Generation complete!\n");
    console.log(`📁 Generated ${result.files.length} files:`);
    result.files.forEach((file) => {
      console.log(`   - ${file}`);
    });

    if (result.warnings && result.warnings.length > 0) {
      console.log(`\n⚠️  ${result.warnings.length} warnings:`);
      result.warnings.forEach((warning) => {
        console.log(`   - ${warning}`);
      });
    }

    console.log("\n✨ Next steps:");
    console.log("   1. Implement content component logic");
    console.log("   2. Update DAL method");
    console.log("   3. Run validation suite");
    console.log("   4. Test with real Mailchimp data\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Generation failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
