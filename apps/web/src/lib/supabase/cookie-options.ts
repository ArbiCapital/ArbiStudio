// Cookie options — host-only (NO domain). SSO entre apps se hace via token
// HMAC + /api/cross-auth/validate, no via cookies compartidas.
// Setear domain=.arbicapitaluae.com causaba que el cookie de Supabase se
// sobreescribiera entre subdominios (hub/studio/...) y dejara sesiones en
// estado "Auth session missing" al refrescar.
export const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
