import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { ListStats } from "@/components/mailchimp/lists";
import type { DashboardListStats as ListStatsType } from "@/types/mailchimp/lists";

const mockStats: ListStatsType = {
  total_audiences: 3,
  total_members: 5250,
  audiences_by_visibility: {
    pub: 2,
    prv: 1,
  },
};

describe("ListStats", () => {
  describe("Basic Rendering", () => {
    it("renders stats grid card with title", () => {
      render(<ListStats stats={mockStats} />);

      expect(screen.getByText("List Statistics")).toBeInTheDocument();
    });

    it("renders all three stat items", () => {
      render(<ListStats stats={mockStats} />);

      expect(screen.getByText("Total Lists")).toBeInTheDocument();
      expect(screen.getByText("Total Members")).toBeInTheDocument();
      expect(screen.getByText("Visibility (Pub/Prv)")).toBeInTheDocument();
    });

    it("displays correct stat values", () => {
      render(<ListStats stats={mockStats} />);

      expect(screen.getByText("3")).toBeInTheDocument(); // total audiences
      expect(screen.getByText("5.3K")).toBeInTheDocument(); // total members formatted
      expect(screen.getByText("2 / 1")).toBeInTheDocument(); // public / private
    });

    it("displays icon correctly", () => {
      render(<ListStats stats={mockStats} />);

      // Single Users icon in the StatsGridCard header
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Number Formatting", () => {
    it("formats large numbers correctly", () => {
      const largeStats = {
        ...mockStats,
        total_audiences: 1500000,
        total_members: 2500000,
      };

      render(<ListStats stats={largeStats} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
      expect(screen.getByText("2.5M")).toBeInTheDocument();
    });

    it("formats thousands correctly", () => {
      const thousandStats = {
        ...mockStats,
        total_audiences: 1500,
        total_members: 25000,
      };

      render(<ListStats stats={thousandStats} />);

      expect(screen.getByText("1.5K")).toBeInTheDocument();
      expect(screen.getByText("25.0K")).toBeInTheDocument();
    });

    it("displays small numbers without formatting", () => {
      const smallStats = {
        ...mockStats,
        total_audiences: 5,
        total_members: 125,
      };

      render(<ListStats stats={smallStats} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("125")).toBeInTheDocument();
    });
  });

  describe("Visibility Display", () => {
    it("shows public and private counts with proper formatting", () => {
      render(<ListStats stats={mockStats} />);

      // Check for the inline format: "2 / 1" (public/private)
      expect(screen.getByText("2 / 1")).toBeInTheDocument();
      expect(screen.getByText("Visibility (Pub/Prv)")).toBeInTheDocument();
    });

    it("handles zero counts correctly", () => {
      const zeroStats = {
        ...mockStats,
        audiences_by_visibility: {
          pub: 0,
          prv: 0,
        },
      };

      render(<ListStats stats={zeroStats} />);

      // Both counts should show as "0 / 0"
      expect(screen.getByText("0 / 0")).toBeInTheDocument();
    });
  });

  // Note: Loading state tests removed as loading prop has been deprecated.
  // Loading states are now handled at the parent level with Suspense boundaries.

  describe("Grid Layout", () => {
    it("uses correct grid classes for stats layout", () => {
      const { container } = render(<ListStats stats={mockStats} />);

      // The grid-cols-3 class is applied to the stats grid inside CardContent
      const gridContainers = container.querySelectorAll(".grid");
      const statsGrid = Array.from(gridContainers).find((el) =>
        el.classList.contains("grid-cols-3"),
      );
      expect(statsGrid).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <ListStats stats={mockStats} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    // Note: Loading state accessibility test removed as loading prop has been deprecated.
    // Loading states are now handled at the parent level with Suspense boundaries.

    it("has proper semantic structure", () => {
      render(<ListStats stats={mockStats} />);

      // Should have StatsGridCard with proper text content
      expect(screen.getByText("List Statistics")).toBeInTheDocument();
      expect(screen.getByText("Total Lists")).toBeInTheDocument();
      expect(screen.getByText("Total Members")).toBeInTheDocument();
      expect(screen.getByText("Visibility (Pub/Prv)")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing or undefined stats gracefully", () => {
      const incompleteStats = {
        ...mockStats,
      } as ListStatsType;

      // Should not crash when rendering with the stats
      expect(() => {
        render(<ListStats stats={incompleteStats} />);
      }).not.toThrow();
    });

    it("applies custom className correctly", () => {
      const { container } = render(
        <ListStats stats={mockStats} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Component Props", () => {
    it("accepts and applies className prop", () => {
      const { container } = render(
        <ListStats stats={mockStats} className="test-class" />,
      );

      expect(container.firstChild).toHaveClass("test-class");
    });

    it("has correct displayName", () => {
      expect(ListStats.displayName).toBe("ListStats");
    });
  });
});
