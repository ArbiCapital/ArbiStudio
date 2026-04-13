import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const competitorSchema = z.object({
  name: z.string(),
  handle: z.string(),
  platform: z.string(),
  estimatedFollowers: z.string(),
  postsPerWeek: z.number(),
  engagementRate: z.number(),
  topFormats: z.array(z.string()),
  contentPillars: z.array(z.string()),
  toneOfVoice: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  topContent: z.array(z.object({
    description: z.string(),
    estimatedEngagement: z.string(),
    format: z.string(),
  })),
  recommendations: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`competitor:${getClientIp(req)}`, 5, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { target, platform } = await req.json();

    if (!target) {
      return NextResponse.json({ error: "Target is required" }, { status: 400 });
    }

    // First, try to scrape basic info from the URL/handle
    let scrapedContext = "";
    try {
      if (target.startsWith("http")) {
        const scrapeRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: target }),
        });
        const scrapeData = await scrapeRes.json();
        if (scrapeData.success) {
          scrapedContext = `Datos scrapeados de ${target}: Titulo: ${scrapeData.data.title}, Descripcion: ${scrapeData.data.description}, Headings: ${scrapeData.data.subHeadings?.join(", ")}`;
        }
      }
    } catch {}

    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: competitorSchema,
      prompt: `Analiza al competidor "${target}" en la plataforma "${platform || "instagram"}".

${scrapedContext ? `Contexto adicional scrapeado: ${scrapedContext}` : ""}

Genera un analisis completo y realista basado en tu conocimiento del sector. Incluye:
- Datos estimados del perfil (seguidores, posts/semana, engagement rate)
- Formatos de contenido que usan mas
- Pilares de contenido
- Tono de voz
- Fortalezas y debilidades
- Oportunidades para superarlos
- Sus 3 mejores tipos de contenido con engagement estimado
- 3-5 recomendaciones accionables

Responde en espanol. Se especifico y accionable.`,
    });

    return NextResponse.json({ success: true, analysis: result.object });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
