import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/mailchimp/authorize/route";
import { oauthStateRepo } from "@/db/repositories/oauth-state";

// Mock Kinde auth
const mockGetUser = vi.fn();
vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({
    getUser: mockGetUser,
  }),
}));

// Mock OAuth state repository
vi.mock("@/db/repositories/oauth-state", () => ({
  oauthStateRepo: {
    create: vi.fn(),
  },
}));

describe("POST /api/auth/mailchimp/authorize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return authorization URL for authenticated user", async () => {
    // Mock authenticated user
    mockGetUser.mockResolvedValue({
      id: "test_user_123",
      email: "test@example.com",
    });

    // Mock OAuth state creation
    vi.mocked(oauthStateRepo.create).mockResolvedValue({
      id: "test_id_123",
      state: "test_state_123",
      kindeUserId: "test_user_123",
      provider: "mailchimp",
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toContain("https://login.mailchimp.com/oauth2/authorize");
    expect(data.url).toContain("client_id");
    expect(data.url).toContain("redirect_uri");
    expect(data.url).toContain("state");

    // Verify state was stored in database
    expect(oauthStateRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.any(String),
        kindeUserId: "test_user_123",
        provider: "mailchimp",
        expiresAt: expect.any(Date),
      }),
    );
  });

  it("should return 401 for unauthenticated user", async () => {
    // Mock unauthenticated user
    mockGetUser.mockResolvedValue(null);

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized. Please log in first.");

    // Verify state was not stored
    expect(oauthStateRepo.create).not.toHaveBeenCalled();
  });

  it("should return 401 for user without ID", async () => {
    // Mock user without ID
    mockGetUser.mockResolvedValue({ email: "test@example.com" });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized. Please log in first.");
  });

  it("should return 500 if state storage fails", async () => {
    // Mock authenticated user
    mockGetUser.mockResolvedValue({
      id: "test_user_123",
      email: "test@example.com",
    });

    // Mock OAuth state creation to throw error
    vi.mocked(oauthStateRepo.create).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to initiate OAuth flow");
  });
});
