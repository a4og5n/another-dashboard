/**
 * Google Sign-In Button Component Test
 * Tests for Google OAuth authentication button component
 *
 * Following established component testing patterns with comprehensive coverage
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

// Mock environment variable
const mockConnectionId = "conn_test123";
vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);

// Store original window.location
const originalLocation = window.location;

describe("GoogleSignInButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.href setter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = { ...originalLocation, href: "" };
  });

  afterEach(() => {
    // Restore original window.location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = originalLocation;
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
      expect(window.location.href).toContain(`connection_id=${mockConnectionId}`);
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
      expect(window.location.href).toContain(`connection_id=${mockConnectionId}`);
    });

    it("should use login endpoint when mode is login", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton mode="login" />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain("/api/auth/login");
      expect(window.location.href).toContain(`connection_id=${mockConnectionId}`);
    });

    it("should properly encode redirect URL", async () => {
      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(window.location.href).toContain(
        encodeURIComponent("/mailchimp"),
      );
    });
  });

  describe("Error Handling", () => {
    it("should show error when connection_id is missing", async () => {
      // Temporarily unset the environment variable
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      const user = userEvent.setup();
      render(<GoogleSignInButton showErrorAlert />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Google OAuth not configured/i),
      ).toBeInTheDocument();

      // Restore the environment variable
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);
    });

    it("should call onError callback when connection_id is missing", async () => {
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      const onError = vi.fn();
      const user = userEvent.setup();
      render(<GoogleSignInButton onError={onError} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(onError).toHaveBeenCalledWith(
        "Google OAuth not configured. Please check environment variables.",
      );

      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);
    });

    it("should not show error alert when showErrorAlert is false", async () => {
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      const user = userEvent.setup();
      render(<GoogleSignInButton showErrorAlert={false} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);
    });

    it("should not navigate when connection_id is not available", async () => {
      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", undefined);

      const user = userEvent.setup();
      render(<GoogleSignInButton />);

      const button = screen.getByRole("button");
      const initialHref = window.location.href;

      await user.click(button);

      // Should not have navigated
      expect(window.location.href).toBe(initialHref);

      vi.stubEnv("NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID", mockConnectionId);
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
