import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 300; // 5 min — video generation is slow

const MODEL_MAP: Record<string, string> = {
  "kling": "fal-ai/kling-video/v2.1/master/text-to-video",
  "runway": "fal-ai/runway-gen3/turbo/text-to-video",
  "minimax": "fal-ai/minimax-video",
  "wan": "fal-ai/wan/v2.1",
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

    const selectedModel = MODEL_MAP[model || "kling"] || MODEL_MAP.kling;

    // Use queue API for reliable execution across all models
    const { request_id } = await fal.queue.submit(selectedModel, {
      input: {
        prompt,
        ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
      },
    });

    // Poll until complete (respects maxDuration timeout)
    let status = await fal.queue.status(selectedModel, { requestId: request_id, logs: true });
    while (status.status !== "COMPLETED") {
      if ((status.status as string) === "FAILED") {
        return NextResponse.json({
          success: false,
          error: "La generacion del video fallo. Intenta con otro modelo o prompt.",
        }, { status: 500 });
      }
      await new Promise((r) => setTimeout(r, 3000));
      status = await fal.queue.status(selectedModel, { requestId: request_id, logs: true });
    }

    const result = await fal.queue.result(selectedModel, { requestId: request_id });
    const data = result.data as Record<string, unknown>;

    // Extract video URL — different models use different response shapes
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
      model: model || "kling",
      prompt,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Video generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
