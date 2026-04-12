import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import { generateImage, selectModel, ratioToImageSize } from "@/lib/fal";

export const maxDuration = 120;

const SYSTEM_PROMPT = `Eres ArbiStudio, el asistente de creacion de contenido IA mas avanzado del mercado.

## Tus capacidades:
1. **Image Studio**: Generas imagenes fotorrealistas con IA (Flux Pro, Ideogram, Recraft)
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

## Seleccion de modelo:
- Fotos realistas / producto / retrato → flux-pro (default)
- Texto en imagen (banners, ads, titulos) → ideogram
- Ilustraciones / vectores / branding → recraft
- Edicion de imagen existente → kontext

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
          "Generate an AI image. Always use detailed English prompts for best results. Choose the model based on the type of image needed.",
        inputSchema: z.object({
          prompt: z
            .string()
            .describe(
              "Detailed image generation prompt IN ENGLISH. Include style, lighting, composition, mood details."
            ),
          model: z
            .enum(["flux-pro", "ideogram", "recraft", "kontext"])
            .describe(
              "flux-pro: photorealistic/product/portrait. ideogram: text-in-image/banners. recraft: illustration/vector/branding. kontext: image editing."
            ),
          ratio: z
            .enum(["1:1", "4:5", "9:16", "16:9", "4:3"])
            .describe(
              "Aspect ratio. 1:1=Instagram square, 4:5=Instagram feed, 9:16=Stories/Reels/TikTok, 16:9=YouTube/landscape, 4:3=standard"
            ),
          numImages: z
            .number()
            .min(1)
            .max(4)
            .optional()
            .describe("Number of variants to generate (1-4). Default 1."),
        }),
        execute: async ({ prompt, model, ratio, numImages }: { prompt: string; model: string; ratio: string; numImages?: number }) => {
          const MODEL_MAP: Record<string, string> = {
            "flux-pro": "fal-ai/flux-pro/v1.1",
            ideogram: "fal-ai/ideogram/v3",
            recraft: "fal-ai/recraft-v3",
            kontext: "fal-ai/flux-pro/kontext",
          };

          if (!process.env.FAL_KEY) {
            return {
              success: false,
              error: "FAL_KEY no configurada. Anade tu API key de fal.ai en las variables de entorno.",
            };
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
            return {
              success: false,
              error: error instanceof Error ? error.message : "Error generating image",
            };
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
