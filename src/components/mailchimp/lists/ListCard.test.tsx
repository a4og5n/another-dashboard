import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { ListCard } from "./ListCard";
import type { List } from "@/services";

const mockList: List = {
  id: "list123",
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
};

describe("ListCard", () => {
  describe("Basic Rendering", () => {
    it("renders the list name", () => {
      render(<ListCard list={mockList} />);

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });

    it("displays the correct member count", () => {
      render(<ListCard list={mockList} />);

      expect(screen.getByText("1.3K")).toBeInTheDocument(); // Formatted member count
      expect(screen.getByText("Total Members")).toBeInTheDocument();
    });

    it("shows visibility badge", () => {
      render(<ListCard list={mockList} />);

      expect(screen.getByText("Public")).toBeInTheDocument(); // Visibility badge
    });

    it("has proper semantic structure", () => {
      render(<ListCard list={mockList} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute(
        "aria-labelledby",
        `list-${mockList.id}-title`,
      );
    });

    it("applies hover effects correctly", () => {
      const { container } = render(<ListCard list={mockList} />);

      const card = container.firstChild;
      expect(card).toHaveClass("hover:shadow-md");
      expect(card).toHaveClass("transition-shadow");
      expect(card).toHaveClass("duration-200");
    });
  });

  describe("Visibility Badges", () => {
    it("displays 'Public' badge for public lists", () => {
      render(<ListCard list={{ ...mockList, visibility: "pub" }} />);

      expect(screen.getByText("Public")).toBeInTheDocument();
    });

    it("displays 'Private' badge for private lists", () => {
      render(<ListCard list={{ ...mockList, visibility: "prv" }} />);

      expect(screen.getByText("Private")).toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("formats large member counts correctly", () => {
      const largeList = {
        ...mockList,
        stats: { ...mockList.stats, member_count: 1500000 },
      };

      render(<ListCard list={largeList} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
    });

    it("formats thousands correctly", () => {
      const thousandList = {
        ...mockList,
        stats: { ...mockList.stats, member_count: 25000 },
      };

      render(<ListCard list={thousandList} />);

      expect(screen.getByText("25.0K")).toBeInTheDocument();
    });

    it("displays small numbers without formatting", () => {
      const smallList = {
        ...mockList,
        stats: { ...mockList.stats, member_count: 125 },
      };

      render(<ListCard list={smallList} />);

      expect(screen.getByText("125")).toBeInTheDocument();
    });

    it("handles zero member count", () => {
      const zeroList = {
        ...mockList,
        stats: { ...mockList.stats, member_count: 0 },
      };

      render(<ListCard list={zeroList} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Growth Indicator", () => {
    it("shows positive growth indicator for high engagement", () => {
      const highEngagementList = {
        ...mockList,
        stats: {
          ...mockList.stats,
          open_rate: 75.0, // High open rate (>20% threshold)
        },
      };

      render(<ListCard list={highEngagementList} />);

      expect(screen.getByText("75.0%")).toBeInTheDocument();
    });

    it("shows negative growth indicator for low engagement", () => {
      const lowEngagementList = {
        ...mockList,
        stats: {
          ...mockList.stats,
          open_rate: 15.0, // Low open rate (<20% threshold)
        },
      };

      render(<ListCard list={lowEngagementList} />);

      expect(screen.getByText("15.0%")).toBeInTheDocument();
    });

    it("handles missing engagement rate gracefully", () => {
      const noEngagementList = {
        ...mockList,
        stats: {
          ...mockList.stats,
          open_rate: undefined,
        },
      };

      render(<ListCard list={noEngagementList} />);

      // Should not crash and should still show member count
      expect(screen.getByText("1.3K")).toBeInTheDocument();
    });
  });

  describe("Simplified UI - Removed Elements", () => {
    it("does not show action buttons (edit, archive, stats)", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByLabelText(/Edit/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Archive/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/View statistics/i),
      ).not.toBeInTheDocument();
    });

    it("does not show list rating", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByText("List Rating")).not.toBeInTheDocument();
      expect(screen.queryByText("4/5")).not.toBeInTheDocument();
      expect(screen.queryByText("★")).not.toBeInTheDocument();
    });

    it("does not show unsubscribed count", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByText("25")).not.toBeInTheDocument(); // unsubscribe count
      expect(screen.queryByText("Unsubscribed")).not.toBeInTheDocument();
    });

    it("does not show cleaned count", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByText("5")).not.toBeInTheDocument(); // cleaned count
      expect(screen.queryByText("Cleaned")).not.toBeInTheDocument();
    });

    it("does not show contact information", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
      expect(screen.queryByText("Test City, TS")).not.toBeInTheDocument();
    });

    it("does not show created date", () => {
      render(<ListCard list={mockList} />);

      expect(screen.queryByText(/Created:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Last synced:/)).not.toBeInTheDocument();
      expect(screen.queryByText("Jan 1, 2025")).not.toBeInTheDocument();
    });

    it("does not show additional stats sections", () => {
      render(<ListCard list={mockList} />);

      // Should not have multiple bordered sections
      const borderedSections = document.querySelectorAll(".border-t");
      expect(borderedSections.length).toBe(0);
    });
  });

  describe("Title and Name Display", () => {
    it("truncates long list names properly", () => {
      const longNameList = {
        ...mockList,
        name: "Very Long Audience Name That Should Be Truncated In The UI",
      };

      render(<ListCard list={longNameList} />);

      const titleElement = screen.getByTitle(
        "Very Long Audience Name That Should Be Truncated In The UI",
      );
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveClass("truncate");
    });

    it("has proper heading structure", () => {
      render(<ListCard list={mockList} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Newsletter Subscribers");
    });
  });

  describe("Icons and Visual Elements", () => {
    it("displays the Users icon for member count", () => {
      render(<ListCard list={mockList} />);

      // Users icon should be present
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("displays appropriate growth trend icons", () => {
      render(<ListCard list={mockList} />);

      // Should have trend icons when engagement rate is available
      const trendIcons = document.querySelectorAll("svg");
      expect(trendIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <ListCard list={mockList} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("has proper ARIA attributes", () => {
      render(<ListCard list={mockList} />);

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute(
        "aria-labelledby",
        `list-${mockList.id}-title`,
      );
    });

    it("has proper heading hierarchy", () => {
      render(<ListCard list={mockList} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      // The ID is on the CardTitle parent, not the h3 heading
      const cardTitle = document.querySelector(`#list-${mockList.id}-title`);
      expect(cardTitle).toBeInTheDocument();
    });
  });

  describe("Props and Behavior", () => {
    it("applies custom className correctly", () => {
      const { container } = render(
        <ListCard list={mockList} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has correct displayName", () => {
      expect(ListCard.displayName).toBe("ListCard");
    });
  });

  describe("Edge Cases", () => {
    it("handles list with minimal data", () => {
      const minimalList: List = {
        id: "minimal",
        web_id: 99999,
        name: "Minimal List",
        date_created: "2025-01-01T00:00:00Z",
        visibility: "pub" as const,
        stats: {
          member_count: 0,
          total_contacts: 0,
          unsubscribe_count: 0,
          cleaned_count: 0,
          member_count_since_send: 0,
          unsubscribe_count_since_send: 0,
          cleaned_count_since_send: 0,
          campaign_count: 0,
          campaign_last_sent: "2025-01-01T00:00:00+00:00",
          merge_field_count: 0,
          avg_sub_rate: 0,
          avg_unsub_rate: 0,
          open_rate: 0,
          click_rate: 0,
          last_sub_date: "2025-01-01T00:00:00+00:00",
          last_unsub_date: "2025-01-01T00:00:00+00:00",
        },
        contact: {
          company: "Test",
          address1: "123 Main",
          city: "Test City",
          state: "TS",
          zip: "12345",
          country: "US",
        },
        permission_reminder: "You subscribed",
        use_archive_bar: true,
        campaign_defaults: {
          from_name: "Test",
          from_email: "test@example.com",
          subject: "Test",
          language: "en",
        },
        email_type_option: true,
        list_rating: 3,
        subscribe_url_short: "http://eepurl.com/test",
        subscribe_url_long:
          "https://example.us1.list-manage.com/subscribe?u=test&id=test",
        beamer_address: "test@inbound.mailchimp.com",
        double_optin: false,
        has_welcome: false,
        marketing_permissions: false,
      };

      expect(() => {
        render(<ListCard list={minimalList} />);
      }).not.toThrow();

      expect(screen.getByText("Minimal List")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
