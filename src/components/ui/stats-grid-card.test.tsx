import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

describe("StatsGridCard", () => {
  const mockStats = [
    { value: 1250, label: "Total Opens" },
    { value: 980, label: "Unique Opens" },
    { value: "23.4%", label: "Open Rate" },
  ];

  it("renders with basic props", () => {
    render(<StatsGridCard title="Email Opens" stats={mockStats} />);

    expect(screen.getByText("Email Opens")).toBeInTheDocument();
    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("Total Opens")).toBeInTheDocument();
    expect(screen.getByText("980")).toBeInTheDocument();
    expect(screen.getByText("Unique Opens")).toBeInTheDocument();
    expect(screen.getByText("23.4%")).toBeInTheDocument();
    expect(screen.getByText("Open Rate")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    const { container } = render(
      <StatsGridCard title="Email Opens" icon={MailOpen} stats={mockStats} />,
    );

    // Icon should be rendered
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        footer={<Button>View Details</Button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "View Details" }),
    ).toBeInTheDocument();
  });

  it("renders with header action", () => {
    render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        headerAction={
          <Button variant="outline" size="sm">
            Toggle
          </Button>
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  it("supports different column layouts", () => {
    const { container } = render(
      <StatsGridCard
        title="Two Columns"
        stats={[
          { value: 100, label: "Stat 1" },
          { value: 200, label: "Stat 2" },
        ]}
        columns={2}
      />,
    );

    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(
      <StatsGridCard
        title="Large Numbers"
        stats={[{ value: 1234567, label: "Big Number" }]}
      />,
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatsGridCard title="Email Opens" stats={mockStats} loading={true} />,
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsGridCard
        title="Email Opens"
        stats={mockStats}
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatsGridCard title="Email Opens" stats={mockStats} />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(<StatsGridCard title="Email Opens" stats={mockStats} />);

    const card = screen.getByText("Email Opens").closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });
});
