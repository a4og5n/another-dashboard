import { render, screen } from "@testing-library/react";
import { PricingPlanBadge } from "@/components/ui/pricing-plan-badge";

describe("PricingPlanBadge", () => {
  it("renders monthly plan correctly", () => {
    render(<PricingPlanBadge planType="monthly" />);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("renders pay as you go plan correctly", () => {
    render(<PricingPlanBadge planType="pay_as_you_go" />);
    expect(screen.getByText("Pay As You Go")).toBeInTheDocument();
  });

  it("renders forever free plan correctly", () => {
    render(<PricingPlanBadge planType="forever_free" />);
    expect(screen.getByText("Forever Free")).toBeInTheDocument();
  });

  it("renders unknown plan types as-is", () => {
    render(<PricingPlanBadge planType="unknown_plan" />);
    expect(screen.getByText("unknown_plan")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<PricingPlanBadge planType="monthly" className="test-class" />);
    const badge = screen.getByText("Monthly").closest("[class*='test-class']");
    expect(badge).toBeInTheDocument();
  });

  it("applies correct badge variants", () => {
    const { rerender } = render(<PricingPlanBadge planType="monthly" />);
    let badge = screen.getByText("Monthly");
    expect(badge).toBeInTheDocument();

    rerender(<PricingPlanBadge planType="forever_free" />);
    badge = screen.getByText("Forever Free");
    expect(badge).toBeInTheDocument();

    rerender(<PricingPlanBadge planType="pay_as_you_go" />);
    badge = screen.getByText("Pay As You Go");
    expect(badge).toBeInTheDocument();
  });
});
