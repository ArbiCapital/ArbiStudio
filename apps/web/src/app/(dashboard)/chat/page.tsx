"use client";

import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { FormatSwitcher } from "@/components/chat/format-switcher";
import {
  ImageIcon,
  Film,
  Link,
  Search,
  Calendar,
  Sparkles,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    icon: ImageIcon,
    label: "Crear imagen",
    prompt: "Genera una imagen fotorrealista de producto para Instagram",
  },
  {
    icon: Film,
    label: "Editar video",
    prompt:
      "Necesito editar un video: anade subtitulos TikTok style, musica y corta los silencios",
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
    prompt:
      "Crea un calendario editorial para el proximo mes con contenido para Instagram, TikTok y LinkedIn",
  },
];

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (content: string) => {
    sendMessage({ text: content });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Format switcher bar */}
      <FormatSwitcher />

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <EmptyState onAction={handleSubmit} />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role as "user" | "assistant"}
                content={
                  message.parts
                    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                    .map((p) => p.text)
                    .join("") || ""
                }
              />
            ))
          )}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <ChatMessage role="assistant" content="" isLoading />
          )}
        </div>
      </ScrollArea>

      {/* Chat input */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

function EmptyState({ onAction }: { onAction: (prompt: string) => void }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">ArbiStudio</h1>
      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        Crea contenido profesional con IA. Imagen, video, anuncios y estrategia
        — todo desde este chat.
      </p>

      {/* Quick actions */}
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
              <div className="text-xs text-muted-foreground line-clamp-1">
                {action.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
