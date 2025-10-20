/**
 * Breadcrumb Writer
 *
 * Adds breadcrumb function to breadcrumb-builder.ts:
 * - Reads existing src/utils/breadcrumbs/breadcrumb-builder.ts
 * - Adds static route or dynamic function based on page type
 * - Follows existing patterns (bc.report, bc.reports, etc.)
 * - Inserts alphabetically in the appropriate section
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PageConfig } from "../../../src/generation/page-configs";

/**
 * Generate breadcrumb function name
 */
function generateBreadcrumbName(config: PageConfig): string {
  // Convert page title to camelCase
  // "Campaign Clicks" → "campaignClicks"
  const title = config.page.title;
  return title
    .split(/\s+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

/**
 * Generate static breadcrumb
 */
function generateStaticBreadcrumb(config: PageConfig, name: string): string {
  const label = config.ui.breadcrumbs.label;
  const href = config.route.path;

  return `  /**
   * ${config.page.title} breadcrumb
   */
  ${name}: {
    label: "${label}",
    href: "${href}",
  } as const satisfies BreadcrumbItem,`;
}

/**
 * Generate dynamic breadcrumb function
 */
function generateDynamicBreadcrumb(config: PageConfig, name: string): string {
  const label = config.ui.breadcrumbs.label;
  const paramName = config.route.params![0];
  const pathTemplate = config.route.path.replace(`[${paramName}]`, `\${${paramName}}`);

  return `  /**
   * ${config.page.title} breadcrumb
   *
   * @param ${paramName} - ${paramName.toUpperCase()}
   * @returns Breadcrumb item for ${config.page.title.toLowerCase()}
   *
   * @example
   * \`\`\`tsx
   * bc.${name}("abc123")
   * // Returns: { label: "${label}", href: "${pathTemplate}" }
   * \`\`\`
   */
  ${name}(${paramName}: string): BreadcrumbItem {
    return {
      label: "${label}",
      href: \`${pathTemplate}\`,
    };
  },`;
}

/**
 * Find insertion point in the file
 */
function findInsertionPoint(
  content: string,
  isDynamic: boolean,
  name: string,
): number {
  if (isDynamic) {
    // Insert in Dynamic Route Functions section
    const sectionStart = content.indexOf("// Dynamic Route Functions");
    if (sectionStart === -1) {
      throw new Error("Could not find Dynamic Route Functions section");
    }

    // Find all function names in this section
    const sectionEnd = content.indexOf("// Helper Functions", sectionStart);
    const section = content.slice(sectionStart, sectionEnd);

    // Extract function names
    const functionPattern = /^\s+(\w+)\([^)]+\):/gm;
    const functions: Array<{ name: string; position: number }> = [];
    let match;

    while ((match = functionPattern.exec(section)) !== null) {
      functions.push({
        name: match[1],
        position: sectionStart + (match.index || 0),
      });
    }

    // Find alphabetical position
    const insertAfter = functions
      .filter((f) => f.name < name)
      .sort((a, b) => b.position - a.position)[0];

    if (insertAfter) {
      // Find the end of this function (next function or section divider)
      const nextFunction = functions.find((f) => f.position > insertAfter.position);
      if (nextFunction) {
        return nextFunction.position;
      }
      return sectionEnd;
    }

    // Insert at start of dynamic section (after section comment)
    const lineEnd = content.indexOf("\n", sectionStart);
    return content.indexOf("\n", lineEnd + 1) + 1;
  } else {
    // Insert in Static Routes section
    const sectionStart = content.indexOf("// Static Routes");
    if (sectionStart === -1) {
      throw new Error("Could not find Static Routes section");
    }

    // Find all static route names in this section
    const sectionEnd = content.indexOf("// Dynamic Route Functions", sectionStart);
    const section = content.slice(sectionStart, sectionEnd);

    // Extract static route names
    const staticPattern = /^\s+(\w+):\s*{/gm;
    const statics: Array<{ name: string; position: number }> = [];
    let match;

    while ((match = staticPattern.exec(section)) !== null) {
      statics.push({
        name: match[1],
        position: sectionStart + (match.index || 0),
      });
    }

    // Find alphabetical position
    const insertAfter = statics
      .filter((s) => s.name < name)
      .sort((a, b) => b.position - a.position)[0];

    if (insertAfter) {
      // Find the end of this static route (closing brace + comma)
      const searchStart = insertAfter.position;
      const closingBrace = content.indexOf("},", searchStart);
      return content.indexOf("\n", closingBrace) + 1;
    }

    // Insert at start of static section (after section comment)
    const lineEnd = content.indexOf("\n", sectionStart);
    return content.indexOf("\n", lineEnd + 1) + 1;
  }
}

/**
 * Insert breadcrumb into builder
 */
function insertBreadcrumb(
  content: string,
  newBreadcrumb: string,
  isDynamic: boolean,
  name: string,
): string {
  const insertPosition = findInsertionPoint(content, isDynamic, name);

  const before = content.slice(0, insertPosition);
  const after = content.slice(insertPosition);

  return `${before}\n${newBreadcrumb}\n${after}`;
}

/**
 * Check if breadcrumb already exists
 */
function breadcrumbExists(content: string, name: string): boolean {
  const staticPattern = new RegExp(`^\\s+${name}:\\s*{`, "m");
  const dynamicPattern = new RegExp(`^\\s+${name}\\([^)]+\\):`, "m");
  return staticPattern.test(content) || dynamicPattern.test(content);
}

/**
 * Write breadcrumb to file
 */
export function writeBreadcrumb(
  config: PageConfig,
  _configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  const breadcrumbPath = resolve(
    process.cwd(),
    "src/utils/breadcrumbs/breadcrumb-builder.ts",
  );

  // Read existing breadcrumb file
  const content = readFileSync(breadcrumbPath, "utf-8");

  // Generate breadcrumb name
  const name = generateBreadcrumbName(config);

  // Check if breadcrumb already exists
  if (breadcrumbExists(content, name)) {
    warnings.push(`Breadcrumb '${name}' already exists`);
    warnings.push("Skipping breadcrumb generation to avoid overwriting");
    return { files, warnings };
  }

  // Determine if static or dynamic
  const isDynamic = config.route.params && config.route.params.length > 0;

  // Generate breadcrumb
  const newBreadcrumb = isDynamic
    ? generateDynamicBreadcrumb(config, name)
    : generateStaticBreadcrumb(config, name);

  // Insert breadcrumb
  const updatedContent = insertBreadcrumb(content, newBreadcrumb, isDynamic ?? false, name);

  // Write back to file
  writeFileSync(breadcrumbPath, updatedContent, "utf-8");
  files.push(breadcrumbPath);

  warnings.push(`Breadcrumb added: bc.${name}`);

  return { files, warnings };
}
