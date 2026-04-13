"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface CalendarItem {
  day: number;
  title: string;
  type: "image" | "video" | "carousel" | "story" | "article";
  platform: string;
  time?: string;
  description: string;
}

interface Pillar {
  name: string;
  percentage: number;
  description: string;
}

const TYPE_COLORS: Record<string, string> = {
  image: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  video: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  carousel: "bg-green-500/20 text-green-400 border-green-500/30",
  story: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  article: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const PILLAR_COLORS = ["text-blue-400 bg-blue-500/10", "text-purple-400 bg-purple-500/10", "text-green-400 bg-green-500/10", "text-orange-400 bg-orange-500/10"];
const DAYS_OF_WEEK = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function StrategyPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [industry, setIndustry] = useState("Marketing digital");
  const [showConfig, setShowConfig] = useState(true);

  const daysInMonth = 30;
  const firstDayOffset = 2;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowConfig(false);
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          audience: "Emprendedores y pymes en Espana",
          platforms: "Instagram, TikTok, LinkedIn",
          month: "Abril",
          year: 2026,
          postsPerWeek: 5,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.strategy.items || []);
        setPillars(data.strategy.pillars || []);
        setInsights(data.strategy.insights || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Estrategia de Contenido</h1>
          <p className="text-sm text-muted-foreground">
            {items.length > 0
              ? `${items.length} piezas planificadas por IA`
              : "Genera un calendario editorial con IA"}
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isGenerating ? "Generando..." : "Generar con IA"}
        </Button>
      </div>

      {/* Config panel */}
      {showConfig && items.length === 0 && !isGenerating && (
        <div className="border-b border-border px-6 py-4">
          <div className="mx-auto max-w-lg space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Industria / Nicho</label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Ej: Relojes de lujo, Coaching, SaaS..." />
            </div>
            <p className="text-xs text-muted-foreground">
              Claude generara un calendario editorial completo con pilares de contenido, horarios optimos y recomendaciones.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Generando estrategia de contenido con IA...
            </p>
            <p className="text-xs text-muted-foreground">Esto puede tardar 10-20 segundos</p>
          </div>
        </div>
      )}

      {/* Calendar + results */}
      {!isGenerating && items.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Month nav */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-lg font-semibold">Abril 2026</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              {Object.entries(TYPE_COLORS).map(([type, cls]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${cls.split(" ")[0]}`} />
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground">{day}</div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayItems = day ? items.filter((item) => item.day === day) : [];
              return (
                <div key={idx} className={`min-h-[100px] bg-background p-1.5 ${day ? "hover:bg-muted/20" : "bg-muted/10"}`}>
                  {day && (
                    <>
                      <span className="mb-1 inline-block text-xs font-medium text-muted-foreground">{day}</span>
                      <div className="space-y-0.5">
                        {dayItems.map((item, i) => (
                          <div
                            key={i}
                            className={`rounded border px-1.5 py-0.5 text-[9px] leading-tight ${TYPE_COLORS[item.type]}`}
                            title={`${item.title}\n${item.platform}\n${item.time || ""}\n${item.description}`}
                          >
                            <span className="line-clamp-2">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pillars */}
          {pillars.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Pilares de contenido</h3>
              <div className="grid grid-cols-4 gap-4">
                {pillars.map((pillar, i) => (
                  <div key={i} className={`rounded-lg p-3 text-center ${PILLAR_COLORS[i % PILLAR_COLORS.length]}`}>
                    <p className="text-2xl font-bold">{pillar.percentage}%</p>
                    <p className="text-xs font-medium">{pillar.name}</p>
                    <p className="text-[10px] opacity-70">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Recomendaciones estrategicas</h3>
              <ul className="space-y-2">
                {insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isGenerating && items.length === 0 && !showConfig && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Pulsa "Generar con IA" para crear tu calendario</p>
          </div>
        </div>
      )}
    </div>
  );
}
