import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { AudienceCard } from "./AudienceCard";
import type { AudienceModel } from "@/dal/models/audience.model";

const mockAudience: AudienceModel = {
  id: "list123",
  name: "Newsletter Subscribers",
  date_created: "2025-01-01T00:00:00Z",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-15T10:30:00Z",
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
  sync_status: "completed",
  is_deleted: false,
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
  cached_stats: {
    last_updated: "2025-01-15T10:30:00Z",
    member_count: 1250,
    engagement_rate: 0.35,
  },
};

describe("AudienceCard", () => {
  describe("Basic Rendering", () => {
    it("renders the audience name", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
    });

    it("displays the correct member count", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.getByText("1.3K")).toBeInTheDocument(); // Formatted member count
      expect(screen.getByText("Total Members")).toBeInTheDocument();
    });

    it("shows status and visibility badges", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.getByText("Synced")).toBeInTheDocument(); // Status badge
      expect(screen.getByText("Public")).toBeInTheDocument(); // Visibility badge
    });

    it("has proper semantic structure", () => {
      render(<AudienceCard audience={mockAudience} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute(
        "aria-labelledby",
        `audience-${mockAudience.id}-title`,
      );
    });

    it("applies hover effects correctly", () => {
      const { container } = render(<AudienceCard audience={mockAudience} />);

      const card = container.firstChild;
      expect(card).toHaveClass("hover:shadow-md");
      expect(card).toHaveClass("transition-shadow");
      expect(card).toHaveClass("duration-200");
    });
  });

  describe("Status Badges", () => {
    it("displays 'Synced' badge for completed status", () => {
      render(
        <AudienceCard
          audience={{ ...mockAudience, sync_status: "completed" }}
        />,
      );

      const badge = screen.getByText("Synced");
      expect(badge).toBeInTheDocument();
    });

    it("displays 'Syncing' badge for syncing status", () => {
      render(
        <AudienceCard audience={{ ...mockAudience, sync_status: "syncing" }} />,
      );

      const badge = screen.getByText("Syncing");
      expect(badge).toBeInTheDocument();
    });

    it("displays 'Failed' badge for failed status", () => {
      render(
        <AudienceCard audience={{ ...mockAudience, sync_status: "failed" }} />,
      );

      const badge = screen.getByText("Failed");
      expect(badge).toBeInTheDocument();
    });

    it("displays 'Pending' badge for pending status", () => {
      render(
        <AudienceCard audience={{ ...mockAudience, sync_status: "pending" }} />,
      );

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Visibility Badges", () => {
    it("displays 'Public' badge for public audiences", () => {
      render(
        <AudienceCard audience={{ ...mockAudience, visibility: "pub" }} />,
      );

      expect(screen.getByText("Public")).toBeInTheDocument();
    });

    it("displays 'Private' badge for private audiences", () => {
      render(
        <AudienceCard audience={{ ...mockAudience, visibility: "prv" }} />,
      );

      expect(screen.getByText("Private")).toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("formats large member counts correctly", () => {
      const largeAudience = {
        ...mockAudience,
        stats: { ...mockAudience.stats, member_count: 1500000 },
      };

      render(<AudienceCard audience={largeAudience} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
    });

    it("formats thousands correctly", () => {
      const thousandAudience = {
        ...mockAudience,
        stats: { ...mockAudience.stats, member_count: 25000 },
      };

      render(<AudienceCard audience={thousandAudience} />);

      expect(screen.getByText("25.0K")).toBeInTheDocument();
    });

    it("displays small numbers without formatting", () => {
      const smallAudience = {
        ...mockAudience,
        stats: { ...mockAudience.stats, member_count: 125 },
      };

      render(<AudienceCard audience={smallAudience} />);

      expect(screen.getByText("125")).toBeInTheDocument();
    });

    it("handles zero member count", () => {
      const zeroAudience = {
        ...mockAudience,
        stats: { ...mockAudience.stats, member_count: 0 },
      };

      render(<AudienceCard audience={zeroAudience} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Growth Indicator", () => {
    it("shows positive growth indicator for high engagement", () => {
      const highEngagementAudience = {
        ...mockAudience,
        cached_stats: {
          last_updated: "2025-01-15T10:30:00Z",
          member_count: 1250,
          engagement_rate: 0.75,
        },
      };

      render(<AudienceCard audience={highEngagementAudience} />);

      expect(screen.getByText("75.0%")).toBeInTheDocument();
    });

    it("shows negative growth indicator for low engagement", () => {
      const lowEngagementAudience = {
        ...mockAudience,
        cached_stats: {
          last_updated: "2025-01-15T10:30:00Z",
          member_count: 1250,
          engagement_rate: 0.25,
        },
      };

      render(<AudienceCard audience={lowEngagementAudience} />);

      expect(screen.getByText("25.0%")).toBeInTheDocument();
    });

    it("handles missing engagement rate gracefully", () => {
      const noEngagementAudience = {
        ...mockAudience,
        cached_stats: undefined,
      };

      render(<AudienceCard audience={noEngagementAudience} />);

      // Should not crash and should still show member count
      expect(screen.getByText("1.3K")).toBeInTheDocument();
    });
  });

  describe("Simplified UI - Removed Elements", () => {
    it("does not show action buttons (edit, archive, stats)", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByLabelText(/Edit/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Archive/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/View statistics/i),
      ).not.toBeInTheDocument();
    });

    it("does not show list rating", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByText("List Rating")).not.toBeInTheDocument();
      expect(screen.queryByText("4/5")).not.toBeInTheDocument();
      expect(screen.queryByText("★")).not.toBeInTheDocument();
    });

    it("does not show unsubscribed count", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByText("25")).not.toBeInTheDocument(); // unsubscribe count
      expect(screen.queryByText("Unsubscribed")).not.toBeInTheDocument();
    });

    it("does not show cleaned count", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByText("5")).not.toBeInTheDocument(); // cleaned count
      expect(screen.queryByText("Cleaned")).not.toBeInTheDocument();
    });

    it("does not show contact information", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
      expect(screen.queryByText("Test City, TS")).not.toBeInTheDocument();
    });

    it("does not show created date", () => {
      render(<AudienceCard audience={mockAudience} />);

      expect(screen.queryByText(/Created:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Last synced:/)).not.toBeInTheDocument();
      expect(screen.queryByText("Jan 1, 2025")).not.toBeInTheDocument();
    });

    it("does not show additional stats sections", () => {
      render(<AudienceCard audience={mockAudience} />);

      // Should not have multiple bordered sections
      const borderedSections = document.querySelectorAll(".border-t");
      expect(borderedSections.length).toBe(0);
    });
  });

  describe("Title and Name Display", () => {
    it("truncates long audience names properly", () => {
      const longNameAudience = {
        ...mockAudience,
        name: "Very Long Audience Name That Should Be Truncated In The UI",
      };

      render(<AudienceCard audience={longNameAudience} />);

      const titleElement = screen.getByTitle(
        "Very Long Audience Name That Should Be Truncated In The UI",
      );
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveClass("truncate");
    });

    it("has proper heading structure", () => {
      render(<AudienceCard audience={mockAudience} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Newsletter Subscribers");
    });
  });

  describe("Icons and Visual Elements", () => {
    it("displays the Users icon for member count", () => {
      render(<AudienceCard audience={mockAudience} />);

      // Users icon should be present
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("displays appropriate growth trend icons", () => {
      render(<AudienceCard audience={mockAudience} />);

      // Should have trend icons when engagement rate is available
      const trendIcons = document.querySelectorAll("svg");
      expect(trendIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <AudienceCard audience={mockAudience} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    it("has proper ARIA attributes", () => {
      render(<AudienceCard audience={mockAudience} />);

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute(
        "aria-labelledby",
        `audience-${mockAudience.id}-title`,
      );
    });

    it("has proper heading hierarchy", () => {
      render(<AudienceCard audience={mockAudience} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      // The ID is on the CardTitle parent, not the h3 heading
      const cardTitle = document.querySelector(
        `#audience-${mockAudience.id}-title`,
      );
      expect(cardTitle).toBeInTheDocument();
    });
  });

  describe("Props and Behavior", () => {
    it("applies custom className correctly", () => {
      const { container } = render(
        <AudienceCard audience={mockAudience} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has correct displayName", () => {
      expect(AudienceCard.displayName).toBe("AudienceCard");
    });
  });

  describe("Edge Cases", () => {
    it("handles audience with minimal data", () => {
      const minimalAudience = {
        id: "minimal",
        name: "Minimal Audience",
        visibility: "pub" as const,
        sync_status: "completed" as const,
        stats: {
          member_count: 0,
        },
      } as AudienceModel;

      expect(() => {
        render(<AudienceCard audience={minimalAudience} />);
      }).not.toThrow();

      expect(screen.getByText("Minimal Audience")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles missing cached stats", () => {
      const noCachedStatsAudience = {
        ...mockAudience,
        cached_stats: undefined,
      };

      render(<AudienceCard audience={noCachedStatsAudience} />);

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("1.3K")).toBeInTheDocument();
    });

    it("handles all sync status values", () => {
      const statuses: AudienceModel["sync_status"][] = [
        "pending",
        "syncing",
        "completed",
        "failed",
      ];

      statuses.forEach((status) => {
        const { unmount } = render(
          <AudienceCard audience={{ ...mockAudience, sync_status: status }} />,
        );
        // Each status should render without error
        expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
        unmount(); // Clean up between renders to avoid multiple elements
      });
    });
  });
});
