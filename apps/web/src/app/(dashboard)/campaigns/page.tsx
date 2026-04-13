"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  BarChart3,
  Loader2,
  DollarSign,
  MousePointer,
  Eye,
  Target,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  objective: string;
  dailyBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400",
  paused: "bg-yellow-500/10 text-yellow-400",
  archived: "bg-muted text-muted-foreground",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  OUTCOME_LEADS: "Leads",
  OUTCOME_SALES: "Ventas",
  OUTCOME_TRAFFIC: "Trafico",
  OUTCOME_AWARENESS: "Awareness",
  OUTCOME_ENGAGEMENT: "Engagement",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          setError(data.error || "Error cargando campanas");
        }
      })
      .catch(() => setError("Error de conexion"))
      .finally(() => setLoading(false));
  }, []);

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (Number(c.conversions) || 0), 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Campanas Meta Ads</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Cargando..." : `${campaigns.length} campanas — ${activeCampaigns.length} activas`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.open("https://adsmanager.facebook.com", "_blank")}>
            <ExternalLink className="h-4 w-4" />
            Ads Manager
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva campana
          </Button>
        </div>
      </div>

      {/* KPIs */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 border-b border-border px-6 py-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" /> Gasto (30d)
            </div>
            <p className="mt-1 text-2xl font-bold">{totalSpend.toFixed(0)}€</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" /> Impresiones
            </div>
            <p className="mt-1 text-2xl font-bold">{(totalImpressions / 1000).toFixed(1)}K</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointer className="h-4 w-4" /> Clicks
            </div>
            <p className="mt-1 text-2xl font-bold">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" /> Leads
            </div>
            <p className="mt-1 text-2xl font-bold">{totalConversions}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando campanas desde Meta Ads...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
              <p className="mb-2 text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <Badge className="text-[10px] bg-blue-500/10 text-blue-400">META</Badge>
                      <Badge className={`text-[10px] ${STATUS_COLORS[campaign.status] || STATUS_COLORS.archived}`}>
                        {campaign.status === "active" ? "Activa" : campaign.status === "paused" ? "Pausada" : campaign.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {OBJECTIVE_LABELS[campaign.objective] || campaign.objective} · {campaign.dailyBudget > 0 ? `${campaign.dailyBudget}€/dia` : "Sin presupuesto diario"} · Creada {new Date(campaign.createdAt).toLocaleDateString("es")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <BarChart3 className="h-3 w-3" /> Detalles
                  </Button>
                </div>

                {/* Metrics */}
                {(campaign.spend > 0 || campaign.impressions > 0) && (
                  <div className="mt-3 grid grid-cols-3 gap-4 rounded-lg bg-muted/30 px-4 py-2 text-center sm:grid-cols-5">
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
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-muted-foreground">CTR</p>
                      <p className="text-sm font-semibold">{campaign.ctr.toFixed(2)}%</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-muted-foreground">CPC</p>
                      <p className="text-sm font-semibold">{campaign.cpc.toFixed(2)}€</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
