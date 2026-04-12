import { create } from "zustand";
import type { GeneratedAsset, Conversation, ColorGrading } from "@/types";

interface ChatState {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;

  // Generated assets in current conversation
  assets: GeneratedAsset[];
  addAsset: (asset: GeneratedAsset) => void;
  updateAsset: (id: string, updates: Partial<GeneratedAsset>) => void;

  // Active asset for preview
  activeAssetId: string | null;
  setActiveAsset: (id: string | null) => void;

  // Format selection
  selectedFormats: string[];
  toggleFormat: (format: string) => void;
  setFormats: (formats: string[]) => void;

  // Cinema Studio
  colorGrading: ColorGrading;
  setColorGrading: (grading: Partial<ColorGrading>) => void;

  // UI state
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DEFAULT_COLOR_GRADING: ColorGrading = {
  temperature: 0,
  contrast: 0,
  saturation: 0,
  grain: 0,
  bloom: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  vignette: 0,
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  assets: [],
  addAsset: (asset) =>
    set((state) => ({ assets: [...state.assets, asset] })),
  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  activeAssetId: null,
  setActiveAsset: (id) => set({ activeAssetId: id, previewOpen: !!id }),

  selectedFormats: ["instagram:feed_portrait"],
  toggleFormat: (format) =>
    set((state) => ({
      selectedFormats: state.selectedFormats.includes(format)
        ? state.selectedFormats.filter((f) => f !== format)
        : [...state.selectedFormats, format],
    })),
  setFormats: (formats) => set({ selectedFormats: formats }),

  colorGrading: DEFAULT_COLOR_GRADING,
  setColorGrading: (grading) =>
    set((state) => ({
      colorGrading: { ...state.colorGrading, ...grading },
    })),

  previewOpen: false,
  setPreviewOpen: (open) => set({ previewOpen: open }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
