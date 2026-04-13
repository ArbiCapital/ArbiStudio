"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideBannerProps {
  id: string; // Unique key for localStorage dismissal
  title: string;
  steps: string[];
}

export function GuideBanner({ id, title, steps }: GuideBannerProps) {
  const [dismissed, setDismissed] = useState(true); // Hidden by default until checked

  useEffect(() => {
    const key = `guide-dismissed-${id}`;
    setDismissed(localStorage.getItem(key) === "true");
  }, [id]);

  const handleDismiss = () => {
    localStorage.setItem(`guide-dismissed-${id}`, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="relative border-b border-primary/20 bg-primary/5 px-6 py-3">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">{title}</p>
          <ol className="mt-1 space-y-0.5">
            {steps.map((step, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={handleDismiss}
          aria-label="Cerrar guia"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
