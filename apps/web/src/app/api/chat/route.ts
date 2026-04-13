import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import { generateImage, ratioToImageSize } from "@/lib/fal";
import { generateGeminiImage, mapRatioToGemini } from "@/lib/gemini";

export const maxDuration = 120;

const SYSTEM_PROMPT = `Eres ArbiStudio, el asistente de creacion de contenido IA mas avanzado del mercado.

## Tus capacidades:
1. **Image Studio**: Generas imagenes con IA (Flux Pro, Ideogram, Recraft, Gemini 4K)
2. **Video Studio**: Produces video profesional con subtitulos, motion graphics, musica
3. **Cinema Studio**: Controles cinematograficos (camara, lente, color grading)
4. **Click-to-Ad**: Pega una URL y generas anuncios automaticamente
5. **Ads Hub**: Publicas directo en Meta, Google y TikTok Ads
6. **Competitor Intel**: Analizas la competencia scrapeando ads y contenido
7. **Strategy Engine**: Planificas calendarios editoriales basados en datos

## Reglas de interaccion:
- Responde siempre en espanol
- Se conciso y profesional
- Cuando el usuario quiera una imagen, usa SIEMPRE la tool generateImage
- Para el prompt de la tool, escribe un prompt detallado EN INGLES optimizado para el modelo de IA
- Describe al usuario en espanol que vas a generar antes de hacerlo
- Sugiere variantes y formatos alternativos despues de generar
- Si el usuario pega una URL, analiza que quiere y sugiere acciones
- Para batch generation, puedes llamar generateImage varias veces con distintos prompts/estilos

## Seleccion de modelo:
- Fotos realistas / producto / retrato → flux-pro (default, mejor calidad)
- Texto en imagen (banners, ads, titulos) → ideogram (mejor texto)
- Ilustraciones / vectores / branding → recraft (estilos artisticos)
- Edicion de imagen existente → kontext (edicion contextual)
- 4K con texto perfecto y grounding → gemini (Google Gemini, maximo detalle)

## Formato de respuesta:
1. Explica brevemente que vas a crear
2. Ejecuta la tool generateImage
3. Tras la generacion, sugiere: editar, variantes, otros formatos, publicar`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      generateImage: {
        description:
          "Generate an AI image. Use detailed English prompts. Choose model based on content type.",
        inputSchema: z.object({
          prompt: z
            .string()
            .describe("Detailed image prompt IN ENGLISH with style, lighting, composition details."),
          model: z
            .enum(["flux-pro", "ideogram", "recraft", "kontext", "gemini"])
            .describe(
              "flux-pro: photorealistic. ideogram: text-in-image. recraft: illustration. kontext: image editing. gemini: 4K with text rendering."
            ),
          ratio: z
            .enum(["1:1", "4:5", "9:16", "16:9", "4:3"])
            .describe("Aspect ratio for the target platform."),
          numImages: z
            .number()
            .min(1)
            .max(4)
            .optional()
            .describe("Number of variants (1-4). Default 1."),
        }),
        execute: async ({ prompt, model, ratio, numImages }: { prompt: string; model: string; ratio: string; numImages?: number }) => {
          // Gemini path
          if (model === "gemini") {
            if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
              return { success: false, error: "GOOGLE_GENERATIVE_AI_API_KEY no configurada." };
            }
            try {
              const images = await generateGeminiImage({
                prompt,
                aspectRatio: mapRatioToGemini(ratio),
              });
              return {
                success: true,
                images: images.map((img) => ({
                  url: `data:${img.mimeType};base64,${img.base64}`,
                  width: img.width,
                  height: img.height,
                })),
                model: "gemini",
                ratio,
                prompt,
              };
            } catch (error) {
              return { success: false, error: error instanceof Error ? error.message : "Gemini error" };
            }
          }

          // fal.ai path
          const MODEL_MAP: Record<string, string> = {
            "flux-pro": "fal-ai/flux-pro/v1.1",
            ideogram: "fal-ai/ideogram/v3",
            recraft: "fal-ai/recraft-v3",
            kontext: "fal-ai/flux-pro/kontext",
          };

          if (!process.env.FAL_KEY) {
            return { success: false, error: "FAL_KEY no configurada." };
          }

          try {
            const images = await generateImage({
              prompt,
              model: MODEL_MAP[model] as any,
              imageSize: ratioToImageSize(ratio),
              numImages: numImages || 1,
            });
            return {
              success: true,
              images: images.map((img) => ({
                url: img.url,
                width: img.width,
                height: img.height,
              })),
              model,
              ratio,
              prompt,
            };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Generation error" };
          }
        },
      },
      editImage: {
        description:
          "Edit an existing image using AI. Supports inpainting, style transfer, background removal, upscaling.",
        inputSchema: z.object({
          sourceImageUrl: z.string().describe("URL of the image to edit"),
          instruction: z.string().describe("What to change, in English"),
          operation: z
            .enum(["inpaint", "style-transfer", "background-removal", "upscale", "outpaint"])
            .describe("Type of edit operation"),
        }),
        execute: async ({ sourceImageUrl, instruction, operation }: { sourceImageUrl: string; instruction: string; operation: string }) => {
          if (!process.env.FAL_KEY) {
            return { success: false, error: "FAL_KEY no configurada." };
          }

          try {
            if (operation === "upscale") {
              const { fal } = await import("@fal-ai/client");
              fal.config({ credentials: process.env.FAL_KEY });
              const result = await fal.subscribe("fal-ai/clarity-upscaler", {
                input: { image_url: sourceImageUrl },
              });
              const data = result.data as { image: { url: string; width: number; height: number } };
              return {
                success: true,
                images: [{ url: data.image.url, width: data.image.width, height: data.image.height }],
                operation,
              };
            }

            if (operation === "background-removal") {
              const { fal } = await import("@fal-ai/client");
              fal.config({ credentials: process.env.FAL_KEY });
              const result = await fal.subscribe("fal-ai/bria/background/remove", {
                input: { image_url: sourceImageUrl },
              });
              const data = result.data as { image: { url: string; width: number; height: number } };
              return {
                success: true,
                images: [{ url: data.image.url, width: data.image.width, height: data.image.height }],
                operation,
              };
            }

            // Default: use Kontext for inpaint/style-transfer/outpaint
            const images = await generateImage({
              prompt: instruction,
              model: "fal-ai/flux-pro/kontext" as any,
              imageSize: "square_hd",
            });
            return {
              success: true,
              images: images.map((img) => ({ url: img.url, width: img.width, height: img.height })),
              operation,
            };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Edit error" };
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
