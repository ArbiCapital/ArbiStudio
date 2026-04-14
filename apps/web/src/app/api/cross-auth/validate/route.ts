import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * SSO validate endpoint for ArbiStudio.
 * Receives a one-time code from the Hub, looks up the session tokens
 * in the shared sso_tokens table, sets the Supabase session, and redirects.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    // Look up the SSO token
    const { data: ssoToken, error: lookupError } = await supabase
      .from("sso_tokens")
      .select("access_token, refresh_token, email, used, created_at")
      .eq("token", code)
      .single();

    if (lookupError || !ssoToken) {
      return NextResponse.redirect(new URL("/login?error=invalid_code", req.url));
    }

    // Check not used and not expired (60 seconds max)
    if (ssoToken.used) {
      return NextResponse.redirect(new URL("/login?error=code_used", req.url));
    }

    const age = Date.now() - new Date(ssoToken.created_at).getTime();
    if (age > 60000) {
      return NextResponse.redirect(new URL("/login?error=code_expired", req.url));
    }

    // Mark as used
    await supabase.from("sso_tokens").update({ used: true }).eq("token", code);

    // Set the session using the stored tokens
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: ssoToken.access_token,
      refresh_token: ssoToken.refresh_token,
    });

    if (sessionError) {
      return NextResponse.redirect(new URL("/login?error=session_failed", req.url));
    }

    return NextResponse.redirect(new URL("/chat", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=sso_error", req.url));
  }
}
