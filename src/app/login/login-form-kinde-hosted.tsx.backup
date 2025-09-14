"use client";

/**
 * Login Form Component
 * Provides Google OAuth and email/password authentication options
 * 
 * Using shadcn/ui components following established patterns
 */
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Choose your preferred authentication method
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Google OAuth Login */}
        <LoginLink
          authUrlParams={
            process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID 
              ? { connection_id: process.env.NEXT_PUBLIC_KINDE_GOOGLE_CONNECTION_ID }
              : {}
          }
          className="w-full"
        >
          <Button variant="outline" className="w-full" size="lg">
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
              ></path>
            </svg>
            Continue with Google
          </Button>
        </LoginLink>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email/Password Login */}
        <LoginLink className="w-full">
          <Button className="w-full" size="lg">
            <Mail className="mr-2 h-4 w-4" />
            Continue with Email
          </Button>
        </LoginLink>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              New user?
            </span>
          </div>
        </div>

        {/* Registration Link */}
        <RegisterLink className="w-full">
          <Button variant="outline" className="w-full" size="lg">
            <User className="mr-2 h-4 w-4" />
            Create an account
          </Button>
        </RegisterLink>
      </CardContent>
    </Card>
  );
}