/**
 * Login Page - Custom UI with Google OAuth Only
 * Users stay on our domain throughout the entire authentication flow
 *
 * Features:
 * - Google OAuth sign-in with custom UI (only authentication method)
 * - No redirect to Kinde's hosted pages
 * - Clean, branded user experience
 * - Single sign-on via Google for simplicity
 */
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth";

export default async function LoginPage() {
  // Check if user is already authenticated
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect("/mailchimp");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground">
            Access your Mailchimp Dashboard
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google OAuth Sign-In - Only authentication method */}
            <GoogleSignInButton mode="login" />

            <p className="text-center text-xs text-muted-foreground mt-4">
              New users will automatically have an account created
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}
