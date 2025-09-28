/**
 * Reports Overview Component Test Suite
 * Tests for the ReportsOverview dashboard component
 *
 * Issue #127: Reports component testing
 * Tests rendering, interaction, pagination, and accessibility
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportsOverview } from "@/components/dashboard/reports-overview";
import type { MailchimpCampaignReport } from "@/types/mailchimp";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    title,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    title?: string;
  }) => (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  ),
}));

describe("ReportsOverview Component", () => {
  const mockReports: MailchimpCampaignReport[] = [
    {
      id: "campaign123",
      campaign_title: "Newsletter Campaign",
      type: "regular",
      list_id: "list123",
      list_is_active: true,
      list_name: "Newsletter Subscribers",
      subject_line: "Monthly Newsletter",
      preview_text: "Check out this month's updates",
      emails_sent: 1000,
      abuse_reports: 1,
      unsubscribed: 5,
      send_time: "2023-11-01T10:00:00Z",
      bounces: {
        hard_bounces: 2,
        soft_bounces: 3,
        syntax_errors: 1,
      },
      forwards: {
        forwards_count: 15,
        forwards_opens: 8,
      },
      opens: {
        opens_total: 350,
        unique_opens: 300,
        open_rate: 0.3,
        last_open: "2023-11-02T14:30:00Z",
      },
      clicks: {
        clicks_total: 120,
        unique_clicks: 100,
        unique_subscriber_clicks: 95,
        click_rate: 0.1,
        last_click: "2023-11-02T16:00:00Z",
      },
      facebook_likes: {
        recipient_likes: 25,
        unique_likes: 20,
        facebook_likes: 30,
      },
      industry_stats: {
        type: "E-commerce",
        open_rate: 0.25,
        click_rate: 0.08,
        bounce_rate: 0.02,
        unopen_rate: 0.7,
        unsub_rate: 0.005,
        abuse_rate: 0.001,
      },
      list_stats: {
        sub_rate: 0.1,
        unsub_rate: 0.005,
        open_rate: 0.28,
        click_rate: 0.09,
      },
      share_report: {
        share_url: "https://example.com/share/123",
        share_password: "password123",
      },
      ecommerce: {
        total_orders: 25,
        total_spent: 1250.5,
        total_revenue: 1250.5,
      },
      delivery_status: {
        enabled: true,
        can_cancel: false,
        status: "delivered",
        emails_sent: 1000,
        emails_canceled: 0,
      },
    },
    {
      id: "campaign456",
      campaign_title: "Product Launch",
      type: "plain-text",
      list_id: "list456",
      list_is_active: true,
      list_name: "Product Updates",
      subject_line: "New Product Launch",
      preview_text: "Introducing our latest product",
      emails_sent: 500,
      abuse_reports: 0,
      unsubscribed: 2,
      send_time: "2023-10-15T14:00:00Z",
      bounces: {
        hard_bounces: 1,
        soft_bounces: 2,
        syntax_errors: 0,
      },
      forwards: {
        forwards_count: 8,
        forwards_opens: 6,
      },
      opens: {
        opens_total: 200,
        unique_opens: 180,
        open_rate: 0.36,
        last_open: "2023-10-16T10:00:00Z",
      },
      clicks: {
        clicks_total: 75,
        unique_clicks: 60,
        unique_subscriber_clicks: 55,
        click_rate: 0.12,
        last_click: "2023-10-16T12:00:00Z",
      },
      facebook_likes: {
        recipient_likes: 10,
        unique_likes: 8,
        facebook_likes: 12,
      },
      industry_stats: {
        type: "Technology",
        open_rate: 0.22,
        click_rate: 0.06,
        bounce_rate: 0.015,
        unopen_rate: 0.78,
        unsub_rate: 0.003,
        abuse_rate: 0.001,
      },
      list_stats: {
        sub_rate: 0.05,
        unsub_rate: 0.003,
        open_rate: 0.25,
        click_rate: 0.08,
      },
      share_report: {
        share_url: "https://example.com/share/456",
        share_password: "test123",
      },
      ecommerce: {
        total_orders: 15,
        total_spent: 750.0,
        total_revenue: 750.0,
      },
      delivery_status: {
        enabled: true,
        can_cancel: false,
        status: "delivered",
        emails_sent: 500,
        emails_canceled: 0,
      },
    },
  ];

  const defaultProps = {
    reports: mockReports,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 2,
    perPage: 10,
    perPageOptions: [10, 20, 50],
    basePath: "/mailchimp/campaigns",
    additionalParams: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the reports table with correct headers", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("Campaign Reports")).toBeInTheDocument();
      expect(screen.getByText("Campaign Title")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("List Name")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Emails Sent")).toBeInTheDocument();
      expect(screen.getByText("Abuse Reports")).toBeInTheDocument();
      expect(screen.getByText("Unsubscribed")).toBeInTheDocument();
      expect(screen.getByText("Sent Date")).toBeInTheDocument();
    });

    it("should render all reports in the table", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("Newsletter Campaign")).toBeInTheDocument();
      expect(screen.getByText("Product Launch")).toBeInTheDocument();
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Product Updates")).toBeInTheDocument();
    });

    it("should display formatted data correctly", () => {
      render(<ReportsOverview {...defaultProps} />);

      // Check formatted numbers
      expect(screen.getByText("1,000")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();

      // Check dates
      expect(screen.getByText("Nov 1, 2023")).toBeInTheDocument();
      expect(screen.getByText("Oct 15, 2023")).toBeInTheDocument();
    });

    it("should render campaign type badges", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("regular")).toBeInTheDocument();
      expect(screen.getByText("plain-text")).toBeInTheDocument();
    });

    it("should render status badges as 'Sent'", () => {
      render(<ReportsOverview {...defaultProps} />);

      const sentBadges = screen.getAllByText("Sent");
      expect(sentBadges).toHaveLength(2);
    });
  });

  describe("Loading State", () => {
    it("should show skeleton loader when loading", () => {
      render(<ReportsOverview {...defaultProps} loading={true} />);

      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
      expect(screen.getByText("Campaign Reports")).toBeInTheDocument();
    });

    it("should not show reports table when loading", () => {
      render(<ReportsOverview {...defaultProps} loading={true} />);

      expect(screen.queryByText("Newsletter Campaign")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should display error message when there's an error", () => {
      const errorMessage = "Failed to load reports";
      render(<ReportsOverview {...defaultProps} error={errorMessage} />);

      expect(screen.getByText("Error loading reports")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should not show reports table when there's an error", () => {
      render(
        <ReportsOverview {...defaultProps} error="Something went wrong" />,
      );

      expect(screen.queryByText("Newsletter Campaign")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show empty state message when no reports", () => {
      render(<ReportsOverview {...defaultProps} reports={[]} />);

      expect(screen.getByText("No campaign reports found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Send campaigns to view them here with performance metrics.",
        ),
      ).toBeInTheDocument();
    });

    it("should not show pagination when no reports", () => {
      render(<ReportsOverview {...defaultProps} reports={[]} />);

      expect(screen.queryByText("Show")).not.toBeInTheDocument();
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("should render campaign title as a link", () => {
      render(<ReportsOverview {...defaultProps} />);

      const campaignLink = screen.getByRole("link", {
        name: "Newsletter Campaign",
      });
      expect(campaignLink).toHaveAttribute(
        "href",
        "/mailchimp/campaigns/campaign123",
      );
      expect(campaignLink).toHaveClass("hover:underline");
    });

    it("should render list name as a link", () => {
      render(<ReportsOverview {...defaultProps} />);

      const listLink = screen.getByRole("link", {
        name: "Newsletter Subscribers",
      });
      expect(listLink).toHaveAttribute("href", "/mailchimp/audiences/list123");
      expect(listLink).toHaveClass("hover:underline");
    });

    it("should render all campaign links correctly", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(
        screen.getByRole("link", { name: "Newsletter Campaign" }),
      ).toHaveAttribute("href", "/mailchimp/campaigns/campaign123");
      expect(
        screen.getByRole("link", { name: "Product Launch" }),
      ).toHaveAttribute("href", "/mailchimp/campaigns/campaign456");
    });

    it("should render all list links correctly", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(
        screen.getByRole("link", { name: "Newsletter Subscribers" }),
      ).toHaveAttribute("href", "/mailchimp/audiences/list123");
      expect(
        screen.getByRole("link", { name: "Product Updates" }),
      ).toHaveAttribute("href", "/mailchimp/audiences/list456");
    });
  });

  describe("Pagination", () => {
    it("should render pagination controls", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should render pagination controls when there are multiple pages", async () => {
      render(<ReportsOverview {...defaultProps} totalPages={5} />);

      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
    });

    it("should disable previous button on first page", () => {
      render(<ReportsOverview {...defaultProps} currentPage={1} />);

      const previousButton = screen.getByText("Previous");
      expect(previousButton.closest("button")).toBeDisabled();
    });

    it("should disable next button on last page", () => {
      render(
        <ReportsOverview {...defaultProps} currentPage={2} totalPages={2} />,
      );

      const nextButton = screen.getByText("Next");
      expect(nextButton.closest("button")).toBeDisabled();
    });
  });

  describe("Per Page Selector", () => {
    it("should render per page selector", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("Show")).toBeInTheDocument();
      expect(screen.getByText("campaigns per page")).toBeInTheDocument();
    });

    it("should display current per page value", () => {
      render(<ReportsOverview {...defaultProps} perPage={20} />);

      expect(screen.getByText("20")).toBeInTheDocument();
    });

    it("should have per page selector with proper attributes", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for empty state", () => {
      render(<ReportsOverview {...defaultProps} reports={[]} />);

      const emptyState = screen.getByRole("status");
      expect(emptyState).toHaveAttribute("aria-live", "polite");
      expect(emptyState).toHaveAttribute("aria-atomic", "true");
    });

    it("should have proper table structure", () => {
      render(<ReportsOverview {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders).toHaveLength(9);

      const rows = screen.getAllByRole("row");
      // 1 header row + 2 data rows
      expect(rows).toHaveLength(3);
    });

    it("should have accessible link text", () => {
      render(<ReportsOverview {...defaultProps} />);

      const campaignLink = screen.getByRole("link", {
        name: "Newsletter Campaign",
      });
      expect(campaignLink).toHaveAttribute("title", "Newsletter Campaign");

      const listLink = screen.getByRole("link", {
        name: "Newsletter Subscribers",
      });
      expect(listLink).toHaveAttribute("title", "Newsletter Subscribers");
    });

    it("should maintain focus management", async () => {
      const user = userEvent.setup();
      render(<ReportsOverview {...defaultProps} />);

      // Test that links are focusable
      const firstCampaignLink = screen.getByRole("link", {
        name: "Newsletter Campaign",
      });
      await user.tab();
      expect(firstCampaignLink).toHaveFocus();
    });
  });

  describe("Data Formatting", () => {
    it("should format numbers correctly", () => {
      render(<ReportsOverview {...defaultProps} />);

      // Large numbers should be comma-separated
      expect(screen.getByText("1,000")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();

      // Small numbers
      expect(screen.getByText("1")).toBeInTheDocument(); // abuse reports
      expect(screen.getByText("0")).toBeInTheDocument(); // abuse reports for second campaign
    });

    it("should format dates consistently", () => {
      render(<ReportsOverview {...defaultProps} />);

      expect(screen.getByText("Nov 1, 2023")).toBeInTheDocument();
      expect(screen.getByText("Oct 15, 2023")).toBeInTheDocument();
    });

    it("should handle edge case data", () => {
      const edgeCaseReports = [
        {
          ...mockReports[0],
          campaign_title:
            "Very Long Campaign Title That Should Be Truncated In The Table Cell",
          list_name: "Very Long List Name That Should Also Be Truncated",
          emails_sent: 0,
          abuse_reports: 0,
          unsubscribed: 0,
        },
      ];

      render(<ReportsOverview {...defaultProps} reports={edgeCaseReports} />);

      expect(screen.getAllByText("0")).toHaveLength(3);
    });
  });

  describe("Component Props", () => {
    it("should handle empty additional params", () => {
      const propsWithEmptyParams = {
        ...defaultProps,
        additionalParams: {},
      };

      expect(() =>
        render(<ReportsOverview {...propsWithEmptyParams} />),
      ).not.toThrow();
    });

    it("should use default values for optional props", () => {
      const minimalProps = {
        reports: mockReports,
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        perPageOptions: [10, 20, 50],
        basePath: "/test",
      };

      expect(() => render(<ReportsOverview {...minimalProps} />)).not.toThrow();
    });

    it("should handle totalPages of 1", () => {
      render(<ReportsOverview {...defaultProps} totalPages={1} />);

      // Pagination should be hidden when there's only one page
      expect(screen.queryByText("Page 1 of 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
      expect(screen.queryByText("Next")).not.toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render large datasets efficiently", () => {
      const largeDataset = Array.from({ length: 50 }, (_, i) => ({
        ...mockReports[0],
        id: `campaign${i}`,
        campaign_title: `Campaign ${i}`,
        list_id: `list${i}`,
        list_name: `List ${i}`,
      }));

      const startTime = performance.now();
      render(<ReportsOverview {...defaultProps} reports={largeDataset} />);
      const endTime = performance.now();

      // Should render within reasonable time (< 1000ms for testing environment)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
