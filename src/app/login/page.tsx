/**
 * Login Page - MVP Version
 * Uses Kinde's hosted login for simplicity and security
 * 
 * This redirects users to Kinde's hosted authentication page
 * which handles all authentication methods (email, Google, etc.)
 */
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            {/* Login Button */}
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
            
            {/* Register Button */}
            <RegisterLink>
              <Button variant="outline" className="w-full" size="lg">
                Create Account
              </Button>
            </RegisterLink>
          </CardContent>
        </Card>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
            All authentication methods (email, Google, etc.) are handled securely
          </p>
        </div>
      </div>
    </div>
  );
}