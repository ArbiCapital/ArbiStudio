"use client";

import { useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  Upload,
  ImageIcon,
  Film,
  Music,
  FileText,
  Download,
  Trash2,
  Share2,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AssetFilter = "all" | "image" | "video" | "audio";
type ViewMode = "grid" | "list";

interface LibraryAsset {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  format: string;
  model: string;
  dimensions: string;
  size: string;
  createdAt: string;
  status: "ready" | "generating" | "published";
}

const DEMO_ASSETS: LibraryAsset[] = [
  { id: "1", name: "Reloj lujo marmol 1:1", type: "image", format: "1:1", model: "Flux Pro", dimensions: "1080x1080", size: "2.4 MB", createdAt: "2026-04-12", status: "ready" },
  { id: "2", name: "Banner producto 16:9", type: "image", format: "16:9", model: "Ideogram v3", dimensions: "1920x1080", size: "3.1 MB", createdAt: "2026-04-12", status: "published" },
  { id: "3", name: "Reel coaching 9:16", type: "video", format: "9:16", model: "Kling 1.6", dimensions: "1080x1920", size: "18 MB", createdAt: "2026-04-11", status: "ready" },
  { id: "4", name: "Logo marca vectorial", type: "image", format: "1:1", model: "Recraft v3", dimensions: "1024x1024", size: "0.8 MB", createdAt: "2026-04-11", status: "ready" },
  { id: "5", name: "Voiceover promo ES", type: "audio", format: "mp3", model: "ElevenLabs", dimensions: "30s", size: "1.2 MB", createdAt: "2026-04-10", status: "ready" },
  { id: "6", name: "Story producto 4:5", type: "image", format: "4:5", model: "Gemini 4K", dimensions: "1080x1350", size: "4.2 MB", createdAt: "2026-04-10", status: "ready" },
];

const TYPE_ICONS: Record<string, typeof ImageIcon> = {
  image: ImageIcon,
  video: Film,
  audio: Music,
  document: FileText,
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AssetFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = DEMO_ASSETS.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Libreria de Assets</h1>
          <p className="text-sm text-muted-foreground">
            {DEMO_ASSETS.length} assets generados
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Subir archivo
        </Button>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as AssetFilter)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="image">Imagen</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex gap-1">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((asset) => {
              const Icon = TYPE_ICONS[asset.type];
              return (
                <div key={asset.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50">
                    <div className="flex h-full items-center justify-center">
                      <Icon className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{asset.name}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Badge variant="outline" className="text-[9px]">{asset.format}</Badge>
                      <Badge variant="outline" className="text-[9px]">{asset.model}</Badge>
                      {asset.status === "published" && <Badge className="text-[9px]">Publicado</Badge>}
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger><Button size="icon" variant="secondary" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Share2 className="h-3.5 w-3.5" /> Publicar</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><SlidersHorizontal className="h-3.5 w-3.5" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="h-3.5 w-3.5" /> Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((asset) => {
              const Icon = TYPE_ICONS[asset.type];
              return (
                <div key={asset.id} className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 hover:border-border hover:bg-muted/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.dimensions} · {asset.size} · {asset.createdAt}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{asset.model}</Badge>
                  {asset.status === "published" && <Badge className="text-[10px]">Publicado</Badge>}
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">Sin resultados</h3>
              <p className="text-sm text-muted-foreground">
                {search ? "Prueba con otra busqueda" : "Genera tu primer contenido desde el chat"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
