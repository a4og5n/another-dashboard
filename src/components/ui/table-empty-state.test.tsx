/**
 * Tests for TableEmptyState Component
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TableEmptyState } from "./table-empty-state";
import { Users, MousePointerClick, Mail } from "lucide-react";

describe("TableEmptyState", () => {
  describe("Simple Text-Only Mode", () => {
    it("renders message without icon", () => {
      const { container } = render(
        <TableEmptyState message="No data available" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent("No data available");
    });

    it("applies correct default classes for text-only mode", () => {
      const { container } = render(
        <TableEmptyState message="No data available" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toHaveClass(
        "text-muted-foreground",
        "text-center",
        "py-8",
      );
    });

    it("does not render icon element when icon prop is not provided", () => {
      const { container } = render(
        <TableEmptyState message="No data available" />,
      );

      const svg = container.querySelector("svg");
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe("Rich Icon Mode", () => {
    it("renders with icon", () => {
      const { container } = render(
        <TableEmptyState message="No users found" icon={Users} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders message text with icon", () => {
      const { container } = render(
        <TableEmptyState message="No users found" icon={Users} />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent("No users found");
    });

    it("applies correct classes for icon mode", () => {
      const { container } = render(
        <TableEmptyState message="No users found" icon={Users} />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "py-8",
        "text-muted-foreground",
      );
    });

    it("icon has correct styling classes", () => {
      const { container } = render(
        <TableEmptyState message="No users found" icon={Users} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-12", "w-12", "mb-3", "opacity-50");
    });

    it("icon is hidden from screen readers", () => {
      const { container } = render(
        <TableEmptyState message="No users found" icon={Users} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom className for text-only mode", () => {
      const { container } = render(
        <TableEmptyState message="No data" className="custom-text-class" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toHaveClass("custom-text-class");
    });

    it("preserves default classes when custom className provided for text-only", () => {
      const { container } = render(
        <TableEmptyState message="No data" className="custom-class" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toHaveClass(
        "text-muted-foreground",
        "text-center",
        "py-8",
        "custom-class",
      );
    });

    it("accepts custom className for icon mode", () => {
      const { container } = render(
        <TableEmptyState
          message="No data"
          icon={Users}
          className="custom-icon-class"
        />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-icon-class");
    });

    it("preserves default classes when custom className provided for icon mode", () => {
      const { container } = render(
        <TableEmptyState
          message="No data"
          icon={Users}
          className="custom-class"
        />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "py-8",
        "text-muted-foreground",
        "custom-class",
      );
    });
  });

  describe("Different Icons", () => {
    it("works with Users icon", () => {
      const { container } = render(
        <TableEmptyState message="No users" icon={Users} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("works with MousePointerClick icon", () => {
      const { container } = render(
        <TableEmptyState message="No clicks" icon={MousePointerClick} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("works with Mail icon", () => {
      const { container } = render(
        <TableEmptyState message="No emails" icon={Mail} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Real-World Examples", () => {
    it("renders simple empty state for lists", () => {
      const { container } = render(
        <TableEmptyState message="No activity data available for this list." />,
      );

      expect(container.textContent).toBe(
        "No activity data available for this list.",
      );
    });

    it("renders simple empty state for campaigns", () => {
      const { container } = render(
        <TableEmptyState message="No unsubscribes found for this campaign." />,
      );

      expect(container.textContent).toBe(
        "No unsubscribes found for this campaign.",
      );
    });

    it("renders rich empty state for clicks", () => {
      const { container } = render(
        <TableEmptyState
          message="No click data available for this campaign"
          icon={MousePointerClick}
        />,
      );

      expect(container.textContent).toBe(
        "No click data available for this campaign",
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders rich empty state for email activity", () => {
      const { container } = render(
        <TableEmptyState
          message="No email activity found for this campaign."
          icon={Mail}
        />,
      );

      expect(container.textContent).toBe(
        "No email activity found for this campaign.",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper display name", () => {
      expect(TableEmptyState.displayName).toBe("TableEmptyState");
    });

    it("message is accessible to screen readers", () => {
      const { container } = render(
        <TableEmptyState message="No data available" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("No data available");
    });

    it("icon does not interfere with screen readers", () => {
      const { container } = render(
        <TableEmptyState message="No data" icon={Users} />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Message Variations", () => {
    it("handles short messages", () => {
      const { container } = render(<TableEmptyState message="No data" />);

      expect(container.textContent).toBe("No data");
    });

    it("handles long messages", () => {
      const longMessage =
        "No data is currently available for this resource. Please check back later or try refreshing the page.";
      const { container } = render(<TableEmptyState message={longMessage} />);

      expect(container.textContent).toBe(longMessage);
    });

    it("handles messages with special characters", () => {
      const { container } = render(
        <TableEmptyState message="No data available — try again!" />,
      );

      expect(container.textContent).toBe("No data available — try again!");
    });
  });
});
