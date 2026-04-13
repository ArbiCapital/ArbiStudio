"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Grid3X3,
  List,
  ImageIcon,
  Film,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { extractAllAssets, type ExtractedAsset } from "@/lib/asset-storage";

type ViewMode = "grid" | "list";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [assets, setAssets] = useState<ExtractedAsset[]>([]);

  useEffect(() => {
    setAssets(extractAllAssets());
  }, []);

  const filtered = assets.filter((a) => {
    if (search && !a.prompt.toLowerCase().includes(search.toLowerCase()) && !a.model.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDownload = async (asset: ExtractedAsset) => {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arbistudio-${asset.model}-${asset.ratio.replace(":", "x")}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(asset.url, "_blank");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Libreria de Assets</h1>
          <p className="text-sm text-muted-foreground">
            {assets.length} {assets.length === 1 ? "asset generado" : "assets generados"}
          </p>
        </div>
        <Link href="/chat">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Crear contenido
          </Button>
        </Link>
      </div>

      {assets.length > 0 && (
        <div className="flex items-center gap-3 border-b border-border px-6 py-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por prompt o modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {assets.length === 0 ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
              <h3 className="text-lg font-semibold">Sin assets aun</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Genera tu primer contenido desde el chat y aparecera aqui
              </p>
              <Link href="/chat">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Ir al chat
                </Button>
              </Link>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((asset) => (
              <div key={asset.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={asset.url}
                    alt={asset.prompt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-medium">{asset.prompt.replace(/\[CONTEXT:.*?\]\n?/g, "").slice(0, 60)}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Badge variant="outline" className="text-[9px]">{asset.ratio}</Badge>
                    <Badge variant="outline" className="text-[9px]">{asset.model}</Badge>
                    <Badge variant="outline" className="text-[9px]">{asset.width}x{asset.height}</Badge>
                  </div>
                </div>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => handleDownload(asset)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => window.open(asset.url, "_blank")}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((asset) => (
              <div key={asset.id} className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 hover:border-border hover:bg-muted/30">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={asset.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{asset.prompt.slice(0, 80)}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.width}x{asset.height} · {asset.model} · {new Date(asset.createdAt).toLocaleDateString("es")}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">{asset.ratio}</Badge>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDownload(asset)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && assets.length > 0 && (
          <div className="flex h-[30vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Sin resultados para "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
