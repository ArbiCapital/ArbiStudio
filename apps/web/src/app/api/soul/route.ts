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

    const contentType = req.headers.get("content-type") || "";

    // Mode 1: Image upload (multipart form)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      const name = (formData.get("name") as string) || "Character";
      const style = (formData.get("style") as string) || "Professional";
      const numVariants = Math.min(parseInt(formData.get("numVariants") as string) || 4, 4);

      if (!file) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }

      // Upload image to fal.ai storage
      const imageUrl = await fal.storage.upload(file);

      // Generate variants using Flux Kontext Pro — preserves face identity
      const prompts = [
        `Professional headshot portrait, studio lighting, clean background, ${style.toLowerCase()} style, high detail, 8K, photorealistic`,
        `Portrait from slightly different angle, natural warm lighting, ${style.toLowerCase()} look, professional photo, sharp details`,
        `Close-up portrait, soft dramatic lighting, ${style.toLowerCase()} style, editorial quality, confident expression`,
        `Half-body portrait, modern studio setting, ${style.toLowerCase()} fashion, professional photography, 8K resolution`,
      ];

      const promises = prompts.slice(0, numVariants).map((prompt) =>
        fal.subscribe("fal-ai/flux-pro/kontext", {
          input: {
            prompt: `Keep the same person's face and identity exactly. ${prompt}`,
            image_url: imageUrl,
          },
        }).then((result) => {
          const data = result.data as { images: Array<{ url: string; width: number; height: number }> };
          return data.images?.[0] ? { url: data.images[0].url, width: data.images[0].width, height: data.images[0].height } : null;
        }).catch(() => null)
      );

      const results = (await Promise.all(promises)).filter(Boolean);

      if (results.length === 0) {
        return NextResponse.json({ success: false, error: "No se pudieron generar variantes desde la foto." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        character: { name, description: "Generado desde foto de referencia", variants: results },
      });
    }

    // Mode 2: Text description (JSON body — original mode)
    const { name, description, gender, age, style, numVariants } = await req.json();

    const genderText = gender === "Femenino" ? "woman" : gender === "Masculino" ? "man" : "person";

    const characterPrompt = `Professional portrait photography of a ${genderText}, approximately ${age} years old, ${description}. Style: ${style}. Clean studio background, professional lighting, high detail, 8K resolution, photorealistic, natural and approachable expression, suitable for commercial brand imagery.`;

    const count = Math.min(numVariants || 2, 4);

    const promises = Array.from({ length: count }, (_, i) =>
      fal.subscribe("fal-ai/flux-pro/v1.1", {
        input: {
          prompt: characterPrompt + (i > 0 ? ` Variation ${i + 1}, different angle and expression.` : ""),
          image_size: "square_hd",
          num_images: 1,
          seed: Date.now() + i * 7919,
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
