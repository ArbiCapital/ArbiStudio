import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const profileSchema = z.object({
  username: z.string(),
  fullName: z.string(),
  bio: z.string(),
  followers: z.string(),
  following: z.string(),
  posts: z.string(),
  isVerified: z.boolean(),
  category: z.string(),
  recentContent: z.array(z.object({
    type: z.enum(["image", "video", "reel", "carousel"]),
    description: z.string(),
    estimatedLikes: z.string(),
    estimatedComments: z.string(),
    caption: z.string(),
    hashtags: z.array(z.string()),
  })),
  contentStrategy: z.object({
    postingFrequency: z.string(),
    topFormats: z.array(z.string()),
    toneOfVoice: z.string(),
    colorPalette: z.string(),
    topHashtags: z.array(z.string()),
  }),
  competitorInsights: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`ig-scrape:${getClientIp(req)}`, 5, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    const cleanUsername = username.replace("@", "").trim();

    // Try to scrape the public profile page
    let scrapedData = "";
    try {
      const res = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/html",
        },
      });
      if (res.ok) {
        const html = await res.text();
        // Extract meta tags for basic info
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (descMatch) scrapedData += `Meta description: ${descMatch[1]}\n`;
        if (titleMatch) scrapedData += `Title: ${titleMatch[1]}\n`;
      }
    } catch {}

    // Use Claude to analyze based on its knowledge + scraped data
    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: profileSchema,
      prompt: `Analiza el perfil de Instagram @${cleanUsername}.

${scrapedData ? `Datos scrapeados: ${scrapedData}` : ""}

Basandote en tu conocimiento sobre esta cuenta, genera un analisis completo y realista:
- Datos del perfil (nombre, bio, seguidores, posts)
- Los ultimos 5 tipos de contenido que suelen publicar
- Estrategia de contenido (frecuencia, formatos, tono, colores, hashtags)
- 3-5 insights accionables para competir contra ellos

Se lo mas preciso posible basandote en tu conocimiento. Si no conoces la cuenta, genera un analisis razonable basado en el tipo de cuenta que parece ser.
Responde en espanol.`,
    });

    return NextResponse.json({ success: true, profile: result.object });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scrape failed" },
      { status: 500 }
    );
  }
}
