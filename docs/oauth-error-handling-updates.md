# OAuth Error Handling Updates

Based on Next.js App Router best practices: https://nextjs.org/docs/app/getting-started/error-handling

## Key Changes Needed

### 1. OAuth Service (Services Layer)

**Current approach (in plan):**
```typescript
async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
  // ... fetch logic
  if (!response.ok) {
    throw new Error(`Failed to exchange code for token`);
  }
  return data;
}
```

**✅ Recommended approach (return error objects):**
```typescript
type Result<T> = { success: true; data: T } | { success: false; error: string };

async exchangeCodeForToken(code: string): Promise<Result<OAuthTokenResponse>> {
  try {
    const response = await fetch(this.tokenUrl, { /* ... */ });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token exchange failed:", error);
      return {
        success: false,
        error: `Failed to exchange code for token: ${response.statusText}`
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Token exchange error:", error);
    return {
      success: false,
      error: "Network error during token exchange"
    };
  }
}
```

### 2. Route Handlers (API Routes)

**Current approach is mostly correct** - Route handlers CAN use try/catch and return NextResponse.

**Minor improvements:**
- Add proper status codes for all error cases
- Consider adding error boundaries for the pages that call these routes
- Log errors to monitoring service (Sentry, etc.)

**Example (good as-is but can be enhanced):**
```typescript
export async function GET(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.redirect(new URL("/success", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    // ✅ Could add: await logToSentry(error);
    return NextResponse.redirect(
      new URL("/mailchimp?error=connection_failed", request.url),
    );
  }
}
```

### 3. Server Actions (If we add them later)

For Server Actions (not in current plan), use return values:

```typescript
"use server";

export async function connectMailchimp(formData: FormData) {
  // Validate input
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  // Do work
  const result = await mailchimpOAuthService.completeOAuthFlow(code);
  if (!result.success) {
    return { error: result.error };
  }

  // Success
  return { success: true };
}
```

### 4. Client Components Calling APIs

Add error boundaries or handle errors in UI:

```typescript
"use client";

export function ConnectMailchimpButton() {
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    try {
      const res = await fetch("/api/auth/mailchimp/authorize", {
        method: "POST",
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Failed to connect");
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  return (
    <>
      {error && <div className="error">{error}</div>}
      <button onClick={handleConnect}>Connect Mailchimp</button>
    </>
  );
}
```

## Summary of Recommendations

### ✅ Keep as-is:
- Route handlers with try/catch (they're correct)
- Error redirects with query parameters
- CSRF validation and error handling

### 🔄 Consider updating:
1. **OAuth Service methods**: Return `Result<T>` objects instead of throwing
2. **Repository methods**: Return `Result<T>` for expected errors (e.g., "connection not found")
3. **Add error boundaries**: For pages that use these OAuth flows
4. **Zod validation**: Use `.safeParse()` instead of `.parse()` to avoid throwing

### 📝 Implementation Priority:
1. **Low priority**: Current plan is functional and mostly follows Next.js patterns
2. **Nice to have**: Refactor service methods to return Result types
3. **Future enhancement**: Add error boundaries when building UI components

## Conclusion

The current migration plan is **acceptable as-is** for route handlers. The main improvement would be to refactor the **OAuth service methods** to return Result types instead of throwing errors. This would make error handling more explicit and easier to test.

However, since route handlers naturally use try/catch, the current approach will work fine. We can refactor to Result types as a future enhancement if needed.
