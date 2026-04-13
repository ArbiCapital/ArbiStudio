import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 120;

const MODEL_MAP: Record<string, string> = {
  "wan": "fal-ai/wan/v2.1/text-to-video",
  "kling": "fal-ai/kling-video/v2/master",
  "runway": "fal-ai/runway-gen3/turbo/image-to-video",
};

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`gen-vid:${getClientIp(req)}`, 5, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Rate limit: max 5 videos/min" }, { status: 429 });
    }

    const body = await req.json();
    const { prompt, model, imageUrl, duration, aspectRatio } = body as {
      prompt: string;
      model?: string;
      imageUrl?: string;
      duration?: number;
      aspectRatio?: string;
    };

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const selectedModel = MODEL_MAP[model || "wan"] || MODEL_MAP.wan;

    const input: Record<string, unknown> = { prompt };
    if (imageUrl) input.image_url = imageUrl;
    if (duration) input.duration = Math.min(duration, 10);
    if (aspectRatio) input.aspect_ratio = aspectRatio;

    const result = await fal.subscribe(selectedModel, {
      input,
      logs: true,
    });

    const data = result.data as Record<string, unknown>;

    // Different models return video in different fields
    const videoUrl = (data.video as any)?.url || (data as any).video_url || (data as any).output?.url;

    if (!videoUrl) {
      return NextResponse.json({
        success: false,
        error: "Video generated but URL not found in response",
        rawData: JSON.stringify(data).substring(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: { url: videoUrl },
      model: model || "wan",
      prompt,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Video generation failed";
    console.error("Video generation error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
