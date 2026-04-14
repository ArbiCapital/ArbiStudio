import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const secret = process.env.CROSS_APP_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/login", req.url));

  try {
    // Verify HMAC
    const [payloadB64, sig] = token.split(".");
    const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (expected !== sig) throw new Error("Bad signature");

    const { email, ts } = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (Date.now() - ts > 30000) throw new Error("Expired");

    // Create Supabase session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch { /* ignore */ }
          },
        },
      }
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: process.env.SSO_SHARED_PASSWORD || "47564756Oskar",
    });

    if (error) return NextResponse.redirect(new URL("/login?error=auth", req.url));

    return NextResponse.redirect(new URL("/chat", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=sso", req.url));
  }
}
