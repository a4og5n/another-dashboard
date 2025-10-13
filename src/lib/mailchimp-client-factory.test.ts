import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserMailchimpClient } from "@/lib/mailchimp-client-factory";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { UnauthorizedError } from "@/types/api-errors";

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

  it("should throw UnauthorizedError when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue(null);

    await expect(getUserMailchimpClient()).rejects.toThrow(UnauthorizedError);
    await expect(getUserMailchimpClient()).rejects.toThrow(
      "User not authenticated",
    );
  });

  it("should throw UnauthorizedError when user has no id", async () => {
    mockGetUser.mockResolvedValue({
      email: "test@example.com",
      // id is missing
    });

    await expect(getUserMailchimpClient()).rejects.toThrow(UnauthorizedError);
    await expect(getUserMailchimpClient()).rejects.toThrow(
      "User not authenticated",
    );
  });

  it("should throw error when Mailchimp is not connected", async () => {
    mockGetUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    (
      mailchimpConnectionRepo.getDecryptedToken as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    await expect(getUserMailchimpClient()).rejects.toThrow(
      "Mailchimp not connected. Please connect your account.",
    );
  });

  it("should throw error when connection is inactive", async () => {
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

    await expect(getUserMailchimpClient()).rejects.toThrow(
      "Mailchimp connection is inactive. Please reconnect.",
    );
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
});
