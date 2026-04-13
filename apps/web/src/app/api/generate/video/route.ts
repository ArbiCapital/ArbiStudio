import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 120;

type VideoModel =
  | "fal-ai/kling-video/v2/master"
  | "fal-ai/runway-gen3/turbo/image-to-video"
  | "fal-ai/wan/v2.1/text-to-video";

const MODEL_MAP: Record<string, VideoModel> = {
  "kling": "fal-ai/kling-video/v2/master",
  "runway": "fal-ai/runway-gen3/turbo/image-to-video",
  "wan": "fal-ai/wan/v2.1/text-to-video",
};

export async function POST(req: NextRequest) {
  try {
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

    const input: Record<string, unknown> = {
      prompt,
    };

    if (imageUrl) {
      input.image_url = imageUrl;
    }
    if (duration) {
      input.duration = Math.min(duration, 10); // Max 10s for most models
    }
    if (aspectRatio) {
      input.aspect_ratio = aspectRatio;
    }

    const result = await fal.subscribe(selectedModel, {
      input,
      logs: true,
    });

    const data = result.data as { video: { url: string } };

    return NextResponse.json({
      success: true,
      video: {
        url: data.video.url,
      },
      model: model || "wan",
      prompt,
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Video generation failed" },
      { status: 500 }
    );
  }
}
