/**
 * Component Writer
 *
 * Generates placeholder component with Construction card:
 * - Shows available data structure
 * - Includes TODO comments for implementation
 * - Uses lucide-react Construction icon
 * - Writes to src/components/mailchimp/[category]/[name].tsx
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { PageConfig } from "../../../src/generation/page-configs";

/**
 * Determine component category from route path
 */
function getComponentCategory(routePath: string): string {
  // Extract category from route path
  // /mailchimp/reports → reports
  // /mailchimp/lists/[id]/members → lists
  const segments = routePath.split("/").filter(Boolean);

  if (segments.length >= 2) {
    return segments[1]; // First segment after /mailchimp
  }

  return "common";
}

/**
 * Generate component name from page title
 */
function getComponentName(pageTitle: string): string {
  return `${pageTitle.replace(/\s+/g, "")}Content`;
}

/**
 * Generate component file content
 */
function generateComponentContent(config: PageConfig): string {
  const componentName = getComponentName(config.page.title);
  const hasParams = config.route.params && config.route.params.length > 0;
  const hasPagination = config.ui.hasPagination;

  // Generate props interface
  const propsInterface = generatePropsInterface(
    componentName,
    config,
    hasParams,
    Boolean(hasPagination),
  );

  // Generate component body
  const componentBody = generateComponentBody(componentName, config);

  const header = `/**
 * ${config.page.title} Component
 * ${config.page.description}
 *
 * @route ${config.route.path}
 * TODO: Implement full component logic
 * TODO: Replace placeholder with actual data display
 * TODO: Add error handling and loading states
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { MailchimpConnectionGuard } from "@/components/mailchimp";`;

  return `${header}\n\n${propsInterface}\n\n${componentBody}\n`;
}

/**
 * Generate props interface
 */
function generatePropsInterface(
  componentName: string,
  config: PageConfig,
  hasParams: boolean,
  hasPagination: boolean,
): string {
  const props: string[] = [];

  // Data prop
  props.push("  data: any; // TODO: Replace with proper type");

  // Route params
  if (hasParams) {
    const paramName = config.route.params![0];
    props.push(`  ${paramName}: string;`);
  }

  // Pagination props
  if (hasPagination) {
    props.push("  currentPage: number;");
    props.push("  pageSize: number;");
  }

  // Error code
  props.push("  errorCode?: string;");

  return `interface ${componentName}Props {
${props.join("\n")}
}`;
}

/**
 * Generate component body
 */
function generateComponentBody(
  componentName: string,
  config: PageConfig,
): string {
  const hasParams = config.route.params && config.route.params.length > 0;
  const hasPagination = config.ui.hasPagination;
  const paramName = hasParams ? config.route.params![0] : null;

  // Build data structure description
  const dataStructure: string[] = [];

  if (paramName) {
    dataStructure.push(`  • ${paramName}: Route parameter`);
  }

  if (hasPagination) {
    dataStructure.push("  • currentPage: Current page number");
    dataStructure.push("  • pageSize: Items per page");
  }

  dataStructure.push("  • data: API response data");
  dataStructure.push(
    `  • API endpoint: ${config.api.method} ${config.api.endpoint}`,
  );

  return `export function ${componentName}({
  data,${paramName ? `\n  ${paramName},` : ""}${hasPagination ? "\n  currentPage,\n  pageSize," : ""}
  errorCode,
}: ${componentName}Props) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-500" />
            ${config.page.title} - Under Construction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-yellow-500 bg-yellow-50 p-6 dark:bg-yellow-950">
            <p className="text-sm text-muted-foreground mb-4">
              This component is a placeholder. Implement the full UI based on the data structure below.
            </p>

            <div className="space-y-2">
              <p className="font-medium text-sm">Available Data:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
${dataStructure.map((line) => `                <li>${line}</li>`).join("\n")}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-900">
              <p className="text-xs text-muted-foreground">
                <strong>TODO:</strong> Replace this placeholder with actual component implementation
              </p>
            </div>
          </div>

          {/* TODO: Add actual component content here */}
          <div className="p-4 rounded-lg bg-muted">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(
                {${paramName ? `\n                  ${paramName},` : ""}${hasPagination ? "\n                  currentPage,\n                  pageSize," : ""}
                  dataAvailable: !!data,
                },
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </MailchimpConnectionGuard>
  );
}
`;
}

/**
 * Get output path for component
 */
function getOutputPath(config: PageConfig): string {
  const category = getComponentCategory(config.route.path);
  const fileName = `${config.page.title.toLowerCase().replace(/\s+/g, "-")}-content.tsx`;
  return resolve(
    process.cwd(),
    `src/components/mailchimp/${category}/${fileName}`,
  );
}

/**
 * Write component files to disk
 */
export function writeComponentFiles(
  config: PageConfig,
  _configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  // Generate component content
  const componentContent = generateComponentContent(config);

  // Get output path
  const outputPath = getOutputPath(config);

  // Create directory if it doesn't exist
  const dir = join(outputPath, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Check if file already exists
  if (existsSync(outputPath)) {
    warnings.push(`Component file already exists: ${outputPath}`);
    warnings.push("Skipping component generation to avoid overwriting");
    return { files, warnings };
  }

  // Write component file
  writeFileSync(outputPath, componentContent, "utf-8");
  files.push(outputPath);

  warnings.push("Component is a placeholder - requires full implementation");
  warnings.push("Replace Construction card with actual data display");

  return { files, warnings };
}
