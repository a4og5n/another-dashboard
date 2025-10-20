#!/usr/bin/env node
/**
 * Interactive Page Generator CLI
 *
 * Generates complete working Mailchimp pages from API schemas with interactive prompts.
 *
 * Usage:
 *   pnpm generate:page
 *
 * Features:
 * - Schema selection with validation
 * - Smart defaults from schema analysis
 * - Interactive prompts using Clack
 * - Complete page infrastructure generation
 * - Safety checks and overwrite protection
 *
 * @see docs/execution-plans/page-generator/README.md
 */

import * as clack from "@clack/prompts";
import { schemaPrompts } from "./generators/prompts/schema-prompts";
import { routePrompts } from "./generators/prompts/route-prompts";
import { apiPrompts } from "./generators/prompts/api-prompts";
import { uiPrompts } from "./generators/prompts/ui-prompts";
import type { PageConfig } from "@/generation/page-configs";

/**
 * Main CLI flow
 */
async function main() {
  console.clear();

  clack.intro("📄 Page Generator");

  try {
    // Step 1: Schema Configuration
    clack.log.step("Step 1: Schema Configuration");
    const schemaConfig = await schemaPrompts();

    if (clack.isCancel(schemaConfig)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Step 2: Route Configuration
    clack.log.step("Step 2: Route Configuration");
    const routeConfig = await routePrompts();

    if (clack.isCancel(routeConfig)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Step 3: API Configuration
    clack.log.step("Step 3: API Configuration");
    const apiConfig = await apiPrompts(routeConfig);

    if (clack.isCancel(apiConfig)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Step 4: UI Configuration
    clack.log.step("Step 4: UI Configuration");
    const uiConfig = await uiPrompts(schemaConfig, routeConfig);

    if (clack.isCancel(uiConfig)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Build complete PageConfig
    const config: PageConfig = {
      schemas: schemaConfig,
      route: routeConfig,
      api: apiConfig,
      page: {
        type: routeConfig.type,
        title: routeConfig.title,
        description: routeConfig.description,
        features: routeConfig.features,
      },
      ui: uiConfig,
    };

    // Step 5: Review and Confirm
    clack.log.step("Step 5: Review Configuration");
    clack.log.info("Generated Configuration:");
    console.log(JSON.stringify(config, null, 2));

    const shouldSave = await clack.confirm({
      message: "Save this configuration to page-configs.ts?",
      initialValue: true,
    });

    if (clack.isCancel(shouldSave) || !shouldSave) {
      clack.cancel("Configuration not saved");
      process.exit(0);
    }

    // Get config key
    const configKey = await clack.text({
      message: "Enter a key for this config (e.g., 'report-clicks'):",
      placeholder: "report-clicks",
      validate: (value) => {
        if (!value) return "Config key is required";
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Config key must contain only lowercase letters, numbers, and hyphens";
        }
        return undefined;
      },
    });

    if (clack.isCancel(configKey)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // TODO: Phase 5 - Save config to registry
    clack.log.warn("Config saving not yet implemented (Phase 5)");

    // Ask if user wants to generate files now
    const shouldGenerate = await clack.confirm({
      message: "Generate page files now?",
      initialValue: true,
    });

    if (clack.isCancel(shouldGenerate) || !shouldGenerate) {
      clack.outro(
        "Configuration saved. Run 'pnpm generate:page' to generate files.",
      );
      process.exit(0);
    }

    // TODO: Phase 4-5 - Generate files
    clack.log.warn("File generation not yet implemented (Phase 4-5)");

    clack.outro("✅ Configuration created successfully!");
  } catch (error) {
    if (error instanceof Error) {
      clack.log.error(error.message);
    }
    clack.outro("❌ Page generation failed");
    process.exit(1);
  }
}

main();
