"use client";

import { Sparkles, User, Download, Pencil, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  assets?: {
    id: string;
    type: "image" | "video";
    url: string;
    format: string;
    model: string;
  }[];
  isLoading?: boolean;
}

export function ChatMessage({
  role,
  content,
  assets,
  isLoading,
}: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isAssistant ? "bg-muted/30" : "bg-transparent"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isAssistant
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isAssistant ? (
          <Sparkles className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="text-sm font-medium">
          {isAssistant ? "ArbiStudio" : "Tu"}
        </div>

        {/* Text content */}
        {content && (
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
            Generando...
          </div>
        )}

        {/* Generated assets grid */}
        {assets && assets.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-muted/50 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  {asset.type === "image" ? (
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50">
                      {asset.url ? (
                        <img
                          src={asset.url}
                          alt="Generated"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50">
                      <div className="flex h-full items-center justify-center">
                        <div className="rounded-full bg-background/80 p-3">
                          <svg
                            className="h-6 w-6 text-foreground"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Asset info overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {asset.format}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {asset.model}
                      </Badge>
                    </div>
                  </div>

                  {/* Action buttons overlay */}
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                Variantes
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Descargar
              </Button>
              <Button size="sm" className="h-8 gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                Publicar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
