"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage, ChatMessageLoading } from "@/components/chat/chat-message";
import { FormatSwitcher } from "@/components/chat/format-switcher";
import { useChatStore } from "@/stores/chat-store";
import {
  listConversations,
  saveConversation,
  deleteConversation,
  generateConversationId,
  extractTitle,
  type StoredConversation,
} from "@/lib/chat-storage";
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
  Trash2,
  MessageSquare,
} from "lucide-react";

const IMAGE_STYLES = [
  { id: "photorealistic", label: "Fotorrealista", icon: Camera },
  { id: "cinematic", label: "Cinematico", icon: Clapperboard },
  { id: "animated", label: "3D Animado", icon: Wand2 },
  { id: "anime", label: "Anime", icon: Paintbrush },
  { id: "illustration", label: "Ilustracion", icon: Paintbrush },
  { id: "product", label: "Producto", icon: ImageIcon },
  { id: "editorial", label: "Editorial", icon: Camera },
  { id: "minimal", label: "Minimal", icon: ImageIcon },
  { id: "ad-banner", label: "Banner Ads", icon: Film },
];

const QUICK_ACTIONS = [
  { icon: ImageIcon, label: "Crear imagen", prompt: "Genera una imagen de un reloj de lujo sobre fondo de marmol blanco, luz natural suave" },
  { icon: Film, label: "Editar video", prompt: "Necesito editar un video: anade subtitulos TikTok style, musica y corta los silencios" },
  { icon: Link, label: "Click-to-Ad", prompt: "Analiza esta URL y genera anuncios para Meta Ads: " },
  { icon: Search, label: "Analizar competencia", prompt: "Analiza la estrategia de contenido de @" },
  { icon: Calendar, label: "Estrategia mensual", prompt: "Crea un calendario editorial para el proximo mes con contenido para Instagram, TikTok y LinkedIn" },
];

export default function ChatPage() {
  const { selectedFormats } = useChatStore();
  const [imageStyle, setImageStyle] = useState("photorealistic");
  const [conversationId, setConversationId] = useState(() => generateConversationId());
  const [savedConversations, setSavedConversations] = useState<StoredConversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  // Load conversation list on mount
  useEffect(() => {
    setSavedConversations(listConversations());
  }, []);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const serializable = messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      parts: m.parts?.map((p) => {
        const part: Record<string, unknown> = { type: p.type };
        if (p.type === "text") part.text = (p as any).text;
        if (typeof p.type === "string" && p.type.startsWith("tool-")) {
          const tp = p as any;
          part.state = tp.state;
          part.input = tp.input;
          part.output = tp.output;
          part.toolCallId = tp.toolCallId;
        }
        return part as any;
      }) || [],
      createdAt: new Date().toISOString(),
    }));

    saveConversation({
      id: conversationId,
      title: extractTitle(serializable),
      messages: serializable,
      imageStyle,
      selectedFormats,
      createdAt: savedConversations.find((c) => c.id === conversationId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSavedConversations(listConversations());
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (content: string) => {
    const formatStr = selectedFormats.length > 0
      ? selectedFormats.map((f) => f.split(":").slice(1).join(":")).join(", ")
      : "4:5";
    const context = `[CONTEXT: formato=${formatStr}, estilo=${imageStyle}]\n${content}`;
    sendMessage({ text: context });
  };

  const handleNewConversation = () => {
    setConversationId(generateConversationId());
    setMessages([]);
  };

  const handleLoadConversation = (conv: StoredConversation) => {
    setConversationId(conv.id);
    setImageStyle(conv.imageStyle || "photorealistic");
    // Restore messages — reconstruct UIMessage format
    const restored = conv.messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
      content: "", // Required by type but we use parts
      createdAt: new Date(m.createdAt),
    }));
    setMessages(restored as any);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(id);
    setSavedConversations(listConversations());
    if (id === conversationId) {
      handleNewConversation();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="border-b border-border">
        <FormatSwitcher />
        <div className="flex items-center gap-2 overflow-x-auto border-t border-border/50 px-4 py-2">
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
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-4">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight">ArbiStudio</h1>
              <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                Selecciona formato y estilo arriba, luego describe lo que necesitas.
              </p>
              <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSubmit(action.prompt)}
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

              {/* Saved conversations */}
              {savedConversations.length > 0 && (
                <div className="mt-8 w-full max-w-lg">
                  <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    Conversaciones guardadas
                  </h3>
                  <div className="space-y-1">
                    {savedConversations.slice(0, 10).map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => handleLoadConversation(conv)}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/50"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {conv.messages.length} mensajes · {new Date(conv.updatedAt).toLocaleDateString("es")}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
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
