/**
 * Mailchimp Audience Service
 *
 * Implements business logic for Mailchimp Audience operations.
 * Uses the repository pattern for data access and provides
 * high-level operations with business rules and validation.
 */

import type {
  AudienceModel,
  CreateAudienceModel,
  UpdateAudienceModel,
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
   * Create a new audience with business validation
   */
  async createAudience(
    audienceData: Omit<CreateAudienceModel, "created_at" | "updated_at">,
  ): Promise<ServiceResult<AudienceModel>> {
    const startTime = Date.now();
    const operation = "createAudience";

    try {
      // Business validation
      await this.validateAudienceCreation(audienceData);

      // Validate data structure
      const validatedData =
        AudienceModelValidators.validateCreate(audienceData);

      const result = await this.repository.create(validatedData);

      if (result.success && result.data) {
        // Clear relevant caches
        this.invalidateCaches(["audiences:", "stats:"]);

        // Schedule sync if auto-sync is enabled
        if (this.config.enableAutomaticSync) {
          await this.repository.markForSync(result.data.id);
        }
      }

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

  /**
   * Update an existing audience with business validation
   */
  async updateAudience(
    id: string,
    updates: Partial<UpdateAudienceModel>,
  ): Promise<ServiceResult<AudienceModel>> {
    const startTime = Date.now();
    const operation = "updateAudience";

    try {
      // Business validation
      await this.validateAudienceUpdate(id, updates);

      // Validate data structure
      const validatedUpdates = AudienceModelValidators.validateUpdate({
        id,
        ...updates,
      });

      const result = await this.repository.update(id, validatedUpdates);

      if (result.success) {
        // Clear relevant caches
        this.invalidateCaches([`audience:${id}`, "audiences:", "stats:"]);
      }

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

  /**
   * Delete an audience with business rules
   */
  async deleteAudience(id: string): Promise<ServiceResult<boolean>> {
    const startTime = Date.now();
    const operation = "deleteAudience";

    try {
      // Business validation - check if audience can be deleted
      const audience = await this.repository.findById(id);
      if (!audience.success || !audience.data) {
        return {
          success: false,
          error: `Audience with ID ${id} not found`,
          operation,
          duration_ms: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      }

      // Check business rules for deletion
      if (audience.data.sync_status === "syncing") {
        throw new BusinessValidationError(
          "Cannot delete audience while sync is in progress",
          "sync_status",
          "SYNC_IN_PROGRESS",
        );
      }

      const result = await this.repository.delete(id);

      if (result.success) {
        // Clear relevant caches
        this.invalidateCaches([`audience:${id}`, "audiences:", "stats:"]);
      }

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

  private async validateAudienceCreation(data: unknown): Promise<void> {
    const typedData = data as CreateAudienceModel;
    // Business validation rules for creation
    if (
      typedData.stats?.member_count &&
      typedData.stats.member_count > this.config.maxMemberCount
    ) {
      throw new BusinessValidationError(
        `Member count exceeds maximum allowed (${this.config.maxMemberCount})`,
        "member_count",
        "MAX_MEMBERS_EXCEEDED",
      );
    }

    // Check for duplicate names
    const existingResult = await this.repository.findMany({
      name_contains: typedData.name,
      offset: 0,
      limit: 1,
      sort_by: "created_at",
      sort_order: "desc",
    });

    if (
      existingResult.success &&
      existingResult.data &&
      existingResult.data.items.length > 0
    ) {
      const existing = existingResult.data.items.find(
        (audience) =>
          audience.name.toLowerCase() === typedData.name.toLowerCase(),
      );
      if (existing) {
        throw new BusinessValidationError(
          "An audience with this name already exists",
          "name",
          "DUPLICATE_NAME",
        );
      }
    }
  }

  private async validateAudienceUpdate(
    id: string,
    updates: unknown,
  ): Promise<void> {
    const typedUpdates = updates as UpdateAudienceModel;
    // Business validation rules for updates
    if (
      typedUpdates.stats?.member_count &&
      typedUpdates.stats.member_count > this.config.maxMemberCount
    ) {
      throw new BusinessValidationError(
        `Member count exceeds maximum allowed (${this.config.maxMemberCount})`,
        "member_count",
        "MAX_MEMBERS_EXCEEDED",
      );
    }

    // Check if audience exists
    const existingResult = await this.repository.findById(id);
    if (!existingResult.success || !existingResult.data) {
      throw new BusinessValidationError(
        `Audience with ID ${id} not found`,
        "id",
        "AUDIENCE_NOT_FOUND",
      );
    }
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
