import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserMailchimpClient,
  invalidateValidationCache,
  clearValidationCache,
} from "@/lib/mailchimp-client-factory";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { UnauthorizedError } from "@/types/api-errors";
import { MAILCHIMP_ERROR_CODES } from "@/constants";

// Mock dependencies
vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: vi.fn(),
}));

vi.mock("@/db/repositories", () => ({
  mailchimpConnectionRepo: {
    getDecryptedToken: vi.fn(),
  },
}));

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories";

describe("getUserMailchimpClient", () => {
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    clearValidationCache(); // Clear cache before each test
    (getKindeServerSession as ReturnType<typeof vi.fn>).mockReturnValue({
      getUser: mockGetUser,
    });
  });

  it("should create client for authenticated user with active connection", async () => {
    // Mock authenticated user
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    // Mock active connection
    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      userId: "user-123",
      accessToken: "test-token",
      serverPrefix: "us1",
      isActive: true,
    });

    const client = await getUserMailchimpClient();

    expect(client).toBeInstanceOf(MailchimpFetchClient);
    expect(mockGetUser).toHaveBeenCalledOnce();
    expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledWith(
      "user-123",
    );
  });

  it("should throw UnauthorizedError with errorCode when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue(null);

    try {
      await getUserMailchimpClient();
      expect.fail("Should have thrown UnauthorizedError");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as Error).message).toBe("User not authenticated");
      expect((error as Error & { errorCode: string }).errorCode).toBe(
        MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED,
      );
    }
  });

  it("should throw UnauthorizedError with errorCode when user has no id", async () => {
    mockGetUser.mockResolvedValue({
      email: "test@example.com",
      // id is missing
    });

    try {
      await getUserMailchimpClient();
      expect.fail("Should have thrown UnauthorizedError");
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as Error).message).toBe("User not authenticated");
      expect((error as Error & { errorCode: string }).errorCode).toBe(
        MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED,
      );
    }
  });

  it("should throw error with errorCode when Mailchimp is not connected", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    try {
      await getUserMailchimpClient();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain(
        "Mailchimp account not connected",
      );
      expect((error as Error & { errorCode: string }).errorCode).toBe(
        MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
      );
    }
  });

  it("should throw error with errorCode when connection is inactive", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      userId: "user-123",
      accessToken: "test-token",
      serverPrefix: "us1",
      isActive: false, // Inactive connection
    });

    try {
      await getUserMailchimpClient();
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("connection is inactive");
      expect((error as Error & { errorCode: string }).errorCode).toBe(
        MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE,
      );
    }
  });

  it("should handle different server prefixes", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      userId: "user-123",
      accessToken: "test-token",
      serverPrefix: "us14", // Different server prefix
      isActive: true,
    });

    const client = await getUserMailchimpClient();

    expect(client).toBeInstanceOf(MailchimpFetchClient);
  });

  it("should create client with correct configuration", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-456",
      email: "another@example.com",
    });

    const mockConnection = {
      userId: "user-456",
      accessToken: "another-test-token",
      serverPrefix: "us7",
      isActive: true,
    };

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockConnection);

    const client = await getUserMailchimpClient();

    expect(client).toBeInstanceOf(MailchimpFetchClient);
    expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledWith(
      "user-456",
    );
  });

  it("should handle repository errors gracefully", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("Database connection failed"));

    await expect(getUserMailchimpClient()).rejects.toThrow(
      "Database connection failed",
    );
  });

  describe("caching behavior", () => {
    it("should cache validation results and reuse them", async () => {
      mockGetUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
      });

      const mockConnection = {
        userId: "user-123",
        accessToken: "test-token",
        serverPrefix: "us1",
        isActive: true,
      };

      (
        mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockConnection);

      // First call
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      );

      // Second call should use cache
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      ); // Still 1
    });

    it("should cache error states", async () => {
      mockGetUser.mockResolvedValue({
        id: "user-456",
        email: "test@example.com",
      });

      (
        mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      // First call
      try {
        await getUserMailchimpClient();
      } catch (error) {
        expect((error as Error & { errorCode: string }).errorCode).toBe(
          MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
        );
      }

      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      );

      // Second call should use cached error
      try {
        await getUserMailchimpClient();
      } catch (error) {
        expect((error as Error & { errorCode: string }).errorCode).toBe(
          MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
        );
      }

      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      ); // Still 1
    });

    it("should invalidate cache for specific user", async () => {
      mockGetUser.mockResolvedValue({
        id: "user-789",
        email: "test@example.com",
      });

      const mockConnection = {
        userId: "user-789",
        accessToken: "test-token",
        serverPrefix: "us1",
        isActive: true,
      };

      (
        mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockConnection);

      // First call
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      );

      // Invalidate cache for this user
      invalidateValidationCache("user-789");

      // Next call should fetch from DB again
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        2,
      );
    });

    it("should clear entire cache", async () => {
      mockGetUser.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
      });

      const mockConnection = {
        userId: "user-123",
        accessToken: "test-token",
        serverPrefix: "us1",
        isActive: true,
      };

      (
        mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockConnection);

      // First call
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        1,
      );

      // Clear entire cache
      clearValidationCache();

      // Next call should fetch from DB again
      await getUserMailchimpClient();
      expect(mailchimpConnectionRepo.getDecryptedToken).toHaveBeenCalledTimes(
        2,
      );
    });
  });
});
