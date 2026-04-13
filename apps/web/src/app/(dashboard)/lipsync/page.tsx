"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Play, Loader2, Download, Volume2, Plus, X, Upload, Video, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: string;
  custom?: boolean;
}

const DEFAULT_VOICES: Voice[] = [
  { id: "isabella-es", name: "Isabella", lang: "ES", gender: "Mujer" },
  { id: "carlos-es", name: "Carlos", lang: "ES", gender: "Hombre" },
  { id: "aria-en", name: "Aria", lang: "EN", gender: "Woman" },
  { id: "roger-en", name: "Roger", lang: "EN", gender: "Man" },
];

const EMOTIONS = [
  { id: "neutral", label: "Neutral" },
  { id: "happy", label: "Feliz" },
  { id: "serious", label: "Serio" },
  { id: "enthusiastic", label: "Entusiasta" },
  { id: "confident", label: "Confiado" },
];

const CUSTOM_VOICES_KEY = "arbistudio-custom-voices";

function loadCustomVoices(): Voice[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_VOICES_KEY) || "[]"); }
  catch { return []; }
}

function saveCustomVoices(voices: Voice[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOM_VOICES_KEY, JSON.stringify(voices));
  }
}

export default function LipsyncPage() {
  const [script, setScript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("isabella-es");
  const [selectedEmotion, setSelectedEmotion] = useState("neutral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customVoices, setCustomVoices] = useState<Voice[]>([]);
  const [showAddVoice, setShowAddVoice] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [newVoice, setNewVoice] = useState({ name: "", elevenlabsId: "", lang: "ES", gender: "Mujer" });

  // Lip sync state
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [characterImagePreview, setCharacterImagePreview] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCustomVoices(loadCustomVoices()); }, []);

  const allVoices = [...DEFAULT_VOICES, ...customVoices];

  const handleGenerate = async () => {
    if (!script) return;
    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          voiceId: selectedVoice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAudioUrl(data.audio.dataUrl);
      } else {
        setError(data.error || "Error generando audio");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => setCharacterImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to fal.ai storage via a temporary object URL
    // We'll send the file as base64 to the lipsync API, which will handle the upload
    // For now, convert to a data URL that the API can use
    const base64Reader = new FileReader();
    base64Reader.onload = (e) => {
      setCharacterImageUrl(e.target?.result as string);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleGenerateLipsync = async () => {
    if (!characterImageUrl) {
      setVideoError("Sube una imagen del personaje primero");
      return;
    }
    if (!audioUrl && !script) {
      setVideoError("Genera un voiceover o escribe un guion primero");
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoUrl(null);

    try {
      const body: Record<string, string> = {
        imageUrl: characterImageUrl,
      };

      if (audioUrl) {
        // If we have a generated audio data URL, pass the text so the API generates fresh audio
        // (data URLs can't be used directly by fal.ai, so let the API handle TTS + upload)
        body.text = script;
        body.voiceId = selectedVoice;
      } else {
        // No audio yet — pass text for TTS generation within the lipsync API
        body.text = script;
        body.voiceId = selectedVoice;
      }

      const res = await fetch("/api/lipsync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setVideoUrl(data.video.url);
      } else {
        setVideoError(data.error || "Error generando video de lip sync");
      }
    } catch {
      setVideoError("Error de conexion al generar lip sync");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleCloneVoice = async (file: File) => {
    if (!newVoice.name) return;
    setIsCloning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("name", newVoice.name);

      const res = await fetch("/api/voice-clone", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        const voice: Voice = {
          id: data.voiceId,
          name: newVoice.name,
          lang: newVoice.lang,
          gender: newVoice.gender,
          custom: true,
        };
        const updated = [...customVoices, voice];
        setCustomVoices(updated);
        saveCustomVoices(updated);
        setSelectedVoice(data.voiceId);
        setShowAddVoice(false);
        setNewVoice({ name: "", elevenlabsId: "", lang: "ES", gender: "Mujer" });
      } else {
        setError(data.error || "Error clonando voz");
      }
    } catch {
      setError("Error de conexion al clonar voz");
    } finally {
      setIsCloning(false);
    }
  };

  const handleAddManualVoice = () => {
    if (!newVoice.name || !newVoice.elevenlabsId) return;
    const voice: Voice = {
      id: newVoice.elevenlabsId,
      name: newVoice.name,
      lang: newVoice.lang,
      gender: newVoice.gender,
      custom: true,
    };
    const updated = [...customVoices, voice];
    setCustomVoices(updated);
    saveCustomVoices(updated);
    setSelectedVoice(newVoice.elevenlabsId);
    setShowAddVoice(false);
    setNewVoice({ name: "", elevenlabsId: "", lang: "ES", gender: "Mujer" });
  };

  const handleDeleteCustomVoice = (voiceId: string) => {
    const updated = customVoices.filter((v) => v.id !== voiceId);
    setCustomVoices(updated);
    saveCustomVoices(updated);
    if (selectedVoice === voiceId) setSelectedVoice("isabella-es");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Lipsync Studio</h1>
          <p className="text-sm text-muted-foreground">
            Genera voiceovers con IA y sincronizacion labial
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — Script + controls */}
        <div className="flex w-full flex-col border-r border-border p-4 md:w-96 overflow-y-auto">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Guion</label>
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Escribe el guion que quieres convertir en voiceover..."
              rows={6}
              className="text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">{script.length} caracteres</p>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Voz</label>
              <button
                onClick={() => setShowAddVoice(true)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Anadir voz
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allVoices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`group relative rounded-lg border p-2 text-left text-xs transition-all ${
                    selectedVoice === voice.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium">{voice.name}</p>
                  <p className="text-muted-foreground">{voice.gender} · {voice.lang}</p>
                  {voice.custom && (
                    <>
                      <Badge variant="outline" className="mt-1 text-[9px]">Custom</Badge>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomVoice(voice.id); }}
                        className="absolute right-1 top-1 hidden rounded-full p-0.5 text-muted-foreground hover:text-destructive group-hover:block"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Emocion</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => setSelectedEmotion(emo.id)}
                  className={`rounded-full px-3 py-1 text-xs transition-all ${
                    selectedEmotion === emo.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {emo.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!script || isGenerating}
            className="gap-2"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
            {isGenerating ? "Generando..." : "Generar voiceover"}
          </Button>

          {/* Lip Sync Section */}
          <div className="mt-6 border-t border-border pt-4">
            <label className="mb-2 block text-sm font-medium">Lip Sync Video</label>
            <p className="mb-3 text-xs text-muted-foreground">
              Sube una imagen de personaje y genera un video con sincronizacion labial
            </p>

            {/* Character image upload */}
            <div className="mb-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {characterImagePreview ? (
                <div className="relative">
                  <img
                    src={characterImagePreview}
                    alt="Character"
                    className="h-32 w-32 rounded-lg border border-border object-cover"
                  />
                  <button
                    onClick={() => {
                      setCharacterImageUrl(null);
                      setCharacterImagePreview(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-xs">Subir imagen</span>
                </button>
              )}
            </div>

            <Button
              onClick={handleGenerateLipsync}
              disabled={!characterImageUrl || (!audioUrl && !script) || isGeneratingVideo}
              className="w-full gap-2"
              variant="secondary"
            >
              {isGeneratingVideo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Video className="h-4 w-4" />
              )}
              {isGeneratingVideo ? "Generando video..." : "Generar Lip Sync Video"}
            </Button>

            {videoError && (
              <p className="mt-2 text-xs text-destructive">{videoError}</p>
            )}
          </div>
        </div>

        {/* Right — Preview */}
        <div className="flex flex-1 flex-col items-center justify-center p-8 overflow-y-auto">
          {videoUrl ? (
            <div className="w-full max-w-lg space-y-6 text-center">
              <div>
                <h3 className="text-lg font-semibold">Lip Sync Video generado</h3>
                <div className="mt-2 flex justify-center gap-2">
                  <Badge variant="secondary">{allVoices.find((v) => v.id === selectedVoice)?.name}</Badge>
                  <Badge variant="outline">SadTalker</Badge>
                </div>
              </div>
              <video
                controls
                className="w-full rounded-lg border border-border"
                src={videoUrl}
              />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = videoUrl;
                    a.download = `arbistudio-lipsync-${Date.now()}.mp4`;
                    a.target = "_blank";
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                  Descargar video
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setVideoUrl(null);
                    setAudioUrl(null);
                    setScript("");
                    setCharacterImageUrl(null);
                    setCharacterImagePreview(null);
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }}
                >
                  <Video className="h-4 w-4" />
                  Nuevo
                </Button>
              </div>

              {/* Also show audio player if available */}
              {audioUrl && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-sm text-muted-foreground">Audio generado</p>
                  <audio controls className="w-full" src={audioUrl} />
                </div>
              )}
            </div>
          ) : audioUrl ? (
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Volume2 className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Voiceover generado</h3>
                <div className="mt-2 flex justify-center gap-2">
                  <Badge variant="secondary">{allVoices.find((v) => v.id === selectedVoice)?.name}</Badge>
                  <Badge variant="outline">{selectedEmotion}</Badge>
                </div>
              </div>
              <audio controls className="w-full" src={audioUrl} />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = audioUrl;
                    a.download = `arbistudio-voiceover-${Date.now()}.mp3`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                  Descargar MP3
                </Button>
                <Button className="gap-2" onClick={() => { setAudioUrl(null); setScript(""); }}>
                  <Mic className="h-4 w-4" />
                  Nuevo
                </Button>
              </div>
              {characterImageUrl && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Tienes audio + imagen listos. Pulsa &quot;Generar Lip Sync Video&quot; en el panel izquierdo.
                  </p>
                </div>
              )}
            </div>
          ) : isGeneratingVideo ? (
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-medium">Generando video de lip sync...</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Esto puede tardar 1-2 minutos. Se genera el audio y se sincroniza con la imagen.
              </p>
            </div>
          ) : isGenerating ? (
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generando voiceover con ElevenLabs...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="mb-2 text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>Reintentar</Button>
            </div>
          ) : (
            <div className="text-center">
              <Mic className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
              <h3 className="text-lg font-semibold">Lipsync Studio</h3>
              <p className="text-sm text-muted-foreground">
                Escribe un guion, selecciona voz y emocion, y genera un voiceover profesional
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Sube una imagen de personaje para generar un video con lip sync
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Voice Dialog */}
      <Dialog open={showAddVoice} onOpenChange={setShowAddVoice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Anadir voz personalizada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre de la voz (ej: Mi voz, Voz cliente)"
              value={newVoice.name}
              onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Idioma</label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={newVoice.lang}
                  onChange={(e) => setNewVoice({ ...newVoice, lang: e.target.value })}
                >
                  <option value="ES">Espanol</option>
                  <option value="EN">English</option>
                  <option value="AR">Arabic</option>
                  <option value="FR">French</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Genero</label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={newVoice.gender}
                  onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value })}
                >
                  <option>Mujer</option>
                  <option>Hombre</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-3">
              <p className="text-xs font-medium">Opcion 1: Clonar voz con audio</p>
              <p className="text-xs text-muted-foreground">
                Sube un audio claro de al menos 30 segundos para clonar la voz
              </p>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && newVoice.name) handleCloneVoice(file);
                }}
                className="w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:text-primary"
                disabled={!newVoice.name || isCloning}
              />
              {isCloning && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Clonando voz...
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-3 space-y-3">
              <p className="text-xs font-medium">Opcion 2: Usar ID de ElevenLabs</p>
              <p className="text-xs text-muted-foreground">
                Si ya tienes una voz en ElevenLabs, pega su Voice ID aqui
              </p>
              <Input
                placeholder="Voice ID (ej: LcfcDJNlP1WERjJ8eyKu)"
                value={newVoice.elevenlabsId}
                onChange={(e) => setNewVoice({ ...newVoice, elevenlabsId: e.target.value })}
                className="text-sm"
              />
              <Button
                onClick={handleAddManualVoice}
                disabled={!newVoice.name || !newVoice.elevenlabsId}
                className="w-full gap-2"
                size="sm"
              >
                <Plus className="h-3 w-3" />
                Anadir voz
              </Button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
