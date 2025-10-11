/**
 * GoogleSignInButton Component Props
 * Props interface for the Google OAuth sign-in button component
 *
 * Following established component type patterns
 */

/**
 * Authentication mode for Google sign-in
 */
export type GoogleAuthMode = "login" | "register";

/**
 * Props for GoogleSignInButton component
 */
export interface GoogleSignInButtonProps {
  /** Authentication mode: login or register */
  mode?: GoogleAuthMode;
  /** Callback fired when an error occurs */
  onError?: (error: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Show error alerts inline */
  showErrorAlert?: boolean;
}

/**
 * Props for GoogleLogo component
 */
export interface GoogleLogoProps {
  /** Additional CSS classes for styling */
  className?: string;
}
