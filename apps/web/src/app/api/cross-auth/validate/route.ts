import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const secret = process.env.CROSS_APP_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const [payloadB64, sig] = token.split(".");
    const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (expected !== sig) throw new Error("Bad signature");

    const { email, ts } = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (Date.now() - ts > 30000) throw new Error("Expired");

    const ssoUrl = new URL("/auth/sso", req.url);
    ssoUrl.searchParams.set("email", email);
    return NextResponse.redirect(ssoUrl);
  } catch {
    return NextResponse.redirect(new URL("/login?error=sso", req.url));
  }
}
