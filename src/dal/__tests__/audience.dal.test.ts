/**
 * Comprehensive test suite for Mailchimp Audience DAL implementation
 * Tests models, repositories, and services with various scenarios
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  AudienceModelValidators,
  type CreateAudienceModel,
} from "@/dal/models/audience.model";
import {
  InMemoryAudienceRepository,
  type IAudienceRepository,
} from "@/dal/repositories/audience.repository";
import {
  AudienceService,
  type AudienceServiceConfig,
} from "@/dal/services/audience.service";

describe("Audience DAL Implementation", () => {
  let repository: IAudienceRepository;
  let service: AudienceService;
  let sampleAudience: CreateAudienceModel;

  beforeEach(() => {
    repository = new InMemoryAudienceRepository();
    service = new AudienceService(repository);

    sampleAudience = {
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
      stats: {
        member_count: 1500,
        unsubscribe_count: 25,
        cleaned_count: 10,
      },
      list_rating: 4,
      date_created: "2023-01-15T10:00:00Z",
      sync_status: "pending",
      is_deleted: false,
    };
  });

  describe("AudienceModelValidators", () => {
    describe("validateModel", () => {
      it("should validate a complete audience model", () => {
        const result = AudienceModelValidators.validateModel(sampleAudience);

        expect(result.id).toBe(sampleAudience.id);
        expect(result.name).toBe(sampleAudience.name);
        expect(result.sync_status).toBe("pending"); // default value
      });

      it("should throw for invalid audience model", () => {
        const { id: _id, ...invalidData } = sampleAudience;

        expect(() =>
          AudienceModelValidators.validateModel(invalidData),
        ).toThrow("Invalid audience model");
      });
    });

    describe("validateFilters", () => {
      it("should validate query filters with defaults", () => {
        const result = AudienceModelValidators.validateFilters({
          name_contains: "test",
        });

        expect(result.offset).toBe(0);
        expect(result.limit).toBe(20);
        expect(result.sort_by).toBe("created_at");
        expect(result.sort_order).toBe("desc");
        expect(result.name_contains).toBe("test");
      });

      it("should apply limits and validate ranges", () => {
        // Test valid values within limits
        const result = AudienceModelValidators.validateFilters({
          limit: 50, // within max
          offset: 10, // valid
        });

        expect(result.limit).toBe(50);
        expect(result.offset).toBe(10);

        // Test that invalid values throw errors
        expect(() =>
          AudienceModelValidators.validateFilters({
            limit: 150, // over max
          }),
        ).toThrow("Invalid query filters");

        expect(() =>
          AudienceModelValidators.validateFilters({
            offset: -5, // invalid
          }),
        ).toThrow("Invalid query filters");
      });
    });
  });

  describe("InMemoryAudienceRepository", () => {
    describe("create and findById", () => {
      it("should create and retrieve an audience", async () => {
        const createResult = await repository.create(sampleAudience);
        expect(createResult.success).toBe(true);
        expect(createResult.data?.id).toBe(sampleAudience.id);

        const findResult = await repository.findById(sampleAudience.id);
        expect(findResult.success).toBe(true);
        expect(findResult.data?.name).toBe(sampleAudience.name);
      });

      it("should fail to create duplicate audience", async () => {
        await repository.create(sampleAudience);
        const duplicateResult = await repository.create(sampleAudience);

        expect(duplicateResult.success).toBe(false);
        expect(duplicateResult.error).toContain("already exists");
      });

      it("should return null for non-existent audience", async () => {
        const result = await repository.findById("non-existent");

        expect(result.success).toBe(true);
        expect(result.data).toBe(null);
      });
    });

    describe("update", () => {
      it("should update existing audience", async () => {
        await repository.create(sampleAudience);

        const updateResult = await repository.update(sampleAudience.id, {
          id: sampleAudience.id,
          name: "Updated Name",
          sync_status: "completed",
        });

        expect(updateResult.success).toBe(true);
        expect(updateResult.data?.name).toBe("Updated Name");
        expect(updateResult.data?.sync_status).toBe("completed");
      });

      it("should fail to update non-existent audience", async () => {
        const result = await repository.update("non-existent", {
          id: "non-existent",
          name: "Test",
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("not found");
      });
    });

    describe("findMany with filters", () => {
      beforeEach(async () => {
        // Create multiple test audiences
        const audiences = [
          {
            ...sampleAudience,
            id: "aud-001",
            name: "Public Newsletter",
            visibility: "pub" as const,
          },
          {
            ...sampleAudience,
            id: "aud-002",
            name: "Private Updates",
            visibility: "prv" as const,
          },
          {
            ...sampleAudience,
            id: "aud-003",
            name: "Marketing List",
            sync_status: "completed" as const,
          },
        ];

        for (const audience of audiences) {
          await repository.create(audience);
        }
      });

      it("should filter by visibility", async () => {
        const result = await repository.findMany({
          visibility: "prv",
          offset: 0,
          limit: 20,
          sort_by: "created_at",
          sort_order: "desc",
        });

        expect(result.success).toBe(true);
        expect(result.data?.items.length).toBe(1);
        expect(result.data?.items[0].name).toBe("Private Updates");
      });

      it("should filter by name contains", async () => {
        const result = await repository.findMany({
          name_contains: "Newsletter",
          offset: 0,
          limit: 20,
          sort_by: "created_at",
          sort_order: "desc",
        });

        expect(result.success).toBe(true);
        expect(result.data?.items.length).toBe(1);
        expect(result.data?.items[0].name).toBe("Public Newsletter");
      });

      it("should apply pagination", async () => {
        const result = await repository.findMany({
          limit: 2,
          offset: 0,
          sort_by: "created_at",
          sort_order: "desc",
        });

        expect(result.success).toBe(true);
        expect(result.data?.items.length).toBe(2);
        expect(result.data?.total_count).toBe(3);
        expect(result.data?.has_more).toBe(true);
      });

      it("should sort by member count", async () => {
        // Update one audience to have more members
        await repository.update("aud-002", {
          id: "aud-002",
          stats: {
            member_count: 5000,
            unsubscribe_count: 50,
            cleaned_count: 20,
          },
        });

        const result = await repository.findMany({
          offset: 0,
          limit: 20,
          sort_by: "member_count",
          sort_order: "desc",
        });

        expect(result.success).toBe(true);
        expect(result.data?.items[0].id).toBe("aud-002"); // Highest member count first
      });
    });

    describe("delete operations", () => {
      it("should delete existing audience", async () => {
        await repository.create(sampleAudience);

        const deleteResult = await repository.delete(sampleAudience.id);
        expect(deleteResult.success).toBe(true);
        expect(deleteResult.data).toBe(true);

        const findResult = await repository.findById(sampleAudience.id);
        expect(findResult.data).toBe(null);
      });

      it("should handle bulk delete", async () => {
        const audiences = [
          { ...sampleAudience, id: "bulk-001" },
          { ...sampleAudience, id: "bulk-002" },
          { ...sampleAudience, id: "bulk-003" },
        ];

        for (const audience of audiences) {
          await repository.create(audience);
        }

        const result = await repository.bulkDelete([
          "bulk-001",
          "bulk-002",
          "non-existent",
        ]);

        expect(result.success).toBe(true);
        expect(result.data).toBe(2); // Only 2 existed and were deleted
      });
    });

    describe("sync operations", () => {
      it("should update sync status", async () => {
        await repository.create(sampleAudience);

        const result = await repository.updateSyncStatus(
          sampleAudience.id,
          "syncing",
        );
        expect(result.success).toBe(true);

        const audience = await repository.findById(sampleAudience.id);
        expect(audience.data?.sync_status).toBe("syncing");
      });

      it("should get stale audiences", async () => {
        const now = new Date();
        const oldDate = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

        const staleAudience = {
          ...sampleAudience,
          id: "stale-001",
          last_synced_at: oldDate.toISOString(),
        };

        await repository.create(staleAudience);

        const result = await repository.getStaleAudiences(60); // 60 minutes

        expect(result.success).toBe(true);
        expect(result.data?.length).toBe(1);
        expect(result.data?.[0].id).toBe("stale-001");
      });
    });

    describe("analytics", () => {
      beforeEach(async () => {
        const audiences = [
          {
            ...sampleAudience,
            id: "stats-001",
            stats: {
              member_count: 1000,
              unsubscribe_count: 10,
              cleaned_count: 5,
            },
          },
          {
            ...sampleAudience,
            id: "stats-002",
            stats: {
              member_count: 2000,
              unsubscribe_count: 20,
              cleaned_count: 10,
            },
          },
          {
            ...sampleAudience,
            id: "stats-003",
            visibility: "prv" as const,
            stats: {
              member_count: 500,
              unsubscribe_count: 5,
              cleaned_count: 2,
            },
          },
        ];

        for (const audience of audiences) {
          await repository.create(audience);
        }
      });

      it("should generate audience statistics", async () => {
        const result = await repository.getStats();

        expect(result.success).toBe(true);
        expect(result.data?.total_audiences).toBe(3);
        expect(result.data?.total_members).toBe(3500);
        expect(result.data?.avg_member_count).toBe(3500 / 3);
        expect(result.data?.audiences_by_visibility.pub).toBe(2);
        expect(result.data?.audiences_by_visibility.prv).toBe(1);
      });

      it("should get growth metrics", async () => {
        await repository.create(sampleAudience);

        const result = await repository.getGrowthMetrics(sampleAudience.id, 7);

        expect(result.success).toBe(true);
        expect(result.data?.length).toBe(7);
        expect(result.data?.[0]).toHaveProperty("date");
        expect(result.data?.[0]).toHaveProperty("member_count");
      });
    });
  });

  describe("AudienceService", () => {
    describe("business validation", () => {
      it("should prevent duplicate audience names", async () => {
        await service.createAudience(sampleAudience);

        const duplicateName = {
          ...sampleAudience,
          id: "different-id",
          name: sampleAudience.name, // Same name
        };

        const result = await service.createAudience(duplicateName);

        expect(result.success).toBe(false);
        expect(result.error).toContain("already exists");
      });

      it("should enforce member count limits", async () => {
        const config: AudienceServiceConfig = {
          maxAudiencesPerSync: 50,
          syncIntervalMinutes: 30,
          cacheExpiryMinutes: 15,
          maxMemberCount: 1000, // Low limit for testing
          enableAutomaticSync: true,
        };

        const serviceWithLimits = new AudienceService(repository, config);

        const overLimitAudience = {
          ...sampleAudience,
          stats: {
            member_count: 2000, // Over limit
            unsubscribe_count: 20,
            cleaned_count: 10,
          },
        };

        const result =
          await serviceWithLimits.createAudience(overLimitAudience);

        expect(result.success).toBe(false);
        expect(result.error).toContain("exceeds maximum");
      });

      it("should prevent deleting audience during sync", async () => {
        await repository.create(sampleAudience);
        await repository.updateSyncStatus(sampleAudience.id, "syncing");

        const result = await service.deleteAudience(sampleAudience.id);

        expect(result.success).toBe(false);
        expect(result.error).toContain("sync is in progress");
      });
    });

    describe("caching behavior", () => {
      it("should cache audience data", async () => {
        await service.createAudience(sampleAudience);

        // First call - should hit repository
        const result1 = await service.getAudience(sampleAudience.id);
        expect(result1.success).toBe(true);
        expect(result1.cache_hit).toBe(false);

        // Second call - should hit cache
        const result2 = await service.getAudience(sampleAudience.id);
        expect(result2.success).toBe(true);
        expect(result2.cache_hit).toBe(true);
      });

      it("should invalidate cache after updates", async () => {
        await service.createAudience(sampleAudience);

        // Cache the audience
        await service.getAudience(sampleAudience.id);

        // Update should invalidate cache
        await service.updateAudience(sampleAudience.id, {
          name: "Updated Name",
        });

        // Next get should miss cache
        const result = await service.getAudience(sampleAudience.id);
        expect(result.cache_hit).toBe(false);
        expect(result.data?.name).toBe("Updated Name");
      });
    });

    describe("sync operations", () => {
      it("should sync stale audiences", async () => {
        // Create audiences and mark them as having old sync times
        const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

        const audiences = [
          {
            ...sampleAudience,
            id: "sync-001",
            last_synced_at: oldDate.toISOString(),
          },
          {
            ...sampleAudience,
            id: "sync-002",
            last_synced_at: oldDate.toISOString(),
          },
        ];

        for (const audience of audiences) {
          await repository.create(audience);
        }

        const result = await service.syncStaleAudiences();

        expect(result.success).toBe(true);
        expect(result.data?.synced).toBeGreaterThanOrEqual(0);
        expect(result.data?.failed).toBeGreaterThanOrEqual(0);
        expect(
          (result.data?.synced ?? 0) + (result.data?.failed ?? 0),
        ).toBeGreaterThan(0);
      });
    });

    describe("growth metrics", () => {
      it("should validate days parameter", async () => {
        await service.createAudience(sampleAudience);

        const result = await service.getGrowthMetrics(sampleAudience.id, 500); // Over limit

        expect(result.success).toBe(false);
        expect(result.error).toContain("between 1 and 365");
      });

      it("should return growth data", async () => {
        await service.createAudience(sampleAudience);

        const result = await service.getGrowthMetrics(sampleAudience.id, 7);

        expect(result.success).toBe(true);
        expect(result.data?.length).toBe(7);
      });
    });

    describe("error handling", () => {
      it("should handle repository errors gracefully", async () => {
        // Try to get non-existent audience
        const result = await service.getAudience("non-existent");

        expect(result.success).toBe(true);
        expect(result.data).toBe(null);
        expect(result.operation).toBe("getAudience");
        expect(typeof result.duration_ms).toBe("number");
      });

      it("should include operation metadata in results", async () => {
        const result = await service.listAudiences();

        expect(result.operation).toBe("listAudiences");
        expect(typeof result.duration_ms).toBe("number");
        expect(typeof result.timestamp).toBe("string");
      });
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete audience lifecycle", async () => {
      // Create
      const createResult = await service.createAudience(sampleAudience);
      expect(createResult.success).toBe(true);

      // Read
      const getResult = await service.getAudience(sampleAudience.id);
      expect(getResult.success).toBe(true);
      expect(getResult.data?.name).toBe(sampleAudience.name);

      // Update
      const updateResult = await service.updateAudience(sampleAudience.id, {
        name: "Updated Audience Name",
      });
      expect(updateResult.success).toBe(true);

      // List (should include updated audience)
      const listResult = await service.listAudiences();
      expect(listResult.success).toBe(true);
      expect(listResult.data?.items.length).toBe(1);
      expect(listResult.data?.items[0].name).toBe("Updated Audience Name");

      // Delete
      const deleteResult = await service.deleteAudience(sampleAudience.id);
      expect(deleteResult.success).toBe(true);

      // Verify deletion
      const getAfterDelete = await service.getAudience(sampleAudience.id);
      expect(getAfterDelete.data).toBe(null);
    });

    it("should handle complex filtering and pagination", async () => {
      // Create multiple audiences
      const audiences = Array.from({ length: 25 }, (_, i) => ({
        ...sampleAudience,
        id: `test-${i.toString().padStart(3, "0")}`,
        name: `Audience ${i}`,
        visibility: i % 2 === 0 ? ("pub" as const) : ("prv" as const),
        stats: {
          member_count: (i + 1) * 100,
          unsubscribe_count: i,
          cleaned_count: Math.floor(i / 2),
        },
      }));

      for (const audience of audiences) {
        await service.createAudience(audience);
      }

      // Test pagination
      const page1 = await service.listAudiences({ limit: 10, offset: 0 });
      expect(page1.success).toBe(true);
      expect(page1.data?.items.length).toBe(10);
      expect(page1.data?.has_more).toBe(true);

      const page2 = await service.listAudiences({ limit: 10, offset: 10 });
      expect(page2.success).toBe(true);
      expect(page2.data?.items.length).toBe(10);

      // Test filtering
      const publicOnly = await service.listAudiences({ visibility: "pub" });
      expect(publicOnly.success).toBe(true);
      expect(publicOnly.data?.items.every((a) => a.visibility === "pub")).toBe(
        true,
      );
    });

    it("should generate comprehensive statistics", async () => {
      // Create diverse set of audiences directly in repository to avoid service validation
      const audiences = [
        {
          ...sampleAudience,
          id: "stat-001",
          visibility: "pub" as const,
          sync_status: "completed" as const,
        },
        {
          ...sampleAudience,
          id: "stat-002",
          visibility: "prv" as const,
          sync_status: "pending" as const,
        },
        {
          ...sampleAudience,
          id: "stat-003",
          visibility: "pub" as const,
          sync_status: "failed" as const,
        },
      ];

      for (const audience of audiences) {
        await repository.create(audience);
      }

      const statsResult = await service.getAudienceStats();

      expect(statsResult.success).toBe(true);
      expect(statsResult.data?.total_audiences).toBe(3);
      expect(statsResult.data?.audiences_by_visibility.pub).toBe(2);
      expect(statsResult.data?.audiences_by_visibility.prv).toBe(1);
      expect(statsResult.data?.audiences_by_status.completed).toBe(1);
      expect(statsResult.data?.audiences_by_status.pending).toBe(1);
      expect(statsResult.data?.audiences_by_status.failed).toBe(1);
    });
  });
});
