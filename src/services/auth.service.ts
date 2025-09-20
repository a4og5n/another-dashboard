/**
 * Authentication Service
 * Handles Kinde authentication operations with Zod validation
 *
 * Following established service patterns from base-api.service.ts
 */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { authSessionSchema, kindeUserSchema } from "@/schemas/auth";
import type {
  AuthSession,
  KindeUser,
  UserPermission,
  UserRole,
} from "@/types/auth";

/**
 * AuthService Class
 * Provides authentication utilities with schema validation
 */
export class AuthService {
  /**
   * Get current user session with validation
   * Returns validated session data or null if unauthenticated
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const {
        getUser,
        isAuthenticated,
        getPermissions,
        getRoles,
        getAccessToken,
      } = getKindeServerSession();

      let isAuth = false;
      try {
        const authResult = await isAuthenticated();
        isAuth = !!authResult;
      } catch (error: unknown) {
        // Handle Next.js NEXT_REDIRECT error gracefully
        if (
          error instanceof Error &&
          typeof error.message === "string" &&
          error.message.includes("NEXT_REDIRECT")
        ) {
          // User is not authenticated, do not throw, just return null
          return null;
        }
        // Handle AbortError gracefully (happens during navigation/unmounting)
        if (error instanceof Error && error.name === "AbortError") {
          console.log(
            "AuthService.getSession: Request was aborted (navigation/unmount)",
          );
          return null;
        }
        // Log and return null for any other error
        console.error("AuthService.getSession isAuthenticated error:", error);
        return null;
      }

      if (!isAuth) {
        return null;
      }

      const user = await getUser();
      const permissions = await getPermissions();
      const roles = await getRoles();
      const accessToken = await getAccessToken();

      // Validate user data with Zod schema
      const validatedUser = kindeUserSchema.parse(user);

      // Extract the actual token string if accessToken is an object
      const tokenString = (() => {
        if (!accessToken) return null;
        if (typeof accessToken === "string") return accessToken;
        if (typeof accessToken === "object" && "access_token" in accessToken) {
          return (
            (accessToken as { access_token?: string }).access_token || null
          );
        }
        return null;
      })();

      // Build session object
      const sessionData = {
        user: validatedUser,
        isAuthenticated: isAuth,
        isLoading: false,
        accessToken: tokenString,
        permissions: permissions?.permissions || [],
        roles: roles?.map((role) => role.key) || [],
      };

      // Validate complete session with schema
      const validatedSession = authSessionSchema.parse(sessionData);

      return validatedSession;
    } catch (error) {
      // Handle AbortError gracefully (happens during navigation/unmounting)
      if (error instanceof Error && error.name === "AbortError") {
        console.log(
          "AuthService.getSession: Request was aborted (navigation/unmount)",
        );
        return null;
      }
      // Log and return null for any other error
      console.error("AuthService.getSession error:", error);
      return null;
    }
  }

  /**
   * Require authentication - throws if not authenticated
   * Use this in protected API routes or server actions
   */
  async requireAuth(): Promise<AuthSession> {
    const session = await this.getSession();

    if (!session) {
      throw new Error("Authentication required");
    }

    return session;
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(permission: UserPermission): Promise<boolean> {
    const session = await this.getSession();
    return session?.permissions.includes(permission) || false;
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: UserRole): Promise<boolean> {
    const session = await this.getSession();
    return session?.roles.includes(role) || false;
  }

  /**
   * Get user display name with fallback logic
   */
  getDisplayName(user: KindeUser): string {
    if (user.given_name && user.family_name) {
      return `${user.given_name} ${user.family_name}`;
    }
    if (user.given_name) {
      return user.given_name;
    }
    if (user.family_name) {
      return user.family_name;
    }
    return user.email;
  }

  /**
   * Get user initials for avatar display
   */
  getInitials(user: KindeUser): string {
    const displayName = this.getDisplayName(user);
    const names = displayName.split(" ");

    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }

    return displayName.slice(0, 2).toUpperCase();
  }
}

/**
 * Singleton instance for consistent usage across the app
 */
export const authService = new AuthService();
