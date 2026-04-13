import { NextRequest, NextResponse } from "next/server";
import { generateImage, selectModel, ratioToImageSize } from "@/lib/fal";
import type { FalImageModel } from "@/lib/fal";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`gen-img:${getClientIp(req)}`, 15, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Rate limit: max 15 images/min" }, { status: 429 });
    }

    const body = await req.json();
    const { prompt, model, ratio, numImages } = body as {
      prompt: string;
      model?: FalImageModel;
      ratio?: string;
      numImages?: number;
    };

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY not configured" },
        { status: 500 }
      );
    }

    const selectedModel =
      model ||
      selectModel({
        hasText: /text|banner|titulo|headline|copy/i.test(prompt),
        isIllustration: /ilustraci|vector|icon|logo|brand/i.test(prompt),
      });

    const imageSize = ratioToImageSize(ratio || "1:1");

    const images = await generateImage({
      prompt,
      model: selectedModel,
      imageSize,
      numImages: numImages || 1,
    });

    return NextResponse.json({
      success: true,
      images,
      model: selectedModel,
      ratio: ratio || "1:1",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
