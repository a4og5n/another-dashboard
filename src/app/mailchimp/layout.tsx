/**
 * Mailchimp Layout
 * Protected layout that requires authentication for all mailchimp routes
 *
 * Following established layout patterns with route protection
 */
import { AuthWrapper } from "@/components/auth";

export default function MailchimpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper
      redirectTo="/login"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      }
    >
      {children}
    </AuthWrapper>
  );
}
