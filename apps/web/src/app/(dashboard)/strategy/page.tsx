"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Sparkles,
  ImageIcon,
  Film,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarItem {
  id: string;
  day: number;
  title: string;
  type: "image" | "video" | "carousel" | "story" | "article";
  platform: string;
  status: "scheduled" | "draft" | "published" | "idea";
  time?: string;
}

const TYPE_COLORS: Record<string, string> = {
  image: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  video: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  carousel: "bg-green-500/20 text-green-400 border-green-500/30",
  story: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  article: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const DEMO_CALENDAR: CalendarItem[] = [
  { id: "1", day: 1, title: "Reel: 3 errores de marketing", type: "video", platform: "IG + TT", status: "published", time: "19:00" },
  { id: "2", day: 2, title: "Carrusel educativo: Funnel", type: "carousel", platform: "IG + LI", status: "published", time: "10:00" },
  { id: "3", day: 3, title: "Story: Behind the scenes", type: "story", platform: "IG", status: "published", time: "12:00" },
  { id: "4", day: 5, title: "Foto producto premium", type: "image", platform: "IG + FB", status: "published", time: "19:00" },
  { id: "5", day: 7, title: "Reel: Case study cliente", type: "video", platform: "IG + TT + YT", status: "published", time: "19:00" },
  { id: "6", day: 8, title: "Blog: SEO tendencias 2026", type: "article", platform: "Web + LI", status: "published", time: "09:00" },
  { id: "7", day: 10, title: "Carrusel: 5 tips de branding", type: "carousel", platform: "IG", status: "scheduled", time: "19:00" },
  { id: "8", day: 12, title: "Reel: Q&A con fundador", type: "video", platform: "IG + TT", status: "scheduled", time: "19:00" },
  { id: "9", day: 13, title: "Story: Promocion flash", type: "story", platform: "IG + FB", status: "draft", time: "12:00" },
  { id: "10", day: 14, title: "Foto lifestyle marca", type: "image", platform: "IG + PI", status: "draft", time: "19:00" },
  { id: "11", day: 15, title: "Reel: Tutorial rapido", type: "video", platform: "IG + TT + YT", status: "idea" },
  { id: "12", day: 17, title: "Carrusel: Antes vs Despues", type: "carousel", platform: "IG + LI", status: "idea" },
  { id: "13", day: 19, title: "Reel: Trend del momento", type: "video", platform: "TT + IG", status: "idea" },
  { id: "14", day: 21, title: "Blog: Guia completa Meta Ads", type: "article", platform: "Web + LI", status: "idea" },
  { id: "15", day: 22, title: "Foto producto nuevo", type: "image", platform: "IG + FB + PI", status: "idea" },
  { id: "16", day: 25, title: "Reel: Resumen semanal", type: "video", platform: "IG + TT", status: "idea" },
  { id: "17", day: 28, title: "Carrusel: Resultados del mes", type: "carousel", platform: "IG + LI", status: "idea" },
  { id: "18", day: 30, title: "Story: Cierre de mes + CTA", type: "story", platform: "IG + FB", status: "idea" },
];

const DAYS_OF_WEEK = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export default function StrategyPage() {
  const [month] = useState("Abril 2026");
  const daysInMonth = 30;
  const firstDayOffset = 2; // Wednesday for April 2026

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Estrategia de Contenido</h1>
          <p className="text-sm text-muted-foreground">
            Calendario editorial generado por IA — {DEMO_CALENDAR.length} piezas planificadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generar con IA
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Anadir pieza
          </Button>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{month}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" /> Publicado
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Programado
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Borrador
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" /> Idea
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-7 gap-px rounded-xl border border-border bg-border overflow-hidden">
          {/* Day headers */}
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Calendar cells */}
          {calendarDays.map((day, idx) => {
            const dayItems = day
              ? DEMO_CALENDAR.filter((item) => item.day === day)
              : [];

            return (
              <div
                key={idx}
                className={`min-h-[120px] bg-background p-1.5 ${
                  day ? "hover:bg-muted/20" : "bg-muted/10"
                }`}
              >
                {day && (
                  <>
                    <span
                      className={`mb-1 inline-block text-xs font-medium ${
                        day === 13 ? "rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="space-y-1">
                      {dayItems.map((item) => {
                        const statusDot =
                          item.status === "published"
                            ? "bg-green-500"
                            : item.status === "scheduled"
                              ? "bg-blue-500"
                              : item.status === "draft"
                                ? "bg-yellow-500"
                                : "bg-muted-foreground";

                        return (
                          <button
                            key={item.id}
                            className={`flex w-full items-start gap-1 rounded border px-1.5 py-1 text-left text-[10px] leading-tight transition-colors ${TYPE_COLORS[item.type]}`}
                          >
                            <div className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${statusDot}`} />
                            <span className="line-clamp-2">{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Content pillars */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold">Pilares de contenido — Abril 2026</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">40%</p>
              <p className="text-xs text-muted-foreground">Educativo</p>
              <p className="text-[10px] text-muted-foreground">Tips, tutoriales, guias</p>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">25%</p>
              <p className="text-xs text-muted-foreground">Inspiracional</p>
              <p className="text-[10px] text-muted-foreground">Cases, testimonios</p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-green-400">20%</p>
              <p className="text-xs text-muted-foreground">Producto</p>
              <p className="text-[10px] text-muted-foreground">Fotos, demos, features</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-orange-400">15%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
              <p className="text-[10px] text-muted-foreground">Q&A, encuestas, BTS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
