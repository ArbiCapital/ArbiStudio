import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { z } from "zod";
import { generateImage, ratioToImageSize } from "@/lib/fal";
import { generateGeminiImage, mapRatioToGemini } from "@/lib/gemini";

export const maxDuration = 120;

const SYSTEM_PROMPT = `Eres ArbiStudio, el asistente de creacion de contenido IA mas avanzado del mercado.

## CONTEXTO DEL USUARIO:
Los mensajes del usuario incluyen un tag [CONTEXT: formato=X, estilo=Y] al inicio. USA esos valores para:
- "formato" → usalo como ratio en generateImage
- "estilo" → usalo para seleccionar el modelo y estilo del prompt
NO muestres el tag [CONTEXT] al usuario. Ignora su existencia en tu respuesta.

## REGLAS CRITICAS PARA GENERACION DE IMAGEN:

1. SIEMPRE usa la tool generateImage cuando el usuario pida cualquier tipo de imagen
2. El prompt para la tool DEBE ser EN INGLES, ultra-detallado y profesional
3. RESPETA el formato que el usuario tiene seleccionado. Si tiene "4:5" seleccionado, usa ratio "4:5"
4. RESPETA el estilo seleccionado:
   - "photorealistic" → model "flux-pro", prompt con: "photorealistic, professional photography, 8K detail, natural lighting, sharp focus"
   - "cinematic" → model "flux-pro", prompt con: "cinematic still, film grain, anamorphic bokeh, dramatic lighting, color graded"
   - "editorial" → model "flux-pro", prompt con: "editorial fashion photography, studio lighting, high-end magazine style"
   - "animated" → model "recraft", prompt con: "3D animated character, Pixar style, vibrant colors, soft lighting, detailed textures"
   - "anime" → model "recraft", prompt con: "anime style illustration, detailed anime art, cel shading, vibrant colors"
   - "illustration" → model "recraft", prompt con: "digital illustration, vector art, clean lines, modern graphic design"
   - "product" → model "flux-pro", prompt con: "professional product photography, studio lighting, clean white background, commercial quality"
   - "minimal" → model "flux-pro", prompt con: "minimalist photography, clean composition, negative space, subtle tones"
   - "ad-banner" → model "ideogram", prompt con: "professional advertising banner, bold typography, commercial design"

5. ESTRUCTURA DEL PROMPT DE IMAGEN (sigue este orden):
   [Sujeto principal] + [Accion/Pose] + [Entorno/Fondo] + [Iluminacion] + [Estilo fotografico] + [Detalles tecnicos] + [Mood/Atmosfera]

   Ejemplo BUENO: "Luxury Swiss wristwatch with silver metal band resting on polished white marble surface, soft natural window light from the left creating gentle shadows, product photography style, 8K resolution, shallow depth of field f/2.8, warm neutral tones, elegant and sophisticated atmosphere"

   Ejemplo MALO: "a watch on marble" (demasiado vago)

6. Despues de generar, sugiere brevemente: variantes, otros formatos, ediciones posibles

## SELECCION DE MODELO:
- flux-pro: Fotorrealismo, producto, retrato, editorial, cinematografico, minimal
- ideogram: Texto en imagen, banners publicitarios, titulos, logos con texto
- recraft: Ilustracion, animacion 3D, anime, vectores, branding artistico
- kontext: Edicion de imagen existente
- gemini: 4K maximo detalle (solo si el usuario lo pide especificamente)

## GENERACION DE ANUNCIOS PARA INSTAGRAM:
Cuando el usuario pida "generar anuncio", "crear ad para Instagram", "anuncio estatico", etc.:
1. Usa la tool generateInstagramAd
2. Esta tool genera TODO de golpe: imagen + copy + hashtags + CTA
3. El copy DEBE ser en ESPANOL (es el idioma del mercado del usuario)
4. Los hashtags deben ser relevantes al sector (max 20)
5. El CTA debe ser claro y accionable
6. Genera la imagen con el formato del usuario (normalmente 4:5 o 1:1 para feed)

## RESPONDE SIEMPRE EN ESPANOL. Los prompts de imagen siempre en ingles.`;

export async function POST(req: Request) {
  // Auth check
  const { requireAuth } = await import("@/lib/api-auth");
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.error!;

  // Rate limit: 30 requests per minute per IP
  const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
  const ip = getClientIp(req);
  const { success } = rateLimit(`chat:${ip}`, 30, 60_000);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
  }

  const { messages: rawMessages } = await req.json();

  // Convert UI messages (parts-based) to model messages (content-based)
  const messages = rawMessages.map((msg: any) => {
    if (msg.content) return msg;
    const textParts = msg.parts?.filter((p: any) => p.type === "text") || [];
    const content = textParts.map((p: any) => p.text).join("") || "";
    return { role: msg.role, content };
  });

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      generateImage: {
        description:
          "Generate an AI image. Write ultra-detailed English prompts following the structure: [Subject] + [Action] + [Environment] + [Lighting] + [Style] + [Technical] + [Mood]. Choose model based on the selected style.",
        inputSchema: z.object({
          prompt: z
            .string()
            .describe("Ultra-detailed image prompt IN ENGLISH. Follow the structure: subject, action, environment, lighting, style, technical details, mood. Minimum 30 words."),
          model: z
            .enum(["flux-pro", "ideogram", "recraft", "kontext", "gemini"])
            .describe("flux-pro: photos/cinematic/editorial/product/minimal. ideogram: text-in-image/banners. recraft: illustration/animated/anime. kontext: editing. gemini: 4K."),
          ratio: z
            .enum(["1:1", "4:5", "9:16", "16:9", "4:3"])
            .describe("Aspect ratio. MUST match the user's [CONTEXT: formato=X] tag. Default 4:5 for Instagram."),
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
                model: "gemini", ratio, prompt,
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
              images: images.map((img) => ({ url: img.url, width: img.width, height: img.height })),
              model, ratio, prompt,
            };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Generation error" };
          }
        },
      },
      editImage: {
        description: "Edit an existing image: upscale, remove background, inpaint, or style transfer.",
        inputSchema: z.object({
          sourceImageUrl: z.string().describe("URL of the image to edit"),
          instruction: z.string().describe("What to change, in English"),
          operation: z.enum(["inpaint", "style-transfer", "background-removal", "upscale", "outpaint"]).describe("Type of edit"),
        }),
        execute: async ({ sourceImageUrl, instruction, operation }: { sourceImageUrl: string; instruction: string; operation: string }) => {
          if (!process.env.FAL_KEY) return { success: false, error: "FAL_KEY no configurada." };
          try {
            const { fal } = await import("@fal-ai/client");
            fal.config({ credentials: process.env.FAL_KEY });
            if (operation === "upscale") {
              const result = await fal.subscribe("fal-ai/clarity-upscaler", { input: { image_url: sourceImageUrl } });
              const data = result.data as { image: { url: string; width: number; height: number } };
              return { success: true, images: [{ url: data.image.url, width: data.image.width, height: data.image.height }], operation };
            }
            if (operation === "background-removal") {
              const result = await fal.subscribe("fal-ai/bria/background/remove", { input: { image_url: sourceImageUrl } });
              const data = result.data as { image: { url: string; width: number; height: number } };
              return { success: true, images: [{ url: data.image.url, width: data.image.width, height: data.image.height }], operation };
            }
            const images = await generateImage({ prompt: instruction, model: "fal-ai/flux-pro/kontext" as any, imageSize: "square_hd" });
            return { success: true, images: images.map((img) => ({ url: img.url, width: img.width, height: img.height })), operation };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Edit error" };
          }
        },
      },
      generateInstagramAd: {
        description: "Generate a complete Instagram ad: image + caption + hashtags + CTA. Use when user asks for an ad, anuncio, or creative for Instagram.",
        inputSchema: z.object({
          imagePrompt: z.string().describe("Detailed image prompt IN ENGLISH for the ad visual. Professional, commercial quality."),
          headline: z.string().describe("Short attention-grabbing headline IN SPANISH (max 10 words)"),
          caption: z.string().describe("Full Instagram caption IN SPANISH. Persuasive, with emojis, 2-3 paragraphs. Include a clear value proposition."),
          cta: z.string().describe("Call to action IN SPANISH (e.g., 'Comenta INFO', 'Link en bio', 'Reserva tu plaza')"),
          hashtags: z.array(z.string()).describe("15-20 relevant hashtags in Spanish (without #)"),
          targetAudience: z.string().describe("Description of target audience in Spanish"),
          ratio: z.enum(["1:1", "4:5", "9:16"]).describe("Format: 4:5 for feed (recommended), 1:1 for square, 9:16 for stories/reels"),
          model: z.enum(["flux-pro", "ideogram", "recraft"]).describe("flux-pro for photos, ideogram for text-heavy banners, recraft for illustrations"),
        }),
        execute: async ({ imagePrompt, headline, caption, cta, hashtags, targetAudience, ratio, model }: {
          imagePrompt: string; headline: string; caption: string; cta: string;
          hashtags: string[]; targetAudience: string; ratio: string; model: string;
        }) => {
          const MODEL_MAP: Record<string, string> = {
            "flux-pro": "fal-ai/flux-pro/v1.1",
            ideogram: "fal-ai/ideogram/v3",
            recraft: "fal-ai/recraft-v3",
          };

          if (!process.env.FAL_KEY) return { success: false, error: "FAL_KEY no configurada." };

          try {
            const images = await generateImage({
              prompt: imagePrompt,
              model: MODEL_MAP[model] as any,
              imageSize: ratioToImageSize(ratio),
              numImages: 1,
            });

            return {
              success: true,
              type: "instagram_ad",
              images: images.map((img) => ({ url: img.url, width: img.width, height: img.height })),
              ad: {
                headline,
                caption,
                cta,
                hashtags: hashtags.map((h) => `#${h}`).join(" "),
                targetAudience,
              },
              model, ratio, prompt: imagePrompt,
            };
          } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : "Ad generation error" };
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
