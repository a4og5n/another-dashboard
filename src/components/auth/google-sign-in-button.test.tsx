/**
 * Google Sign-In Button Component Test
 * Tests for Google OAuth authentication button component
 *
 * Following established component testing patterns with comprehensive coverage
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

// Mock environment variable
const mockConnectionId = "conn_test123";
vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);

// Mock window.location for testing navigation
const mockLocation = { href: "" };
Object.defineProperty(window, "location", {
  writable: true,
  value: mockLocation,
});

describe("GoogleSignInButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location.href
    mockLocation.href = "";
    // Ensure environment variable is set for each test
    vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the Google sign-in button", () => {
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("should render with login mode by default", () => {
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      expect(button).toHaveTextContent("Continue with Google");
    });

    it("should render with register mode when specified", () => {
      render(<GoogleSignInButton mode="register" />);

      const button = screen.getByRole("button", {
        name: /sign up with google/i,
      });
      expect(button).toHaveTextContent("Sign up with Google");
    });

    it("should render Google logo SVG", () => {
      render(<GoogleSignInButton />);

      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("should apply custom className when provided", () => {
      render(<GoogleSignInButton className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Authentication Flow", () => {
    it("should navigate to login endpoint with connection_id on button click", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain("/api/auth/login");
      expect(window.location.href).toContain(
        `connection_id=${mockConnectionId}`,
      );
      expect(window.location.href).toContain(
        "post_login_redirect_url=%2Fmailchimp",
      );
    });

    it("should use register endpoint when mode is register", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton mode="register" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain("/api/auth/register");
      expect(window.location.href).toContain(
        `connection_id=${mockConnectionId}`,
      );
    });

    it("should use login endpoint when mode is login", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton mode="login" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain("/api/auth/login");
      expect(window.location.href).toContain(
        `connection_id=${mockConnectionId}`,
      );
    });

    it("should properly encode redirect URL", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain(encodeURIComponent("/mailchimp"));
    });
  });

  describe("Error Handling", () => {
    it("should show error when connection_id is missing", () => {
      // Temporarily unset the environment variable
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      render(<GoogleSignInButton showErrorAlert />);

      // Should show error alert instead of button
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Google OAuth not configured/i),
      ).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not show error alert when showErrorAlert is false", () => {
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      render(<GoogleSignInButton showErrorAlert={false} />);

      // Should not show error alert or button
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not navigate when connection_id is not available", () => {
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      render(<GoogleSignInButton />);

      // Should not have rendered button, so no navigation possible
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      // window.location.href should remain empty since no button was clicked
      expect(window.location.href).toBe("");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA label for login mode", () => {
      render(<GoogleSignInButton mode="login" />);

      const button = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      expect(button).toHaveAttribute("aria-label", "Sign in with Google");
    });

    it("should have proper ARIA label for register mode", () => {
      render(<GoogleSignInButton mode="register" />);

      const button = screen.getByRole("button", {
        name: /sign up with google/i,
      });
      expect(button).toHaveAttribute("aria-label", "Sign up with Google");
    });

    it("should hide Google logo from screen readers", () => {
      render(<GoogleSignInButton />);

      const svg = document.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard("{Enter}");

      expect(window.location.href).toContain("/api/auth/login");
    });

    it("should be activatable with Space key", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Space
      await user.keyboard(" ");

      expect(window.location.href).toContain("/api/auth/login");
    });
  });

  describe("Button Styling", () => {
    it("should have outline variant styling", () => {
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      // Check for base outline button classes (from shadcn/ui)
      expect(button.className).toContain("border");
    });

    it("should have Google brand colors (white background)", () => {
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-white");
    });

    it("should be full width", () => {
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      expect(button.className).toContain("w-full");
    });
  });
});
