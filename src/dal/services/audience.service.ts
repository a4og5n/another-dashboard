/**
 * Mailchimp Audience Service
 *
 * Implements business logic for Mailchimp Audience operations.
 * Uses the repository pattern for data access and provides
 * high-level operations with business rules and validation.
 */

import type {
  AudienceModel,
  AudienceQueryFilters,
  AudienceStats,
} from "@/dal/models/audience.model";
import type {
  IAudienceRepository,
  RepositoryResult,
  PaginatedResult,
} from "@/dal/repositories/audience.repository";
import { AudienceModelValidators } from "@/dal/models/audience.model";

/**
 * Service result type with additional business context
 */
export interface ServiceResult<T> extends RepositoryResult<T> {
  operation: string;
  duration_ms?: number;
  cache_hit?: boolean;
}

/**
 * Business validation error
 */
export class BusinessValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string,
  ) {
    super(message);
    this.name = "BusinessValidationError";
  }
}

/**
 * Service configuration options
 */
export interface AudienceServiceConfig {
  maxAudiencesPerSync: number;
  syncIntervalMinutes: number;
  cacheExpiryMinutes: number;
  maxMemberCount: number;
  enableAutomaticSync: boolean;
}

/**
 * Default service configuration
 */
const DEFAULT_CONFIG: AudienceServiceConfig = {
  maxAudiencesPerSync: 50,
  syncIntervalMinutes: 30,
  cacheExpiryMinutes: 15,
  maxMemberCount: 500000,
  enableAutomaticSync: true,
};

/**
 * Audience Service implementing business logic operations
 */
export class AudienceService {
  private cache = new Map<string, { data: unknown; expiry: number }>();

  constructor(
    private repository: IAudienceRepository,
    private config: AudienceServiceConfig = DEFAULT_CONFIG,
  ) {}

  /**
   * Get audience by ID with caching
   */
  async getAudience(id: string): Promise<ServiceResult<AudienceModel | null>> {
    const startTime = Date.now();
    const operation = "getAudience";

    try {
      // Check cache first
      const cacheKey = `audience:${id}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached as AudienceModel | null,
          operation,
          duration_ms: Date.now() - startTime,
          cache_hit: true,
          timestamp: new Date().toISOString(),
        };
      }

      const result = await this.repository.findById(id);

      if (result.success && result.data) {
        // Cache successful result
        this.setCache(cacheKey, result.data);
      }

      return {
        ...result,
        operation,
        duration_ms: Date.now() - startTime,
        cache_hit: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * List audiences with business rules applied
   */
  async listAudiences(
    filters: Partial<AudienceQueryFilters> = {},
  ): Promise<ServiceResult<PaginatedResult<AudienceModel>>> {
    const startTime = Date.now();
    const operation = "listAudiences";

    try {
      // Apply business validation to filters
      const validatedFilters = this.validateListFilters(filters);

      // Check cache for this query
      const cacheKey = `audiences:${JSON.stringify(validatedFilters)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached as PaginatedResult<AudienceModel>,
          operation,
          duration_ms: Date.now() - startTime,
          cache_hit: true,
          timestamp: new Date().toISOString(),
        };
      }

      const result = await this.repository.findMany(validatedFilters);

      if (result.success && result.data) {
        // Apply business post-processing
        result.data.items = this.enrichAudienceData(result.data.items);

        // Cache successful result
        this.setCache(cacheKey, result.data);
      }

      return {
        ...result,
        operation,
        duration_ms: Date.now() - startTime,
        cache_hit: false,
      };
    } catch (error) {
      if (error instanceof BusinessValidationError) {
        return {
          success: false,
          error: error.message,
          operation,
          duration_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get comprehensive audience statistics
   */
  async getAudienceStats(): Promise<ServiceResult<AudienceStats>> {
    const startTime = Date.now();
    const operation = "getAudienceStats";

    try {
      // Check cache first
      const cacheKey = "stats:audience";
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached as AudienceStats,
          operation,
          duration_ms: Date.now() - startTime,
          cache_hit: true,
          timestamp: new Date().toISOString(),
        };
      }

      const result = await this.repository.getStats();

      if (result.success && result.data) {
        // Cache successful result with shorter expiry for stats
        this.setCache(cacheKey, result.data, 5); // 5 minute cache
      }

      return {
        ...result,
        operation,
        duration_ms: Date.now() - startTime,
        cache_hit: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync stale audiences with Mailchimp API
   */
  async syncStaleAudiences(): Promise<
    ServiceResult<{ synced: number; failed: number }>
  > {
    const startTime = Date.now();
    const operation = "syncStaleAudiences";

    try {
      const staleResult = await this.repository.getStaleAudiences(
        this.config.syncIntervalMinutes,
      );

      if (!staleResult.success || !staleResult.data) {
        return {
          success: false,
          error: staleResult.error || "Failed to get stale audiences",
          operation,
          duration_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      }

      let synced = 0;
      let failed = 0;

      // Process audiences in batches
      const audiences = staleResult.data.slice(
        0,
        this.config.maxAudiencesPerSync,
      );

      for (const audience of audiences) {
        try {
          // Mark as syncing
          await this.repository.updateSyncStatus(audience.id, "syncing");

          // Here you would integrate with Mailchimp API
          // For now, we'll simulate success

          // Mark as completed
          await this.repository.updateSyncStatus(audience.id, "completed");
          synced++;
        } catch {
          // Mark as failed
          await this.repository.updateSyncStatus(audience.id, "failed");
          failed++;
        }
      }

      // Clear caches after sync
      this.invalidateCaches(["audiences:", "stats:"]);

      return {
        success: true,
        data: { synced, failed },
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get audience growth metrics
   */
  async getGrowthMetrics(
    audienceId: string,
    days: number = 30,
  ): Promise<ServiceResult<Array<{ date: string; member_count: number }>>> {
    const startTime = Date.now();
    const operation = "getGrowthMetrics";

    try {
      // Validate input
      if (days < 1 || days > 365) {
        throw new BusinessValidationError(
          "Days must be between 1 and 365",
          "days",
          "INVALID_RANGE",
        );
      }

      const result = await this.repository.getGrowthMetrics(audienceId, days);

      return {
        ...result,
        operation,
        duration_ms: Date.now() - startTime,
      };
    } catch (error) {
      if (error instanceof BusinessValidationError) {
        return {
          success: false,
          error: error.message,
          operation,
          duration_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation,
        duration_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Private helper methods

  private validateListFilters(
    filters: Partial<AudienceQueryFilters>,
  ): AudienceQueryFilters {
    // Apply business defaults and validation
    const validated = AudienceModelValidators.validateFilters({
      ...filters,
      is_deleted: filters.is_deleted ?? false, // Default to non-deleted
      limit: Math.min(filters.limit || 20, 100), // Max 100 per page
    });

    return validated;
  }

  private enrichAudienceData(audiences: AudienceModel[]): AudienceModel[] {
    // Add business-specific enrichments
    return audiences.map((audience) => ({
      ...audience,
      // Add calculated fields or business-specific data
    }));
  }

  private getFromCache(key: string): unknown {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    if (cached) {
      this.cache.delete(key); // Remove expired entry
    }

    return null;
  }

  private setCache(key: string, data: unknown, expiryMinutes?: number): void {
    const expiry =
      Date.now() +
      (expiryMinutes || this.config.cacheExpiryMinutes) * 60 * 1000;
    this.cache.set(key, { data, expiry });
  }

  private invalidateCaches(prefixes: string[]): void {
    for (const [key] of this.cache) {
      if (prefixes.some((prefix) => key.startsWith(prefix))) {
        this.cache.delete(key);
      }
    }
  }
}
