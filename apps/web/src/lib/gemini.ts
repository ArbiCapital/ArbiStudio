import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not configured");
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }
  return genAI;
}

export interface GeminiImageParams {
  prompt: string;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}

export interface GeminiGeneratedImage {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "3:4": { width: 768, height: 1024 },
  "4:3": { width: 1024, height: 768 },
  "9:16": { width: 576, height: 1024 },
  "16:9": { width: 1024, height: 576 },
};

export function mapRatioToGemini(
  ratio: string
): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" {
  const map: Record<string, "1:1" | "3:4" | "4:3" | "9:16" | "16:9"> = {
    "1:1": "1:1",
    "4:5": "3:4",
    "9:16": "9:16",
    "16:9": "16:9",
    "4:3": "4:3",
  };
  return map[ratio] || "1:1";
}

export async function generateGeminiImage(
  params: GeminiImageParams
): Promise<GeminiGeneratedImage[]> {
  const client = getClient();
  const aspectRatio = params.aspectRatio || "1:1";
  const dimensions = ASPECT_DIMENSIONS[aspectRatio];

  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    generationConfig: {
      responseModalities: ["image", "text"],
    } as any,
  });

  const response = await model.generateContent(params.prompt);
  const images: GeminiGeneratedImage[] = [];

  if (response.response.candidates) {
    for (const candidate of response.response.candidates) {
      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            images.push({
              base64: part.inlineData.data || "",
              mimeType: part.inlineData.mimeType || "image/png",
              width: dimensions.width,
              height: dimensions.height,
            });
          }
        }
      }
    }
  }

  return images;
}
