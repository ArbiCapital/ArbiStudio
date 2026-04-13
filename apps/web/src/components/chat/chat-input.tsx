"use client";

import { useRef, useState } from "react";
import { Send, Paperclip, ImageIcon, Film, Sparkles, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSubmit: (message: string, attachments?: File[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl border border-border bg-muted/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
          {/* Quick actions */}
          <div className="flex items-center gap-1 border-b border-border/50 px-3 py-1.5">
            <div
              role="button"
              tabIndex={0}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-3.5 w-3.5" />
              Adjuntar
            </div>

            <div
              role="button"
              tabIndex={0}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              onClick={() => setInput(input + "/image ")}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Imagen
            </div>

            <div
              role="button"
              tabIndex={0}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              onClick={() => setInput(input + "/video ")}
            >
              <Film className="h-3.5 w-3.5" />
              Video
            </div>

            <div
              role="button"
              tabIndex={0}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              onClick={() => setInput(input + "/analyze ")}
            >
              <Link className="h-3.5 w-3.5" />
              Click-to-Ad
            </div>
          </div>

          {/* Textarea */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe lo que quieres crear... (imagen, video, anuncio, analisis)"
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={2}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Claude 4 Sonnet
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="h-8 gap-1.5 rounded-lg px-3"
            >
              <Send className="h-3.5 w-3.5" />
              {isLoading ? "Generando..." : "Enviar"}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*,.pdf"
          multiple
        />
      </div>
    </div>
  );
}
