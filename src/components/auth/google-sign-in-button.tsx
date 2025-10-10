"use client";

/**
 * Google Sign-In Button Component
 * Provides OAuth authentication via Kinde with Google connection
 *
 * Features:
 * - Google branding per Google's brand guidelines
 * - Direct navigation to Kinde OAuth with connection_id
 * - Error handling with user feedback
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Uses Kinde OAuth with Google connection ID
 *
 * Following Kinde's custom UI documentation:
 * https://docs.kinde.com/build/authentication/custom-configurations/custom-sign-up-sign-in/
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  onError,
  className = "",
  showErrorAlert = true,
}: GoogleSignInButtonProps) {
  const [error, setError] = useState<string | null>(null);

  // Construct the Kinde auth URL with Google connection_id parameter
  // Per Kinde's custom UI documentation, we pass connection_id as a query parameter
  // to tell Kinde which OAuth provider to use (Google in this case)
  const connectionId = process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID;

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("GoogleSignInButton - connectionId:", connectionId);
    console.log("GoogleSignInButton - all NEXT_PUBLIC env vars:", {
      connectionId: process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID,
    });
  }

  // Build the auth URL based on mode (login vs register)
  const authEndpoint =
    mode === "register" ? "/api/auth/register" : "/api/auth/login";
  const postLoginRedirect = "/mailchimp";

  // Construct full auth URL with connection_id and post_login_redirect_url
  const authUrl = `${authEndpoint}?connection_id=${connectionId}&post_login_redirect_url=${encodeURIComponent(postLoginRedirect)}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Validate that connection_id is available
    if (!connectionId) {
      e.preventDefault();
      const errorMessage =
        "Google OAuth not configured. Please check environment variables.";
      setError(errorMessage);
      onError?.(errorMessage);

      if (process.env.NODE_ENV === "development") {
        console.error("Missing NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID");
      }
      return;
    }

    // Navigate to the auth URL
    window.location.href = authUrl;
  };

  return (
    <div className="w-full space-y-3">
      {/* Error alert - following established Alert component patterns */}
      {showErrorAlert && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google sign-in button - following Google's brand guidelines */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={`w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 font-medium dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-200 dark:border-gray-600 ${className}`}
        onClick={handleClick}
        aria-label={
          mode === "register" ? "Sign up with Google" : "Sign in with Google"
        }
        title={
          connectionId
            ? undefined
            : "Google OAuth not configured - check console"
        }
      >
        <GoogleLogo className="mr-3 h-5 w-5" />
        <span>
          {mode === "register" ? "Sign up with Google" : "Continue with Google"}
          {!connectionId && (
            <span className="ml-2 text-xs text-red-500">[CONFIG MISSING]</span>
          )}
        </span>
      </Button>
    </div>
  );
}
