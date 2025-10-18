import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatCard } from "@/components/ui/stat-card";
import { Mail } from "lucide-react";

describe("StatCard", () => {
  it("renders with basic props", () => {
    render(<StatCard icon={Mail} value={12500} label="Emails Sent" />);

    expect(screen.getByText("Emails Sent")).toBeInTheDocument();
    expect(screen.getByText("12,500")).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(<StatCard icon={Mail} value={1234567} label="Large Number" />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders string values without formatting", () => {
    render(<StatCard icon={Mail} value="23.4%" label="Open Rate" />);

    expect(screen.getByText("23.4%")).toBeInTheDocument();
  });

  it("renders trend indicator when provided", () => {
    render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        trend="up"
        change={5.2}
      />,
    );

    expect(screen.getByText("+5.2%")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        description="Compared to last month"
      />,
    );

    expect(screen.getByText("Compared to last month")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatCard icon={Mail} value={12500} label="Emails Sent" loading={true} />,
    );

    // Skeleton components should be present
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatCard
        icon={Mail}
        value={12500}
        label="Emails Sent"
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatCard icon={Mail} value={12500} label="Emails Sent" />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(<StatCard icon={Mail} value={12500} label="Emails Sent" />);

    // Card should have proper data attributes
    const card = screen.getByText("Emails Sent").closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });
});
