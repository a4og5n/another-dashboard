# Accessibility Testing Components

This directory contains components and utilities for accessibility (a11y) testing in development.

## Components

### A11yProvider

A provider component that enables accessibility testing in development mode using @axe-core/react.

### A11yTester

A development-only component that runs accessibility tests and shows violations as alerts.

## Usage

### In Root Layout (Recommended)

```tsx
import { A11yProvider } from "@/components/accessibility/a11y-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <A11yProvider enableInDevelopment>{children}</A11yProvider>
      </body>
    </html>
  );
}
```

### For Specific Components

```tsx
import { A11yTester } from "@/components/accessibility/a11y-test-utils";

export default function MyPage() {
  return (
    <A11yTester>
      <YourComponent />
    </A11yTester>
  );
}
```

### Using the Hook

```tsx
import { useA11yTest } from "@/components/accessibility/a11y-test-utils";

function MyComponent() {
  const { results, isRunning } = useA11yTest();

  return <div>Your component</div>;
}
```

## Testing

Use the accessibility test helper in your tests:

```tsx
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";

it("should be accessible", async () => {
  const { renderResult } = await renderWithA11y(<MyComponent />);
  await expectNoA11yViolations(renderResult.container);
});
```

## Scripts

- `pnpm test:a11y` - Run only accessibility-related tests
- `pnpm test` - Run all tests (including accessibility tests)

## Best Practices

1. **Use semantic HTML** - Proper heading hierarchy, landmarks, etc.
2. **Add ARIA labels** where needed for screen readers
3. **Ensure keyboard navigation** works for all interactive elements
4. **Test color contrast** - Ensure sufficient contrast ratios
5. **Test with screen readers** - Use tools like NVDA, JAWS, or VoiceOver

## Resources

- [WebAIM Guidelines](https://webaim.org/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
