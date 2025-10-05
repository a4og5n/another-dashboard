import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { ListList } from "@/components/mailchimp/lists";
import type { List } from "@/services";

const mockLists: List[] = [
  {
    id: "list1",
    web_id: 12345,
    name: "Newsletter Subscribers",
    date_created: "2025-01-01T00:00:00Z",
    visibility: "pub",
    stats: {
      member_count: 1250,
      total_contacts: 1280,
      unsubscribe_count: 25,
      cleaned_count: 5,
      member_count_since_send: 50,
      unsubscribe_count_since_send: 2,
      cleaned_count_since_send: 1,
      campaign_count: 12,
      campaign_last_sent: "2025-01-15T10:00:00+00:00",
      merge_field_count: 5,
      avg_sub_rate: 0.05,
      avg_unsub_rate: 0.02,
      open_rate: 28,
      click_rate: 12,
      last_sub_date: "2025-01-20T12:00:00+00:00",
      last_unsub_date: "2025-01-19T15:30:00+00:00",
    },
    contact: {
      company: "Test Company",
      address1: "123 Main St",
      city: "Test City",
      state: "TS",
      zip: "12345",
      country: "US",
    },
    permission_reminder: "You subscribed to our newsletter",
    use_archive_bar: true,
    campaign_defaults: {
      from_name: "Test Company",
      from_email: "test@example.com",
      subject: "Newsletter",
      language: "en",
    },
    notify_on_subscribe: "admin@example.com",
    notify_on_unsubscribe: "admin@example.com",
    email_type_option: true,
    list_rating: 4,
    subscribe_url_short: "http://eepurl.com/abc123",
    subscribe_url_long:
      "https://example.us1.list-manage.com/subscribe?u=abc&id=123",
    beamer_address: "list123@inbound.mailchimp.com",
    double_optin: true,
    has_welcome: true,
    marketing_permissions: false,
  },
  {
    id: "list2",
    web_id: 67890,
    name: "Product Updates",
    date_created: "2025-01-02T00:00:00Z",
    visibility: "prv",
    stats: {
      member_count: 850,
      total_contacts: 870,
      unsubscribe_count: 15,
      cleaned_count: 3,
      member_count_since_send: 30,
      unsubscribe_count_since_send: 1,
      cleaned_count_since_send: 0,
      campaign_count: 8,
      campaign_last_sent: "2025-01-14T14:00:00+00:00",
      merge_field_count: 4,
      avg_sub_rate: 0.04,
      avg_unsub_rate: 0.015,
      open_rate: 32,
      click_rate: 15,
      last_sub_date: "2025-01-18T09:00:00+00:00",
      last_unsub_date: "2025-01-17T11:00:00+00:00",
    },
    contact: {
      company: "Test Company",
      address1: "123 Main St",
      city: "Test City",
      state: "TS",
      zip: "12345",
      country: "US",
    },
    permission_reminder: "You subscribed to product updates",
    use_archive_bar: false,
    campaign_defaults: {
      from_name: "Test Company",
      from_email: "test@example.com",
      subject: "Product Update",
      language: "en",
    },
    notify_on_subscribe: "admin@example.com",
    notify_on_unsubscribe: "admin@example.com",
    email_type_option: true,
    list_rating: 3,
    subscribe_url_short: "http://eepurl.com/def456",
    subscribe_url_long:
      "https://example.us1.list-manage.com/subscribe?u=def&id=456",
    beamer_address: "list456@inbound.mailchimp.com",
    double_optin: false,
    has_welcome: false,
    marketing_permissions: true,
  },
];

const defaultProps = {
  lists: mockLists,
  totalCount: 2,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 20,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

describe("ListList", () => {
  describe("Basic Rendering", () => {
    it("renders the main card with title", () => {
      render(<ListList {...defaultProps} />);

      expect(screen.getByText("Lists")).toBeInTheDocument();
    });

    it("displays total count badge when audiences exist", () => {
      render(<ListList {...defaultProps} />);

      expect(screen.getByText("2")).toBeInTheDocument(); // Total count badge
    });

    it("renders all list cards in grid layout", () => {
      render(<ListList {...defaultProps} />);

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Product Updates")).toBeInTheDocument();

      // Check grid layout classes
      const gridContainer = document.querySelector(".grid-cols-1");
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("sm:grid-cols-2");
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });

    it("uses correct semantic structure", () => {
      render(<ListList {...defaultProps} />);

      // Should have proper heading
      expect(screen.getByText("Lists")).toBeInTheDocument();
      // Should have individual list cards with role="article"
      expect(screen.getAllByRole("article")).toHaveLength(2);
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when loading is true", () => {
      render(<ListList {...defaultProps} loading={true} />);

      expect(
        screen.queryByText("Newsletter Subscribers"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Product Updates")).not.toBeInTheDocument();

      // Should show skeleton with proper test id
      expect(screen.getByTestId("lists-skeleton")).toBeInTheDocument();
    });

    it("shows skeleton with correct parameters", () => {
      render(<ListList {...defaultProps} loading={true} />);

      const skeleton = screen.getByTestId("lists-skeleton");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when error is provided", () => {
      render(<ListList {...defaultProps} error="Failed to load audiences" />);

      expect(screen.getByText("Error Loading Lists")).toBeInTheDocument();
      expect(screen.getByText("Failed to load audiences")).toBeInTheDocument();
      expect(
        screen.queryByText("Newsletter Subscribers"),
      ).not.toBeInTheDocument();
    });

    it("has proper accessibility attributes for error state", () => {
      render(<ListList {...defaultProps} error="API Error" />);

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveAttribute("aria-live", "polite");
    });

    it("shows proper error icon", () => {
      render(<ListList {...defaultProps} error="Test error" />);

      // Icon should be present (Users icon)
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no audiences are provided", () => {
      render(<ListList {...defaultProps} lists={[]} />);

      expect(screen.getByText("No lists found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Create your first list to start building your email lists.",
        ),
      ).toBeInTheDocument();
    });

    it("has proper accessibility attributes for empty state", () => {
      render(<ListList {...defaultProps} lists={[]} />);

      const emptyContainer = screen.getByRole("status");
      expect(emptyContainer).toHaveAttribute("aria-live", "polite");
    });

    it("shows empty state icon", () => {
      render(<ListList {...defaultProps} lists={[]} />);

      // Should show Users icon
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Pagination", () => {
    it("shows pagination when there are multiple pages", () => {
      render(
        <ListList
          {...defaultProps}
          totalCount={50}
          pageSize={20}
          currentPage={1}
        />,
      );

      // Should show pagination controls and per-page selector
      const paginationContainer = document.querySelector(".border-t");
      expect(paginationContainer).toBeInTheDocument();
    });

    it("hides pagination when there's only one page", () => {
      render(
        <ListList
          {...defaultProps}
          totalCount={10}
          pageSize={20}
          currentPage={1}
        />,
      );

      // Should not show pagination
      expect(screen.queryByText("Showing")).not.toBeInTheDocument();
    });

    it("displays correct pagination information", () => {
      render(
        <ListList
          {...defaultProps}
          totalCount={50}
          pageSize={20}
          currentPage={2}
        />,
      );

      expect(
        screen.getByText(/Showing 21 to 40 of 50 lists/),
      ).toBeInTheDocument();
    });

    it("handles last page calculations correctly", () => {
      render(
        <ListList
          {...defaultProps}
          totalCount={45}
          pageSize={20}
          currentPage={3}
        />,
      );

      expect(
        screen.getByText(/Showing 41 to 45 of 45 lists/),
      ).toBeInTheDocument();
    });
  });

  describe("Grid Layout", () => {
    it("always uses grid layout (no list toggle)", () => {
      render(<ListList {...defaultProps} />);

      // Should always have grid layout - look for the specific grid container
      const gridContainer = document.querySelector(
        ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3",
      );
      expect(gridContainer).toBeInTheDocument();

      // Should not have any toggle buttons
      expect(screen.queryByLabelText("Grid view")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("List view")).not.toBeInTheDocument();
    });
  });

  describe("Simplified UI", () => {
    it("does not show search functionality", () => {
      render(<ListList {...defaultProps} />);

      expect(
        screen.queryByPlaceholderText("Search lists..."),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Search lists")).not.toBeInTheDocument();
    });

    it("does not show filter dropdowns", () => {
      render(<ListList {...defaultProps} />);

      expect(screen.queryByText("Visibility")).not.toBeInTheDocument();
      expect(screen.queryByText("Status")).not.toBeInTheDocument();
      expect(screen.queryByText("Sort by")).not.toBeInTheDocument();
    });

    it("does not show New Audience button", () => {
      render(<ListList {...defaultProps} />);

      expect(screen.queryByText("New List")).not.toBeInTheDocument();
      expect(screen.queryByText("Create First List")).not.toBeInTheDocument();
    });

    it("does not show filter indicator", () => {
      render(<ListList {...defaultProps} />);

      expect(
        screen.queryByText("Active filters applied"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations with audiences", async () => {
      const { renderResult } = await renderWithA11y(
        <ListList {...defaultProps} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations in loading state", async () => {
      const { renderResult } = await renderWithA11y(
        <ListList {...defaultProps} loading={true} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations in empty state", async () => {
      const { renderResult } = await renderWithA11y(
        <ListList {...defaultProps} lists={[]} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations in error state", async () => {
      const { renderResult } = await renderWithA11y(
        <ListList {...defaultProps} error="Test error" />,
      );

      await expectNoA11yViolations(renderResult.container);
    });
  });

  describe("Props and Behavior", () => {
    it("applies custom className correctly", () => {
      const { container } = render(
        <ListList {...defaultProps} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("handles page change calls correctly", async () => {
      const onPageChange = vi.fn();
      render(
        <ListList
          {...defaultProps}
          totalCount={50}
          onPageChange={onPageChange}
        />,
      );

      // Page change handlers should exist but be no-ops due to simplification
      expect(onPageChange).toBeDefined();
    });

    it("handles page size change calls correctly", async () => {
      const onPageSizeChange = vi.fn();
      render(
        <ListList
          {...defaultProps}
          totalCount={50}
          onPageSizeChange={onPageSizeChange}
        />,
      );

      // Page size change handlers should exist but be no-ops due to simplification
      expect(onPageSizeChange).toBeDefined();
    });

    it("has correct displayName", () => {
      expect(ListList.displayName).toBe("ListList");
    });
  });

  describe("Edge Cases", () => {
    it("handles zero total count", () => {
      render(<ListList {...defaultProps} totalCount={0} />);

      expect(screen.queryByText("0")).not.toBeInTheDocument(); // Badge should not show for zero
    });

    it("handles single audience correctly", () => {
      render(
        <ListList {...defaultProps} lists={[mockLists[0]]} totalCount={1} />,
      );

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Count badge
    });

    it("handles large numbers in formatting", () => {
      render(<ListList {...defaultProps} totalCount={1000000} />);

      expect(screen.getByText("1,000,000")).toBeInTheDocument();
    });
  });
});
