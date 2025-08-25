This document provides best practices and guidance for developing with this Next.js project structure. Follow these patterns for consistent and maintainable code.

## 📁 Project Structure Guidelines

### `/src/app` - App Router Pages and Layouts
- Use the App Router pattern for routing
- Keep page components lean, focus on layout and data fetching
- Place layout components in `app/_components` for route-specific UI
- Follow the route segment config patterns for metadata, loading states, and error handling
- Use Server Components by default, mark with 'use client' only when needed

### `/src/components` - Reusable UI Components
- Organize by feature or category in subfolders
- Create an index.ts file for each subfolder to export components
- Follow atomic design principles (atoms, molecules, organisms)
- Use shadcn/ui components as base building blocks
- Implement consistent prop interfaces with TypeScript
- Document component usage with JSDoc comments

### `/src/actions` - Server Actions and API Routes
- Keep server-side logic separate from UI components
- Use Zod schemas for input validation
- Implement proper error handling and type safety
- Follow RESTful patterns for API routes
- Document expected inputs and outputs

### `/src/types` - TypeScript Definitions
- Define shared interfaces and types
- Use descriptive naming conventions
- Export types from index.ts files
- Avoid using 'any' type
- Implement strict type checking

### `/src/schemas` - Zod Validation Schemas
- Create reusable validation schemas
- Share schemas between client and server
- Define clear error messages
- Use strict type inference
- Keep schemas focused and composable

### `/src/utils` - Helper Functions
- Create pure, reusable utility functions
- Write comprehensive unit tests
- Document function purposes and parameters
- Use TypeScript generics where appropriate

### `/src/test` - Testing Utilities
- Use test-utils.tsx for custom render functions
- Follow testing patterns from example tests
- Use MSW for mocking API requests
- Write component tests using React Testing Library
- Ensure good test coverage for critical paths
- Keep functions small and focused

## 🔧 Development Best Practices

### Type Safety
- Enable strict TypeScript checks
- Use type inference where possible
- Define explicit return types for functions
- Avoid type assertions unless necessary
- Use generics for reusable components

### Error Handling
- Implement error boundaries at appropriate levels
- Use custom error classes for different scenarios
- Log errors with proper context
- Provide user-friendly error messages
- Handle edge cases explicitly

### State Management
- Use React Server Components when possible
- Implement form validation with Zod
- Keep client-side state minimal
- Use URL state for shareable UI states
- Implement proper loading states

### Performance
- Use Next.js Image component for images
- Implement proper code splitting
- Use dynamic imports for large components
- Optimize API calls with proper caching
- Monitor and optimize bundle size
- **Track Core Web Vitals** using the provided Web Vitals utilities
- **Monitor performance metrics** with real-time analytics integration
- Use performance hooks to measure component render times
- Implement performance budgets and monitoring

### Testing
- Write unit tests for utilities and hooks
- Implement integration tests for complex features
- Use React Testing Library for component tests
- Mock external services appropriately
- Maintain good test coverage
- **Include accessibility tests** using axe-core and jest-axe
- Test keyboard navigation and ARIA attributes
- Validate semantic HTML structure in tests

### Accessibility (A11y)
- Use semantic HTML elements (header, nav, main, section, etc.)
- Implement proper heading hierarchy (h1, h2, h3...)
- Add ARIA labels and descriptions where needed
- Ensure keyboard navigation works for all interactive elements
- Test color contrast ratios (minimum 4.5:1 for normal text)
- Use the provided A11yProvider in development for real-time checking
- Include accessibility tests using the axe-helper utilities
- Test with screen readers (VoiceOver, NVDA, JAWS)
- Follow WCAG 2.1 AA guidelines

### Performance Monitoring
- Track Core Web Vitals (LCP, FID, CLS) using the WebVitalsReporter component
- Monitor performance metrics with multiple analytics providers (GA4, Vercel, custom)
- Use performance hooks (useWebVitals, usePageLoadPerformance) for component-level monitoring
- Implement performance budgets and set thresholds for key metrics
- Monitor bundle size and optimize for performance
- Use the Performance Observer API for custom metrics
- Track user experience across different devices and network conditions
- Set up alerts for performance regressions

### Security
- Validate all inputs with Zod schemas
- Implement proper CSRF protection
- Use environment variables for sensitive data
- Follow security best practices for APIs
- Regularly update dependencies

### Code Style
- Use ESLint for code linting
- Format code with Prettier
- Follow consistent naming conventions
- Write meaningful commit messages
- Document complex logic

## 🛠️ Tools and Commands

### Development
- \`pnpm dev\`: Start development server with HTTPS and Turbopack
- \`pnpm type-check\`: Verify TypeScript types
- \`pnpm format\`: Format code with Prettier
- \`pnpm lint:fix\`: Fix ESLint issues

### Testing
- \`pnpm test\`: Run all tests
- \`pnpm test:watch\`: Run tests in watch mode
- \`pnpm test:ui\`: Run tests with UI interface
- \`pnpm test:coverage\`: Generate test coverage report
- \`pnpm test:a11y\`: Run accessibility-specific tests

### Documentation
- \`pnpm docs\`: Generate TypeDoc documentation
- \`pnpm docs:watch\`: Watch mode for documentation

### Production
- \`pnpm build\`: Create production build
- \`pnpm start\`: Start production server
- \`pnpm clean\`: Clean build directories

## � GitHub Workflow and Branch Management

When working with GitHub tasks and issues assigned to this repository, follow these workflow guidelines:

### Branch Strategy

Always create and use feature/fix branches when working on assigned tasks:

1. **Feature branches**: For new functionality or enhancements
   \`\`\`bash
   git checkout -b feature/description-of-feature
   \`\`\`

2. **Fix branches**: For bug fixes or hotfixes
   \`\`\`bash
   git checkout -b fix/description-of-fix
   \`\`\`

3. **Branch naming conventions**:
   - Use lowercase with hyphens
   - Be descriptive but concise
   - Examples: \`feature/add-user-auth\`, \`fix/navbar-mobile-layout\`

### GitHub Issue Workflow

When assigned a GitHub issue or task:

1. **Create a branch** from the default branch (main):
   \`\`\`bash
   git checkout main
   git pull origin main
   git checkout -b feature/issue-description
   \`\`\`

2. **Make your changes** following the contributing guidelines

3. **Commit with meaningful messages**:
   \`\`\`bash
   git add .
   git commit -m "feat: add user authentication system
   
   - Implement login/logout functionality
   - Add JWT token handling
   - Create user session management
   - Closes #issue-number"
   \`\`\`

4. **Push the branch**:
   \`\`\`bash
   git push origin feature/issue-description
   \`\`\`

5. **Create a Pull Request** with:
   - Clear title describing the change
   - Reference to the issue number (e.g., "Closes #123")
   - Description of changes made
   - Any testing performed

### Pull Request Guidelines

- **Always use pull requests** - never push directly to main
- **Request reviews** from repository maintainers
- **Include tests** if applicable
- **Update documentation** if your changes affect usage
- **Ensure CI passes** before requesting review
- **Use conventional commits** for better changelog generation

### Commit Message Format

Follow conventional commits format:
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

Types: \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`

Examples:
- \`feat: add user dashboard component\`
- \`fix: resolve mobile navigation overflow\`
- \`docs: update API documentation\`

## �📝 Pull Request Guidelines

1. Follow the existing code style
2. Update documentation as needed
3. Add/update tests for new features
4. Use semantic commit messages
5. Keep PRs focused and atomic
6. Update the changelog if required

