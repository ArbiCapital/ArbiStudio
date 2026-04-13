import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const calendarItemSchema = z.object({
  day: z.number().min(1).max(31),
  title: z.string(),
  type: z.enum(["image", "video", "carousel", "story", "article"]),
  platform: z.string(),
  time: z.string().optional(),
  description: z.string(),
});

const strategySchema = z.object({
  items: z.array(calendarItemSchema),
  pillars: z.array(z.object({
    name: z.string(),
    percentage: z.number(),
    description: z.string(),
  })),
  insights: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`strategy:${getClientIp(req)}`, 5, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { industry, audience, platforms, month, year, postsPerWeek } = await req.json();

    const result = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: strategySchema,
      prompt: `Genera un calendario editorial completo para ${month || "el proximo mes"} ${year || 2026}.

Industria: ${industry || "Marketing digital"}
Audiencia: ${audience || "Emprendedores y pymes en Espana"}
Plataformas: ${platforms || "Instagram, TikTok, LinkedIn"}
Posts por semana: ${postsPerWeek || 5}

Genera:
1. items: Piezas de contenido distribuidas en el mes (dia, titulo, tipo, plataforma, hora optima, descripcion)
2. pillars: Pilares de contenido con porcentaje (ej: Educativo 40%, Inspiracional 25%, Producto 20%, Engagement 15%)
3. insights: 3-5 recomendaciones estrategicas

Tipos disponibles: image, video, carousel, story, article
Horas optimas para Espana: 09:00, 12:00, 19:00, 21:00
Distribuye contenido de forma variada. No repitas formatos consecutivos.
Responde en espanol.`,
    });

    return NextResponse.json({ success: true, strategy: result.object });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Strategy generation failed" },
      { status: 500 }
    );
  }
}
