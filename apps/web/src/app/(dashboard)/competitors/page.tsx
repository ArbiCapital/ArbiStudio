"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ExternalLink,
  TrendingUp,
  BarChart3,
  ImageIcon,
  Film,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CompetitorProfile {
  id: string;
  name: string;
  handle: string;
  platform: string;
  url: string;
  followers: string;
  postsPerWeek: number;
  engagementRate: number;
  topFormats: string[];
  lastAnalyzed: string;
  status: "analyzed" | "analyzing" | "pending";
}

interface AdLibraryResult {
  id: string;
  advertiser: string;
  platform: string;
  format: "image" | "video" | "carousel";
  status: "active" | "inactive";
  startDate: string;
  impressions: string;
}

const DEMO_COMPETITORS: CompetitorProfile[] = [
  { id: "1", name: "Competidor A", handle: "@competidora_lujo", platform: "instagram", url: "https://instagram.com/competidora_lujo", followers: "45.2K", postsPerWeek: 12, engagementRate: 3.2, topFormats: ["Reels", "Carrusel", "Stories"], lastAnalyzed: "2026-04-12", status: "analyzed" },
  { id: "2", name: "Competidor B", handle: "@marca_premium", platform: "instagram", url: "https://instagram.com/marca_premium", followers: "120K", postsPerWeek: 8, engagementRate: 2.1, topFormats: ["Post", "Reels"], lastAnalyzed: "2026-04-11", status: "analyzed" },
  { id: "3", name: "Competidor C", handle: "@coaching_elite", platform: "tiktok", url: "https://tiktok.com/@coaching_elite", followers: "89K", postsPerWeek: 18, engagementRate: 5.7, topFormats: ["Video", "Duet"], lastAnalyzed: "2026-04-10", status: "analyzed" },
];

const DEMO_ADS: AdLibraryResult[] = [
  { id: "1", advertiser: "Competidor A", platform: "meta", format: "video", status: "active", startDate: "2026-04-01", impressions: "250K-500K" },
  { id: "2", advertiser: "Competidor A", platform: "meta", format: "image", status: "active", startDate: "2026-03-28", impressions: "100K-250K" },
  { id: "3", advertiser: "Competidor B", platform: "meta", format: "carousel", status: "active", startDate: "2026-04-05", impressions: "50K-100K" },
  { id: "4", advertiser: "Competidor B", platform: "google", format: "image", status: "active", startDate: "2026-04-02", impressions: "500K-1M" },
];

export default function CompetitorsPage() {
  const [activeView, setActiveView] = useState("profiles");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!newCompetitor) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
    setNewCompetitor("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Competitor Intel</h1>
          <p className="text-sm text-muted-foreground">
            Analiza la competencia: ads, contenido, estrategia
          </p>
        </div>
      </div>

      {/* Add competitor */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="@handle, URL o nombre del competidor..."
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!newCompetitor || isAnalyzing}
          className="gap-2"
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analizar
        </Button>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="profiles">Perfiles</TabsTrigger>
            <TabsTrigger value="ads">Ad Library</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeView === "profiles" && (
          <div className="space-y-4">
            {DEMO_COMPETITORS.map((comp) => (
              <div
                key={comp.id}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{comp.name}</h3>
                      <Badge variant="outline" className="text-xs">{comp.platform}</Badge>
                      <Badge className="text-[10px] bg-green-500/10 text-green-400">Analizado</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {comp.handle} · {comp.followers} seguidores
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <ExternalLink className="h-3 w-3" />
                    Ver perfil
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Posts/semana</p>
                    <p className="text-lg font-bold">{comp.postsPerWeek}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Engagement</p>
                    <p className="text-lg font-bold text-green-400">{comp.engagementRate}%</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Seguidores</p>
                    <p className="text-lg font-bold">{comp.followers}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Top formato</p>
                    <p className="text-lg font-bold">{comp.topFormats[0]}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {comp.topFormats.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />
                    Crear contenido similar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <BarChart3 className="h-3 w-3" />
                    Ver analisis completo
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <TrendingUp className="h-3 w-3" />
                    Monitorear
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === "ads" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Anuncios activos de tus competidores en Meta Ad Library y Google Ads Transparency
            </p>
            {DEMO_ADS.map((ad) => (
              <div key={ad.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {ad.format === "video" ? <Film className="h-6 w-6 text-muted-foreground" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{ad.advertiser}</p>
                  <p className="text-xs text-muted-foreground">
                    {ad.format} · Activo desde {ad.startDate} · {ad.impressions} impresiones
                  </p>
                </div>
                <Badge className={ad.platform === "meta" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"} >
                  {ad.platform.toUpperCase()}
                </Badge>
                <Badge variant={ad.status === "active" ? "default" : "secondary"} className="text-[10px]">
                  {ad.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
                <Button variant="outline" size="sm" className="text-xs">Analizar</Button>
              </div>
            ))}
          </div>
        )}

        {activeView === "insights" && (
          <div className="mx-auto max-w-2xl space-y-6 py-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Insights de la competencia</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 shrink-0 text-green-400" />
                  <div>
                    <p className="font-medium">Los Reels de unboxing tienen 3x mas engagement</p>
                    <p className="text-sm text-muted-foreground">Competidor A y C usan este formato con resultados consistentes</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-blue-400" />
                  <div>
                    <p className="font-medium">Hora optima de publicacion: 19:00 CET</p>
                    <p className="text-sm text-muted-foreground">Los 3 competidores publican entre 18:30 y 19:30 — coincide con pico de engagement</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Globe className="mt-1 h-5 w-5 shrink-0 text-orange-400" />
                  <div>
                    <p className="font-medium">Oportunidad: Ninguno usa TikTok Ads</p>
                    <p className="text-sm text-muted-foreground">Solo Competidor C tiene presencia organica en TikTok, pero nadie invierte en paid</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <ImageIcon className="mt-1 h-5 w-5 shrink-0 text-purple-400" />
                  <div>
                    <p className="font-medium">Los carruseles educativos generan mas saves</p>
                    <p className="text-sm text-muted-foreground">Competidor B obtiene 2x mas saves con carruseles de tips vs posts normales</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Generar estrategia basada en estos insights
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
