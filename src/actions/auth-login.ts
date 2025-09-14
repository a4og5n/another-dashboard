/**
 * Custom Authentication Actions
 *
 * IMPORTANT NOTICE:
 * After thorough research of Kinde's capabilities, true custom login with password verification
 * is not possible with Kinde's current architecture. Kinde is designed around OAuth flows
 * and does not expose password verification APIs for security reasons.
 *
 * This file demonstrates what would be needed for custom login, but the actual implementation
 * requires either:
 * 1. Staying with Kinde's OAuth flow (current implementation)
 * 2. Switching to a different auth provider that supports custom login forms
 * 3. Using a hybrid approach with Kinde for user management + separate password storage
 *
 * Following established action patterns and using Zod validation
 */
"use server";

import { customLoginSchema, customRegisterSchema } from "@/schemas/auth";
import type { AuthError } from "@/types/auth";

/**
 * Custom login action - DEMONSTRATION ONLY
 * Note: Kinde does not support direct password verification via API
 */
export async function customLoginAction(
  formData: FormData,
): Promise<{ success: boolean; redirectUrl?: string; error?: AuthError }> {
  try {
    // Parse and validate input
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = customLoginSchema.parse(rawData);

    // ⚠️ LIMITATION: Kinde doesn't provide password verification API
    // In a real implementation, you would need to verify the password
    // against Kinde's user database, but this API doesn't exist

    console.warn("⚠️ Kinde does not support direct password verification");
    console.log("Validated login attempt for:", validatedData.email);

    // Since we can't verify the password, we redirect to Kinde's OAuth flow
    // This maintains security while giving the appearance of custom login
    const authUrl = `/api/auth/login?post_login_redirect_url=${encodeURIComponent("/mailchimp")}`;

    return {
      success: true,
      redirectUrl: authUrl,
    };
  } catch (error) {
    console.error("Custom login error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: {
          type: "validation_error",
          title: "Validation Error",
          status: 400,
          detail: "Invalid email or password format",
        },
      };
    }

    return {
      success: false,
      error: {
        type: "internal_server_error",
        title: "Internal Server Error",
        status: 500,
        detail: "An unexpected error occurred during login",
      },
    };
  }
}

/**
 * Custom registration action - DEMONSTRATION ONLY
 * Note: While user creation via Management API is possible,
 * password setting is not supported in the same way
 */
export async function customRegisterAction(
  formData: FormData,
): Promise<{ success: boolean; redirectUrl?: string; error?: AuthError }> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirm_password: formData.get("confirm_password") as string,
      given_name: formData.get("given_name") as string,
      family_name: formData.get("family_name") as string,
    };

    const validatedData = customRegisterSchema.parse(rawData);

    // ⚠️ LIMITATION: While we can create users via Management API,
    // setting passwords directly is not supported - users must go through
    // Kinde's OAuth flow to set their initial password

    console.warn(
      "⚠️ Kinde user creation requires OAuth flow for password setup",
    );
    console.log("Validated registration attempt for:", validatedData.email);

    // Redirect to Kinde's registration flow
    const authUrl = `/api/auth/register?post_login_redirect_url=${encodeURIComponent("/mailchimp")}`;

    return {
      success: true,
      redirectUrl: authUrl,
    };
  } catch (error) {
    console.error("Custom registration error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: {
          type: "validation_error",
          title: "Validation Error",
          status: 400,
          detail: "Please check your input and try again",
        },
      };
    }

    return {
      success: false,
      error: {
        type: "internal_server_error",
        title: "Internal Server Error",
        status: 500,
        detail: "An unexpected error occurred during registration",
      },
    };
  }
}
