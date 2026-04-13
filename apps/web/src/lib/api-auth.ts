/**
 * API route authentication + input validation helpers.
 * Checks Supabase auth for all API routes to prevent unauthorized access.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAuth(): Promise<{
  authenticated: boolean;
  userId?: string;
  error?: NextResponse;
}> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    return { authenticated: true, userId: user.id };
  } catch {
    // If Supabase is unreachable, allow through for development
    // In production, change this to fail-closed
    return { authenticated: true, userId: "anonymous" };
  }
}

/**
 * Validate and sanitize text input
 */
export function validateText(
  text: string | undefined,
  maxLength: number = 5000,
  fieldName: string = "text"
): { valid: boolean; error?: string; sanitized: string } {
  if (!text || typeof text !== "string") {
    return { valid: false, error: `${fieldName} is required`, sanitized: "" };
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty`, sanitized: "" };
  }
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} exceeds max length of ${maxLength} characters`,
      sanitized: "",
    };
  }
  return { valid: true, sanitized: trimmed };
}

/**
 * Sanitize error for client — never expose internal details
 */
export function safeError(error: unknown): string {
  if (error instanceof Error) {
    // Only return generic messages, strip internal details
    if (error.message.includes("rate limit")) return "Rate limit exceeded. Try again later.";
    if (error.message.includes("401") || error.message.includes("auth")) return "Authentication error";
    if (error.message.includes("402") || error.message.includes("billing")) return "API billing issue — check your account";
    return "An error occurred. Please try again.";
  }
  return "An unexpected error occurred.";
}
