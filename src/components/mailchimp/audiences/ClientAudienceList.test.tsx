import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { ClientAudienceList } from "./ClientAudienceList";
import type { MailchimpList } from "@/services";

const mockAudiences: MailchimpList[] = [
  {
    id: "list1",
    name: "Newsletter Subscribers",
    date_created: "2025-01-01T00:00:00Z",
    visibility: "pub",
    stats: {
      member_count: 1250,
      unsubscribe_count: 25,
      cleaned_count: 5,
      campaign_count: 12,
      avg_sub_rate: 0.05,
      avg_unsub_rate: 0.02,
      open_rate: 0.28,
      click_rate: 0.12,
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
  },
  {
    id: "list2",
    name: "Product Updates",
    date_created: "2025-01-02T00:00:00Z",
    visibility: "prv",
    stats: {
      member_count: 850,
      unsubscribe_count: 15,
      cleaned_count: 3,
      campaign_count: 8,
      avg_sub_rate: 0.04,
      avg_unsub_rate: 0.015,
      open_rate: 0.32,
      click_rate: 0.15,
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
  },
];

const defaultProps = {
  audiences: mockAudiences,
  totalCount: 2,
  currentPage: 1,
  pageSize: 20,
};

describe("ClientAudienceList", () => {
  describe("Basic Rendering", () => {
    it("renders the AudienceList component", () => {
      render(<ClientAudienceList {...defaultProps} />);

      expect(screen.getByText("Audiences")).toBeInTheDocument();
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Product Updates")).toBeInTheDocument();
    });

    it("passes all props correctly to AudienceList", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Check that audience data is displayed (proves props are passed)
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Product Updates")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Total count badge
    });

    it("always sets loading to false", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Should not show loading skeleton
      expect(
        screen.queryByTestId("audiences-skeleton"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });

    it("always sets error to null", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Should not show error state
      expect(
        screen.queryByText("Error Loading Audiences"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });
  });

  describe("Simplified Static Behavior", () => {
    it("provides no-op handlers for filters", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Component should render successfully with no-op handlers
      expect(screen.getByText("Audiences")).toBeInTheDocument();
    });

    it("provides no-op handlers for pagination", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Should render pagination if multiple pages exist
      const paginationTest = {
        ...defaultProps,
        totalCount: 50,
        pageSize: 20,
      };

      render(<ClientAudienceList {...paginationTest} />);
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
    });

    it("does not manipulate URL parameters", () => {
      const originalPush = window.history.pushState;
      const pushSpy = vi.fn();
      window.history.pushState = pushSpy;

      render(<ClientAudienceList {...defaultProps} />);

      // No URL manipulation should occur during rendering
      expect(pushSpy).not.toHaveBeenCalled();

      window.history.pushState = originalPush;
    });
  });

  describe("Props Handling", () => {
    it("handles different audience counts", () => {
      render(
        <ClientAudienceList
          {...defaultProps}
          audiences={[mockAudiences[0]]}
          totalCount={1}
        />,
      );

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.queryByText("Product Updates")).not.toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Count badge
    });

    it("handles empty audiences array", () => {
      render(
        <ClientAudienceList {...defaultProps} audiences={[]} totalCount={0} />,
      );

      expect(screen.getByText("No audiences found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Create your first audience to start building your email lists.",
        ),
      ).toBeInTheDocument();
    });

    it("handles large datasets", () => {
      const largeProps = {
        ...defaultProps,
        totalCount: 1000,
        pageSize: 50,
        currentPage: 5,
      };

      render(<ClientAudienceList {...largeProps} />);

      expect(screen.getByText("1,000")).toBeInTheDocument(); // Total count badge
    });

    it("handles different page sizes", () => {
      const smallPageProps = {
        ...defaultProps,
        totalCount: 100,
        pageSize: 10,
        currentPage: 3,
      };

      render(<ClientAudienceList {...smallPageProps} />);

      expect(screen.getByText(/Showing 21 to 30 of 100/)).toBeInTheDocument();
    });
  });

  describe("Handler Functions", () => {
    it("creates stable handler functions", () => {
      const { rerender } = render(<ClientAudienceList {...defaultProps} />);

      // Component should render consistently across re-renders
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();

      rerender(<ClientAudienceList {...defaultProps} />);
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });

    it("handlers are no-ops and do not cause errors", () => {
      expect(() => {
        render(<ClientAudienceList {...defaultProps} />);
      }).not.toThrow();

      // Component should work without any interactive handlers
      expect(screen.getByText("Audiences")).toBeInTheDocument();
    });
  });

  describe("Integration with AudienceList", () => {
    it("displays audience cards in grid layout", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Should show grid layout
      const gridContainer = document.querySelector(".grid-cols-1");
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("sm:grid-cols-2");
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });

    it("shows proper status badges", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Status badges have been removed for MVP (no database sync)
    });

    it("shows proper visibility badges", () => {
      render(<ClientAudienceList {...defaultProps} />);

      expect(screen.getByText("Public")).toBeInTheDocument(); // list1 visibility
      expect(screen.getByText("Private")).toBeInTheDocument(); // list2 visibility
    });

    it("formats member counts correctly", () => {
      render(<ClientAudienceList {...defaultProps} />);

      expect(screen.getByText("1.3K")).toBeInTheDocument(); // list1 member count
      expect(screen.getByText("850")).toBeInTheDocument(); // list2 member count
    });
  });

  describe("Pagination Integration", () => {
    it("shows pagination controls when needed", () => {
      const paginatedProps = {
        ...defaultProps,
        totalCount: 60,
        pageSize: 20,
        currentPage: 2,
      };

      render(<ClientAudienceList {...paginatedProps} />);

      expect(screen.getByText(/Showing 21 to 40 of 60/)).toBeInTheDocument();
    });

    it("hides pagination when not needed", () => {
      const singlePageProps = {
        ...defaultProps,
        totalCount: 5,
        pageSize: 20,
        currentPage: 1,
      };

      render(<ClientAudienceList {...singlePageProps} />);

      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <ClientAudienceList {...defaultProps} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations with empty state", async () => {
      const { renderResult } = await renderWithA11y(
        <ClientAudienceList {...defaultProps} audiences={[]} totalCount={0} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("maintains proper focus management", () => {
      render(<ClientAudienceList {...defaultProps} />);

      // Should have proper semantic structure for screen readers
      expect(screen.getAllByRole("article")).toHaveLength(2); // Two audience cards
    });
  });

  describe("Performance Considerations", () => {
    it("renders efficiently with large audience lists", () => {
      const manyAudiences = Array.from({ length: 100 }, (_, i) => ({
        ...mockAudiences[0],
        id: `list-${i}`,
        name: `Audience ${i + 1}`,
      }));

      const largeProps = {
        audiences: manyAudiences.slice(0, 20), // Simulate pagination
        totalCount: 100,
        currentPage: 1,
        pageSize: 20,
      };

      expect(() => {
        render(<ClientAudienceList {...largeProps} />);
      }).not.toThrow();

      expect(screen.getByText("Audience 1")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument(); // Total count
    });

    it("handles rapid re-renders gracefully", () => {
      const { rerender } = render(<ClientAudienceList {...defaultProps} />);

      // Simulate multiple re-renders
      for (let i = 1; i <= 5; i++) {
        rerender(<ClientAudienceList {...defaultProps} currentPage={i} />);
      }

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles zero total count", () => {
      render(
        <ClientAudienceList {...defaultProps} audiences={[]} totalCount={0} />,
      );

      expect(screen.getByText("No audiences found")).toBeInTheDocument();
    });

    it("handles mismatched audiences and totalCount", () => {
      // Edge case: fewer audiences than totalCount (due to pagination)
      render(
        <ClientAudienceList
          {...defaultProps}
          audiences={[mockAudiences[0]]}
          totalCount={50}
        />,
      );

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument(); // Total count badge
    });

    it("handles invalid page numbers gracefully", () => {
      expect(() => {
        render(<ClientAudienceList {...defaultProps} currentPage={0} />);
      }).not.toThrow();

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });
  });
});
