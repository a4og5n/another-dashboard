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
import { generatePageFromConfig } from "./generators/api/generate-from-config";
import {
  validateConfig,
  checkFilesWillBeGenerated,
} from "./generators/api/validators";
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
    const routeConfig = await routePrompts(schemaConfig);

    if (clack.isCancel(routeConfig)) {
      clack.cancel("Operation cancelled");
      process.exit(0);
    }

    // Step 3: API Configuration
    clack.log.step("Step 3: API Configuration");
    const apiConfig = await apiPrompts(schemaConfig, routeConfig);

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

    // Step 5: Validate Configuration
    clack.log.step("Step 5: Validate Configuration");
    const validationErrors = validateConfig(config);

    if (validationErrors.length > 0) {
      clack.log.error("❌ Configuration validation failed:");
      validationErrors.forEach((error) => {
        clack.log.error(`  • ${error}`);
      });
      clack.outro("Fix the errors above and try again");
      process.exit(1);
    }

    clack.log.success("✅ Configuration is valid");

    // Step 6: Review and Confirm
    clack.log.step("Step 6: Review Configuration");
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

    // Step 7: Safety Check
    clack.log.step("Step 7: Safety Check");
    const fileCheck = checkFilesWillBeGenerated(config, configKey);

    if (fileCheck.willCreate.length > 0) {
      clack.log.info("Files to be created:");
      fileCheck.willCreate.forEach((file) => {
        clack.log.info(`  ✨ ${file}`);
      });
    }

    if (fileCheck.willModify.length > 0) {
      clack.log.info("\nFiles to be modified:");
      fileCheck.willModify.forEach((file) => {
        clack.log.info(`  ✏️  ${file}`);
      });
    }

    if (fileCheck.warnings.length > 0) {
      clack.log.warn("\n⚠️  Warnings:");
      fileCheck.warnings.forEach((warning) => {
        clack.log.warn(`  ${warning}`);
      });
      clack.log.warn(
        "\nExisting files will be SKIPPED (not overwritten) by the generator.",
      );
    }

    const confirmGenerate = await clack.confirm({
      message: "Proceed with file generation?",
      initialValue: true,
    });

    if (clack.isCancel(confirmGenerate) || !confirmGenerate) {
      clack.cancel("File generation cancelled");
      process.exit(0);
    }

    // Step 8: Generate Files
    clack.log.step("Step 8: Generating Files");

    const spinner = clack.spinner();
    spinner.start("Generating page infrastructure...");

    try {
      // Use the programmatic API
      const result = await generatePageFromConfig(config, configKey);

      spinner.stop("✅ All files generated successfully!");

      // Display results
      clack.log.success(`Generated ${result.files.length} files:`);
      result.files.forEach((file) => {
        const relativePath = file.replace(process.cwd(), ".");
        clack.log.info(`  ${relativePath}`);
      });

      // Display warnings if any
      if (result.warnings.length > 0) {
        clack.log.warn("\nWarnings:");
        result.warnings.forEach((warning) => {
          clack.log.warn(`  ⚠️  ${warning}`);
        });
      }

      // Next steps
      clack.note(
        `1. Review generated files\n2. Implement component logic (replace Construction card)\n3. Add proper types to DAL method\n4. Test the page at ${config.route.path}\n5. Run 'pnpm format' to format generated files\n6. Run 'pnpm lint:fix' to fix any linting issues`,
        "Next Steps:",
      );

      // TODO: Phase 5 - Save config to registry
      clack.log.info(
        "\nℹ️  Config registry saving not yet implemented. Manually add to src/generation/page-configs.ts if needed.",
      );

      clack.outro("✅ Page generation completed successfully!");
    } catch (error) {
      spinner.stop("❌ File generation failed");
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      clack.log.error(error.message);
    }
    clack.outro("❌ Page generation failed");
    process.exit(1);
  }
}

main();
