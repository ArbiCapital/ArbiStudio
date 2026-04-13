// Shared cookie options for cross-subdomain SSO with ArbiCapital Hub
export const cookieOptions = {
  domain: process.env.NODE_ENV === "production" ? ".arbicapitaluae.com" : undefined,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
