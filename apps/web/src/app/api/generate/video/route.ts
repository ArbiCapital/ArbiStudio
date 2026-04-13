import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 300; // 5 min — video generation is slow

const MODEL_MAP: Record<string, string> = {
  "minimax": "fal-ai/minimax-video/text-to-video",
  "wan": "fal-ai/wan/v2.1/text-to-video",
  "hunyuan": "fal-ai/hunyuan-video",
};

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`gen-vid:${getClientIp(req)}`, 5, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit: max 5 videos/min" }, { status: 429 });

    const body = await req.json();
    const { prompt, model, aspectRatio } = body as {
      prompt: string;
      model?: string;
      aspectRatio?: string;
    };

    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    if (!process.env.FAL_KEY) return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });

    fal.config({ credentials: process.env.FAL_KEY });

    const selectedModel = MODEL_MAP[model || "minimax"] || MODEL_MAP.minimax;

    const result = await fal.subscribe(selectedModel, {
      input: {
        prompt,
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
      },
      logs: true,
    });

    const data = result.data as Record<string, unknown>;

    // Extract video URL — different models use different fields
    let videoUrl: string | undefined;
    if ((data as any).video?.url) videoUrl = (data as any).video.url;
    else if ((data as any).video_url) videoUrl = (data as any).video_url;
    else if (Array.isArray(data.videos) && (data.videos as any)[0]?.url) videoUrl = (data.videos as any)[0].url;

    if (!videoUrl) {
      return NextResponse.json({
        success: false,
        error: "Video generado pero no se encontro la URL. Intenta con otro modelo.",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: { url: videoUrl },
      model: model || "minimax",
      prompt,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Video generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
