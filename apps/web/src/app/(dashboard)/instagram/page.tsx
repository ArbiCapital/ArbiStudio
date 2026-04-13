"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Heart,
  MessageCircle,
  ExternalLink,
  Send,
  ImageIcon,
  AlertCircle,
  Grid3X3,
  Search,
  Play,
  X,
  FileText,
  Sparkles,
  Film,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface IGProfile {
  username: string;
  profilePicture: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
}

interface IGMedia {
  id: string;
  caption: string;
  type: string; // IMAGE, VIDEO, CAROUSEL_ALBUM
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
  likes: number;
  comments: number;
  productType: string; // REELS, FEED
}

export default function InstagramPage() {
  const [profile, setProfile] = useState<IGProfile | null>(null);
  const [media, setMedia] = useState<IGMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("myfeed");
  const [selectedMedia, setSelectedMedia] = useState<IGMedia | null>(null);
  const [mediaFilter, setMediaFilter] = useState<"all" | "IMAGE" | "VIDEO">("all");

  // Publish
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");
  const [publishCaption, setPublishCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  // Search competitor
  const [searchUsername, setSearchUsername] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // Transcription
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
          setMedia(data.media);
        } else {
          setError(data.error);
        }
      })
      .catch(() => setError("Error de conexion"))
      .finally(() => setLoading(false));
  }, []);

  const filteredMedia = media.filter((m) => {
    if (mediaFilter === "all") return true;
    return m.type === mediaFilter;
  });

  const handlePublish = async () => {
    if (!publishUrl) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: publishUrl, caption: publishCaption }),
      });
      const data = await res.json();
      setPublishResult(data.success ? "Publicado con exito en Instagram!" : `Error: ${data.error}`);
      if (data.success) { setPublishUrl(""); setPublishCaption(""); }
    } catch { setPublishResult("Error de conexion"); }
    setPublishing(false);
  };

  const handleSearchCompetitor = async () => {
    if (!searchUsername) return;
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/instagram/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchUsername }),
      });
      const data = await res.json();
      if (data.success) setSearchResult(data.profile);
    } catch {}
    setSearchLoading(false);
  };

  const handleTranscribe = async (videoUrl: string) => {
    setTranscribing(true);
    setTranscription(null);
    try {
      // For IG videos, we use Claude to describe/analyze since we can't directly download
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analiza este video de Instagram: ${videoUrl}\n\nDescribe el contenido del video, que se dice, la estructura, los hooks, CTAs y cualquier texto en pantalla. Si es un reel con voz, intenta transcribir lo que se dice.`,
          }],
        }),
      });
      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let text = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value);
        }
        setTranscription(text || "Analisis completado. Abre el video para mas detalles.");
      }
    } catch {
      setTranscription("No se pudo analizar el video.");
    }
    setTranscribing(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Instagram</h1>
          <p className="text-sm text-muted-foreground">
            {profile ? `@${profile.username} · ${profile.followers} seguidores` : "Cargando..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.open("https://instagram.com/arbicapitaluae", "_blank")}>
            <ExternalLink className="h-4 w-4" /> Ver en IG
          </Button>
          <Button className="gap-2" onClick={() => setPublishOpen(true)}>
            <Send className="h-4 w-4" /> Publicar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-6 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="myfeed">Mi Feed</TabsTrigger>
            <TabsTrigger value="search">Buscar Perfiles</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* === MY FEED TAB === */}
          {activeTab === "myfeed" && (
            <>
              {/* Profile header */}
              {profile && (
                <div className="flex items-center gap-6 border-b border-border px-6 py-6">
                  <img src={profile.profilePicture} alt={profile.username} className="h-20 w-20 rounded-full border-2 border-border" />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">@{profile.username}</h2>
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                  </div>
                  <div className="flex gap-8 text-center">
                    <div><p className="text-2xl font-bold">{profile.posts}</p><p className="text-xs text-muted-foreground">Posts</p></div>
                    <div><p className="text-2xl font-bold">{profile.followers}</p><p className="text-xs text-muted-foreground">Seguidores</p></div>
                    <div><p className="text-2xl font-bold">{profile.following || 0}</p><p className="text-xs text-muted-foreground">Siguiendo</p></div>
                  </div>
                </div>
              )}

              {/* Media filter */}
              <div className="flex items-center gap-2 border-b border-border px-6 py-2">
                <span className="text-xs text-muted-foreground">Filtrar:</span>
                {[
                  { id: "all" as const, label: "Todo", count: media.length },
                  { id: "IMAGE" as const, label: "Imagenes", count: media.filter((m) => m.type === "IMAGE").length },
                  { id: "VIDEO" as const, label: "Videos/Reels", count: media.filter((m) => m.type === "VIDEO").length },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMediaFilter(f.id)}
                    className={`rounded-full px-3 py-1 text-xs transition-all ${
                      mediaFilter === f.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>

              {/* Media grid */}
              <div className="p-6">
                {filteredMedia.length === 0 ? (
                  <div className="flex h-[30vh] items-center justify-center text-center">
                    <div>
                      <Grid3X3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground">Sin publicaciones</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {filteredMedia.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedMedia(item); setTranscription(null); }}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-muted text-left"
                      >
                        <img
                          src={item.thumbnailUrl || item.mediaUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {item.type === "VIDEO" && (
                          <div className="absolute left-2 top-2">
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                              <Play className="h-2.5 w-2.5" />
                              {item.productType === "REELS" ? "Reel" : "Video"}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="flex items-center gap-1 text-sm font-semibold text-white">
                            <Heart className="h-4 w-4" /> {item.likes}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-white">
                            <MessageCircle className="h-4 w-4" /> {item.comments}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* === SEARCH TAB === */}
          {activeTab === "search" && (
            <div className="p-6">
              <div className="mx-auto max-w-2xl">
                {/* Search bar */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="@competidor o nombre de cuenta..."
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchCompetitor()}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={handleSearchCompetitor} disabled={!searchUsername || searchLoading} className="gap-2">
                    {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Analizar
                  </Button>
                </div>

                {searchLoading && (
                  <div className="mt-12 text-center">
                    <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Analizando @{searchUsername} con IA...</p>
                  </div>
                )}

                {searchResult && (
                  <div className="mt-6 space-y-6">
                    {/* Profile card */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">@{searchResult.username}</h3>
                          <p className="text-sm text-muted-foreground">{searchResult.fullName}</p>
                          <p className="mt-1 text-sm">{searchResult.bio}</p>
                        </div>
                        {searchResult.isVerified && <Badge>Verificado</Badge>}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-muted/30 p-3 text-center">
                          <p className="text-xl font-bold">{searchResult.followers}</p>
                          <p className="text-xs text-muted-foreground">Seguidores</p>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3 text-center">
                          <p className="text-xl font-bold">{searchResult.following}</p>
                          <p className="text-xs text-muted-foreground">Siguiendo</p>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3 text-center">
                          <p className="text-xl font-bold">{searchResult.posts}</p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                      </div>
                    </div>

                    {/* Content strategy */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h4 className="mb-3 text-sm font-semibold">Estrategia de contenido</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Frecuencia:</span> <span className="font-medium">{searchResult.contentStrategy.postingFrequency}</span></div>
                        <div><span className="text-muted-foreground">Tono:</span> <span className="font-medium">{searchResult.contentStrategy.toneOfVoice}</span></div>
                        <div><span className="text-muted-foreground">Colores:</span> <span className="font-medium">{searchResult.contentStrategy.colorPalette}</span></div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground">Formatos top:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {searchResult.contentStrategy.topFormats.map((f: string) => (
                            <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground">Hashtags:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {searchResult.contentStrategy.topHashtags.map((h: string) => (
                            <Badge key={h} variant="outline" className="text-xs">#{h}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent content */}
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h4 className="mb-3 text-sm font-semibold">Contenido reciente</h4>
                      <div className="space-y-3">
                        {searchResult.recentContent.map((c: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/20 p-3">
                            <Badge variant="outline" className="shrink-0 text-[10px]">{c.type}</Badge>
                            <div className="flex-1">
                              <p className="text-sm">{c.description}</p>
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{c.caption}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              <p>❤️ {c.estimatedLikes}</p>
                              <p>💬 {c.estimatedComments}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                        <Sparkles className="h-4 w-4" /> Insights para competir
                      </h4>
                      <ul className="space-y-2">
                        {searchResult.competitorInsights.map((insight: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">→ {insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {!searchLoading && !searchResult && (
                  <div className="mt-16 text-center">
                    <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                    <h3 className="text-lg font-semibold">Analiza cualquier perfil</h3>
                    <p className="text-sm text-muted-foreground">
                      Escribe un @handle y Claude analizara su estrategia de contenido
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === MEDIA DETAIL MODAL === */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
          {selectedMedia && (
            <div className="flex flex-col md:flex-row">
              {/* Media */}
              <div className="flex-1 bg-black">
                {selectedMedia.type === "VIDEO" ? (
                  <video
                    src={selectedMedia.mediaUrl}
                    controls
                    autoPlay
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedMedia.mediaUrl}
                    alt=""
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex w-full flex-col p-4 md:w-80">
                <div className="mb-3 flex items-center gap-2">
                  {profile && <img src={profile.profilePicture} alt="" className="h-8 w-8 rounded-full" />}
                  <span className="font-semibold">@{profile?.username}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedMedia.type === "VIDEO"
                      ? selectedMedia.productType === "REELS" ? "Reel" : "Video"
                      : "Imagen"}
                  </Badge>
                </div>

                <p className="mb-3 text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
                  {selectedMedia.caption || "Sin caption"}
                </p>

                <div className="mb-3 flex gap-4">
                  <span className="flex items-center gap-1 text-sm"><Heart className="h-4 w-4" /> {selectedMedia.likes}</span>
                  <span className="flex items-center gap-1 text-sm"><MessageCircle className="h-4 w-4" /> {selectedMedia.comments}</span>
                </div>

                <p className="mb-4 text-xs text-muted-foreground">
                  {new Date(selectedMedia.timestamp).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                <Separator className="mb-4" />

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2 text-xs" onClick={() => window.open(selectedMedia.permalink, "_blank")}>
                    <ExternalLink className="h-3.5 w-3.5" /> Ver en Instagram
                  </Button>

                  {selectedMedia.type === "VIDEO" && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-xs"
                      onClick={() => handleTranscribe(selectedMedia.permalink)}
                      disabled={transcribing}
                    >
                      {transcribing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                      {transcribing ? "Transcribiendo..." : "Transcribir video"}
                    </Button>
                  )}

                  <Button variant="outline" className="w-full gap-2 text-xs" onClick={() => {
                    if (selectedMedia.mediaUrl) window.open(selectedMedia.mediaUrl, "_blank");
                  }}>
                    <Download className="h-3.5 w-3.5" /> Descargar
                  </Button>
                </div>

                {/* Transcription result */}
                {transcription && (
                  <div className="mt-4 rounded-lg bg-muted/30 p-3">
                    <p className="mb-1 text-xs font-semibold">Transcripcion / Analisis:</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{transcription.substring(0, 500)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* === PUBLISH DIALOG === */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Publicar en Instagram</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">URL de la imagen</label>
              <Input placeholder="https://... (URL publica)" value={publishUrl} onChange={(e) => setPublishUrl(e.target.value)} />
              <p className="mt-1 text-xs text-muted-foreground">Copia la URL de una imagen generada en el Chat</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Caption</label>
              <Textarea placeholder="Escribe el caption..." value={publishCaption} onChange={(e) => setPublishCaption(e.target.value)} rows={4} />
            </div>
            {publishResult && (
              <p className={`text-sm ${publishResult.startsWith("Error") ? "text-destructive" : "text-green-400"}`}>{publishResult}</p>
            )}
            <Button onClick={handlePublish} disabled={!publishUrl || publishing} className="w-full gap-2">
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {publishing ? "Publicando..." : "Publicar en Instagram"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
