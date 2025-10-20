/**
 * API Configuration Prompts
 *
 * Prompts user for API configuration with smart defaults.
 * Auto-generates DAL method names and suggests HTTP methods.
 */

import * as clack from "@clack/prompts";
import type { RouteConfig } from "./route-prompts";
import type { HttpMethod } from "@/generation/page-configs";

/**
 * API configuration from user prompts
 */
export interface ApiConfig {
  endpoint: string;
  method: HttpMethod;
  dalMethod?: string;
}

/**
 * Convert route path to API endpoint
 * @example "/mailchimp/reports/[id]/clicks" → "/reports/{campaign_id}/click-details"
 */
function routeToEndpoint(routePath: string): string {
  // Remove /mailchimp prefix
  let endpoint = routePath.replace("/mailchimp", "");

  // Convert [id] to {campaign_id} (Mailchimp convention)
  endpoint = endpoint.replace(/\[id\]/g, "{campaign_id}");

  // Convert other dynamic segments
  endpoint = endpoint.replace(/\[([^\]]+)\]/g, "{$1}");

  return endpoint;
}

/**
 * Generate DAL method name from endpoint
 * @example "/reports/{campaign_id}/click-details" → "fetchCampaignClickDetails"
 */
function generateDalMethodName(endpoint: string): string {
  // Remove leading slash and parameters
  const cleaned = endpoint
    .replace(/^\//, "")
    .replace(/\{[^}]+\}/g, "")
    .replace(/\/+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Convert to camelCase with "fetch" prefix
  const parts = cleaned.split("-");
  const camelCase = parts
    .map((part, i) => {
      if (i === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");

  return `fetch${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
}

/**
 * Suggest HTTP method based on endpoint structure
 */
function suggestHttpMethod(endpoint: string): HttpMethod {
  // If endpoint has parameters, likely a GET
  if (endpoint.includes("{")) {
    return "GET";
  }

  // Default to GET for list endpoints
  return "GET";
}

/**
 * Prompt user for API configuration
 */
export async function apiPrompts(routeConfig: RouteConfig): Promise<ApiConfig> {
  clack.log.info("Configure the Mailchimp API endpoint.");

  // Suggest endpoint from route
  const suggestedEndpoint = routeToEndpoint(routeConfig.path);

  const endpoint = await clack.text({
    message: "Mailchimp API endpoint:",
    placeholder: suggestedEndpoint,
    initialValue: suggestedEndpoint,
    validate: (value) => {
      if (!value) return "API endpoint is required";
      if (!value.startsWith("/")) return "Endpoint must start with '/'";
      return undefined;
    },
  });

  if (clack.isCancel(endpoint)) {
    throw new Error("Operation cancelled");
  }

  // Suggest HTTP method
  const suggestedMethod = suggestHttpMethod(endpoint);

  const method = (await clack.select({
    message: "HTTP method:",
    options: [
      {
        value: "GET",
        label: "GET - Fetch data",
        hint: suggestedMethod === "GET" ? "suggested" : undefined,
      },
      { value: "POST", label: "POST - Create new resource" },
      { value: "PATCH", label: "PATCH - Update existing resource" },
      { value: "PUT", label: "PUT - Replace existing resource" },
      { value: "DELETE", label: "DELETE - Remove resource" },
    ],
    initialValue: suggestedMethod,
  })) as HttpMethod;

  if (clack.isCancel(method)) {
    throw new Error("Operation cancelled");
  }

  // Generate DAL method name
  const suggestedDalMethod = generateDalMethodName(endpoint);

  const useCustomDalMethod = await clack.confirm({
    message: `Use auto-generated DAL method name? (${suggestedDalMethod})`,
    initialValue: true,
  });

  if (clack.isCancel(useCustomDalMethod)) {
    throw new Error("Operation cancelled");
  }

  let dalMethod: string | undefined = suggestedDalMethod;

  if (!useCustomDalMethod) {
    const customDalMethod = await clack.text({
      message: "Custom DAL method name:",
      placeholder: suggestedDalMethod,
      validate: (value) => {
        if (!value) return "DAL method name is required";
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
          return "DAL method name must be valid JavaScript identifier";
        }
        return undefined;
      },
    });

    if (clack.isCancel(customDalMethod)) {
      throw new Error("Operation cancelled");
    }

    dalMethod = customDalMethod;
  }

  clack.log.success("✓ API configuration complete");

  return {
    endpoint,
    method,
    dalMethod,
  };
}
