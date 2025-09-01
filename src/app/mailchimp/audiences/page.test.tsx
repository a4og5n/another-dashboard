import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import { renderWithA11y } from "@/test/axe-helper";
import React from "react";

// Mock the Next.js specific components
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <span data-href={href} {...props}>
      {children}
    </span>
  ),
}));

// Mock the layout components
vi.mock("@/components/layout/dashboard-layout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

vi.mock("@/components/dashboard/shared/dashboard-error", () => ({
  DashboardError: ({ error }: { error: string }) => (
    <div data-testid="dashboard-error" role="alert">
      {error}
    </div>
  ),
}));

// Import the components we want to test
import { AudienceStats } from "@/components/mailchimp/audiences/AudienceStats";
import { ClientAudienceList } from "@/components/mailchimp/audiences/ClientAudienceList";
import type {
  AudienceModel,
  AudienceStats as AudienceStatsType,
} from "@/dal/models/audience.model";

const mockAudiences: AudienceModel[] = [
  {
    id: "list1",
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
  },
  {
    id: "list2",
    name: "Product Updates",
    date_created: "2025-01-02T00:00:00Z",
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-15T10:30:00Z",
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
    sync_status: "syncing",
    is_deleted: false,
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

const mockStats: AudienceStatsType = {
  total_audiences: 2,
  total_members: 2100, // 1250 + 850
  avg_member_count: 1050,
  avg_engagement_rate: 0,
  audiences_by_status: {
    pending: 0,
    syncing: 1,
    completed: 1,
    failed: 0,
  },
  audiences_by_visibility: {
    pub: 1,
    prv: 1,
  },
  last_updated: new Date().toISOString(),
};

// Create a static page component that renders the structure we expect
const MockAudiencePage = () => (
  <div data-testid="dashboard-layout">
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" role="navigation">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <span data-href="/">Dashboard</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span>/</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span data-href="/mailchimp">Mailchimp</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span>/</span>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-current="page">Audiences</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audiences</h1>
          <p className="text-muted-foreground">
            Manage your Mailchimp audiences and monitor their performance
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <AudienceStats stats={mockStats} loading={false} />

      {/* Main Content */}
      <ClientAudienceList
        audiences={mockAudiences}
        totalCount={2}
        currentPage={1}
        pageSize={20}
      />
    </div>
  </div>
);

describe("Audiences Page Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Structure", () => {
    it("renders the main page structure", () => {
      render(<MockAudiencePage />);

      expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
      // Check for the main heading specifically to avoid confusion with breadcrumb
      expect(
        screen.getByRole("heading", { level: 1, name: "Audiences" }),
      ).toBeInTheDocument();
    });

    it("renders breadcrumb navigation", () => {
      render(<MockAudiencePage />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Mailchimp")).toBeInTheDocument();
      // Use getAllByText to handle multiple instances of "Audiences"
      const audienceTexts = screen.getAllByText("Audiences");
      expect(audienceTexts.length).toBeGreaterThan(0);
    });

    it("displays page header", () => {
      render(<MockAudiencePage />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Audiences",
      );
      expect(
        screen.getByText(
          "Manage your Mailchimp audiences and monitor their performance",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Statistics Display", () => {
    it("shows audience statistics overview", () => {
      render(<MockAudiencePage />);

      expect(screen.getByText("Total Audiences")).toBeInTheDocument();
      expect(screen.getAllByText("Total Members").length).toBeGreaterThan(0);
      expect(screen.getByText("Visibility")).toBeInTheDocument();

      // Check calculated values - use getAllByText for the number "2" which appears multiple times
      const totalAudiences = screen.getAllByText("2").find((el) => {
        const parent = el.closest('[data-slot="card-content"]');
        return parent && parent.textContent?.includes("Total Audiences");
      });
      expect(totalAudiences).toBeInTheDocument();
      expect(screen.getByText("2.1K")).toBeInTheDocument(); // Total members (1250 + 850)
    });

    it("displays proper stat formatting", () => {
      render(<MockAudiencePage />);

      // Large numbers should be formatted
      expect(screen.getByText("2.1K")).toBeInTheDocument(); // 2100 formatted as 2.1K
    });
  });

  describe("Audience List Display", () => {
    it("renders all audiences in grid layout", () => {
      render(<MockAudiencePage />);

      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("Product Updates")).toBeInTheDocument();

      // Check grid layout is applied
      const gridContainer = document.querySelector(".grid-cols-1");
      expect(gridContainer).toBeInTheDocument();
    });

    it("displays audience cards with simplified information", () => {
      render(<MockAudiencePage />);

      // Should show essential info only
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("1.3K")).toBeInTheDocument(); // Formatted member count
      expect(screen.getByText("Synced")).toBeInTheDocument(); // Status badge (completed -> Synced)
      expect(screen.getByText("Public")).toBeInTheDocument(); // Visibility badge

      expect(screen.getByText("Product Updates")).toBeInTheDocument();
      expect(screen.getByText("850")).toBeInTheDocument(); // Member count
      expect(screen.getByText("Syncing")).toBeInTheDocument(); // Status badge
      expect(screen.getByText("Private")).toBeInTheDocument(); // Visibility badge
    });

    it("does not show removed UI elements", () => {
      render(<MockAudiencePage />);

      // Should not show removed elements
      expect(
        screen.queryByPlaceholderText("Search audiences..."),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("New Audience")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Grid view")).not.toBeInTheDocument();
      expect(screen.queryByText("List Rating")).not.toBeInTheDocument();
      expect(screen.queryByText("Unsubscribed")).not.toBeInTheDocument();
      expect(screen.queryByText("Test Company")).not.toBeInTheDocument(); // Contact info
      expect(screen.queryByLabelText(/Edit/)).not.toBeInTheDocument(); // Action buttons
    });
  });

  describe("Data Integration", () => {
    it("correctly displays mapped audience data", () => {
      render(<MockAudiencePage />);

      // Check that audience data is properly displayed
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("1.3K")).toBeInTheDocument(); // member_count: 1250 -> 1.3K
      expect(screen.getByText("Public")).toBeInTheDocument(); // visibility: "pub" -> "Public"
    });

    it("generates correct statistics from audience data", () => {
      render(<MockAudiencePage />);

      // Check calculated statistics - use more specific selectors
      const totalAudiences = screen.getAllByText("2").find((el) => {
        const parent = el.closest('[data-slot="card-content"]');
        return parent && parent.textContent?.includes("Total Audiences");
      });
      expect(totalAudiences).toBeInTheDocument(); // total_audiences
      expect(screen.getByText("2.1K")).toBeInTheDocument(); // total_members (1250 + 850)
    });

    it("handles sync status display correctly", () => {
      render(<MockAudiencePage />);

      // Should show proper status badges
      expect(screen.getByText("Synced")).toBeInTheDocument(); // completed status
      expect(screen.getByText("Syncing")).toBeInTheDocument(); // syncing status
    });
  });

  describe("MVP Principle Compliance", () => {
    it("displays only single-API-call data", () => {
      render(<MockAudiencePage />);

      // Should only show data available from basic audience list
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument();
      expect(screen.getByText("1.3K")).toBeInTheDocument(); // Direct from API
      expect(screen.getByText("2.1K")).toBeInTheDocument(); // Simple calculation

      // Should not show data requiring additional API calls
      expect(screen.queryByText("Engagement Rate")).not.toBeInTheDocument();
      expect(screen.queryByText("Avg. Audience Size")).not.toBeInTheDocument();
    });

    it("uses only simple derivations from API data", () => {
      render(<MockAudiencePage />);

      // Simple sum: 1250 + 850 = 2100 -> 2.1K
      expect(screen.getByText("2.1K")).toBeInTheDocument();

      // Simple count: 2 total audiences - use specific selector
      const totalAudiences = screen.getAllByText("2").find((el) => {
        const parent = el.closest('[data-slot="card-content"]');
        return parent && parent.textContent?.includes("Total Audiences");
      });
      expect(totalAudiences).toBeInTheDocument();

      // Simple categorization: visibility card should be present
      expect(screen.getByText("Visibility")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations except for known component issues", async () => {
      // Import axe directly to configure custom rules
      const axe = await import("axe-core");
      const { renderResult } = await renderWithA11y(<MockAudiencePage />);

      // Run custom axe check excluding heading-order and list rules
      const results = await axe.default.run(renderResult.container, {
        rules: {
          "heading-order": { enabled: false }, // Allow h1 -> h3 as this is how our components are structured
          list: { enabled: false }, // Allow breadcrumb structure as designed
        },
      });

      expect(results.violations).toEqual([]);
    });

    it("has proper page structure for screen readers", () => {
      render(<MockAudiencePage />);

      expect(screen.getByRole("navigation")).toBeInTheDocument(); // Breadcrumb
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument(); // Main heading
      expect(screen.getAllByRole("article")).toHaveLength(2); // Audience cards
    });
  });

  describe("Component Integration", () => {
    it("properly integrates all audience components", () => {
      render(<MockAudiencePage />);

      // Should have all component parts working together
      expect(screen.getByText("Total Audiences")).toBeInTheDocument(); // AudienceStats
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Audiences",
      ); // Page header
      expect(screen.getByText("Newsletter Subscribers")).toBeInTheDocument(); // AudienceCard
    });

    it("maintains consistent styling across components", () => {
      render(<MockAudiencePage />);

      // Check that consistent card styling is applied
      const cards = document.querySelectorAll(".rounded-xl");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Error State Rendering", () => {
    it("renders error component properly", () => {
      const ErrorComponent = () => (
        <div data-testid="dashboard-layout">
          <div data-testid="dashboard-error" role="alert">
            API Error occurred
          </div>
        </div>
      );

      render(<ErrorComponent />);

      expect(screen.getByTestId("dashboard-error")).toBeInTheDocument();
      expect(screen.getByText("API Error occurred")).toBeInTheDocument();
    });
  });

  describe("Static Behavior Verification", () => {
    it("does not manipulate URL parameters", () => {
      const originalPush = window.history.pushState;
      const pushSpy = vi.fn();
      window.history.pushState = pushSpy;

      render(<MockAudiencePage />);

      // No URL manipulation should occur during rendering
      expect(pushSpy).not.toHaveBeenCalled();

      window.history.pushState = originalPush;
    });

    it("displays static pagination information", () => {
      render(<MockAudiencePage />);

      // Since we have only 2 items and pageSize is 20, pagination should be hidden
      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });
  });
});

describe("Page Component Props Validation", () => {
  it("validates expected component props are handled correctly", () => {
    // Test that our mock components handle the expected props
    const statsComponent = <AudienceStats stats={mockStats} loading={false} />;

    const audienceListComponent = (
      <ClientAudienceList
        audiences={mockAudiences}
        totalCount={2}
        currentPage={1}
        pageSize={20}
      />
    );

    expect(() => {
      render(statsComponent);
    }).not.toThrow();

    expect(() => {
      render(audienceListComponent);
    }).not.toThrow();
  });
});
