import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`soul:${getClientIp(req)}`, 3, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const { name, description, gender, age, style, numVariants } = await req.json();

    const genderText = gender === "Femenino" ? "woman" : gender === "Masculino" ? "man" : "person";

    const characterPrompt = `Professional portrait photography of a ${genderText}, approximately ${age} years old, ${description}. Style: ${style}. Clean studio background, professional lighting, high detail, 8K resolution, photorealistic, natural and approachable expression, suitable for commercial brand imagery.`;

    const count = Math.min(numVariants || 2, 4); // Default 2, max 4

    // Generate all variants in parallel for speed
    const promises = Array.from({ length: count }, (_, i) =>
      fal.subscribe("fal-ai/flux-pro/v1.1", {
        input: {
          prompt: characterPrompt + (i > 0 ? ` Variation ${i + 1}, different angle and expression.` : ""),
          image_size: "square_hd",
          num_images: 1,
          seed: Date.now() + i * 7919, // Different seeds
        },
      }).then((result) => {
        const data = result.data as { images: Array<{ url: string; width: number; height: number }> };
        return data.images?.[0] ? { url: data.images[0].url, width: data.images[0].width, height: data.images[0].height } : null;
      }).catch(() => null)
    );

    const results = (await Promise.all(promises)).filter(Boolean);

    if (results.length === 0) {
      return NextResponse.json({ success: false, error: "No se pudieron generar variantes. Verifica tu saldo en fal.ai." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      character: { name, description, variants: results },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Character generation failed" },
      { status: 500 }
    );
  }
}
