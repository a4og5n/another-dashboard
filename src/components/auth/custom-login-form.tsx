"use client";

/**
 * Custom Login Form Component
 * Provides email/password authentication form with validation
 *
 * IMPORTANT: This demonstrates custom login UI, but due to Kinde's architecture,
 * actual authentication still requires OAuth flow for security.
 *
 * Using shadcn/ui components following established patterns
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import { customLoginAction, customRegisterAction } from "@/actions/auth-login";

type AuthMode = "login" | "register";

interface FormErrors {
  email?: string;
  password?: string;
  confirm_password?: string;
  given_name?: string;
  family_name?: string;
  general?: string;
}

export function CustomLoginForm() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setErrors({});

    startTransition(async () => {
      try {
        let result;

        if (authMode === "login") {
          result = await customLoginAction(formData);
        } else {
          result = await customRegisterAction(formData);
        }

        if (result.success && result.redirectUrl) {
          // For demonstration purposes, we show an alert before redirecting
          // In reality, this would verify credentials first
          const confirmRedirect = window.confirm(
            `⚠️ Kinde Limitation Notice:\n\n` +
              `Custom password verification is not possible with Kinde's current API. ` +
              `This will redirect you to Kinde's secure OAuth flow.\n\n` +
              `Would you like to continue?`,
          );

          if (confirmRedirect) {
            router.push(result.redirectUrl);
          }
        } else if (result.error) {
          setErrors({
            general: result.error.detail,
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {authMode === "login"
            ? "Sign in to your account"
            : "Create your account"}
        </CardTitle>
        <CardDescription>
          {authMode === "login"
            ? "Enter your credentials to access the dashboard"
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* General error alert */}
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          {/* Name fields for registration */}
          {authMode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="given_name">First Name</Label>
                <Input
                  id="given_name"
                  name="given_name"
                  type="text"
                  required
                  disabled={isPending}
                  className={errors.given_name ? "border-red-500" : ""}
                />
                {errors.given_name && (
                  <p className="text-sm text-red-500">{errors.given_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_name">Last Name</Label>
                <Input
                  id="family_name"
                  name="family_name"
                  type="text"
                  required
                  disabled={isPending}
                  className={errors.family_name ? "border-red-500" : ""}
                />
                {errors.family_name && (
                  <p className="text-sm text-red-500">{errors.family_name}</p>
                )}
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                disabled={isPending}
                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={togglePasswordVisibility}
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm password field for registration */}
          {authMode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isPending}
                  className={`pl-10 pr-10 ${errors.confirm_password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-red-500">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {authMode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {authMode === "login" ? (
                  <Mail className="mr-2 h-4 w-4" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                {authMode === "login" ? "Sign In" : "Create Account"}
              </>
            )}
          </Button>
        </form>

        {/* Mode toggle */}
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={toggleAuthMode}
            disabled={isPending}
            className="text-sm"
          >
            {authMode === "login"
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
