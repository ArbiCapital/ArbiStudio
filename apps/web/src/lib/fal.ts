import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export type FalImageModel =
  | "fal-ai/flux-pro/v1.1"
  | "fal-ai/ideogram/v3"
  | "fal-ai/recraft-v3"
  | "fal-ai/flux/dev"
  | "fal-ai/flux-pro/kontext";

export type ImageSize =
  | "square_hd"     // 1024x1024
  | "square"        // 512x512
  | "portrait_4_3"  // 768x1024
  | "portrait_16_9" // 576x1024
  | "landscape_4_3" // 1024x768
  | "landscape_16_9"// 1024x576;

export interface GenerateImageParams {
  prompt: string;
  model: FalImageModel;
  imageSize?: ImageSize;
  numImages?: number;
  seed?: number;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  contentType: string;
}

const RATIO_TO_SIZE: Record<string, ImageSize> = {
  "1:1": "square_hd",
  "4:5": "portrait_4_3",
  "9:16": "portrait_16_9",
  "16:9": "landscape_16_9",
  "4:3": "landscape_4_3",
};

export function ratioToImageSize(ratio: string): ImageSize {
  return RATIO_TO_SIZE[ratio] || "square_hd";
}

export async function generateImage(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const result = await fal.subscribe(params.model, {
    input: {
      prompt: params.prompt,
      image_size: params.imageSize || "square_hd",
      num_images: params.numImages || 1,
      ...(params.seed ? { seed: params.seed } : {}),
    },
    logs: true,
  });

  const data = result.data as { images: Array<{ url: string; width: number; height: number; content_type: string }> };

  return data.images.map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    contentType: img.content_type,
  }));
}

/**
 * Select the best model based on intent
 */
export function selectModel(intent: {
  hasText?: boolean;
  style?: string;
  isEdit?: boolean;
  isIllustration?: boolean;
}): FalImageModel {
  if (intent.isEdit) return "fal-ai/flux-pro/kontext";
  if (intent.hasText) return "fal-ai/ideogram/v3";
  if (intent.isIllustration) return "fal-ai/recraft-v3";
  return "fal-ai/flux-pro/v1.1";
}
