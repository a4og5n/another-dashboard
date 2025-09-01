/**
 * Test suite for Mailchimp Audience DAL implementation
 * Tests read-only operations for the Mailchimp Audience API
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AudienceModelValidators } from "@/dal/models/audience.model";
import {
  InMemoryAudienceRepository,
  type IAudienceRepository,
} from "@/dal/repositories/audience.repository";
import {
  AudienceService,
  type AudienceServiceConfig,
} from "@/dal/services/audience.service";
import type { AudienceModel } from "@/types/mailchimp/audience";

describe("Audience DAL Implementation (Read-Only)", () => {
  let repository: IAudienceRepository;
  let service: AudienceService;
  let mockAudienceData: AudienceModel;

  beforeEach(() => {
    repository = new InMemoryAudienceRepository();
    service = new AudienceService(repository);

    mockAudienceData = {
      id: "test-audience-001",
      name: "Test Newsletter Audience",
      contact: {
        company: "Test Company",
        address1: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zip: "12345",
        country: "US",
      },
      permission_reminder: "You signed up for our newsletter",
      use_archive_bar: true,
      campaign_defaults: {
        from_name: "Test Company",
        from_email: "newsletter@test.com",
        subject: "Weekly Newsletter",
        language: "en",
      },
      email_type_option: false,
      visibility: "pub",
      date_created: "2023-01-01T00:00:00.000Z",
      list_rating: 4,
      stats: {
        member_count: 1250,
        unsubscribe_count: 25,
        cleaned_count: 5,
        campaign_count: 12,
        open_rate: 0.245,
        click_rate: 0.035,
      },
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-15T10:30:00.000Z",
      sync_status: "completed",
      is_deleted: false,
    };
  });

  describe("Model Validators", () => {
    it("should validate audience model data", () => {
      expect(() =>
        AudienceModelValidators.validateModel(mockAudienceData),
      ).not.toThrow();
    });

    it("should validate query filters", () => {
      const filters = {
        visibility: "pub" as const,
        sync_status: "completed" as const,
        offset: 0,
        limit: 20,
        sort_by: "created_at" as const,
        sort_order: "desc" as const,
      };

      expect(() =>
        AudienceModelValidators.validateFilters(filters),
      ).not.toThrow();
    });

    it("should reject invalid model data", () => {
      const invalidData = {
        ...mockAudienceData,
        id: "", // Invalid empty ID
      };

      expect(() =>
        AudienceModelValidators.validateModel(invalidData),
      ).toThrow();
    });
  });

  describe("Repository Operations (Read-Only)", () => {
    it("should find audience by ID", async () => {
      // Note: In a real implementation, this would be populated by sync operations
      // For testing, we need to manually add data to the in-memory store
      const result = await repository.findById("non-existent-id");
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it("should list audiences with filters", async () => {
      const filters = {
        visibility: "pub" as const,
        offset: 0,
        limit: 20,
        sort_by: "created_at" as const,
        sort_order: "desc" as const,
      };

      const result = await repository.findMany(filters);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.items).toEqual([]);
      expect(result.data?.total_count).toBe(0);
    });

    it("should count audiences", async () => {
      const filters = {
        visibility: "pub" as const,
      };

      const result = await repository.count(filters);
      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it("should check if audience exists", async () => {
      const result = await repository.exists("non-existent-id");
      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    });

    it("should get audience statistics", async () => {
      const result = await repository.getStats();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.total_audiences).toBe(0);
    });

    it("should get growth metrics for audience", async () => {
      const result = await repository.getGrowthMetrics("test-audience-001", 30);
      expect(result.success).toBe(false); // Should fail as audience doesn't exist
    });
  });

  describe("Service Operations (Read-Only)", () => {
    it("should get audience with caching", async () => {
      const result = await service.getAudience("non-existent-id");
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.cache_hit).toBe(false);
    });

    it("should list audiences with business validation", async () => {
      const result = await service.listAudiences({
        visibility: "pub",
        offset: 0,
        limit: 20,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.cache_hit).toBe(false);
    });

    it("should get comprehensive audience statistics", async () => {
      const result = await service.getAudienceStats();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.total_audiences).toBe(0);
      expect(result.cache_hit).toBe(false);
    });

    it("should get growth metrics with business validation", async () => {
      const result = await service.getGrowthMetrics("test-audience-001", 30);
      expect(result.success).toBe(false); // Should fail as audience doesn't exist
    });

    it("should validate growth metrics input", async () => {
      const result = await service.getGrowthMetrics("test-audience-001", 500); // Invalid: too many days
      expect(result.success).toBe(false);
      expect(result.error).toContain("Days must be between 1 and 365");
    });

    it("should sync stale audiences", async () => {
      const result = await service.syncStaleAudiences();
      expect(result.success).toBe(true);
      expect(result.data?.synced).toBe(0);
      expect(result.data?.failed).toBe(0);
    });
  });

  describe("Sync Operations", () => {
    it("should get stale audiences", async () => {
      const result = await repository.getStaleAudiences(60); // 1 hour
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("should update sync status", async () => {
      // This would normally be called during sync operations
      const result = await repository.updateSyncStatus(
        "non-existent-id",
        "syncing",
      );
      expect(result.success).toBe(false); // Should fail as audience doesn't exist
    });
  });

  describe("Configuration", () => {
    it("should use custom service configuration", () => {
      const customConfig: AudienceServiceConfig = {
        maxAudiencesPerSync: 100,
        syncIntervalMinutes: 15,
        cacheExpiryMinutes: 5,
        maxMemberCount: 1000000,
        enableAutomaticSync: false,
      };

      const customService = new AudienceService(repository, customConfig);
      expect(customService).toBeDefined();
    });
  });
});
