#!/usr/bin/env node
/**
 * Non-Interactive Page Generator CLI
 *
 * Generates complete working pages from pre-defined PageConfig entries.
 * Ideal for AI-assisted workflows where configs are created first.
 *
 * Usage:
 *   pnpm generate:from-config <config-key>
 *
 * Example:
 *   pnpm generate:from-config campaign-detail
 *
 * Features:
 * - Reads from src/generation/page-configs.ts registry
 * - No interactive prompts (fully automated)
 * - Validates config exists before generation
 * - Complete page infrastructure generation
 * - Safety checks and overwrite protection
 *
 * @see docs/execution-plans/page-generator/README.md
 * @see CLAUDE.md Phase 2 Implementation
 */

import { generatePageFromConfig } from "./generators/api/generate-from-config";
import {
  getPageConfig,
  hasPageConfig,
  getPageConfigKeys,
  type PageConfigKey,
} from "@/generation/page-configs";

/**
 * Main CLI flow
 */
async function main() {
  // Get config key from command line args
  const configKey = process.argv[2];

  // Validate config key provided
  if (!configKey) {
    console.error("❌ Error: Config key is required");
    console.error("");
    console.error("Usage: pnpm generate:from-config <config-key>");
    console.error("");
    console.error("Available config keys:");
    const keys = getPageConfigKeys();
    keys.forEach((key) => {
      console.error(`  - ${key}`);
    });
    process.exit(1);
  }

  // Validate config key exists
  if (!hasPageConfig(configKey)) {
    console.error(`❌ Error: Config key "${configKey}" not found`);
    console.error("");
    console.error("Available config keys:");
    const keys = getPageConfigKeys();
    keys.forEach((key) => {
      console.error(`  - ${key}`);
    });
    process.exit(1);
  }

  try {
    // Get config from registry
    console.log(`📄 Generating page from config: ${configKey}`);
    console.log("");

    const config = getPageConfig(configKey as PageConfigKey);

    // Display config summary
    console.log("Configuration:");
    console.log(`  Route: ${config.route.path}`);
    console.log(`  API: ${config.api.method} ${config.api.endpoint}`);
    console.log(`  Type: ${config.page.type}`);
    console.log("");

    // Generate files
    console.log("Generating files...");
    const result = await generatePageFromConfig(config, configKey);

    // Display results
    console.log("");
    console.log(`✅ Successfully generated ${result.files.length} files:`);
    console.log("");
    result.files.forEach((file) => {
      const relativePath = file.replace(process.cwd(), ".");
      console.log(`  ✨ ${relativePath}`);
    });

    // Display warnings if any
    if (result.warnings.length > 0) {
      console.log("");
      console.log("⚠️  Warnings:");
      result.warnings.forEach((warning) => {
        console.log(`  ${warning}`);
      });
    }

    // Next steps
    console.log("");
    console.log("Next Steps:");
    console.log(`  1. Review generated files`);
    console.log(`  2. Implement component logic (replace Construction card)`);
    console.log(`  3. Add proper types to DAL method`);
    console.log(`  4. Test the page at ${config.route.path}`);
    console.log(`  5. Run 'pnpm format' to format generated files`);
    console.log(`  6. Run 'pnpm lint:fix' to fix any linting issues`);
    console.log(`  7. Run 'pnpm type-check' to verify type safety`);
    console.log("");
    console.log("✅ Page generation completed successfully!");
  } catch (error) {
    console.error("");
    console.error("❌ Page generation failed:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
