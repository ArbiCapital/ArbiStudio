"use client";

import {
  Sparkles,
  User,
  Download,
  Pencil,
  Copy,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

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
      <div className="flex-1 space-y-4 overflow-hidden">
        <div className="text-sm font-medium">
          {isAssistant ? "ArbiStudio" : "Tu"}
        </div>

        {/* Render parts */}
        {message.parts?.map((part, i) => {
          switch (part.type) {
            case "text":
              return part.text ? (
                <div key={i} className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.text}
                  </ReactMarkdown>
                </div>
              ) : null;

            default:
              // Handle tool parts (type starts with "tool-")
              if (typeof part.type === "string" && part.type.startsWith("tool-")) {
                const toolPart = part as unknown as {
                  type: string;
                  toolCallId: string;
                  state: string;
                  input?: Record<string, unknown>;
                  output?: Record<string, unknown>;
                };
                const toolName = toolPart.type.replace("tool-", "");
                return (
                  <ToolInvocationPart
                    key={i}
                    toolName={toolName}
                    state={toolPart.state}
                    args={toolPart.input || {}}
                    result={
                      toolPart.state === "output-available"
                        ? toolPart.output
                        : undefined
                    }
                  />
                );
              }
              return null;
          }
        })}
      </div>
    </div>
  );
}

function ToolInvocationPart({
  toolName,
  state,
  args,
  result,
}: {
  toolName: string;
  state: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}) {
  if (toolName === "generateImage") {
    return (
      <ImageToolResult state={state} args={args} result={result} />
    );
  }

  // Generic tool display
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {state === "result" ? (
          <Sparkles className="h-4 w-4 text-primary" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {toolName}: {state}
      </div>
    </div>
  );
}

function ImageToolResult({
  state,
  args,
  result,
}: {
  state: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}) {
  const model = (args.model as string) || "flux-pro";
  const ratio = (args.ratio as string) || "1:1";

  // Loading state — v6 uses "output-available" when tool execution is done
  if (state !== "output-available") {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium">
              Generando imagen con{" "}
              <Badge variant="secondary" className="text-xs">
                {model}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Formato {ratio} — Esto puede tardar unos segundos...
            </p>
          </div>
        </div>

        {/* Skeleton preview */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Array.from({ length: (args.numImages as number) || 1 }).map(
            (_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-lg bg-muted"
              />
            )
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (result && !result.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Error: {result.error as string}</span>
        </div>
      </div>
    );
  }

  // Success state with images
  const images = (result?.images as Array<{ url: string; width: number; height: number }>) || [];

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "grid gap-3",
          images.length === 1 ? "grid-cols-1 max-w-md" : "grid-cols-2"
        )}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border border-border bg-muted/50 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <img
              src={img.url}
              alt={`Generated image ${i + 1}`}
              width={img.width}
              height={img.height}
              className="h-auto w-full"
              loading="lazy"
            />

            {/* Overlay info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  {ratio}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {model}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {img.width}x{img.height}
                </Badge>
              </div>
            </div>

            {/* Actions overlay */}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7"
                onClick={async () => {
                  try {
                    const response = await fetch(img.url);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `arbistudio-${model}-${ratio.replace(":", "x")}-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch {
                    window.open(img.url, "_blank");
                  }
                }}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Copy className="h-3.5 w-3.5" />
          Mas variantes
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Descargar
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          Publicar
        </Button>
      </div>
    </div>
  );
}

// Simple loading message component
export function ChatMessageLoading() {
  return (
    <div className="flex gap-4 bg-muted/30 px-4 py-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">ArbiStudio</div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </div>
          Pensando...
        </div>
      </div>
    </div>
  );
}
