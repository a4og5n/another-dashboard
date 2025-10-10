"use client";

/**
 * Google Sign-In Button Component
 * Provides OAuth authentication via Kinde with Google connection
 *
 * Features:
 * - Google branding per Google's brand guidelines
 * - Uses Kinde's LoginLink/RegisterLink with authUrlParams for proper OAuth flow
 * - Error handling with user feedback
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Direct Google OAuth via connection_id parameter
 *
 * Following Kinde's Next.js SDK documentation:
 * https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/
 *
 * @component
 * @example
 * ```tsx
 * <GoogleSignInButton
 *   mode="login"
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  GoogleSignInButtonProps,
  GoogleLogoProps,
} from "@/types/components";

/**
 * Google "G" logo SVG component
 * Following Google's brand guidelines for the logo
 */
function GoogleLogo({ className }: GoogleLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  mode = "login",
  className = "",
  showErrorAlert = true,
}: GoogleSignInButtonProps) {
  const router = useRouter();

  // Get Google connection ID from environment variables
  // This tells Kinde which OAuth provider to use (Google in this case)
  const connectionId = process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID;

  // Validate connection_id is configured
  if (!connectionId) {
    const errorMessage =
      "Google OAuth not configured. Missing NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID";

    if (process.env.NODE_ENV === "development") {
      console.error(errorMessage);
    }

    // Show error state
    return (
      <div className="w-full space-y-3">
        {showErrorAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  const buttonText =
    mode === "register" ? "Sign up with Google" : "Continue with Google";
  const ariaLabel =
    mode === "register" ? "Sign up with Google" : "Sign in with Google";

  // Handle click - directly navigate to Kinde API endpoint with connection_id
  const handleClick = () => {
    const authEndpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const postLoginRedirect = "/mailchimp";

    // Build the auth URL with connection_id as query parameter
    // Based on community solutions: router.push to API endpoint with query params
    const authUrl = `${authEndpoint}?connection_id=${connectionId}&post_login_redirect_url=${encodeURIComponent(postLoginRedirect)}`;

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Google OAuth Debug:", {
        connectionId,
        mode,
        authUrl,
      });
      console.log("🚀 Navigating to:", authUrl);
    }

    // Use router.push instead of LoginLink component
    router.push(authUrl);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        className={`w-full inline-flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750 ${className}`}
        aria-label={ariaLabel}
        onClick={handleClick}
      >
        <GoogleLogo className="h-5 w-5" />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}
