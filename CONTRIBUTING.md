# Contributing to Another Dashboard

Thank you for your interest in contributing to Another Dashboard! This document provides guidelines and information for contributors.

## 🎯 Project Overview

Another Dashboard is a comprehensive business analytics platform built with Next.js 15, TypeScript, and modern web technologies. We aim to create a performant, accessible, and user-friendly dashboard experience.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Git

### Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/another-dashboard.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm dev`
5. Open https://localhost:3000

### Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── accessibility/  # A11y components and providers
│   ├── performance/    # Performance monitoring
│   └── ...
├── lib/                # Utility libraries and configurations
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── test/               # Testing utilities and setup
```

## 🛠️ Development Workflow

### Branch Strategy

- `main` - Production branch (protected)
- `feature/feature-name` - Feature development
- `fix/bug-description` - Bug fixes
- `chore/task-description` - Maintenance tasks

### Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(dashboard): add user analytics chart
fix(auth): resolve token expiration handling
docs: update API integration guide
```

### Pull Request Process

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow TypeScript best practices
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**

   **🚀 NEW: Automated Local Validation**

   We use pre-commit hooks to automatically run quality checks before commits:

```bash
# Quick validation (recommended during development)
pnpm quick-check   # Type checking + linting

# Full pre-commit validation (runs automatically on git commit)
pnpm pre-commit    # All checks: format, lint, type-check, tests, a11y (Prettier runs first)

# Complete validation including build
pnpm validate      # Pre-commit + build test
```

**Manual Testing Commands:**

```bash
pnpm test          # Run unit tests
pnpm test:a11y     # Run accessibility tests
pnpm lint          # Check code style
pnpm type-check    # Verify TypeScript
pnpm format:check  # Check code formatting
pnpm build         # Test production build
```

4. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add new dashboard component"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure WCAG 2.1 AA compliance
- **Performance Tests**: Monitor Core Web Vitals

### Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

test('should not have accessibility violations', async () => {
  const { container } = render(<YourComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 🎨 Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Define explicit return types for functions
- Use interfaces over types when possible
- Avoid `any` type

```typescript
// Good
interface UserData {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<UserData> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Implement proper prop interfaces
- Use descriptive component and prop names
- Include JSDoc comments for complex components

```typescript
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Reusable button component with multiple variants
 */
export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant })} {...props}>
      {children}
    </button>
  );
}
```

### CSS/Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS variables for theme values

## ♿ Accessibility Standards

We strive for WCAG 2.1 AA compliance:

### Requirements

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper semantic HTML and ARIA labels
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for images

### Testing

```bash
pnpm test:a11y  # Run accessibility tests
```

Use browser tools:

- axe DevTools extension
- Chrome Lighthouse
- NVDA/VoiceOver screen readers

## ⚡ Performance Guidelines

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Best Practices

- Use Next.js Image component for images
- Implement proper code splitting
- Minimize bundle size
- Use React.memo for expensive components
- Optimize API calls with proper caching

### Monitoring

```bash
pnpm build        # Check bundle analysis
pnpm start        # Test production build
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what was expected
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Environment**: OS, browser, Node.js version
4. **Screenshots**: Visual evidence if applicable
5. **Console Logs**: Any relevant error messages

## 💡 Feature Requests

For new features, please provide:

1. **Use Case**: Why is this feature needed?
2. **Requirements**: What should it do?
3. **Mockups**: Visual representation if applicable
4. **Technical Considerations**: Implementation thoughts

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Tag maintainers in PRs for review

## 📜 Code of Conduct

We expect all contributors to:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to Another Dashboard! 🚀
