import { ReactElement } from "react";
import { render, RenderResult } from "@testing-library/react";
import { configureAxe, toHaveNoViolations } from "jest-axe";
import axe, { AxeResults } from "axe-core";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure axe-core for better performance in tests
const axeConfig = configureAxe({
  rules: {
    // Disable color-contrast rule in tests (can be unreliable in jsdom)
    "color-contrast": { enabled: false },
  },
});

/**
 * Test a component for accessibility violations
 * @param ui - React element to test
 * @param options - Additional render options
 * @returns Promise with render result and axe results
 */
export const renderWithA11y = async (
  ui: ReactElement,
  options?: Parameters<typeof render>[1],
): Promise<{
  renderResult: RenderResult;
  axeResults: AxeResults;
}> => {
  const renderResult = render(ui, options);
  const axeResults = await axeConfig(renderResult.container);

  // @ts-expect-error - Version conflict between jest-axe and axe-core types, will be resolved in future update
  return { renderResult, axeResults };
};

/**
 * Run accessibility tests on a rendered component
 * @param container - DOM container to test
 * @returns Promise with axe results
 */
export const runA11yTests = async (container: Element): Promise<AxeResults> => {
  // @ts-expect-error - Version conflict between jest-axe and axe-core types, will be resolved in future update
  return await axeConfig(container);
};

/**
 * Custom hook to validate accessibility in tests
 * Usage: await expectNoA11yViolations(container);
 */
export const expectNoA11yViolations = async (
  container: Element,
): Promise<void> => {
  const results = await runA11yTests(container);
  expect(results).toHaveNoViolations();
};

/**
 * Test helper for checking specific accessibility rules
 * @param container - DOM container to test
 * @param rules - Array of specific axe rule IDs to test
 */
export const testA11yRules = async (
  container: Element,
  rules: string[],
): Promise<AxeResults> => {
  return await axe.run(container, {
    rules: rules.reduce(
      (acc, rule) => ({
        ...acc,
        [rule]: { enabled: true },
      }),
      {},
    ),
  });
};

/**
 * Common accessibility test patterns
 */
export const A11yTestPatterns = {
  /**
   * Test keyboard navigation
   */
  testKeyboardNavigation: async (element: Element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    return focusableElements.length > 0;
  },

  /**
   * Test ARIA attributes
   */
  testAriaAttributes: async (container: Element) => {
    return await testA11yRules(container, [
      "aria-valid-attr",
      "aria-valid-attr-value",
      "aria-required-attr",
      "aria-roles",
    ]);
  },

  /**
   * Test semantic HTML
   */
  testSemanticHTML: async (container: Element) => {
    return await testA11yRules(container, [
      "landmark-one-main",
      "page-has-heading-one",
      "heading-order",
    ]);
  },
};
