/**
 * Login Page - MVP Version with Google OAuth
 * Provides custom Google OAuth button alongside Kinde's hosted login
 *
 * Features:
 * - Google OAuth sign-in with custom UI (stays on our domain)
 * - Fallback to Kinde's hosted authentication (email, password, etc.)
 * - Seamless user experience without Kinde branding
 */
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google OAuth Sign-In - Primary option */}
            <GoogleSignInButton mode="login" />

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

            {/* Kinde Hosted Login - Fallback option for email/password */}
            <LoginLink>
              <Button className="w-full" size="lg">
                Sign In
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

            {/* Register Account */}
            <RegisterLink>
              <Button variant="outline" className="w-full" size="lg">
                Create Account
              </Button>
            </RegisterLink>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}
