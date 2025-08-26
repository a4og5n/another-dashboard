import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
  });

  // Accessibility tests
  it("should not have accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <Button>Accessible Button</Button>,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("should have proper ARIA attributes when disabled", async () => {
    const { renderResult } = await renderWithA11y(
      <Button disabled>Disabled Button</Button>,
    );
    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-disabled", "true");
    await expectNoA11yViolations(renderResult.container);
  });

  it("should be keyboard accessible", () => {
    render(<Button>Keyboard Button</Button>);
    const button = screen.getByRole("button");

    // Button should be focusable
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
