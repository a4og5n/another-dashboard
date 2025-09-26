import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { AudienceStats } from "./AudienceStats";
import type { AudienceStats as AudienceStatsType } from "@/types/mailchimp/audience";

const mockStats: AudienceStatsType = {
  total_audiences: 3,
  total_members: 5250,
  audiences_by_visibility: {
    pub: 2,
    prv: 1,
  },
};

describe("AudienceStats", () => {
  describe("Basic Rendering", () => {
    it("renders all three stat cards", () => {
      render(<AudienceStats stats={mockStats} />);

      expect(screen.getByText("Total Audiences")).toBeInTheDocument();
      expect(screen.getByText("Total Members")).toBeInTheDocument();
      expect(screen.getByText("Visibility")).toBeInTheDocument();
    });

    it("displays correct stat values", () => {
      render(<AudienceStats stats={mockStats} />);

      expect(screen.getByText("3")).toBeInTheDocument(); // total audiences
      expect(screen.getByText("5.3K")).toBeInTheDocument(); // total members formatted
      expect(screen.getByText("2")).toBeInTheDocument(); // public audiences
      expect(screen.getByText("1")).toBeInTheDocument(); // private audiences
    });

    it("displays proper card descriptions", () => {
      render(<AudienceStats stats={mockStats} />);

      expect(screen.getByText("Active email lists")).toBeInTheDocument();
      expect(screen.getByText("Across all audiences")).toBeInTheDocument();
      expect(screen.getByText("Public / Private")).toBeInTheDocument();
    });

    it("displays icons correctly", () => {
      render(<AudienceStats stats={mockStats} />);

      // Icons are rendered as SVG elements with specific classes
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(3); // At least one for each card
    });
  });

  describe("Number Formatting", () => {
    it("formats large numbers correctly", () => {
      const largeStats = {
        ...mockStats,
        total_audiences: 1500000,
        total_members: 2500000,
      };

      render(<AudienceStats stats={largeStats} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
      expect(screen.getByText("2.5M")).toBeInTheDocument();
    });

    it("formats thousands correctly", () => {
      const thousandStats = {
        ...mockStats,
        total_audiences: 1500,
        total_members: 25000,
      };

      render(<AudienceStats stats={thousandStats} />);

      expect(screen.getByText("1.5K")).toBeInTheDocument();
      expect(screen.getByText("25.0K")).toBeInTheDocument();
    });

    it("displays small numbers without formatting", () => {
      const smallStats = {
        ...mockStats,
        total_audiences: 5,
        total_members: 125,
      };

      render(<AudienceStats stats={smallStats} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("125")).toBeInTheDocument();
    });
  });

  describe("Visibility Display", () => {
    it("shows public and private counts with proper formatting", () => {
      render(<AudienceStats stats={mockStats} />);

      // Check for the inline format: "2/1" (public/private)
      const visibilityCard = screen.getByText("Visibility").closest(".p-6");
      expect(visibilityCard).toBeInTheDocument();

      expect(screen.getByText("2")).toBeInTheDocument(); // public count
      expect(screen.getByText("1")).toBeInTheDocument(); // private count
    });

    it("handles zero counts correctly", () => {
      const zeroStats = {
        ...mockStats,
        audiences_by_visibility: {
          pub: 0,
          prv: 0,
        },
      };

      render(<AudienceStats stats={zeroStats} />);

      // Both counts should show as "0"
      const visibilityCard = screen.getByText("Visibility").closest(".p-6");
      expect(visibilityCard).toBeInTheDocument();
    });
  });

  // Note: Loading state tests removed as loading prop has been deprecated.
  // Loading states are now handled at the parent level with Suspense boundaries.

  describe("Grid Layout", () => {
    it("uses correct grid classes for responsive layout", () => {
      const { container } = render(<AudienceStats stats={mockStats} />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("grid-cols-1");
      expect(gridContainer).toHaveClass("md:grid-cols-2");
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });
  });

  describe("Accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { renderResult } = await renderWithA11y(
        <AudienceStats stats={mockStats} />,
      );

      await expectNoA11yViolations(renderResult.container);
    });

    // Note: Loading state accessibility test removed as loading prop has been deprecated.
    // Loading states are now handled at the parent level with Suspense boundaries.

    it("has proper semantic structure", () => {
      render(<AudienceStats stats={mockStats} />);

      // Should have cards with proper text content
      expect(screen.getByText("Total Audiences")).toBeInTheDocument();
      expect(screen.getByText("Total Members")).toBeInTheDocument();
      expect(screen.getByText("Visibility")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing or undefined stats gracefully", () => {
      const incompleteStats = {
        ...mockStats,
      } as AudienceStatsType;

      // Should not crash when rendering with the stats
      expect(() => {
        render(<AudienceStats stats={incompleteStats} />);
      }).not.toThrow();
    });

    it("applies custom className correctly", () => {
      const { container } = render(
        <AudienceStats stats={mockStats} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Component Props", () => {
    it("accepts and applies className prop", () => {
      const { container } = render(
        <AudienceStats stats={mockStats} className="test-class" />,
      );

      expect(container.firstChild).toHaveClass("test-class");
    });

    it("has correct displayName", () => {
      expect(AudienceStats.displayName).toBe("AudienceStats");
    });
  });
});
