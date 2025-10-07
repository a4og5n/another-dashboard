/**
 * Mock utilities for OAuth-based Mailchimp client testing
 * Provides mocks for Kinde auth and database connection repository
 */

import { vi } from "vitest";

/**
 * Mock database connection to prevent connection errors in tests
 */
vi.mock("@/db", () => ({
  db: {},
  schema: {
    mailchimpConnections: {},
  },
}));

/**
 * Mock Kinde user for testing
 */
export const mockKindeUser = {
  id: "test-user-123",
  email: "test@example.com",
  given_name: "Test",
  family_name: "User",
};

/**
 * Mock decrypted token response
 */
export const mockDecryptedToken = {
  accessToken: "mock-oauth-token-123",
  serverPrefix: "us1",
  isActive: true,
};

/**
 * Mock Mailchimp connection repository
 */
export const mockMailchimpConnectionRepo = {
  getDecryptedToken: vi.fn().mockResolvedValue(mockDecryptedToken),
  findByKindeUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deactivate: vi.fn(),
  delete: vi.fn(),
  touchValidation: vi.fn(),
};

/**
 * Mock Kinde server session
 */
export const mockKindeServerSession = {
  getUser: vi.fn().mockResolvedValue(mockKindeUser),
  isAuthenticated: vi.fn().mockResolvedValue(true),
  getPermission: vi.fn(),
  getPermissions: vi.fn(),
  getOrganization: vi.fn(),
  getUserOrganizations: vi.fn(),
  getClaim: vi.fn(),
  getFlag: vi.fn(),
  getBooleanFlag: vi.fn(),
  getIntegerFlag: vi.fn(),
  getStringFlag: vi.fn(),
  getAccessToken: vi.fn(),
  getIdToken: vi.fn(),
};

/**
 * Setup OAuth mocks for Mailchimp tests
 * Call this in beforeEach() of your test files
 */
export function setupOAuthMocks() {
  // Mock Kinde auth
  vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
    getKindeServerSession: vi.fn(() => mockKindeServerSession),
  }));

  // Mock connection repository
  vi.mock("@/db/repositories/mailchimp-connection", () => ({
    mailchimpConnectionRepo: mockMailchimpConnectionRepo,
    MailchimpConnectionRepository: vi.fn(() => mockMailchimpConnectionRepo),
  }));

  return {
    mockKindeServerSession,
    mockMailchimpConnectionRepo,
    mockKindeUser,
    mockDecryptedToken,
  };
}

/**
 * Reset all OAuth mocks
 * Call this in afterEach() of your test files
 */
export function resetOAuthMocks() {
  mockKindeServerSession.getUser.mockResolvedValue(mockKindeUser);
  mockMailchimpConnectionRepo.getDecryptedToken.mockResolvedValue(
    mockDecryptedToken,
  );
}

/**
 * Mock scenario: User not authenticated
 */
export function mockUnauthenticatedUser() {
  mockKindeServerSession.getUser.mockResolvedValue(null);
}

/**
 * Mock scenario: Mailchimp not connected
 */
export function mockNoMailchimpConnection() {
  mockMailchimpConnectionRepo.getDecryptedToken.mockResolvedValue(null);
}

/**
 * Mock scenario: Mailchimp connection inactive
 */
export function mockInactiveMailchimpConnection() {
  mockMailchimpConnectionRepo.getDecryptedToken.mockResolvedValue({
    ...mockDecryptedToken,
    isActive: false,
  });
}
