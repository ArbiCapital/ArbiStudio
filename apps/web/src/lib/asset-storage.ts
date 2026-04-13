/**
 * Extract generated assets from saved conversations
 */

import { listConversations } from "./chat-storage";

export interface ExtractedAsset {
  id: string;
  conversationId: string;
  conversationTitle: string;
  type: "image" | "video";
  url: string;
  width: number;
  height: number;
  model: string;
  ratio: string;
  prompt: string;
  createdAt: string;
}

export function extractAllAssets(): ExtractedAsset[] {
  const conversations = listConversations();
  const assets: ExtractedAsset[] = [];

  for (const conv of conversations) {
    for (const msg of conv.messages) {
      if (msg.role !== "assistant") continue;
      for (const part of msg.parts || []) {
        if (typeof part.type === "string" && part.type.startsWith("tool-") && part.state === "output-available") {
          const output = part.output as Record<string, unknown> | undefined;
          if (!output?.success) continue;
          const images = output.images as Array<{ url: string; width: number; height: number }> | undefined;
          if (!images) continue;

          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            // Skip data URIs (too large for library view) — only show hosted URLs
            if (img.url.startsWith("data:")) continue;

            assets.push({
              id: `${conv.id}-${msg.id}-${i}`,
              conversationId: conv.id,
              conversationTitle: conv.title,
              type: "image",
              url: img.url,
              width: img.width,
              height: img.height,
              model: (output.model as string) || "unknown",
              ratio: (output.ratio as string) || "1:1",
              prompt: (output.prompt as string) || "",
              createdAt: msg.createdAt,
            });
          }
        }
      }
    }
  }

  // Also load manually saved assets from Video Studio, Lipsync, etc.
  const manual = getManualAssets();
  assets.push(...manual);

  return assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const MANUAL_ASSETS_KEY = "arbistudio-library-assets";

export function getManualAssets(): ExtractedAsset[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MANUAL_ASSETS_KEY) || "[]");
  } catch { return []; }
}

export function saveAssetToLibrary(asset: Omit<ExtractedAsset, "id" | "conversationId" | "conversationTitle">) {
  const existing = getManualAssets();
  const newAsset: ExtractedAsset = {
    ...asset,
    id: `manual-${Date.now()}`,
    conversationId: "manual",
    conversationTitle: "Video Studio",
  };
  existing.push(newAsset);
  localStorage.setItem(MANUAL_ASSETS_KEY, JSON.stringify(existing));
  return newAsset;
}
