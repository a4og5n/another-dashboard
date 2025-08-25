/**
 * Base API Service Class
 * Provides common functionality for all API integrations including:
 * - HTTP client wrapper
 * - Error handling
 * - Rate limiting
 * - Authentication
 * - Logging
 */

import { env, isDev } from '@/lib/config';

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  rateLimit?: {
    remaining: number;
    resetTime: Date;
  };
}

/**
 * Rate limiting information
 */
export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  limit: number;
}

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseUrl: string;
  headers: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Base API Service abstract class
 * All API integrations should extend this class
 */
export abstract class BaseApiService {
  protected config: HttpClientConfig;
  protected serviceName: string;
  protected rateLimit?: RateLimitInfo;

  constructor(serviceName: string, config: HttpClientConfig) {
    this.serviceName = serviceName;
    this.config = {
      timeout: 10000, // 10 seconds default
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
      ...config,
    };
  }

  /**
   * Abstract method for service-specific authentication
   * Each service implements its own auth mechanism
   */
  protected abstract authenticate(): Promise<void>;

  /**
   * Abstract method for handling service-specific rate limiting
   */
  protected abstract handleRateLimit(response: Response): void;

  /**
   * HTTP client wrapper with error handling and retries
   */
  protected async httpClient<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout!),
    };

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= (this.config.retryAttempts || 1); attempt++) {
      try {
        this.logRequest(url, requestOptions, attempt);

        const response = await fetch(url, requestOptions);
        
        // Handle rate limiting
        this.handleRateLimit(response);

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        this.logResponse(url, response.status, data);

        return {
          success: true,
          data,
          statusCode: response.status,
          rateLimit: this.rateLimit,
        };

      } catch (error) {
        lastError = error as Error;
        this.logError(url, error as Error, attempt);

        // If this is the last attempt, don't retry
        if (attempt === this.config.retryAttempts) {
          break;
        }

        // Wait before retrying (exponential backoff)
        const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    // All attempts failed
    return {
      success: false,
      error: lastError?.message || 'Unknown error occurred',
      statusCode: 500,
    };
  }

  /**
   * GET request helper
   */
  protected async get<T>(endpoint: string, params?: Record<string, string | number | boolean | string[]>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays by joining with commas
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.httpClient<T>(url, { method: 'GET' });
  }

  /**
   * POST request helper
   */
  protected async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.httpClient<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.httpClient<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.httpClient<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Sleep utility for retry delays
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logging utilities (development only)
   */
  protected logRequest(url: string, options: RequestInit, attempt: number): void {
    if (!isDev || !env.DEBUG_API_CALLS) return;
    
    console.log(`🌐 [${this.serviceName}] ${options.method?.toUpperCase() || 'GET'} ${url}`);
    if (attempt > 1) {
      console.log(`🔄 [${this.serviceName}] Retry attempt ${attempt}`);
    }
  }

  protected logResponse(url: string, status: number, data: unknown): void {
    if (!isDev || !env.DEBUG_API_CALLS) return;
    
    console.log(`✅ [${this.serviceName}] ${status} - ${url}`);
    console.log(`📦 [${this.serviceName}] Response:`, data);
  }

  protected logError(url: string, error: Error, attempt: number): void {
    if (!isDev || !env.DEBUG_API_CALLS) return;
    
    console.error(`❌ [${this.serviceName}] Error on attempt ${attempt} - ${url}:`, error.message);
  }

  /**
   * Health check method - each service should implement
   */
  abstract healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>>;
}

/**
 * API Service Factory
 * Creates and manages service instances
 */
export class ApiServiceFactory {
  private static instances = new Map<string, BaseApiService>();

  static getInstance<T extends BaseApiService>(
    serviceName: string,
    factory: () => T
  ): T {
    if (!this.instances.has(serviceName)) {
      this.instances.set(serviceName, factory());
    }
    return this.instances.get(serviceName) as T;
  }

  static clearInstances(): void {
    this.instances.clear();
  }
}
