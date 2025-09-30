/**
 * Auth Schemas Test
 * Validates authentication-related Zod schemas
 *
 * Following established testing patterns from mailchimp schema tests
 */
import { describe, it, expect } from "vitest";
import {
  kindeUserSchema,
  authSessionSchema,
  authErrorSchema,
  extendedUserSchema,
  USER_ROLES,
  USER_PERMISSIONS,
} from "@/schemas/auth";

describe("Auth Schemas", () => {
  describe("kindeUserSchema", () => {
    it("should validate complete user data", () => {
      const validUser = {
        id: "kinde_123456",
        email: "user@example.com",
        given_name: "John",
        family_name: "Doe",
        picture: "https://example.com/avatar.jpg",
        created_on: "2024-01-01T00:00:00Z",
        organization: "ACME Corp",
        job_title: "Developer",
        phone: "+1234567890",
      };

      const result = kindeUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it("should validate minimal user data", () => {
      const minimalUser = {
        id: "kinde_123456",
        email: "user@example.com",
        given_name: null,
        family_name: null,
        picture: null,
        created_on: null,
        organization: null,
        job_title: null,
        phone: null,
      };

      const result = kindeUserSchema.safeParse(minimalUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        id: "kinde_123456",
        email: "invalid-email",
        given_name: null,
        family_name: null,
        picture: null,
        created_on: null,
        organization: null,
        job_title: null,
        phone: null,
      };

      const result = kindeUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const incompleteUser = {
        email: "user@example.com",
      };

      const result = kindeUserSchema.safeParse(incompleteUser);
      expect(result.success).toBe(false);
    });
  });

  describe("authSessionSchema", () => {
    it("should validate complete session data", () => {
      const validSession = {
        user: {
          id: "kinde_123456",
          email: "user@example.com",
          given_name: "John",
          family_name: "Doe",
          picture: "https://example.com/avatar.jpg",
          created_on: "2024-01-01T00:00:00Z",
          organization: "ACME Corp",
          job_title: "Developer",
          phone: "+1234567890",
        },
        isAuthenticated: true,
        isLoading: false,
        accessToken: "token_123",
        permissions: ["read:dashboard", "write:dashboard"],
        roles: ["user"],
      };

      const result = authSessionSchema.safeParse(validSession);
      expect(result.success).toBe(true);
    });

    it("should apply default values", () => {
      const sessionWithDefaults = {
        user: {
          id: "kinde_123456",
          email: "user@example.com",
          given_name: null,
          family_name: null,
          picture: null,
          created_on: null,
          organization: null,
          job_title: null,
          phone: null,
        },
        isAuthenticated: true,
        accessToken: null,
      };

      const result = authSessionSchema.safeParse(sessionWithDefaults);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isLoading).toBe(false);
        expect(result.data.permissions).toEqual([]);
        expect(result.data.roles).toEqual([]);
      }
    });
  });

  describe("authErrorSchema", () => {
    it("should validate error response", () => {
      const validError = {
        type: "authentication_error",
        title: "Authentication Failed",
        status: 401,
        detail: "Invalid credentials provided",
        instance: "/api/auth/login",
      };

      const result = authErrorSchema.safeParse(validError);
      expect(result.success).toBe(true);
    });

    it("should allow optional instance field", () => {
      const errorWithoutInstance = {
        type: "authentication_error",
        title: "Authentication Failed",
        status: 401,
        detail: "Invalid credentials provided",
      };

      const result = authErrorSchema.safeParse(errorWithoutInstance);
      expect(result.success).toBe(true);
    });
  });

  describe("extendedUserSchema", () => {
    it("should validate extended user data", () => {
      const extendedUser = {
        id: "kinde_123456",
        email: "user@example.com",
        given_name: "John",
        family_name: "Doe",
        picture: "https://example.com/avatar.jpg",
        created_on: "2024-01-01T00:00:00Z",
        organization: "ACME Corp",
        job_title: "Developer",
        phone: "+1234567890",
        displayName: "John Doe",
        initials: "JD",
        lastLoginAt: "2024-01-02T00:00:00Z",
        preferences: {
          theme: "dark",
          notifications: false,
        },
      };

      const result = extendedUserSchema.safeParse(extendedUser);
      expect(result.success).toBe(true);
    });

    it("should apply preference defaults", () => {
      const userWithDefaultPrefs = {
        id: "kinde_123456",
        email: "user@example.com",
        given_name: "John",
        family_name: "Doe",
        picture: null,
        created_on: null,
        organization: null,
        job_title: null,
        phone: null,
        displayName: "John Doe",
        initials: "JD",
        lastLoginAt: null,
        preferences: {},
      };

      const result = extendedUserSchema.safeParse(userWithDefaultPrefs);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferences?.theme).toBe("system");
        expect(result.data.preferences?.notifications).toBe(true);
      }
    });
  });

  describe("Auth Enums", () => {
    it("should have valid user roles", () => {
      expect(USER_ROLES).toEqual(["admin", "user", "viewer"]);
    });

    it("should have valid user permissions", () => {
      expect(USER_PERMISSIONS).toEqual([
        "read:dashboard",
        "write:dashboard",
        "admin:settings",
        "read:mailchimp",
        "write:mailchimp",
      ]);
    });
  });
});
