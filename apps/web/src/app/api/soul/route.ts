import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const { name, description, gender, age, style } = await req.json();

    // Generate 4 character variants using Flux Pro with detailed character prompt
    const characterPrompt = `Professional portrait photography of a ${gender === "Femenino" ? "woman" : gender === "Masculino" ? "man" : "person"}, approximately ${age} years old, ${description}. Style: ${style}. Clean background, professional studio lighting, high detail, 8K resolution, photorealistic. The person should look natural and approachable, suitable for commercial brand imagery.`;

    const results = [];
    for (let i = 0; i < 4; i++) {
      const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
        input: {
          prompt: characterPrompt + ` Variant ${i + 1}, slightly different angle and expression.`,
          image_size: "square_hd",
          num_images: 1,
          seed: Date.now() + i * 1000,
        },
      });

      const data = result.data as { images: Array<{ url: string; width: number; height: number }> };
      if (data.images?.[0]) {
        results.push({
          url: data.images[0].url,
          width: data.images[0].width,
          height: data.images[0].height,
        });
      }
    }

    return NextResponse.json({
      success: true,
      character: {
        name,
        description,
        variants: results,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Character generation failed" },
      { status: 500 }
    );
  }
}
