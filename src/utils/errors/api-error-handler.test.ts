import { describe, it, expect, vi } from "vitest";
import {
  is404Error,
  handleApiError,
  handleApiErrorWithFallback,
} from "./api-error-handler";
import type { ApiResponse } from "@/types";

// Mock Next.js notFound function
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("is404Error", () => {
  it("should return true for 'not found' message", () => {
    expect(is404Error("Campaign not found")).toBe(true);
    expect(is404Error("Resource Not Found")).toBe(true);
  });

  it("should return true for '404' message", () => {
    expect(is404Error("404 error occurred")).toBe(true);
    expect(is404Error("Error: 404")).toBe(true);
  });

  it("should return true for 'does not exist' message", () => {
    expect(is404Error("Campaign does not exist")).toBe(true);
    expect(is404Error("Resource Does Not Exist")).toBe(true);
  });

  it("should return true for 'could not be found' message", () => {
    expect(is404Error("The requested resource could not be found")).toBe(true);
    expect(is404Error("Campaign Could Not Be Found")).toBe(true);
  });

  it("should return true for validation error message", () => {
    expect(is404Error("The resource submitted could not be validated")).toBe(
      true,
    );
  });

  it("should return false for other error messages", () => {
    expect(is404Error("Invalid API key")).toBe(false);
    expect(is404Error("Network timeout")).toBe(false);
    expect(is404Error("Unauthorized")).toBe(false);
  });

  it("should handle empty strings", () => {
    expect(is404Error("")).toBe(false);
  });
});

describe("handleApiError", () => {
  it("should call notFound() for 404 errors based on message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Campaign not found",
    };

    expect(() => handleApiError(response)).toThrow("NEXT_NOT_FOUND");
  });

  it("should call notFound() for 404 status code even without matching message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Resource could not be retrieved",
      statusCode: 404,
    };

    expect(() => handleApiError(response)).toThrow("NEXT_NOT_FOUND");
  });

  it("should call notFound() for both 404 status code and matching message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Campaign not found",
      statusCode: 404,
    };

    expect(() => handleApiError(response)).toThrow("NEXT_NOT_FOUND");
  });

  it("should call notFound() for 400 status code with 404-like message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "A campaign with the provided ID does not exist",
      statusCode: 400,
    };

    expect(() => handleApiError(response)).toThrow("NEXT_NOT_FOUND");
  });

  it("should return error message for non-404 errors", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Invalid API key",
      statusCode: 401,
    };

    expect(handleApiError(response)).toBe("Invalid API key");
  });

  it("should return error message for 400 errors without 404-like message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Invalid request parameters",
      statusCode: 400,
    };

    expect(handleApiError(response)).toBe("Invalid request parameters");
  });

  it("should return null for successful responses", () => {
    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: "123" },
    };

    expect(handleApiError(response)).toBe(null);
  });

  it("should use fallback message when error is undefined", () => {
    const response: ApiResponse<unknown> = {
      success: false,
    };

    expect(handleApiError(response)).toBe("Failed to load data");
  });
});

describe("handleApiErrorWithFallback", () => {
  it("should use custom fallback message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
    };

    expect(handleApiErrorWithFallback(response, "Custom error")).toBe(
      "Custom error",
    );
  });

  it("should call notFound() for 404 errors with fallback based on message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Resource not found",
    };

    expect(() => handleApiErrorWithFallback(response, "Custom error")).toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("should call notFound() for 404 status code with fallback", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Resource could not be retrieved",
      statusCode: 404,
    };

    expect(() => handleApiErrorWithFallback(response, "Custom error")).toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("should call notFound() for 400 status code with 404-like message", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "The campaign does not exist in this account",
      statusCode: 400,
    };

    expect(() => handleApiErrorWithFallback(response, "Custom error")).toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("should prefer response.error over fallback", () => {
    const response: ApiResponse<unknown> = {
      success: false,
      error: "Specific error",
    };

    expect(handleApiErrorWithFallback(response, "Fallback error")).toBe(
      "Specific error",
    );
  });
});
