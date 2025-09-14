/**
 * Auth Provider Component
 * Server component that fetches auth state and provides it to client components
 * 
 * Following React server component patterns for auth integration
 */
import { authService } from "@/services/auth.service";
import type { AuthSession } from "@/types/auth";

interface AuthProviderProps {
  children: (authData: {
    session: AuthSession | null;
    displayName?: string;
    initials?: string;
  }) => React.ReactNode;
}

export async function AuthProvider({ children }: AuthProviderProps) {
  // Get auth session on server
  const session = await authService.getSession();
  
  // Prepare auth data
  const authData = {
    session,
    displayName: session ? authService.getDisplayName(session.user) : undefined,
    initials: session ? authService.getInitials(session.user) : undefined,
  };

  return <>{children(authData)}</>;
}