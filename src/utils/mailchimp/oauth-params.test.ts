import { describe, it, expect } from "vitest";
import {
  validateMailchimpConnectionParams,
  hasOAuthCallbackParams,
} from "@/utils/mailchimp/oauth-params";
import type { MailchimpConnectionParams } from "@/types/auth";

describe("validateMailchimpConnectionParams", () => {
  describe("successful connection", () => {
    it("should return connected=true when connected param is 'true'", () => {
      const params = { connected: "true" };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: true,
        error: null,
      });
    });

    it("should return connected=false for any other value", () => {
      const testCases = ["false", "1", "yes", "", undefined];

      testCases.forEach((value) => {
        const params = { connected: value };
        const result = validateMailchimpConnectionParams(params);

        expect(result.connected).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("should extract error from 'error' parameter", () => {
      const params = { error: "access_denied" };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: false,
        error: "access_denied",
      });
    });

    it("should extract error from 'error_description' parameter", () => {
      const params = { error_description: "User denied access" };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: false,
        error: "User denied access",
      });
    });

    it("should prioritize 'error' over 'error_description' when both exist", () => {
      const params = {
        error: "access_denied",
        error_description: "User denied access",
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBe("access_denied");
    });

    it("should convert error to string if not a string", () => {
      const params = {
        error: ["invalid_state"] as unknown as string,
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBe("invalid_state");
    });

    it("should return null error when no error params exist", () => {
      const params = {};
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBeNull();
    });
  });

  describe("combined scenarios", () => {
    it("should handle successful connection with no error", () => {
      const params = { connected: "true" };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: true,
        error: null,
      });
    });

    it("should handle failed connection with error", () => {
      const params = {
        connected: "false",
        error: "invalid_request",
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: false,
        error: "invalid_request",
      });
    });

    it("should handle edge case: connected=true with error (shouldn't happen but handle gracefully)", () => {
      const params = {
        connected: "true",
        error: "some_error",
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: true,
        error: "some_error",
      });
    });
  });

  describe("empty and undefined values", () => {
    it("should handle empty object", () => {
      const params = {};
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: false,
        error: null,
      });
    });

    it("should handle undefined values", () => {
      const params = {
        connected: undefined,
        error: undefined,
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: false,
        error: null,
      });
    });

    it("should handle empty string values", () => {
      const params = {
        connected: "",
        error: "",
      };
      const result = validateMailchimpConnectionParams(params);

      // Empty strings are falsy, so:
      // - connected will be false (not === "true")
      // - error will be null (empty string is falsy)
      expect(result).toEqual({
        connected: false,
        error: null,
      });
    });
  });

  describe("type safety", () => {
    it("should return correct type", () => {
      const params = { connected: "true" };
      const result: MailchimpConnectionParams =
        validateMailchimpConnectionParams(params);

      expect(typeof result.connected).toBe("boolean");
      expect(result.error === null || typeof result.error === "string").toBe(
        true,
      );
    });
  });

  describe("array handling (Next.js can send arrays for duplicate params)", () => {
    it("should handle connected as array (take first value)", () => {
      const params = { connected: ["true"] };
      const result = validateMailchimpConnectionParams(params);

      expect(result.connected).toBe(true);
    });

    it("should handle connected array with false value", () => {
      const params = { connected: ["false"] };
      const result = validateMailchimpConnectionParams(params);

      expect(result.connected).toBe(false);
    });

    it("should handle error as array (take first value)", () => {
      const params = { error: ["access_denied"] };
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBe("access_denied");
    });

    it("should handle error_description as array (take first value)", () => {
      const params = { error_description: ["User denied access"] };
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBe("User denied access");
    });

    it("should handle array with empty string as null", () => {
      const params = { error: [""] };
      const result = validateMailchimpConnectionParams(params);

      expect(result.error).toBeNull();
    });
  });

  describe("extra parameters (should be ignored)", () => {
    it("should ignore non-OAuth parameters", () => {
      const params = {
        connected: "true",
        page: "1",
        sort: "desc",
        foo: "bar",
      };
      const result = validateMailchimpConnectionParams(params);

      expect(result).toEqual({
        connected: true,
        error: null,
      });
    });
  });
});

describe("hasOAuthCallbackParams", () => {
  it("should return true when 'connected' param exists", () => {
    const params = { connected: "true" };
    expect(hasOAuthCallbackParams(params)).toBe(true);
  });

  it("should return true when 'error' param exists", () => {
    const params = { error: "access_denied" };
    expect(hasOAuthCallbackParams(params)).toBe(true);
  });

  it("should return true when 'error_description' param exists", () => {
    const params = { error_description: "User denied access" };
    expect(hasOAuthCallbackParams(params)).toBe(true);
  });

  it("should return true when multiple OAuth params exist", () => {
    const params = {
      connected: "true",
      error: "some_error",
    };
    expect(hasOAuthCallbackParams(params)).toBe(true);
  });

  it("should return false when no OAuth params exist", () => {
    const params = {};
    expect(hasOAuthCallbackParams(params)).toBe(false);
  });

  it("should return false when only other params exist", () => {
    const params = {
      page: "1",
      sort: "desc",
      filter: "active",
    };
    expect(hasOAuthCallbackParams(params)).toBe(false);
  });

  it("should return false for undefined values", () => {
    const params = {
      connected: undefined,
      error: undefined,
    };
    // The 'in' operator returns true for properties that exist even with undefined values
    expect(hasOAuthCallbackParams(params)).toBe(true);
  });
});
