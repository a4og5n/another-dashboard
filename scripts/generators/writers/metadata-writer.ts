/**
 * Metadata Writer
 *
 * Adds metadata helper function to utils/mailchimp/metadata.ts:
 * - Reads existing file
 * - Generates metadata helper function following existing patterns
 * - Follows pattern from generateCampaignOpensMetadata
 * - Exports from src/utils/metadata.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PageConfig } from "@/generation/page-configs";

/**
 * Generate metadata function name
 */
function generateMetadataFunctionName(config: PageConfig): string {
  // Convert page title to camelCase
  // "Campaign Clicks" → "generateCampaignClicksMetadata"
  const title = config.page.title;
  const camelCase = title
    .split(/\s+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");

  return `generate${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}Metadata`;
}

/**
 * Generate metadata helper function
 */
function generateMetadataFunction(
  config: PageConfig,
  functionName: string,
): string {
  const paramName = config.route.params?.[0] || "id";
  const schemaName = `${toCamelCase(config.page.title)}PageParamsSchema`;

  // Generate description based on page
  const description = config.page.description;
  const title = config.page.title;

  return `/**
 * Generates metadata specifically for ${title.toLowerCase()} pages
 * @param params - Object containing the ${paramName}
 * @returns Next.js Metadata object for the ${title.toLowerCase()} page
 */
export async function ${functionName}({
  params,
}: {
  params: Promise<{ ${paramName}: string }>;
}): Promise<Metadata> {
  const rawParams = await params;
  const { ${paramName} } = ${schemaName}.parse(rawParams);

  // Fetch data for metadata
  // TODO: Implement proper data fetching using DAL method
  const response = await mailchimpDAL.fetchCampaignReport(${paramName});

  if (!response.success || !response.data) {
    return {
      title: "${title} - Not Found",
      description: "The requested resource could not be found.",
    };
  }

  const data = response.data as any; // TODO: Add proper type

  return {
    title: \`\${data.campaign_title || "Resource"} - ${title}\`,
    description: "${description}",
    openGraph: {
      title: \`\${data.campaign_title || "Resource"} - ${title}\`,
      description: "${description}",
      type: "website",
    },
  };
}
`;
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

/**
 * Insert metadata function into file
 */
function insertMetadataFunction(content: string, newFunction: string): string {
  // Append at the end of the file
  return `${content}\n${newFunction}`;
}

/**
 * Check if metadata function already exists
 */
function metadataFunctionExists(
  content: string,
  functionName: string,
): boolean {
  const pattern = new RegExp(`export async function ${functionName}\\(`);
  return pattern.test(content);
}

/**
 * Update exports in utils/metadata.ts
 */
function updateMetadataExports(functionName: string): void {
  const exportPath = resolve(process.cwd(), "src/utils/metadata.ts");
  const content = readFileSync(exportPath, "utf-8");

  // Check if already exported
  if (content.includes(functionName)) {
    return;
  }

  // Add to export list
  const exportPattern =
    /export \{([^}]+)\} from ["'][@./]+utils\/mailchimp\/metadata["'];/;
  const match = content.match(exportPattern);

  if (match) {
    // Add to existing exports
    const currentExports = match[1].trim();
    const newExports = `${currentExports},\n  ${functionName}`;
    const updatedContent = content.replace(
      exportPattern,
      `export {\n  ${newExports}\n} from "@/utils/mailchimp/metadata";`,
    );
    writeFileSync(exportPath, updatedContent, "utf-8");
  } else {
    // Create new export
    const newExport = `\nexport {\n  ${functionName}\n} from "@/utils/mailchimp/metadata";\n`;
    writeFileSync(exportPath, content + newExport, "utf-8");
  }
}

/**
 * Write metadata helper to file
 */
export function writeMetadataHelper(
  config: PageConfig,
  _configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  const metadataPath = resolve(
    process.cwd(),
    "src/utils/mailchimp/metadata.ts",
  );

  // Read existing metadata file
  const content = readFileSync(metadataPath, "utf-8");

  // Generate function name
  const functionName = generateMetadataFunctionName(config);

  // Check if function already exists
  if (metadataFunctionExists(content, functionName)) {
    warnings.push(`Metadata function '${functionName}' already exists`);
    warnings.push("Skipping metadata generation to avoid overwriting");
    return { files, warnings };
  }

  // Generate metadata function
  const newFunction = generateMetadataFunction(config, functionName);

  // Insert function into file
  const updatedContent = insertMetadataFunction(content, newFunction);

  // Write back to file
  writeFileSync(metadataPath, updatedContent, "utf-8");
  files.push(metadataPath);

  // Update exports in utils/metadata.ts
  try {
    updateMetadataExports(functionName);
    files.push(resolve(process.cwd(), "src/utils/metadata.ts"));
  } catch (_error) {
    warnings.push("Failed to update utils/metadata.ts exports");
    warnings.push(
      `Manually add: export { ${functionName} } from "@/utils/mailchimp/metadata";`,
    );
  }

  warnings.push(`Metadata function added: ${functionName}`);
  warnings.push("TODO: Update function to use proper DAL method and types");

  return { files, warnings };
}
