/**
 * Mailchimp Layout
 * Protected layout that requires authentication for all mailchimp routes
 *
 * Server-side authentication check for improved security and performance
 */
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function MailchimpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const { isAuthenticated } = await getKindeServerSession();

  // Redirect unauthenticated users (server-side)
  if (!isAuthenticated) {
    redirect("/login?post_login_redirect_url=/mailchimp");
  }

  // Render children for authenticated users
  return <>{children}</>;
}
