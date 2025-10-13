import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { db, schema } from "@/db";
import { mailchimpConnectionRepo } from "@/db/repositories/mailchimp-connection";
import { eq } from "drizzle-orm";

/**
 * Integration tests for Mailchimp Connection Repository
 * These tests require a real database connection
 * Skip if DATABASE_URL is not configured
 */

const isDatabaseAvailable = Boolean(
  process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL,
);

// TODO: Convert to integration tests with test database setup
// These tests require:
// 1. Test database instance (e.g., docker-compose with PostgreSQL)
// 2. Database migrations run before tests
// 3. Proper cleanup between tests
// 4. Consider using `testcontainers` for isolated test database
// Recommended approach: Set up GitHub Actions with PostgreSQL service container
// Skipping temporarily - see GitHub issue #172
describe.skip("MailchimpConnectionRepository (Integration)", () => {
  const testKindeUserId = "test_kinde_user_123";
  const testAccessToken = "test_access_token_abc";

  // Verify database connection before running tests
  beforeAll(async () => {
    if (!isDatabaseAvailable) {
      console.log("Skipping integration tests - DATABASE_URL not configured");
      return;
    }
  });

  // Clean up test data after each test
  afterEach(async () => {
    try {
      await db
        .delete(schema.mailchimpConnections)
        .where(eq(schema.mailchimpConnections.kindeUserId, testKindeUserId));
    } catch (error) {
      // Ignore cleanup errors
      console.error("Cleanup error:", error);
    }
  });

  describe("create", () => {
    it("should create new connection with encrypted token", async () => {
      const connection = await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
        email: "test@example.com",
      });

      expect(connection.kindeUserId).toBe(testKindeUserId);
      expect(connection.serverPrefix).toBe("us1");
      expect(connection.email).toBe("test@example.com");
      expect(connection.accessToken).not.toBe(testAccessToken); // Should be encrypted
      expect(connection.isActive).toBe(true);
    });
  });

  describe("findByKindeUserId", () => {
    it("should find existing connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const found =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(found).not.toBeNull();
      expect(found?.kindeUserId).toBe(testKindeUserId);
    });

    it("should return null for non-existent user", async () => {
      const found =
        await mailchimpConnectionRepo.findByKindeUserId("nonexistent");
      expect(found).toBeNull();
    });
  });

  describe("getDecryptedToken", () => {
    it("should decrypt token correctly", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result).not.toBeNull();
      expect(result?.accessToken).toBe(testAccessToken);
      expect(result?.serverPrefix).toBe("us1");
    });

    it("should return null for inactive connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.deactivate(testKindeUserId);

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update connection and re-encrypt token", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      const newToken = "new_token_xyz";
      await mailchimpConnectionRepo.update(testKindeUserId, {
        accessToken: newToken,
        serverPrefix: "us19",
      });

      const result =
        await mailchimpConnectionRepo.getDecryptedToken(testKindeUserId);
      expect(result?.accessToken).toBe(newToken);
      expect(result?.serverPrefix).toBe("us19");
    });
  });

  describe("deactivate", () => {
    it("should mark connection as inactive", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.deactivate(testKindeUserId);

      const connection =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(connection?.isActive).toBe(false);
    });
  });

  describe("delete", () => {
    it("should permanently delete connection", async () => {
      await mailchimpConnectionRepo.create({
        kindeUserId: testKindeUserId,
        accessToken: testAccessToken,
        serverPrefix: "us1",
      });

      await mailchimpConnectionRepo.delete(testKindeUserId);

      const connection =
        await mailchimpConnectionRepo.findByKindeUserId(testKindeUserId);
      expect(connection).toBeNull();
    });
  });
});
