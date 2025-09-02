/**
 * AccountOverview Component Tests
 * Comprehensive tests for the AccountOverview component
 *
 * Issue #123: Account Overview component testing
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccountOverview } from "./AccountOverview";
import { renderWithA11y } from "@/test/axe-helper";
import type { MailchimpRoot } from "@/types/mailchimp";

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

describe("AccountOverview", () => {
  describe("Basic Rendering", () => {
    it("renders account information correctly", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(
        screen.getByText("Account ID: test-account-123"),
      ).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("Monthly")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    it("renders contact information correctly", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("Test Company Inc")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("Suite 100")).toBeInTheDocument();
      expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
      expect(screen.getByText("USA")).toBeInTheDocument();
    });

    it("renders subscriber count with formatting", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("15,000")).toBeInTheDocument();
      expect(screen.getByText("Total subscribers")).toBeInTheDocument();
    });

    it("renders industry statistics correctly", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("21.0%")).toBeInTheDocument(); // Open rate
      expect(screen.getByText("8.0%")).toBeInTheDocument(); // Click rate
      expect(screen.getByText("3.0%")).toBeInTheDocument(); // Bounce rate
      expect(screen.getByText("Open Rate")).toBeInTheDocument();
      expect(screen.getByText("Click Rate")).toBeInTheDocument();
      expect(screen.getByText("Bounce Rate")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("formats dates correctly", () => {
      const { container } = render(
        <AccountOverview account={mockAccountData} />,
      );

      // Check for date content in the rendered HTML (dates may vary by timezone)
      expect(container.textContent).toMatch(
        /December 31, 2019|January 1, 2020/,
      ); // Member since
      expect(container.textContent).toContain("January 15, 2020"); // First payment
      expect(container.textContent).toContain("January 15, 2024"); // Last login
    });

    it("handles missing optional dates", () => {
      const accountWithoutOptionalDates = {
        ...mockAccountData,
        first_payment: "",
        last_login: "",
      };

      render(<AccountOverview account={accountWithoutOptionalDates} />);

      expect(screen.getByText("Member Since")).toBeInTheDocument();
      expect(screen.queryByText("First Payment")).not.toBeInTheDocument();
      expect(screen.queryByText("Last Login")).not.toBeInTheDocument();
    });
  });

  describe("Pricing Plan Variants", () => {
    it("displays correct badge variant for monthly plan", () => {
      render(<AccountOverview account={mockAccountData} />);

      const monthlyBadge = screen.getByText("Monthly");
      expect(monthlyBadge).toBeInTheDocument();
    });

    it("displays correct badge variant for pay as you go plan", () => {
      const payAsYouGoAccount = {
        ...mockAccountData,
        pricing_plan_type: "pay_as_you_go" as const,
      };

      render(<AccountOverview account={payAsYouGoAccount} />);

      expect(screen.getByText("Pay As You Go")).toBeInTheDocument();
    });

    it("displays correct badge variant for forever free plan", () => {
      const freeAccount = {
        ...mockAccountData,
        pricing_plan_type: "forever_free" as const,
      };

      render(<AccountOverview account={freeAccount} />);

      expect(screen.getByText("Forever Free")).toBeInTheDocument();
    });
  });

  describe("Pro Features", () => {
    it("shows Pro badge when pro is enabled", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    it("hides Pro badge when pro is disabled", () => {
      const nonProAccount = {
        ...mockAccountData,
        pro_enabled: false,
      };

      render(<AccountOverview account={nonProAccount} />);

      expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    });
  });

  describe("Contact Address Handling", () => {
    it("handles missing addr2 gracefully", () => {
      const accountWithoutAddr2 = {
        ...mockAccountData,
        contact: {
          ...mockAccountData.contact,
          addr2: "",
        },
      };

      render(<AccountOverview account={accountWithoutAddr2} />);

      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.queryByText("Suite 100")).not.toBeInTheDocument();
      expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
    });

    it("displays addr2 when present", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("Suite 100")).toBeInTheDocument();
    });
  });

  describe("Industry Benchmarks", () => {
    it("displays industry name in benchmarks section", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText(/Technology industry/)).toBeInTheDocument();
    });

    it("formats percentage values correctly", () => {
      const accountWithDecimalStats = {
        ...mockAccountData,
        industry_stats: {
          open_rate: 0.2567, // Should display as 25.7%
          bounce_rate: 0.0234, // Should display as 2.3%
          click_rate: 0.1789, // Should display as 17.9%
        },
      };

      render(<AccountOverview account={accountWithDecimalStats} />);

      expect(screen.getByText("25.7%")).toBeInTheDocument();
      expect(screen.getByText("2.3%")).toBeInTheDocument();
      expect(screen.getByText("17.9%")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when loading is true", () => {
      const { container } = render(
        <AccountOverview account={null} loading={true} />,
      );

      // Check for skeleton elements by CSS class
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("does not show account data when loading", () => {
      render(<AccountOverview account={mockAccountData} loading={true} />);

      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when error is provided", () => {
      const errorMessage = "Failed to load account data";
      render(<AccountOverview account={null} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText("Account Information")).toBeInTheDocument();
    });

    it("displays generic error when account is null without specific error", () => {
      render(<AccountOverview account={null} />);

      expect(
        screen.getByText("Unable to load account information"),
      ).toBeInTheDocument();
    });

    it("does not show account data when there is an error", () => {
      render(<AccountOverview account={null} error="API Error" />);

      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
    });
  });

  describe("Grid Layout", () => {
    it("uses proper grid layout classes", () => {
      const { container } = render(
        <AccountOverview account={mockAccountData} />,
      );

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass(
        "gap-4",
        "md:grid-cols-2",
        "lg:grid-cols-3",
      );
    });

    it("has proper responsive spans for full-width cards", () => {
      const { container } = render(
        <AccountOverview account={mockAccountData} />,
      );

      const fullWidthCards = container.querySelectorAll(
        ".md\\:col-span-2.lg\\:col-span-3",
      );
      expect(fullWidthCards.length).toBe(2); // Timeline and Industry Stats cards
    });
  });

  describe("Semantic Structure", () => {
    it("has proper heading structure", () => {
      render(<AccountOverview account={mockAccountData} />);

      expect(screen.getByText("Account Details")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Account Timeline")).toBeInTheDocument();
      expect(screen.getByText("Industry Benchmarks")).toBeInTheDocument();
    });

    it("uses proper ARIA labels and semantic HTML", () => {
      const { container } = render(
        <AccountOverview account={mockAccountData} />,
      );

      // Check for proper card structure
      const cards = container.querySelectorAll("[data-slot='card']");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <AccountOverview account={mockAccountData} />,
      );
      // Test passes if no violations are found (renderWithA11y includes assertion)
      expect(renderResult.container).toBeInTheDocument();
    });

    it("should not have accessibility violations in loading state", async () => {
      const { renderResult } = await renderWithA11y(
        <AccountOverview account={null} loading={true} />,
      );
      expect(renderResult.container).toBeInTheDocument();
    });

    it("should not have accessibility violations in error state", async () => {
      const { renderResult } = await renderWithA11y(
        <AccountOverview account={null} error="Test error" />,
      );
      expect(renderResult.container).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles account with minimal data", () => {
      const minimalAccount: MailchimpRoot = {
        account_id: "min-account",
        login_id: "min-user",
        account_name: "Minimal Account",
        email: "min@example.com",
        first_name: "Min",
        last_name: "User",
        username: "minuser",
        avatar_url: "",
        role: "user",
        first_payment: "",
        account_timezone: "UTC",
        account_industry: "Other",
        last_login: "",
        member_since: "2024-01-01T00:00:00Z",
        pricing_plan_type: "forever_free",
        pro_enabled: false,
        total_subscribers: 0,
        contact: {
          company: "Min Company",
          addr1: "Min Address",
          addr2: "",
          city: "Min City",
          state: "MS",
          zip: "00000",
          country: "Country",
        },
        industry_stats: {
          open_rate: 0,
          bounce_rate: 0,
          click_rate: 0,
        },
        _links: [
          {
            rel: "self",
            href: "https://example.com",
            targetSchema: "",
            schema: "",
            method: "GET",
          },
        ],
      };

      render(<AccountOverview account={minimalAccount} />);

      expect(screen.getByText("Minimal Account")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument(); // Zero subscribers
      expect(screen.getByText("Forever Free")).toBeInTheDocument();
      expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    });

    it("handles very large subscriber counts", () => {
      const largeAccount = {
        ...mockAccountData,
        total_subscribers: 1234567,
      };

      render(<AccountOverview account={largeAccount} />);

      expect(screen.getByText("1,234,567")).toBeInTheDocument();
    });

    it("handles zero percentage values in industry stats", () => {
      const zeroStatsAccount = {
        ...mockAccountData,
        industry_stats: {
          open_rate: 0,
          bounce_rate: 0,
          click_rate: 0,
        },
      };

      render(<AccountOverview account={zeroStatsAccount} />);

      // Check that all three stats show 0.0%
      const percentageElements = screen.getAllByText("0.0%");
      expect(percentageElements).toHaveLength(3); // One for each stat
    });
  });
});
