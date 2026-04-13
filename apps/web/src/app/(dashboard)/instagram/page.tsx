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
  Users,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  type: string;
  url: string;
  permalink: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export default function InstagramPage() {
  const [profile, setProfile] = useState<IGProfile | null>(null);
  const [media, setMedia] = useState<IGMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");
  const [publishCaption, setPublishCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

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
      if (data.success) {
        setPublishResult("Publicado con exito en Instagram!");
        setPublishUrl("");
        setPublishCaption("");
        // Reload media
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setPublishResult(`Error: ${data.error}`);
      }
    } catch {
      setPublishResult("Error de conexion");
    }
    setPublishing(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Instagram</h1>
          <p className="text-sm text-muted-foreground">
            {profile ? `@${profile.username}` : "Cargando..."}
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
          {/* Profile header */}
          {profile && (
            <div className="flex items-center gap-6 border-b border-border px-6 py-6">
              <img
                src={profile.profilePicture}
                alt={profile.username}
                className="h-20 w-20 rounded-full border-2 border-border"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">@{profile.username}</h2>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{profile.bio}</p>
              </div>
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold">{profile.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.followers}</p>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.following || 0}</p>
                  <p className="text-xs text-muted-foreground">Siguiendo</p>
                </div>
              </div>
            </div>
          )}

          {/* Media grid */}
          <div className="p-6">
            {media.length === 0 ? (
              <div className="flex h-[30vh] items-center justify-center text-center">
                <div>
                  <Grid3X3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">Sin publicaciones aun</p>
                  <Button className="mt-4 gap-2" onClick={() => setPublishOpen(true)}>
                    <Send className="h-4 w-4" /> Publicar primera imagen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                {media.map((item) => (
                  <a
                    key={item.id}
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    {item.url ? (
                      <img src={item.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
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
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish dialog */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publicar en Instagram</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">URL de la imagen</label>
              <Input
                placeholder="https://... (imagen publica accesible por URL)"
                value={publishUrl}
                onChange={(e) => setPublishUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Usa una imagen generada en ArbiStudio — copia la URL del asset
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Caption</label>
              <Textarea
                placeholder="Escribe el caption para tu post..."
                value={publishCaption}
                onChange={(e) => setPublishCaption(e.target.value)}
                rows={4}
              />
            </div>
            {publishResult && (
              <p className={`text-sm ${publishResult.startsWith("Error") ? "text-destructive" : "text-green-400"}`}>
                {publishResult}
              </p>
            )}
            <Button
              onClick={handlePublish}
              disabled={!publishUrl || publishing}
              className="w-full gap-2"
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {publishing ? "Publicando..." : "Publicar en Instagram"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
