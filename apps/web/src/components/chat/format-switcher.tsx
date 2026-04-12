"use client";

import { PLATFORM_FORMATS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  tiktok: "TT",
  youtube: "YT",
  linkedin: "LI",
  x_twitter: "X",
  google_ads: "GA",
  pinterest: "PI",
};

export function FormatSwitcher() {
  const { selectedFormats, toggleFormat } = useChatStore();

  return (
    <div className="border-b border-border bg-muted/20 px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Formatos:
        </span>
        {Object.entries(PLATFORM_FORMATS).map(([platform, formats]) =>
          Object.entries(formats).map(([key, format]) => {
            const formatId = `${platform}:${key}`;
            const isSelected = selectedFormats.includes(formatId);
            return (
              <Button
                key={formatId}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 shrink-0 gap-1 px-2 text-[11px]",
                  !isSelected && "text-muted-foreground"
                )}
                onClick={() => toggleFormat(formatId)}
              >
                <Badge
                  variant="outline"
                  className="h-4 px-1 text-[9px] font-bold"
                >
                  {PLATFORM_ICONS[platform]}
                </Badge>
                {format.ratio}
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
