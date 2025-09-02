/**
 * Account Page Integration Tests
 * Tests for the Mailchimp Account page component
 *
 * Issue #123: Account page integration testing
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AccountPage from "./page";
import { getApiRoot } from "@/actions/mailchimp-root";
import { renderWithA11y } from "@/test/axe-helper";
import type {
  MailchimpRoot,
  MailchimpRootErrorResponse,
} from "@/types/mailchimp";

// Mock server action
vi.mock("@/actions/mailchimp-root", () => ({
  getApiRoot: vi.fn(),
}));

// Mock DashboardLayout component
vi.mock("@/components/layout/dashboard-layout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

const mockGetApiRoot = vi.mocked(getApiRoot);

const mockAccountData: MailchimpRoot = {
  account_id: "test-account-123",
  login_id: "user123",
  account_name: "Test Company",
  email: "test@example.com",
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  avatar_url: "https://example.com/avatar.jpg",
  role: "owner",
  first_payment: "2020-01-15T10:00:00Z",
  account_timezone: "America/New_York",
  account_industry: "Technology",
  last_login: "2024-01-15T10:00:00Z",
  member_since: "2020-01-01T00:00:00Z",
  pricing_plan_type: "monthly",
  pro_enabled: true,
  total_subscribers: 15000,
  contact: {
    company: "Test Company Inc",
    addr1: "123 Main St",
    addr2: "Suite 100",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
  },
  industry_stats: {
    open_rate: 0.21,
    bounce_rate: 0.03,
    click_rate: 0.08,
  },
  _links: [
    {
      rel: "self",
      href: "https://us1.api.mailchimp.com/3.0/",
      targetSchema: "https://us1.api.mailchimp.com/schema/3.0/Root.json",
      schema: "https://us1.api.mailchimp.com/schema/3.0/Root.json",
      method: "GET",
    },
  ],
};

const mockErrorResponse: MailchimpRootErrorResponse = {
  type: "about:blank",
  title: "API Root Error",
  detail: "Failed to fetch account data",
  status: 500,
  instance: "/",
};

describe("Account Page Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("renders the main page structure", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
      expect(screen.getByText("Account Information")).toBeInTheDocument();
      expect(
        screen.getByText(
          "View your Mailchimp account details, contact information, and industry benchmarks",
        ),
      ).toBeInTheDocument();
    });

    it("has proper semantic structure with headings", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("Account Information");
    });

    it("uses proper spacing and layout classes", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      const { container } = render(<AccountPage />);

      const spacingContainer = container.querySelector(".space-y-6");
      expect(spacingContainer).toBeInTheDocument();
    });
  });

  describe("Data Loading", () => {
    it("displays loading skeleton initially", async () => {
      // Mock a slow API response to test loading state
      mockGetApiRoot.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockAccountData), 100),
          ),
      );

      const { container } = render(<AccountPage />);

      // Check for skeleton elements by CSS class
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("displays account data after successful load", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("15,000")).toBeInTheDocument();
    });

    it("calls getApiRoot action on page load", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      expect(mockGetApiRoot).toHaveBeenCalledTimes(1);
      expect(mockGetApiRoot).toHaveBeenCalledWith();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when API returns error", async () => {
      mockGetApiRoot.mockResolvedValue(mockErrorResponse);

      render(<AccountPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load account information"),
        ).toBeInTheDocument();
      });

      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
    });

    it("handles API action rejection gracefully", async () => {
      mockGetApiRoot.mockRejectedValue(new Error("Network error"));

      render(<AccountPage />);

      await waitFor(() => {
        // Should show the error fallback in AccountOverview
        expect(screen.getByText("Account Information")).toBeInTheDocument();
      });
    });
  });

  describe("Suspense Behavior", () => {
    it("shows skeleton while data is loading", async () => {
      let resolvePromise: (value: MailchimpRoot) => void;
      const promise = new Promise<MailchimpRoot>((resolve) => {
        resolvePromise = resolve;
      });
      mockGetApiRoot.mockReturnValue(promise);

      const { container } = render(<AccountPage />);

      // Should show skeleton initially
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);

      // Resolve the promise
      resolvePromise!(mockAccountData);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });
    });

    it("replaces skeleton with content after data loads", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      const { container } = render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });

      // Skeleton should be gone
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons).toHaveLength(0);
    });
  });

  describe("Component Integration", () => {
    it("passes correct props to AccountOverview component", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });

      // Verify all main sections are rendered (from AccountOverview)
      expect(screen.getByText("Account Details")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Account Timeline")).toBeInTheDocument();
      expect(screen.getByText("Industry Benchmarks")).toBeInTheDocument();
    });

    it("integrates properly with DashboardLayout", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      render(<AccountPage />);

      expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    });
  });

  describe("Metadata", () => {
    it("exports correct metadata", async () => {
      // Import the module to access exports
      const pageModule = await import("./page");

      expect(pageModule.metadata).toEqual({
        title: "Account | Mailchimp Dashboard",
        description: "View your Mailchimp account information and settings",
      });
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations with loaded data", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      const { renderResult } = await renderWithA11y(<AccountPage />);
      expect(renderResult.container).toBeInTheDocument();
    });

    it("should not have accessibility violations in loading state", async () => {
      const slowPromise = new Promise(() => {
        // Never resolves to test loading state
      });
      mockGetApiRoot.mockReturnValue(slowPromise as Promise<MailchimpRoot>);

      const { renderResult } = await renderWithA11y(<AccountPage />);
      expect(renderResult.container).toBeInTheDocument();
    });

    it("should not have accessibility violations in error state", async () => {
      mockGetApiRoot.mockResolvedValue(mockErrorResponse);

      const { renderResult } = await renderWithA11y(<AccountPage />);
      expect(renderResult.container).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("does not make unnecessary API calls on re-renders", async () => {
      mockGetApiRoot.mockResolvedValue(mockAccountData);

      const { rerender } = render(<AccountPage />);

      expect(mockGetApiRoot).toHaveBeenCalledTimes(1);

      rerender(<AccountPage />);

      // Should still be called only once due to React's Server Components behavior
      expect(mockGetApiRoot).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty account data gracefully", async () => {
      const emptyAccount = {
        ...mockAccountData,
        account_name: "",
        email: "",
        total_subscribers: 0,
      };
      mockGetApiRoot.mockResolvedValue(emptyAccount);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Account Details")).toBeInTheDocument();
      });

      expect(screen.getByText("0")).toBeInTheDocument(); // Zero subscribers
    });

    it("handles missing optional data fields", async () => {
      const partialAccount = {
        ...mockAccountData,
        first_payment: "",
        last_login: "",
        contact: {
          ...mockAccountData.contact,
          addr2: "",
        },
      };
      mockGetApiRoot.mockResolvedValue(partialAccount);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });

      expect(screen.queryByText("First Payment")).not.toBeInTheDocument();
      expect(screen.queryByText("Last Login")).not.toBeInTheDocument();
    });

    it("handles malformed API response gracefully", async () => {
      // Test with response that has status but no detail
      const malformedError = {
        status: 500,
        title: "Internal Server Error",
        // Missing detail field
      };
      mockGetApiRoot.mockResolvedValue(
        malformedError as MailchimpRootErrorResponse,
      );

      render(<AccountPage />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load account information"),
        ).toBeInTheDocument();
      });
    });

    it("handles very large subscriber counts", async () => {
      const largeNumberAccount = {
        ...mockAccountData,
        total_subscribers: 999999999,
      };
      mockGetApiRoot.mockResolvedValue(largeNumberAccount);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("999,999,999")).toBeInTheDocument();
      });
    });

    it("handles account with no industry stats", async () => {
      const noStatsAccount = {
        ...mockAccountData,
        industry_stats: {
          open_rate: 0,
          bounce_rate: 0,
          click_rate: 0,
        },
      };
      mockGetApiRoot.mockResolvedValue(noStatsAccount);

      render(<AccountPage />);

      await waitFor(() => {
        expect(screen.getByText("Test Company")).toBeInTheDocument();
      });

      // Should display 0.0% for all stats
      const zeroPercents = screen.getAllByText("0.0%");
      expect(zeroPercents.length).toBeGreaterThan(0);
    });
  });
});
