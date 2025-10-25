/**
 * Tests for AuthErrorRecovery Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthErrorRecovery, detectAuthErrorType } from "./auth-error-recovery";
import type { AuthErrorType } from "@/types/components/auth/error-recovery";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch for clear-state API
global.fetch = vi.fn();

describe("AuthErrorRecovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render with error message", () => {
    render(
      <AuthErrorRecovery
        errorType="network"
        message="Network connection failed"
      />,
    );

    expect(screen.getByText("Authentication Error")).toBeInTheDocument();
    expect(screen.getByText("Network connection failed")).toBeInTheDocument();
  });

  it("should display appropriate icon for error type", () => {
    const { rerender } = render(
      <AuthErrorRecovery errorType="network" message="Network error" />,
    );

    // Should show "Authentication Error" title
    expect(screen.getByText("Authentication Error")).toBeInTheDocument();

    // Rate limit error should also show title
    rerender(
      <AuthErrorRecovery errorType="rate_limit" message="Rate limited" />,
    );
    expect(screen.getByText("Authentication Error")).toBeInTheDocument();
  });

  it("should show recovery steps by default", () => {
    render(
      <AuthErrorRecovery
        errorType="state_not_found"
        message="State verification failed"
      />,
    );

    expect(screen.getByText("What you can try:")).toBeInTheDocument();
    expect(
      screen.getByText(/OAuth state verification failed/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Clear your browser cookies/i)).toBeInTheDocument();
  });

  it("should hide recovery steps when showTroubleshootingSteps is false", () => {
    render(
      <AuthErrorRecovery
        errorType="network"
        message="Network error"
        showTroubleshootingSteps={false}
      />,
    );

    expect(screen.queryByText("What you can try:")).not.toBeInTheDocument();
  });

  it("should toggle technical details visibility", () => {
    render(
      <AuthErrorRecovery
        errorType="token_exchange"
        message="Token exchange failed"
        technicalDetails="Error: Failed to exchange authorization code"
      />,
    );

    // Technical details hidden by default
    expect(
      screen.queryByText("Error: Failed to exchange authorization code"),
    ).not.toBeInTheDocument();

    // Click to show details
    fireEvent.click(screen.getByText("Show technical details"));
    expect(
      screen.getByText("Error: Failed to exchange authorization code"),
    ).toBeInTheDocument();

    // Click to hide details
    fireEvent.click(screen.getByText("Hide technical details"));
    expect(
      screen.queryByText("Error: Failed to exchange authorization code"),
    ).not.toBeInTheDocument();
  });

  it("should not show technical details button when no details provided", () => {
    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    expect(
      screen.queryByText("Show technical details"),
    ).not.toBeInTheDocument();
  });

  it("should call onRetry callback when Try Again is clicked", () => {
    const onRetry = vi.fn();

    render(
      <AuthErrorRecovery
        errorType="network"
        message="Network error"
        onRetry={onRetry}
      />,
    );

    fireEvent.click(screen.getByText("Try Again"));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled(); // Should not redirect when callback provided
  });

  it("should redirect to /login when Try Again is clicked without callback", () => {
    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    fireEvent.click(screen.getByText("Try Again"));

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should call onClearSession callback when Clear Session is clicked", () => {
    const onClearSession = vi.fn();

    render(
      <AuthErrorRecovery
        errorType="state_not_found"
        message="State not found"
        onClearSession={onClearSession}
      />,
    );

    fireEvent.click(screen.getByText("Clear Session"));

    expect(onClearSession).toHaveBeenCalledTimes(1);
  });

  it("should call clear-state API when Clear Session is clicked without callback", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    fireEvent.click(screen.getByText("Clear Session"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/clear-state");
    });

    // Should redirect to login after successful clear
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("should show loading state while clearing session", async () => {
    const mockFetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ json: () => Promise.resolve({ success: true }) });
          }, 100);
        }),
    );
    global.fetch = mockFetch;

    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    fireEvent.click(screen.getByText("Clear Session"));

    // Should show loading state
    expect(screen.getByText("Clearing...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clearing/i })).toBeDisabled();

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      },
      { timeout: 200 },
    );
  });

  it("should handle clear session API failure gracefully", async () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockFetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: false, message: "Failed to clear state" }),
    });
    global.fetch = mockFetch;

    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    fireEvent.click(screen.getByText("Clear Session"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("Failed to clear session"),
      );
    });

    mockAlert.mockRestore();
  });

  it("should handle network error during clear session", async () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    fireEvent.click(screen.getByText("Clear Session"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("Network error while clearing session"),
      );
    });

    mockAlert.mockRestore();
  });

  it("should render all action buttons", () => {
    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Clear Session")).toBeInTheDocument();
  });

  it("should show help link", () => {
    render(<AuthErrorRecovery errorType="network" message="Network error" />);

    const helpLink = screen.getByText("View troubleshooting guide");
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute(
      "href",
      "/docs/troubleshooting/authentication",
    );
  });

  it("should display context-specific recovery steps for each error type", () => {
    const errorTypes: AuthErrorType[] = [
      "network",
      "timeout",
      "rate_limit",
      "invalid_credentials",
      "state_not_found",
      "token_exchange",
      "metadata_fetch",
      "mailchimp_connection",
      "kinde_jwks",
      "unknown",
    ];

    errorTypes.forEach((errorType) => {
      const { unmount } = render(
        <AuthErrorRecovery errorType={errorType} message="Test error" />,
      );

      // Each error type should have recovery steps
      expect(screen.getByText("What you can try:")).toBeInTheDocument();

      // Should have at least one list item
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);

      unmount();
    });
  });
});

describe("detectAuthErrorType", () => {
  it("should detect network errors", () => {
    expect(detectAuthErrorType({ message: "Network connection failed" })).toBe(
      "network",
    );
    expect(detectAuthErrorType({ status: 503 })).toBe("network");
    expect(detectAuthErrorType({ status: 500 })).toBe("network");
  });

  it("should detect timeout errors", () => {
    expect(detectAuthErrorType({ message: "Request timeout" })).toBe("timeout");
  });

  it("should detect state not found errors", () => {
    expect(detectAuthErrorType({ message: "State not found" })).toBe(
      "state_not_found",
    );
  });

  it("should detect token exchange errors", () => {
    expect(detectAuthErrorType({ message: "Failed to exchange token" })).toBe(
      "token_exchange",
    );
  });

  it("should detect metadata fetch errors", () => {
    expect(detectAuthErrorType({ message: "Metadata fetch failed" })).toBe(
      "metadata_fetch",
    );
  });

  it("should detect JWKS errors", () => {
    expect(detectAuthErrorType({ message: "JWKS fetch failed" })).toBe(
      "kinde_jwks",
    );
  });

  it("should detect rate limit errors by status code", () => {
    expect(detectAuthErrorType({ status: 429 })).toBe("rate_limit");
  });

  it("should detect invalid credentials by status code", () => {
    expect(detectAuthErrorType({ status: 401 })).toBe("invalid_credentials");
    expect(detectAuthErrorType({ status: 403 })).toBe("invalid_credentials");
  });

  it("should return unknown for unrecognized errors", () => {
    expect(detectAuthErrorType({ message: "Something went wrong" })).toBe(
      "unknown",
    );
    expect(detectAuthErrorType(new Error("Generic error"))).toBe("unknown");
    expect(detectAuthErrorType("string error")).toBe("unknown");
    expect(detectAuthErrorType(null)).toBe("unknown");
  });
});
