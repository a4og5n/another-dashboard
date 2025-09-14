# Kinde Authentication Implementation Plan

## Single-Agent Optimized Workflow

**Version:** 2.0  
**Date:** September 13, 2025  
**Optimized for:** Single agent execution, zero refactoring, minimal token consumption  
**Target:** MVP Authentication following PRD.md requirements

---

## Implementation Strategy

### Core Principles

1. **Schema-First Development**: Build types and validation before implementation
2. **Path Alias Consistency**: Use `@/` aliases for all imports/exports per PRD
3. **Atomic Commits**: Each section represents one logical commit
4. **Zero Refactoring**: Follow established patterns exactly
5. **Token Efficiency**: Minimize context switching, maximize reuse

### Estimated Time: 3.5 hours total

---

## Section 1: Foundation Setup (30 minutes)

### 1.1 Environment Configuration (10 minutes)

- [ ] Add Kinde environment variables to `env.example`
- [ ] Configure local `.env.local` with Kinde credentials
- [ ] Install `@kinde-oss/kinde-auth-nextjs` package

### 1.2 Kinde Account Setup (20 minutes)

- [ ] Register Kinde tenant and Next.js application
- [ ] Enable Google OAuth and email/password authentication
- [ ] Configure callback URLs for local and Vercel environments
- [ ] Test Kinde configuration with health endpoint

**Files Created:**

- Updated: `env.example`
- Updated: `package.json`

---

## Section 2: Schema & Types Layer (45 minutes)

### 2.1 Authentication Schemas (25 minutes)

Create `src/schemas/auth/` directory following mailchimp patterns:

**File: `src/schemas/auth/user.ts`**

```typescript
import { z } from "zod";

export const kindeUserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  given_name: z.string().nullable(),
  family_name: z.string().nullable(),
  picture: z.string().url().nullable(),
});

export const authSessionSchema = z.object({
  user: kindeUserSchema.nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
});

export const authErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});
```

**File: `src/schemas/auth/index.ts`**

```typescript
export * from "@/schemas/auth/user";
```

### 2.2 TypeScript Types (20 minutes)

**File: `src/types/auth/user.ts`**

```typescript
import type { z } from "zod";
import type {
  kindeUserSchema,
  authSessionSchema,
  authErrorSchema,
} from "@/schemas/auth";

export type KindeUser = z.infer<typeof kindeUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;

// Reserved for future role-based access
export type UserRole = "admin" | "editor" | "viewer" | "client";
export type UserPermission = "read" | "write" | "admin";

export interface ExtendedUser extends KindeUser {
  roles?: UserRole[];
  permissions?: UserPermission[];
}
```

**File: `src/types/auth/index.ts`**

```typescript
export * from "@/types/auth/user";
```

**Update: `src/types/index.ts`**

```typescript
// Add to existing exports
export * from "@/types/auth";
```

**Files Created:**

- `src/schemas/auth/user.ts`
- `src/schemas/auth/index.ts`
- `src/types/auth/user.ts`
- `src/types/auth/index.ts`
- Updated: `src/types/index.ts`

---

## Section 3: Authentication Service (30 minutes)

**File: `src/services/auth.service.ts`**

```typescript
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { AuthSession, KindeUser } from "@/types/auth";
import { kindeUserSchema, authSessionSchema } from "@/schemas/auth";

export class AuthService {
  static async getSession(): Promise<AuthSession> {
    try {
      const { getUser, isAuthenticated } = getKindeServerSession();
      const user = await getUser();
      const authenticated = await isAuthenticated();

      const validatedUser = user ? kindeUserSchema.parse(user) : null;

      return authSessionSchema.parse({
        user: validatedUser,
        isAuthenticated: authenticated,
        isLoading: false,
      });
    } catch (error) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }
  }

  static async requireAuth(): Promise<KindeUser> {
    const session = await this.getSession();
    if (!session.isAuthenticated || !session.user) {
      throw new Error("Authentication required");
    }
    return session.user;
  }
}
```

**Files Created:**

- `src/services/auth.service.ts`

---

## Section 4: Middleware & Route Protection (30 minutes)

**File: `src/middleware.ts`**

```typescript
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(
  async function middleware(req) {
    // Additional middleware logic can be added here
  },
  {
    isReturnToCurrentPage: true,
    loginPage: "/login",
    isAuthorized: ({ token }) => {
      // For MVP, allow all authenticated users
      return !!token;
    },
    publicPaths: ["/", "/login", "/register", "/api/auth"],
  },
);

export const config = {
  matcher: [
    "/mailchimp/:path*",
    // Add other protected routes here
  ],
};
```

**Files Created:**

- `src/middleware.ts`

---

## Section 5: Authentication Pages (45 minutes)

### 5.1 Login Page (25 minutes)

**File: `src/app/login/page.tsx`**

```typescript
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function LoginPage() {
  const { isAuthenticated } = getKindeServerSession()

  if (await isAuthenticated()) {
    redirect("/mailchimp")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginLink
            authUrlParams={{
              connection_id: process.env.KINDE_GOOGLE_CONNECTION_ID,
            }}
          >
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
          </LoginLink>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <LoginLink>
            <Button className="w-full">
              Sign in with Email
            </Button>
          </LoginLink>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <RegisterLink className="text-primary hover:underline">
              Sign up
            </RegisterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 5.2 Auth API Routes (20 minutes)

**File: `src/app/api/auth/[kindeAuth]/route.ts`**

```typescript
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth();
```

**File: `src/app/api/auth/health/route.ts`**

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  const requiredVars = [
    "KINDE_CLIENT_ID",
    "KINDE_CLIENT_SECRET",
    "KINDE_ISSUER_URL",
    "KINDE_SITE_URL",
    "KINDE_POST_LOGOUT_REDIRECT_URL",
    "KINDE_POST_LOGIN_REDIRECT_URL",
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        status: "error",
        missing: missing,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "ok",
    configured: true,
  });
}
```

**Files Created:**

- `src/app/login/page.tsx`
- `src/app/api/auth/[kindeAuth]/route.ts`
- `src/app/api/auth/health/route.ts`

---

## Section 6: User Interface Components (30 minutes)

### 6.1 User Menu Component (20 minutes)

**File: `src/components/auth/user-menu.tsx`**

```typescript
"use client"

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { KindeUser } from "@/types/auth"

interface UserMenuProps {
  user: KindeUser
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = `${user.given_name?.[0] || ""}${user.family_name?.[0] || ""}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture || ""} alt={user.email || ""} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.given_name} {user.family_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="w-full cursor-pointer">
            Log out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 6.2 Auth Loading Component (10 minutes)

**File: `src/components/auth/auth-loading.tsx`**

```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function AuthLoading() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  )
}
```

**File: `src/components/auth/index.ts`**

```typescript
export { UserMenu } from "@/components/auth/user-menu";
export { AuthLoading } from "@/components/auth/auth-loading";
```

**Files Created:**

- `src/components/auth/user-menu.tsx`
- `src/components/auth/auth-loading.tsx`
- `src/components/auth/index.ts`

---

## Section 7: Layout Integration (20 minutes)

**Update: `src/app/layout.tsx`**

```typescript
// Add import
import { AuthService } from "@/services/auth.service";
import { UserMenu, AuthLoading } from "@/components/auth";

// In the layout component, add user session check and user menu
// This will be integrated into the existing layout structure
```

**Update navigation component** (exact file path from existing codebase):

- Add UserMenu to header/navigation
- Show loading state during auth check
- Handle authenticated vs unauthenticated states

**Files Updated:**

- `src/app/layout.tsx` (or relevant layout file)
- Navigation component (exact path to be determined)

---

## Section 8: Route Protection Implementation (20 minutes)

### 8.1 Auth Wrapper for Protected Pages

**File: `src/components/auth/auth-wrapper.tsx`**

```typescript
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

interface AuthWrapperProps {
  children: ReactNode
  redirectTo?: string
}

export async function AuthWrapper({
  children,
  redirectTo = "/login"
}: AuthWrapperProps) {
  const { isAuthenticated } = getKindeServerSession()

  if (!(await isAuthenticated())) {
    redirect(redirectTo)
  }

  return <>{children}</>
}
```

### 8.2 Update Mailchimp Pages

**Update: `src/app/mailchimp/layout.tsx`** (or create if doesn't exist)

```typescript
import { AuthWrapper } from "@/components/auth/auth-wrapper"

export default function MailchimpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  )
}
```

**Files Created/Updated:**

- `src/components/auth/auth-wrapper.tsx`
- `src/app/mailchimp/layout.tsx`

---

## Section 9: Testing & Validation (30 minutes)

### 9.1 Schema Tests (15 minutes)

**File: `src/test/auth-schemas.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import {
  kindeUserSchema,
  authSessionSchema,
  authErrorSchema,
} from "@/schemas/auth";

describe("Auth Schemas", () => {
  it("validates Kinde user schema", () => {
    const validUser = {
      id: "user_123",
      email: "test@example.com",
      given_name: "John",
      family_name: "Doe",
      picture: "https://example.com/avatar.jpg",
    };

    expect(() => kindeUserSchema.parse(validUser)).not.toThrow();
  });

  it("validates auth session schema", () => {
    const validSession = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };

    expect(() => authSessionSchema.parse(validSession)).not.toThrow();
  });

  it("validates auth error schema", () => {
    const validError = {
      message: "Authentication failed",
      code: "AUTH_ERROR",
    };

    expect(() => authErrorSchema.parse(validError)).not.toThrow();
  });
});
```

### 9.2 Component Tests (15 minutes)

**File: `src/test/user-menu.test.tsx`**

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@/test/test-utils"
import { UserMenu } from "@/components/auth/user-menu"

describe("UserMenu", () => {
  it("renders user information", () => {
    const mockUser = {
      id: "user_123",
      email: "test@example.com",
      given_name: "John",
      family_name: "Doe",
      picture: null,
    }

    render(<UserMenu user={mockUser} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
  })
})
```

**Files Created:**

- `src/test/auth-schemas.test.ts`
- `src/test/user-menu.test.tsx`

---

## Section 10: Documentation & Environment (20 minutes)

### 10.1 Environment Documentation

**Update: `env.example`**

```bash
# Add to existing env.example
# Kinde Authentication
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your-tenant.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/mailchimp
KINDE_GOOGLE_CONNECTION_ID=your_google_connection_id
```

### 10.2 Documentation Updates

**File: `docs/auth-setup.md`**

````markdown
# Authentication Setup Guide

## Kinde Integration

This project uses Kinde for authentication with Google OAuth and email/password support.

### Environment Variables

See `env.example` for required Kinde environment variables.

### Protected Routes

- `/mailchimp/*` - Requires authentication
- `/` - Public (landing page)
- `/login` - Public (authentication page)

### Components

- `UserMenu` - Displays user info and logout
- `AuthWrapper` - Protects routes requiring authentication
- `AuthLoading` - Loading state for auth checks

### API Endpoints

- `/api/auth/[kindeAuth]` - Kinde auth handler
- `/api/auth/health` - Configuration validation

### Usage

```typescript
import { AuthService } from "@/services/auth.service";

// Get current session
const session = await AuthService.getSession();

// Require authentication (throws if not authenticated)
const user = await AuthService.requireAuth();
```
````

```

**Files Created/Updated:**
- Updated: `env.example`
- `docs/auth-setup.md`

---

## Validation Checklist

Before considering implementation complete:

- [ ] All schemas use path aliases (`@/schemas/auth`)
- [ ] All types use path aliases (`@/types/auth`)
- [ ] Middleware protects `/mailchimp/*` routes
- [ ] Login page supports Google and email/password
- [ ] User menu displays in authenticated areas
- [ ] Loading states show during auth checks
- [ ] Tests cover schemas and components
- [ ] Environment variables documented
- [ ] Health endpoint validates configuration
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All imports use path aliases (no relative imports)

---

## Token Optimization Notes

- **Reuse Patterns**: Follow existing schema/type patterns exactly
- **Batch Operations**: Group related file creation in sections
- **Minimal Context**: Each section is self-contained
- **Path Consistency**: Use established `@/` alias patterns
- **Component Reuse**: Leverage existing shadcn/ui components

---

## Estimated Token Consumption

- **Section 1-2**: ~1000 tokens (foundation, schemas, types)
- **Section 3-4**: ~800 tokens (service, middleware)
- **Section 5-6**: ~1200 tokens (pages, components)
- **Section 7-8**: ~600 tokens (integration, protection)
- **Section 9-10**: ~800 tokens (testing, docs)

**Total**: ~4400 tokens for complete implementation
```
