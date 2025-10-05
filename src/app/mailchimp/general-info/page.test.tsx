/**
 * General Info Page Integration Tests
 * Tests for the Mailchimp General Info page component
 *
 * Issue #123: General Info page integration testing
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithA11y } from "@/test/axe-helper";
import { GeneralInfoOverview } from "@/components/mailchimp/general-info";
import type { RootSuccess } from "@/types/mailchimp";

// Mock DashboardLayout component
vi.mock("@/components/layout/dashboard-layout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

// Component test data

const mockAccountData: RootSuccess = {
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

describe("General Info Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GeneralInfoOverview Component", () => {
    it("renders general info data correctly", () => {
      render(<GeneralInfoOverview data={mockAccountData} />);

      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("15,000")).toBeInTheDocument();
      expect(screen.getByText("Account Details")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
    });

    it("displays industry benchmarks correctly", () => {
      render(<GeneralInfoOverview data={mockAccountData} />);

      expect(screen.getByText("Industry Benchmarks")).toBeInTheDocument();
      expect(screen.getByText("21.0%")).toBeInTheDocument(); // Open rate
      expect(screen.getByText("8.0%")).toBeInTheDocument(); // Click rate
      expect(screen.getByText("3.0%")).toBeInTheDocument(); // Bounce rate
    });

    // Note: Loading skeleton test removed as loading prop has been deprecated.
    // Loading states are now handled at the parent level with Suspense boundaries.
  });

  describe("Error Handling", () => {
    it("displays error message when error prop is provided", () => {
      render(
        <GeneralInfoOverview
          data={null}
          error="Failed to load general info information"
        />,
      );

      expect(
        screen.getByText("Failed to load general info information"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
    });

    it("shows fallback when generalInfo is null", () => {
      render(<GeneralInfoOverview data={null} />);

      expect(
        screen.getByText("No general info data provided"),
      ).toBeInTheDocument();
    });
  });

  describe("Data Scenarios", () => {
    it("handles empty general info data gracefully", () => {
      const emptyAccount = {
        ...mockAccountData,
        account_name: "",
        email: "",
        total_subscribers: 0,
      };

      render(<GeneralInfoOverview data={emptyAccount} />);

      expect(screen.getByText("Account Details")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument(); // Zero subscribers
    });

    it("handles missing optional data fields", () => {
      const partialAccount = {
        ...mockAccountData,
        first_payment: "",
        last_login: "",
        contact: {
          ...mockAccountData.contact,
          addr2: "",
        },
      };

      render(<GeneralInfoOverview data={partialAccount} />);

      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.queryByText("First Payment")).not.toBeInTheDocument();
      expect(screen.queryByText("Last Login")).not.toBeInTheDocument();
    });

    it("handles very large subscriber counts", () => {
      const largeNumberAccount = {
        ...mockAccountData,
        total_subscribers: 999999999,
      };

      render(<GeneralInfoOverview data={largeNumberAccount} />);

      expect(screen.getByText("999,999,999")).toBeInTheDocument();
    });

    it("handles general info with no industry stats", () => {
      const noStatsAccount = {
        ...mockAccountData,
        industry_stats: {
          open_rate: 0,
          bounce_rate: 0,
          click_rate: 0,
        },
      };

      render(<GeneralInfoOverview data={noStatsAccount} />);

      expect(screen.getByText("Test Company")).toBeInTheDocument();
      // Should display 0.0% for all stats
      const zeroPercents = screen.getAllByText("0.0%");
      expect(zeroPercents.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations with loaded data", async () => {
      const { renderResult } = await renderWithA11y(
        <GeneralInfoOverview data={mockAccountData} />,
      );
      expect(renderResult.container).toBeInTheDocument();
    });

    // Note: Loading state accessibility test removed as loading prop has been deprecated.
    // Loading states are now handled at the parent level with Suspense boundaries.

    it("should not have accessibility violations in error state", async () => {
      const { renderResult } = await renderWithA11y(
        <GeneralInfoOverview
          data={null}
          error="Failed to load general info information"
        />,
      );
      expect(renderResult.container).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders all required sections", () => {
      render(<GeneralInfoOverview data={mockAccountData} />);

      // Verify all main sections are rendered
      expect(screen.getByText("Account Details")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Account Timeline")).toBeInTheDocument();
      expect(screen.getByText("Industry Benchmarks")).toBeInTheDocument();
    });
  });
});
