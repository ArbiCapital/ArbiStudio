"use client";

import { useState } from "react";
import {
  Plus,
  BarChart3,
  Play,
  Pause,
  ExternalLink,
  TrendingUp,
  DollarSign,
  MousePointer,
  Eye,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Campaign {
  id: string;
  name: string;
  platform: "meta" | "google" | "tiktok";
  status: "active" | "paused" | "draft" | "completed";
  objective: string;
  budgetDaily: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  roas: number;
  createdAt: string;
}

const DEMO_CAMPAIGNS: Campaign[] = [
  { id: "1", name: "Relojes Lujo — Conversiones ES", platform: "meta", status: "active", objective: "Conversions", budgetDaily: 50, spend: 234.5, impressions: 45200, clicks: 892, ctr: 1.97, cpc: 0.26, conversions: 23, roas: 4.2, createdAt: "2026-04-08" },
  { id: "2", name: "Brand Awareness — Coaching", platform: "meta", status: "active", objective: "Awareness", budgetDaily: 30, spend: 156.2, impressions: 89400, clicks: 1203, ctr: 1.35, cpc: 0.13, conversions: 0, roas: 0, createdAt: "2026-04-10" },
  { id: "3", name: "Search — Relojes Premium", platform: "google", status: "paused", objective: "Traffic", budgetDaily: 40, spend: 89.0, impressions: 12300, clicks: 345, ctr: 2.8, cpc: 0.26, conversions: 8, roas: 3.1, createdAt: "2026-04-05" },
  { id: "4", name: "TikTok — UGC Coaching", platform: "tiktok", status: "draft", objective: "Traffic", budgetDaily: 25, spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, conversions: 0, roas: 0, createdAt: "2026-04-12" },
];

const PLATFORM_COLORS: Record<string, string> = {
  meta: "bg-blue-500/10 text-blue-400",
  google: "bg-red-500/10 text-red-400",
  tiktok: "bg-pink-500/10 text-pink-400",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400",
  paused: "bg-yellow-500/10 text-yellow-400",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-blue-500/10 text-blue-400",
};

export default function CampaignsPage() {
  const [platformFilter, setPlatformFilter] = useState("all");

  const filtered = DEMO_CAMPAIGNS.filter(
    (c) => platformFilter === "all" || c.platform === platformFilter
  );

  const totalSpend = filtered.reduce((sum, c) => sum + c.spend, 0);
  const totalImpressions = filtered.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = filtered.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = filtered.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Campanas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus campanas de Meta, Google y TikTok Ads
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva campana
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 border-b border-border px-6 py-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Gasto total
          </div>
          <p className="mt-1 text-2xl font-bold">{totalSpend.toFixed(0)}€</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            Impresiones
          </div>
          <p className="mt-1 text-2xl font-bold">{(totalImpressions / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MousePointer className="h-4 w-4" />
            Clicks
          </div>
          <p className="mt-1 text-2xl font-bold">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            Conversiones
          </div>
          <p className="mt-1 text-2xl font-bold">{totalConversions}</p>
        </div>
      </div>

      {/* Platform filter */}
      <div className="border-b border-border px-6 py-3">
        <Tabs value={platformFilter} onValueChange={setPlatformFilter}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Campaign list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {filtered.map((campaign) => (
            <div
              key={campaign.id}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge className={`text-[10px] ${PLATFORM_COLORS[campaign.platform]}`}>
                      {campaign.platform.toUpperCase()}
                    </Badge>
                    <Badge className={`text-[10px] ${STATUS_COLORS[campaign.status]}`}>
                      {campaign.status === "active" ? "Activa" : campaign.status === "paused" ? "Pausada" : campaign.status === "draft" ? "Borrador" : "Completada"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {campaign.objective} · {campaign.budgetDaily}€/dia · Desde {campaign.createdAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  {campaign.status === "active" ? (
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <Pause className="h-3 w-3" /> Pausar
                    </Button>
                  ) : campaign.status === "paused" ? (
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <Play className="h-3 w-3" /> Activar
                    </Button>
                  ) : null}
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <BarChart3 className="h-3 w-3" /> Metricas
                  </Button>
                </div>
              </div>

              {/* Metrics row */}
              {campaign.spend > 0 && (
                <div className="mt-3 grid grid-cols-6 gap-4 rounded-lg bg-muted/30 px-4 py-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Gasto</p>
                    <p className="text-sm font-semibold">{campaign.spend.toFixed(0)}€</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Impresiones</p>
                    <p className="text-sm font-semibold">{(campaign.impressions / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Clicks</p>
                    <p className="text-sm font-semibold">{campaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">CTR</p>
                    <p className="text-sm font-semibold">{campaign.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">CPC</p>
                    <p className="text-sm font-semibold">{campaign.cpc}€</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">ROAS</p>
                    <p className="text-sm font-semibold text-green-400">{campaign.roas > 0 ? `${campaign.roas}x` : "—"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
