import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/mailchimp/authorize/route";

// Mock Kinde auth
const mockGetUser = vi.fn();
vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({
    getUser: mockGetUser,
  }),
}));

// Mock cookies
const mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockCookieSet,
    }),
  ),
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

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toContain("https://login.mailchimp.com/oauth2/authorize");
    expect(data.url).toContain("client_id");
    expect(data.url).toContain("redirect_uri");
    expect(data.url).toContain("state");

    // Verify cookie was set
    expect(mockCookieSet).toHaveBeenCalledWith(
      "mailchimp_oauth_state",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        maxAge: 600,
        path: "/",
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

    // Verify cookie was not set
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  it("should return 401 for user without ID", async () => {
    // Mock user without ID
    mockGetUser.mockResolvedValue({ email: "test@example.com" });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized. Please log in first.");
  });

  it("should return 500 if authorization URL generation fails", async () => {
    // Mock authenticated user
    mockGetUser.mockResolvedValue({
      id: "test_user_123",
      email: "test@example.com",
    });

    // Mock cookie set to throw error
    mockCookieSet.mockImplementation(() => {
      throw new Error("Cookie error");
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to initiate OAuth flow");
  });
});
