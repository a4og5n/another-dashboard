import { NextResponse } from "next/server";

/**
 * Auth Health Check Endpoint
 * Tests availability of authentication services (Kinde & Mailchimp OAuth)
 *
 * GET /api/health/auth
 *
 * Returns:
 * - 200: All auth services are available
 * - 503: One or more auth services are unavailable
 * - 500: Health check failed to run
 *
 * Response format:
 * ```json
 * {
 *   "status": "healthy" | "degraded" | "error",
 *   "timestamp": "2025-01-15T12:00:00.000Z",
 *   "services": [
 *     {
 *       "name": "kinde_jwks",
 *       "status": "available" | "unavailable",
 *       "responseTime": 123,
 *       "error": "error message" (if unavailable)
 *     },
 *     {
 *       "name": "mailchimp_oauth",
 *       "status": "available" | "unavailable",
 *       "responseTime": 456,
 *       "error": "error message" (if unavailable)
 *     }
 *   ]
 * }
 * ```
 */

interface ServiceHealthResult {
  name: string;
  status: "available" | "unavailable";
  responseTime: number; // milliseconds
  error?: string;
}

/**
 * Check Kinde JWKS endpoint availability
 * This is critical for user authentication
 */
async function checkKindeJWKS(): Promise<ServiceHealthResult> {
  const start = Date.now();
  const kindeIssuerUrl = process.env.KINDE_ISSUER_URL;

  if (!kindeIssuerUrl) {
    return {
      name: "kinde_jwks",
      status: "unavailable",
      responseTime: 0,
      error: "KINDE_ISSUER_URL not configured",
    };
  }

  try {
    const jwksUrl = `${kindeIssuerUrl}/.well-known/jwks`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(jwksUrl, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;

    if (!response.ok) {
      return {
        name: "kinde_jwks",
        status: "unavailable",
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Verify response is valid JSON with keys
    const data = await response.json();
    if (!data.keys || !Array.isArray(data.keys)) {
      return {
        name: "kinde_jwks",
        status: "unavailable",
        responseTime,
        error: "Invalid JWKS response format",
      };
    }

    return {
      name: "kinde_jwks",
      status: "available",
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      name: "kinde_jwks",
      status: "unavailable",
      responseTime,
      error:
        error instanceof Error ? error.message : "Unknown error fetching JWKS",
    };
  }
}

/**
 * Check Mailchimp OAuth endpoint availability
 * This is required for Mailchimp account connections
 */
async function checkMailchimpOAuth(): Promise<ServiceHealthResult> {
  const start = Date.now();
  const mailchimpTokenUrl = "https://login.mailchimp.com/oauth2/token";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    // Make a HEAD request to check endpoint availability
    // We expect a 400/401 response (invalid request), which means the endpoint is up
    const response = await fetch(mailchimpTokenUrl, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;

    // 400/401 means endpoint is available but rejecting our request (expected)
    // 2xx, 3xx, 400, 401 are all "available" states
    // 5xx means service is down
    const isAvailable =
      response.status < 500 ||
      response.status === 400 ||
      response.status === 401;

    if (!isAvailable) {
      return {
        name: "mailchimp_oauth",
        status: "unavailable",
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      name: "mailchimp_oauth",
      status: "available",
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      name: "mailchimp_oauth",
      status: "unavailable",
      responseTime,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error checking OAuth endpoint",
    };
  }
}

/**
 * GET handler - Check auth services health
 */
export async function GET() {
  try {
    // Run health checks in parallel
    const [kindeResult, mailchimpResult] = await Promise.all([
      checkKindeJWKS(),
      checkMailchimpOAuth(),
    ]);

    const services = [kindeResult, mailchimpResult];
    const allAvailable = services.every((s) => s.status === "available");
    const status = allAvailable ? 200 : 503;

    return NextResponse.json(
      {
        status: allAvailable ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        services,
      },
      { status },
    );
  } catch (error) {
    console.error("Auth health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: [],
      },
      { status: 500 },
    );
  }
}
