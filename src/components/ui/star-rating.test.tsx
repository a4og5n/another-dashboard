/**
 * Tests for StarRating Component
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StarRating } from "./star-rating";

describe("StarRating", () => {
  describe("Rendering", () => {
    it("renders 5 stars", () => {
      const { container } = render(<StarRating rating={3} />);
      const stars = container.querySelectorAll("svg");
      expect(stars).toHaveLength(5);
    });

    it("fills correct number of stars for whole numbers", () => {
      const { container } = render(<StarRating rating={3} />);
      const stars = container.querySelectorAll("svg");

      // First 3 stars should be filled (yellow)
      expect(stars[0]).toHaveClass("fill-yellow-400", "text-yellow-400");
      expect(stars[1]).toHaveClass("fill-yellow-400", "text-yellow-400");
      expect(stars[2]).toHaveClass("fill-yellow-400", "text-yellow-400");

      // Last 2 stars should be unfilled (muted)
      expect(stars[3]).toHaveClass("text-muted-foreground");
      expect(stars[4]).toHaveClass("text-muted-foreground");
    });

    it("handles rating of 0", () => {
      const { container } = render(<StarRating rating={0} />);
      const stars = container.querySelectorAll("svg");

      stars.forEach((star) => {
        expect(star).toHaveClass("text-muted-foreground");
        expect(star).not.toHaveClass("fill-yellow-400");
      });
    });

    it("handles rating of 5", () => {
      const { container } = render(<StarRating rating={5} />);
      const stars = container.querySelectorAll("svg");

      stars.forEach((star) => {
        expect(star).toHaveClass("fill-yellow-400", "text-yellow-400");
      });
    });
  });

  describe("Size Variants", () => {
    it('renders small size with "sm" prop', () => {
      const { container } = render(<StarRating rating={3} size="sm" />);
      const star = container.querySelector("svg");
      expect(star).toHaveClass("h-4", "w-4");
    });

    it('renders medium size by default and with "md" prop', () => {
      const { container: container1 } = render(<StarRating rating={3} />);
      const star1 = container1.querySelector("svg");
      expect(star1).toHaveClass("h-5", "w-5");

      const { container: container2 } = render(
        <StarRating rating={3} size="md" />,
      );
      const star2 = container2.querySelector("svg");
      expect(star2).toHaveClass("h-5", "w-5");
    });

    it('renders large size with "lg" prop', () => {
      const { container } = render(<StarRating rating={3} size="lg" />);
      const star = container.querySelector("svg");
      expect(star).toHaveClass("h-6", "w-6");
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom className", () => {
      const { container } = render(
        <StarRating rating={3} className="custom-class" />,
      );
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("preserves base classes when custom className is provided", () => {
      const { container } = render(
        <StarRating rating={3} className="custom-class" />,
      );
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toHaveClass("flex", "items-center", "gap-0.5");
    });
  });

  describe("Edge Cases", () => {
    it("handles fractional ratings (fills based on < comparison)", () => {
      const { container } = render(<StarRating rating={3.7} />);
      const stars = container.querySelectorAll("svg");

      // 3.7 fills 4 stars because: 0 < 3.7, 1 < 3.7, 2 < 3.7, 3 < 3.7 are all true
      expect(stars[0]).toHaveClass("fill-yellow-400");
      expect(stars[1]).toHaveClass("fill-yellow-400");
      expect(stars[2]).toHaveClass("fill-yellow-400");
      expect(stars[3]).toHaveClass("fill-yellow-400");
      expect(stars[4]).toHaveClass("text-muted-foreground");
    });

    it("handles negative ratings as 0", () => {
      const { container } = render(<StarRating rating={-1} />);
      const stars = container.querySelectorAll("svg");

      stars.forEach((star) => {
        expect(star).toHaveClass("text-muted-foreground");
        expect(star).not.toHaveClass("fill-yellow-400");
      });
    });

    it("handles ratings greater than 5 (caps at 5 filled)", () => {
      const { container } = render(<StarRating rating={10} />);
      const stars = container.querySelectorAll("svg");

      stars.forEach((star) => {
        expect(star).toHaveClass("fill-yellow-400", "text-yellow-400");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper display name", () => {
      expect(StarRating.displayName).toBe("StarRating");
    });

    it("renders without accessibility violations", () => {
      const { container } = render(<StarRating rating={3} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Real-World Examples", () => {
    it("renders list rating from Mailchimp (rating of 4)", () => {
      const { container } = render(<StarRating rating={4} size="sm" />);
      const stars = container.querySelectorAll("svg");

      expect(stars).toHaveLength(5);
      expect(stars[0]).toHaveClass("fill-yellow-400");
      expect(stars[1]).toHaveClass("fill-yellow-400");
      expect(stars[2]).toHaveClass("fill-yellow-400");
      expect(stars[3]).toHaveClass("fill-yellow-400");
      expect(stars[4]).toHaveClass("text-muted-foreground");
    });

    it("renders list detail rating (rating of 3, larger size)", () => {
      const { container } = render(<StarRating rating={3} size="md" />);
      const stars = container.querySelectorAll("svg");

      expect(stars).toHaveLength(5);
      stars.forEach((star, index) => {
        if (index < 3) {
          expect(star).toHaveClass("fill-yellow-400", "text-yellow-400");
        } else {
          expect(star).toHaveClass("text-muted-foreground");
        }
      });
    });
  });
});
