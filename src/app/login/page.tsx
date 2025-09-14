/**
 * Login Page
 * Provides authentication options using Kinde Auth
 * 
 * Following established page patterns and using shadcn/ui components
 */
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  // Check if user is already authenticated
  const { isAuthenticated } = getKindeServerSession();
  
  if (await isAuthenticated()) {
    redirect("/mailchimp");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your Mailchimp Dashboard
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-center text-sm text-muted-foreground">
          Secure authentication powered by{" "}
          <a 
            href="https://kinde.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Kinde
          </a>
        </p>
      </div>
    </div>
  );
}