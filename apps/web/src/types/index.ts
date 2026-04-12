// ============================================================
// ArbiStudio — Core Types
// ============================================================

export type AssetType = "image" | "video" | "audio" | "document";

export type AssetStatus =
  | "generating"
  | "processing"
  | "ready"
  | "published"
  | "failed";

export type PlatformFormat = {
  width: number;
  height: number;
  ratio: string;
  label: string;
};

export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x_twitter"
  | "google_ads"
  | "pinterest";

export type ImageModel =
  | "flux-1.1-pro"
  | "flux-kontext-pro"
  | "gemini-3.1-flash"
  | "gemini-3-pro"
  | "ideogram-v3"
  | "recraft-v3"
  | "sdxl-custom"
  | "imagen-4-pro";

export type VideoModel =
  | "kling-1.6-pro"
  | "runway-gen3-alpha"
  | "pika-2.0"
  | "wan-2.1";

export type ImageStyle =
  | "photorealistic"
  | "cinematic"
  | "editorial"
  | "product"
  | "lifestyle"
  | "illustration"
  | "minimal"
  | "luxury";

export interface GeneratedAsset {
  id: string;
  type: AssetType;
  status: AssetStatus;
  fileUrl?: string;
  thumbnailUrl?: string;
  prompt: string;
  model: ImageModel | VideoModel;
  formats: Record<string, string>;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    fps?: number;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  brandGuidelines?: BrandGuidelines;
  industry?: string;
  createdAt: string;
}

export interface BrandGuidelines {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  toneOfVoice: string;
  styleModifiers: string[];
}

export interface SoulCharacter {
  id: string;
  name: string;
  description: string;
  referenceImages: string[];
  embedding?: number[];
  loraModelId?: string;
  attributes: {
    gender: string;
    age: number;
    style: string;
    expressions: string[];
  };
}

export interface CinemaPreset {
  id: string;
  name: string;
  description: string;
  category: "movement" | "lens" | "effect";
  promptModifier: string;
  remotionConfig?: Record<string, unknown>;
}

export interface ColorGrading {
  temperature: number;
  contrast: number;
  saturation: number;
  grain: number;
  bloom: number;
  exposure: number;
  shadows: number;
  highlights: number;
  vignette: number;
  lutPreset?: string;
}

export const PLATFORM_FORMATS: Record<string, Record<string, PlatformFormat>> =
  {
    instagram: {
      feed_square: {
        width: 1080,
        height: 1080,
        ratio: "1:1",
        label: "Feed Cuadrado",
      },
      feed_portrait: {
        width: 1080,
        height: 1350,
        ratio: "4:5",
        label: "Feed Vertical",
      },
      stories: {
        width: 1080,
        height: 1920,
        ratio: "9:16",
        label: "Stories/Reels",
      },
    },
    facebook: {
      feed: {
        width: 1200,
        height: 628,
        ratio: "1.91:1",
        label: "Feed",
      },
      feed_square: {
        width: 1080,
        height: 1080,
        ratio: "1:1",
        label: "Feed Cuadrado",
      },
      stories: {
        width: 1080,
        height: 1920,
        ratio: "9:16",
        label: "Stories",
      },
    },
    tiktok: {
      feed: {
        width: 1080,
        height: 1920,
        ratio: "9:16",
        label: "In-Feed",
      },
    },
    youtube: {
      video: {
        width: 1920,
        height: 1080,
        ratio: "16:9",
        label: "Video",
      },
      shorts: {
        width: 1080,
        height: 1920,
        ratio: "9:16",
        label: "Shorts",
      },
      thumbnail: {
        width: 1280,
        height: 720,
        ratio: "16:9",
        label: "Thumbnail",
      },
    },
    linkedin: {
      feed: {
        width: 1200,
        height: 627,
        ratio: "1.91:1",
        label: "Feed",
      },
      feed_square: {
        width: 1080,
        height: 1080,
        ratio: "1:1",
        label: "Cuadrado",
      },
    },
    x_twitter: {
      feed: {
        width: 1600,
        height: 900,
        ratio: "16:9",
        label: "Feed",
      },
    },
    google_ads: {
      landscape: {
        width: 1200,
        height: 628,
        ratio: "1.91:1",
        label: "Landscape",
      },
      square: {
        width: 1080,
        height: 1080,
        ratio: "1:1",
        label: "Square",
      },
    },
    pinterest: {
      pin: {
        width: 1000,
        height: 1500,
        ratio: "2:3",
        label: "Pin",
      },
    },
  };
