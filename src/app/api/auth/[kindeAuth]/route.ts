/**
 * Kinde Auth API Route Handler
 * Handles all Kinde authentication callbacks and operations
 * 
 * This route is required by @kinde-oss/kinde-auth-nextjs
 * Following Next.js 15 App Router patterns
 */
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth();