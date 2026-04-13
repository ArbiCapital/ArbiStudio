"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage, ChatMessageLoading } from "@/components/chat/chat-message";
import { FormatSwitcher } from "@/components/chat/format-switcher";
import { useChatStore } from "@/stores/chat-store";
import {
  ImageIcon,
  Film,
  Link,
  Search,
  Calendar,
  Sparkles,
  Camera,
  Paintbrush,
  Clapperboard,
  Wand2,
} from "lucide-react";

const IMAGE_STYLES = [
  { id: "photorealistic", label: "Fotorrealista", icon: Camera, description: "Fotos ultra-realistas" },
  { id: "cinematic", label: "Cinematico", icon: Clapperboard, description: "Estilo cine/pelicula" },
  { id: "animated", label: "3D Animado", icon: Wand2, description: "Estilo Pixar/3D" },
  { id: "anime", label: "Anime", icon: Paintbrush, description: "Ilustracion anime" },
  { id: "illustration", label: "Ilustracion", icon: Paintbrush, description: "Arte digital/vector" },
  { id: "product", label: "Producto", icon: ImageIcon, description: "Foto de producto pro" },
  { id: "editorial", label: "Editorial", icon: Camera, description: "Estilo revista/moda" },
  { id: "minimal", label: "Minimal", icon: ImageIcon, description: "Minimalista y limpio" },
  { id: "ad-banner", label: "Banner Ads", icon: Film, description: "Banners con texto" },
];

const QUICK_ACTIONS = [
  {
    icon: ImageIcon,
    label: "Crear imagen",
    prompt: "Genera una imagen de un reloj de lujo sobre fondo de marmol blanco, luz natural suave",
  },
  {
    icon: Film,
    label: "Editar video",
    prompt: "Necesito editar un video: anade subtitulos TikTok style, musica y corta los silencios",
  },
  {
    icon: Link,
    label: "Click-to-Ad",
    prompt: "Analiza esta URL y genera anuncios para Meta Ads: ",
  },
  {
    icon: Search,
    label: "Analizar competencia",
    prompt: "Analiza la estrategia de contenido de @",
  },
  {
    icon: Calendar,
    label: "Estrategia mensual",
    prompt: "Crea un calendario editorial para el proximo mes con contenido para Instagram, TikTok y LinkedIn",
  },
];

export default function ChatPage() {
  const { selectedFormats } = useChatStore();
  const [imageStyle, setImageStyle] = useState("photorealistic");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (content: string) => {
    // Inject format and style context into the message so the API knows
    const formatStr = selectedFormats.length > 0
      ? selectedFormats.map(f => f.split(":").slice(1).join(":")).join(", ")
      : "4:5";
    const context = `[CONTEXT: formato=${formatStr}, estilo=${imageStyle}]\n${content}`;
    sendMessage({ text: context });
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar: formats + style selector */}
      <div className="border-b border-border">
        <FormatSwitcher />
        {/* Style selector */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-border/50">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Estilo:</span>
          {IMAGE_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setImageStyle(style.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${
                imageStyle === style.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <style.icon className="h-3 w-3" />
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <EmptyState onAction={handleSubmit} />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" && (
                  <ChatMessageLoading />
                )}
            </>
          )}
        </div>
      </div>

      {/* Chat input */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

function EmptyState({ onAction }: { onAction: (prompt: string) => void }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">ArbiStudio</h1>
      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        Crea contenido profesional con IA. Selecciona un formato y estilo arriba, y escribe lo que necesitas.
      </p>
      <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <action.icon className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="font-medium">{action.label}</div>
              <div className="line-clamp-1 text-xs text-muted-foreground">{action.prompt}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
