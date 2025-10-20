/**
 * Page Writer
 *
 * Generates complete working page files:
 * - page.tsx (main page component with all imports and logic)
 * - not-found.tsx (404 page)
 * - loading.tsx (loading skeleton)
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { PageConfig } from "../../../src/generation/page-configs";

/**
 * Generate page.tsx content
 */
function generatePageContent(config: PageConfig, _configKey: string): string {
  const { route, page, ui, schemas } = config;
  const hasParams = route.params && route.params.length > 0;
  // Extract component names from schemas
  const apiParamsName = extractSchemaName(schemas.apiParams);
  const apiResponseName = extractSchemaName(schemas.apiResponse);

  // Generate page header comment
  const header = `/**
 * ${page.title}
 * ${page.description}
 *
 * @route ${route.path}
 * @requires Mailchimp connection
 * @features ${page.features.join(", ")}
 */`;

  // Generate imports
  // @ts-expect-error - TypeScript cache issue in current session, works correctly
  const imports = generateImports(config, hasParams, ui.hasPagination);

  // Generate page content based on type
  let pageComponent: string;

  if (page.type === "list") {
    pageComponent = generateListPage(config, apiParamsName, apiResponseName);
  } else if (page.type === "detail") {
    pageComponent = generateDetailPage(config, apiParamsName, apiResponseName);
  } else {
    pageComponent = generateNestedDetailPage(
      config,
      apiParamsName,
      apiResponseName,
    );
  }

  return `${header}

${imports}

${pageComponent}`;
}

/**
 * Extract schema name from file path
 */
function extractSchemaName(schemaPath: string): string {
  const fileName = schemaPath.split("/").pop() || "";
  // Convert kebab-case to PascalCase
  return fileName
    .replace(".schema.ts", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Generate imports for page
 */
function generateImports(
  config: PageConfig,
  hasParams: boolean,
  hasPagination: boolean | undefined,
): string {
  const imports: string[] = [];

  // React imports
  if (hasParams) {
    imports.push(`import { Suspense } from "react";`);
  }

  // Layout imports
  imports.push(`import { PageLayout } from "@/components/layout";`);
  if (hasParams) {
    imports.push(`import { BreadcrumbNavigation } from "@/components/layout";`);
  }

  // Mailchimp guard
  imports.push(
    `import { MailchimpConnectionGuard } from "@/components/mailchimp";`,
  );

  // Skeleton
  const skeletonName = `${config.page.title.replace(/\s+/g, "")}Skeleton`;
  imports.push(`import { ${skeletonName} } from "@/skeletons/mailchimp";`);

  // Schemas - will be created by schema writer
  imports.push(`// TODO: Import schemas once created`);

  // DAL
  imports.push(`import { mailchimpDAL } from "@/dal/mailchimp.dal";`);

  // Component - will be created by component writer
  const componentName = `${config.page.title.replace(/\s+/g, "")}Content`;
  imports.push(
    `// TODO: import { ${componentName} } from "@/components/mailchimp";`,
  );

  // Utils
  imports.push(`import { handleApiError, bc } from "@/utils";`);

  if (hasPagination === true) {
    imports.push(
      `import { validatePageParams } from "@/utils/mailchimp/page-params";`,
    );
    imports.push(
      `import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";`,
    );
  }

  // Error display
  imports.push(
    `import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";`,
  );

  return imports.join("\n");
}

/**
 * Generate list page component
 */
function generateListPage(
  config: PageConfig,
  _apiParamsName: string,
  _apiResponseName: string,
): string {
  const dalMethodName = config.api.dalMethod || "fetchData";
  const componentName = `${config.page.title.replace(/\s+/g, "")}Content`;

  return `// TODO: Create actual component
function ${componentName}(props: any) {
  return (
    <MailchimpConnectionGuard errorCode={props.errorCode}>
      <div>
        <p>Component placeholder - implement ${config.page.title}</p>
      </div>
    </MailchimpConnectionGuard>
  );
}

export default async function Page({ searchParams }: any) {
  // Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: {} as any, // TODO: Import UI schema
    apiSchema: {} as any, // TODO: Import API schema
    basePath: "${config.route.path}",
  });

  // Fetch data
  const response = await mailchimpDAL.${dalMethodName}(apiParams);

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbs={[bc.home, bc.mailchimp, bc.current("${config.ui.breadcrumbs.label}")]}
      title="${config.page.title}"
      description="${config.page.description}"
      skeleton={<div>Loading...</div>}
    >
      <${componentName}
        data={data}
        currentPage={currentPage}
        pageSize={pageSize}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// TODO: Add metadata generation
`;
}

/**
 * Generate detail page component
 */
function generateDetailPage(
  config: PageConfig,
  _apiParamsName: string,
  _apiResponseName: string,
): string {
  const dalMethodName = config.api.dalMethod || "fetchData";
  const componentName = `${config.page.title.replace(/\s+/g, "")}Content`;
  const paramName = config.route.params![0];

  return `// TODO: Create actual component
function ${componentName}(props: any) {
  return (
    <MailchimpConnectionGuard errorCode={props.errorCode}>
      <div>
        <p>Component placeholder - implement ${config.page.title}</p>
      </div>
    </MailchimpConnectionGuard>
  );
}

export default async function Page({ params }: any) {
  // Process route params
  const rawParams = await params;
  const { ${paramName} } = {} as any; // TODO: Parse with schema

  // Fetch data
  const response = await mailchimpDAL.${dalMethodName}(${paramName});

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="${config.page.title}"
      description="${config.page.description}"
      skeleton={<div>Loading...</div>}
    >
      <${componentName}
        data={data}
        ${paramName}={${paramName}}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

async function BreadcrumbContent({ params }: { params: Promise<{ ${paramName}: string }> }) {
  const rawParams = await params;
  const { ${paramName} } = {} as any; // TODO: Parse with schema

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        // TODO: Add parent breadcrumbs
        bc.current("${config.ui.breadcrumbs.label}"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// TODO: Add metadata generation
`;
}

/**
 * Generate nested detail page component
 */
function generateNestedDetailPage(
  config: PageConfig,
  _apiParamsName: string,
  _apiResponseName: string,
): string {
  const dalMethodName = config.api.dalMethod || "fetchData";
  const componentName = `${config.page.title.replace(/\s+/g, "")}Content`;
  const paramName = config.route.params![0];
  const hasPagination = config.ui.hasPagination;

  return `// TODO: Create actual component
function ${componentName}(props: any) {
  return (
    <MailchimpConnectionGuard errorCode={props.errorCode}>
      <div>
        <p>Component placeholder - implement ${config.page.title}</p>
      </div>
    </MailchimpConnectionGuard>
  );
}

export default async function Page({ params, searchParams }: any) {
  // Process route params
  const rawParams = await params;
  const { ${paramName} } = {} as any; // TODO: Parse with schema

  ${
    hasPagination
      ? `// Validate page params with redirect handling
  const { apiParams, currentPage, pageSize } = await validatePageParams({
    searchParams,
    uiSchema: {} as any, // TODO: Import UI schema
    apiSchema: {} as any, // TODO: Import API schema
    basePath: "${config.route.path.replace(`[${paramName}]`, `\${${paramName}}`)}",
  });`
      : `// Parse API params
  const apiParams = {} as any; // TODO: Parse with schema`
  }

  // Fetch data
  const response = await mailchimpDAL.${dalMethodName}(${paramName}${hasPagination ? ", apiParams" : ""});

  // Handle API errors
  handleApiError(response);

  const data = response.success ? response.data : null;

  return (
    <PageLayout
      breadcrumbsSlot={
        <Suspense fallback={null}>
          <BreadcrumbContent params={params} />
        </Suspense>
      }
      title="${config.page.title}"
      description="${config.page.description}"
      skeleton={<div>Loading...</div>}
    >
      <${componentName}
        data={data}
        ${paramName}={${paramName}}
        ${hasPagination ? "currentPage={currentPage}\n        pageSize={pageSize}" : ""}
        errorCode={response.errorCode}
      />
    </PageLayout>
  );
}

async function BreadcrumbContent({ params }: { params: Promise<{ ${paramName}: string }> }) {
  const rawParams = await params;
  const { ${paramName} } = {} as any; // TODO: Parse with schema

  return (
    <BreadcrumbNavigation
      items={[
        bc.home,
        bc.mailchimp,
        // TODO: Add parent breadcrumbs
        bc.current("${config.ui.breadcrumbs.label}"),
      ]}
    />
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// TODO: Add metadata generation
`;
}

/**
 * Generate not-found.tsx content
 */
function generateNotFoundContent(config: PageConfig): string {
  return `import { BackButton } from "@/components/not-found";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">404 - ${config.page.title} Not Found</h2>
      <p className="text-muted-foreground">${config.page.description}</p>
      <BackButton />
    </div>
  );
}
`;
}

/**
 * Generate loading.tsx content
 */
function generateLoadingContent(config: PageConfig): string {
  const skeletonName = `${config.page.title.replace(/\s+/g, "")}Skeleton`;

  return `import { ${skeletonName} } from "@/skeletons/mailchimp";

export default function Loading() {
  return <${skeletonName} />;
}
`;
}

/**
 * Write page files to disk
 */
export function writePageFiles(
  config: PageConfig,
  configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  // Convert route path to file system path
  const routePath = config.route.path.replace("/mailchimp", "");
  const pageDir = resolve(process.cwd(), `src/app/mailchimp${routePath}`);

  // Create directory if it doesn't exist
  if (!existsSync(pageDir)) {
    mkdirSync(pageDir, { recursive: true });
  }

  // Write page.tsx
  const pagePath = join(pageDir, "page.tsx");
  const pageContent = generatePageContent(config, configKey);
  writeFileSync(pagePath, pageContent, "utf-8");
  files.push(pagePath);

  // Write not-found.tsx (only for detail/nested-detail pages)
  if (config.page.type !== "list") {
    const notFoundPath = join(pageDir, "not-found.tsx");
    const notFoundContent = generateNotFoundContent(config);
    writeFileSync(notFoundPath, notFoundContent, "utf-8");
    files.push(notFoundPath);
  }

  // Write loading.tsx
  const loadingPath = join(pageDir, "loading.tsx");
  const loadingContent = generateLoadingContent(config);
  writeFileSync(loadingPath, loadingContent, "utf-8");
  files.push(loadingPath);

  warnings.push(
    "Generated files contain TODO comments - complete implementation required",
  );
  warnings.push("Schemas need to be created before page will compile");
  warnings.push("Component needs to be implemented");
  warnings.push("DAL method needs to be added");

  return { files, warnings };
}
