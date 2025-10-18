import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { StatusCard } from "@/components/ui/status-card";
import { Button } from "@/components/ui/button";

describe("StatusCard", () => {
  const mockMetrics = [
    { label: "Emails Sent", value: 5000 },
    { label: "Emails Canceled", value: 0 },
  ];

  it("renders with basic props", () => {
    render(<StatusCard title="Delivery Status" status="delivered" />);

    expect(screen.getByText("Delivery Status")).toBeInTheDocument();
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        description="Campaign delivery information"
      />,
    );

    expect(
      screen.getByText("Campaign delivery information"),
    ).toBeInTheDocument();
  });

  it("renders with metrics", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );

    expect(screen.getByText("Emails Sent")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
    expect(screen.getByText("Emails Canceled")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with progress bar", () => {
    render(
      <StatusCard title="Delivery Status" status="delivering" progress={75} />,
    );

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders with actions", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        actions={<Button size="sm">Cancel</Button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        footer={<div>Footer content</div>}
      />,
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies different badge variants", () => {
    const { rerender } = render(
      <StatusCard title="Status" status="active" statusVariant="default" />,
    );

    let badge = screen.getByText("active");
    expect(badge).toBeInTheDocument();

    rerender(
      <StatusCard title="Status" status="error" statusVariant="destructive" />,
    );

    badge = screen.getByText("error");
    expect(badge).toBeInTheDocument();
  });

  it("formats numeric values with locale formatting", () => {
    render(
      <StatusCard
        title="Status"
        status="active"
        metrics={[{ label: "Total", value: 1234567 }]}
      />,
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders loading skeleton when loading prop is true", () => {
    const { container } = render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
        loading={true}
      />,
    );

    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        className="custom-class"
      />,
    );

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("custom-class");
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper semantic structure", () => {
    render(
      <StatusCard
        title="Delivery Status"
        status="delivered"
        metrics={mockMetrics}
      />,
    );

    const card = screen
      .getByText("Delivery Status")
      .closest('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });
});
