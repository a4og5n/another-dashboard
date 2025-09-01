/**
 * Mailchimp Audience Repository
 *
 * Provides data access patterns for Mailchimp Audience operations.
 * Implements the repository pattern to abstract data storage concerns.
 */

import type {
  AudienceModel,
  AudienceQueryFilters,
  AudienceStats,
} from "@/dal/models/audience.model";

/**
 * Generic result type for repository operations
 */
export interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Paginated result type for list operations
 */
export interface PaginatedResult<T> {
  items: T[];
  total_count: number;
  offset: number;
  limit: number;
  has_more: boolean;
}

/**
 * Interface defining the contract for Audience repository operations
 */
export interface IAudienceRepository {
  // Read operations
  findById(id: string): Promise<RepositoryResult<AudienceModel | null>>;
  findMany(
    filters: AudienceQueryFilters,
  ): Promise<RepositoryResult<PaginatedResult<AudienceModel>>>;
  findByIds(ids: string[]): Promise<RepositoryResult<AudienceModel[]>>;
  exists(id: string): Promise<RepositoryResult<boolean>>;
  count(
    filters: Omit<
      AudienceQueryFilters,
      "offset" | "limit" | "sort_by" | "sort_order"
    >,
  ): Promise<RepositoryResult<number>>;

  // Sync operations
  markForSync(id: string): Promise<RepositoryResult<boolean>>;
  updateSyncStatus(
    id: string,
    status: "pending" | "syncing" | "completed" | "failed",
  ): Promise<RepositoryResult<boolean>>;
  getStaleAudiences(
    staleAfterMinutes: number,
  ): Promise<RepositoryResult<AudienceModel[]>>;

  // Analytics operations
  getStats(): Promise<RepositoryResult<AudienceStats>>;
  getGrowthMetrics(
    audienceId: string,
    days: number,
  ): Promise<RepositoryResult<Array<{ date: string; member_count: number }>>>;
}

/**
 * In-memory implementation of the Audience repository
 * Useful for development, testing, and as a reference implementation
 */
export class InMemoryAudienceRepository implements IAudienceRepository {
  private audiences = new Map<string, AudienceModel>();

  async findById(id: string): Promise<RepositoryResult<AudienceModel | null>> {
    try {
      const audience = this.audiences.get(id) || null;
      return {
        success: true,
        data: audience,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async findMany(
    filters: AudienceQueryFilters,
  ): Promise<RepositoryResult<PaginatedResult<AudienceModel>>> {
    try {
      let items = Array.from(this.audiences.values());

      // Apply filters
      if (filters.ids) {
        items = items.filter((audience) => filters.ids!.includes(audience.id));
      }

      if (filters.name_contains) {
        items = items.filter((audience) =>
          audience.name
            .toLowerCase()
            .includes(filters.name_contains!.toLowerCase()),
        );
      }

      if (filters.visibility) {
        items = items.filter(
          (audience) => audience.visibility === filters.visibility,
        );
      }

      if (filters.sync_status) {
        items = items.filter(
          (audience) => audience.sync_status === filters.sync_status,
        );
      }

      if (filters.is_deleted !== undefined) {
        items = items.filter(
          (audience) => audience.is_deleted === filters.is_deleted,
        );
      }

      if (filters.min_member_count) {
        items = items.filter(
          (audience) =>
            audience.stats.member_count >= filters.min_member_count!,
        );
      }

      if (filters.max_member_count) {
        items = items.filter(
          (audience) =>
            audience.stats.member_count <= filters.max_member_count!,
        );
      }

      // Apply sorting
      items.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (filters.sort_by) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "member_count":
            aValue = a.stats.member_count;
            bValue = b.stats.member_count;
            break;
          case "updated_at":
            aValue = a.updated_at || a.date_created;
            bValue = b.updated_at || b.date_created;
            break;
          case "created_at":
          default:
            aValue = a.created_at || a.date_created;
            bValue = b.created_at || b.date_created;
            break;
        }

        if (filters.sort_order === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      // Apply pagination
      const total_count = items.length;
      const offset = filters.offset || 0;
      const limit = filters.limit || 20;
      const paginatedItems = items.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          items: paginatedItems,
          total_count,
          offset,
          limit,
          has_more: offset + limit < total_count,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async findByIds(ids: string[]): Promise<RepositoryResult<AudienceModel[]>> {
    try {
      const audiences = ids
        .map((id) => this.audiences.get(id))
        .filter(
          (audience): audience is AudienceModel => audience !== undefined,
        );

      return {
        success: true,
        data: audiences,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async exists(id: string): Promise<RepositoryResult<boolean>> {
    try {
      return {
        success: true,
        data: this.audiences.has(id),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async count(
    filters: Omit<
      AudienceQueryFilters,
      "offset" | "limit" | "sort_by" | "sort_order"
    >,
  ): Promise<RepositoryResult<number>> {
    try {
      const fullFilters: AudienceQueryFilters = {
        ...filters,
        offset: 0,
        limit: Number.MAX_SAFE_INTEGER,
        sort_by: "created_at",
        sort_order: "desc",
      };
      const result = await this.findMany(fullFilters);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || "Failed to count audiences",
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: result.data.total_count,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async markForSync(id: string): Promise<RepositoryResult<boolean>> {
    try {
      return await this.updateSyncStatus(id, "pending");
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async updateSyncStatus(
    id: string,
    status: "pending" | "syncing" | "completed" | "failed",
  ): Promise<RepositoryResult<boolean>> {
    try {
      const audience = this.audiences.get(id);
      if (!audience) {
        return {
          success: false,
          error: `Audience with ID ${id} not found`,
          timestamp: new Date().toISOString(),
        };
      }

      const now = new Date().toISOString();
      const updatedAudience: AudienceModel = {
        ...audience,
        sync_status: status,
        last_synced_at: status === "completed" ? now : audience.last_synced_at,
        updated_at: now,
      };

      this.audiences.set(id, updatedAudience);

      return {
        success: true,
        data: true,
        timestamp: now,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getStaleAudiences(
    staleAfterMinutes: number,
  ): Promise<RepositoryResult<AudienceModel[]>> {
    try {
      const staleThreshold = new Date(
        Date.now() - staleAfterMinutes * 60 * 1000,
      ).toISOString();

      const staleAudiences = Array.from(this.audiences.values()).filter(
        (audience) => {
          const lastSync = audience.last_synced_at || audience.created_at;
          return !lastSync || lastSync < staleThreshold;
        },
      );

      return {
        success: true,
        data: staleAudiences,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getStats(): Promise<RepositoryResult<AudienceStats>> {
    try {
      const audiences = Array.from(this.audiences.values());
      const totalMembers = audiences.reduce(
        (sum, audience) => sum + audience.stats.member_count,
        0,
      );
      const engagementRates = audiences
        .map((audience) => audience.cached_stats?.engagement_rate)
        .filter((rate): rate is number => rate !== undefined);

      const statusCounts = audiences.reduce(
        (counts, audience) => {
          counts[audience.sync_status]++;
          return counts;
        },
        { pending: 0, syncing: 0, completed: 0, failed: 0 },
      );

      const visibilityCounts = audiences.reduce(
        (counts, audience) => {
          counts[audience.visibility]++;
          return counts;
        },
        { pub: 0, prv: 0 },
      );

      const stats: AudienceStats = {
        total_audiences: audiences.length,
        total_members: totalMembers,
        avg_member_count:
          audiences.length > 0 ? totalMembers / audiences.length : 0,
        avg_engagement_rate:
          engagementRates.length > 0
            ? engagementRates.reduce((sum, rate) => sum + rate, 0) /
              engagementRates.length
            : 0,
        audiences_by_status: statusCounts,
        audiences_by_visibility: visibilityCounts,
        last_updated: new Date().toISOString(),
      };

      return {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getGrowthMetrics(
    audienceId: string,
    days: number,
  ): Promise<RepositoryResult<Array<{ date: string; member_count: number }>>> {
    try {
      const audience = this.audiences.get(audienceId);
      if (!audience) {
        return {
          success: false,
          error: `Audience with ID ${audienceId} not found`,
          timestamp: new Date().toISOString(),
        };
      }

      // Mock growth data - in a real implementation, this would come from historical data
      const growthData: Array<{ date: string; member_count: number }> = [];
      const currentCount = audience.stats.member_count;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const memberCount = Math.max(
          0,
          currentCount - Math.floor(Math.random() * (i + 1) * 10),
        );

        growthData.push({
          date: date.toISOString().split("T")[0],
          member_count: memberCount,
        });
      }

      return {
        success: true,
        data: growthData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
