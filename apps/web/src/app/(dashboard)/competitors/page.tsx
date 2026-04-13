"use client";

import { useState } from "react";
import {
  Search,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Sparkles,
  Loader2,
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CompetitorAnalysis {
  name: string;
  handle: string;
  platform: string;
  estimatedFollowers: string;
  postsPerWeek: number;
  engagementRate: number;
  topFormats: string[];
  contentPillars: string[];
  toneOfVoice: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  topContent: { description: string; estimatedEngagement: string; format: string }[];
  recommendations: string[];
}

export default function CompetitorsPage() {
  const [target, setTarget] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<CompetitorAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!target) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, platform }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalyses((prev) => [data.analysis, ...prev]);
        setTarget("");
      } else {
        setError(data.error || "Error analizando");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Competitor Intel</h1>
          <p className="text-sm text-muted-foreground">
            Analiza la competencia con IA — {analyses.length} {analyses.length === 1 ? "analisis" : "analisis"} realizados
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="@handle, URL o nombre del competidor..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
          <option value="web">Website</option>
        </select>
        <Button onClick={handleAnalyze} disabled={!target || isAnalyzing} className="gap-2">
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isAnalyzing ? "Analizando..." : "Analizar"}
        </Button>
      </div>

      {error && (
        <div className="mx-6 mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {/* Loading */}
        {isAnalyzing && (
          <div className="mb-6 rounded-xl border border-border bg-card p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analizando {target}...</p>
            <p className="text-xs text-muted-foreground">Claude esta investigando la estrategia del competidor</p>
          </div>
        )}

        {/* Results */}
        {analyses.map((analysis, idx) => (
          <div key={idx} className="mb-6 rounded-xl border border-border bg-card p-6">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{analysis.name}</h3>
                  <Badge variant="outline">{analysis.platform}</Badge>
                  <Badge className="bg-green-500/10 text-green-400 text-xs">Analizado por IA</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {analysis.handle} · {analysis.estimatedFollowers} seguidores est.
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-muted/30 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Posts/semana</p>
                <p className="text-xl font-bold">{analysis.postsPerWeek}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Engagement</p>
                <p className="text-xl font-bold text-green-400">{analysis.engagementRate}%</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Seguidores</p>
                <p className="text-xl font-bold">{analysis.estimatedFollowers}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Tono</p>
                <p className="text-sm font-bold">{analysis.toneOfVoice}</p>
              </div>
            </div>

            {/* Formats & Pillars */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">FORMATOS TOP</p>
                <div className="flex flex-wrap gap-1">{analysis.topFormats.map((f) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}</div>
              </div>
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">PILARES</p>
                <div className="flex flex-wrap gap-1">{analysis.contentPillars.map((p) => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}</div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* SWOT-lite */}
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-green-400"><CheckCircle className="h-3 w-3" /> Fortalezas</p>
                <ul className="space-y-1">{analysis.strengths.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}</ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-red-400"><AlertCircle className="h-3 w-3" /> Debilidades</p>
                <ul className="space-y-1">{analysis.weaknesses.map((w, i) => <li key={i} className="text-xs text-muted-foreground">• {w}</li>)}</ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-blue-400"><Target className="h-3 w-3" /> Oportunidades</p>
                <ul className="space-y-1">{analysis.opportunities.map((o, i) => <li key={i} className="text-xs text-muted-foreground">• {o}</li>)}</ul>
              </div>
            </div>

            {/* Top content */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">TOP CONTENIDO</p>
              <div className="space-y-2">
                {analysis.topContent.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2">
                    <Badge variant="outline" className="text-[10px]">{c.format}</Badge>
                    <span className="flex-1 text-xs">{c.description}</span>
                    <span className="text-xs text-green-400">{c.estimatedEngagement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-primary"><Lightbulb className="h-3 w-3" /> Recomendaciones</p>
              <ul className="space-y-1.5">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground">→ {r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {analyses.length === 0 && !isAnalyzing && (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
              <h3 className="text-lg font-semibold">Analiza a tu competencia</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Escribe un @handle, URL o nombre y Claude analizara su estrategia
              </p>
              <p className="text-xs text-muted-foreground">
                Ejemplo: @nike, https://competidor.com, "Marca de relojes de lujo"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
