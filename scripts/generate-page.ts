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
import { writePageFiles } from "./generators/writers/page-writer";
import { writeSchemaFiles } from "./generators/writers/schema-writer";
import { writeComponentFiles } from "./generators/writers/component-writer";
import { writeDalMethod } from "./generators/writers/dal-writer";
import { writeBreadcrumb } from "./generators/writers/breadcrumb-writer";
import { writeMetadataHelper } from "./generators/writers/metadata-writer";
import type { PageConfig } from "@/generation/page-configs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Validate PageConfig before generation
 */
function validateConfig(config: PageConfig): string[] {
  const errors: string[] = [];

  // Validate schemas exist
  if (!existsSync(resolve(process.cwd(), config.schemas.apiParams))) {
    errors.push(`API params schema not found: ${config.schemas.apiParams}`);
  }
  if (!existsSync(resolve(process.cwd(), config.schemas.apiResponse))) {
    errors.push(`API response schema not found: ${config.schemas.apiResponse}`);
  }
  if (
    config.schemas.apiError &&
    !existsSync(resolve(process.cwd(), config.schemas.apiError))
  ) {
    errors.push(`API error schema not found: ${config.schemas.apiError}`);
  }

  // Validate route path format
  if (!config.route.path.startsWith("/mailchimp/")) {
    errors.push("Route path must start with /mailchimp/");
  }

  // Validate route params match dynamic segments
  const dynamicSegments =
    config.route.path.match(/\[([^\]]+)\]/g)?.map((s) => s.slice(1, -1)) || [];
  const configParams = config.route.params || [];

  if (dynamicSegments.length !== configParams.length) {
    errors.push(
      `Route has ${dynamicSegments.length} dynamic segments but ${configParams.length} params configured`,
    );
  }

  // Validate page type matches route structure
  const hasParams = configParams.length > 0;
  const pathSegments = config.route.path.split("/").filter(Boolean);

  if (config.page.type === "list" && hasParams) {
    errors.push("List page type should not have route params");
  }

  if (config.page.type === "detail" && (!hasParams || pathSegments.length > 3)) {
    errors.push(
      "Detail page type should have exactly one param at depth 3 (e.g., /mailchimp/reports/[id])",
    );
  }

  if (config.page.type === "nested-detail" && pathSegments.length <= 3) {
    errors.push(
      "Nested-detail page type should be deeper than depth 3 (e.g., /mailchimp/reports/[id]/opens)",
    );
  }

  // Validate API endpoint format
  if (!config.api.endpoint.startsWith("/")) {
    errors.push("API endpoint must start with /");
  }

  // Validate breadcrumb parent exists for nested pages
  if (
    config.page.type === "nested-detail" &&
    !config.ui.breadcrumbs.parent
  ) {
    errors.push("Nested-detail pages must specify a breadcrumb parent");
  }

  return errors;
}

/**
 * Check which files will be affected by generation
 */
function checkFilesWillBeGenerated(
  config: PageConfig,
  configKey: string,
): {
  willCreate: string[];
  willModify: string[];
  warnings: string[];
} {
  const willCreate: string[] = [];
  const willModify: string[] = [];
  const warnings: string[] = [];

  // Page files
  const pageDir = resolve(process.cwd(), `src/app${config.route.path}`);
  const pageFiles = [
    `${pageDir}/page.tsx`,
    `${pageDir}/loading.tsx`,
  ];

  if (config.page.type === "detail" || config.page.type === "nested-detail") {
    pageFiles.push(`${pageDir}/not-found.tsx`);
  }

  pageFiles.forEach((file) => {
    if (existsSync(file)) {
      willModify.push(file.replace(process.cwd(), "."));
      warnings.push(`Page file already exists: ${file.replace(process.cwd(), ".")}`);
    } else {
      willCreate.push(file.replace(process.cwd(), "."));
    }
  });

  // Schema files
  const schemaFile = resolve(
    process.cwd(),
    `src/schemas/components/mailchimp/${configKey}-page-params.ts`,
  );
  if (existsSync(schemaFile)) {
    willModify.push(schemaFile.replace(process.cwd(), "."));
    warnings.push(`Schema file already exists: ${schemaFile.replace(process.cwd(), ".")}`);
  } else {
    willCreate.push(schemaFile.replace(process.cwd(), "."));
  }

  // Component file
  const category = config.route.path.split("/")[2] || "common";
  const componentFile = resolve(
    process.cwd(),
    `src/components/mailchimp/${category}/${config.page.title.toLowerCase().replace(/\s+/g, "-")}-content.tsx`,
  );
  if (existsSync(componentFile)) {
    willModify.push(componentFile.replace(process.cwd(), "."));
    warnings.push(`Component file already exists: ${componentFile.replace(process.cwd(), ".")}`);
  } else {
    willCreate.push(componentFile.replace(process.cwd(), "."));
  }

  // DAL will always modify existing file
  const dalFile = resolve(process.cwd(), "src/dal/mailchimp.dal.ts");
  willModify.push(dalFile.replace(process.cwd(), "."));

  // Breadcrumb will always modify existing file
  const breadcrumbFile = resolve(
    process.cwd(),
    "src/utils/breadcrumbs/breadcrumb-builder.ts",
  );
  willModify.push(breadcrumbFile.replace(process.cwd(), "."));

  // Metadata will always modify existing files
  const metadataFile = resolve(
    process.cwd(),
    "src/utils/mailchimp/metadata.ts",
  );
  willModify.push(metadataFile.replace(process.cwd(), "."));

  return { willCreate, willModify, warnings };
}

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
      const allFiles: string[] = [];
      const allWarnings: string[] = [];

      // Generate page files (page.tsx, not-found.tsx, loading.tsx)
      spinner.message("Writing page files...");
      const pageResult = writePageFiles(config, configKey);
      allFiles.push(...pageResult.files);
      allWarnings.push(...pageResult.warnings);

      // Generate UI schema files
      spinner.message("Writing schema files...");
      const schemaResult = writeSchemaFiles(config, configKey);
      allFiles.push(...schemaResult.files);
      allWarnings.push(...schemaResult.warnings);

      // Generate placeholder component
      spinner.message("Writing component files...");
      const componentResult = writeComponentFiles(config, configKey);
      allFiles.push(...componentResult.files);
      allWarnings.push(...componentResult.warnings);

      // Add DAL method
      spinner.message("Adding DAL method...");
      const dalResult = writeDalMethod(config, configKey);
      allFiles.push(...dalResult.files);
      allWarnings.push(...dalResult.warnings);

      // Add breadcrumb function
      spinner.message("Adding breadcrumb...");
      const breadcrumbResult = writeBreadcrumb(config, configKey);
      allFiles.push(...breadcrumbResult.files);
      allWarnings.push(...breadcrumbResult.warnings);

      // Add metadata helper
      spinner.message("Adding metadata helper...");
      const metadataResult = writeMetadataHelper(config, configKey);
      allFiles.push(...metadataResult.files);
      allWarnings.push(...metadataResult.warnings);

      spinner.stop("✅ All files generated successfully!");

      // Display results
      clack.log.success(`Generated ${allFiles.length} files:`);
      allFiles.forEach((file) => {
        const relativePath = file.replace(process.cwd(), ".");
        clack.log.info(`  ${relativePath}`);
      });

      // Display warnings if any
      if (allWarnings.length > 0) {
        clack.log.warn("\nWarnings:");
        allWarnings.forEach((warning) => {
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
