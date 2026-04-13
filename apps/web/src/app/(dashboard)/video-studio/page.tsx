"use client";

import { useState } from "react";
import {
  Film,
  Play,
  Upload,
  Camera,
  Palette,
  Type,
  Music,
  Mic,
  Scissors,
  Sparkles,
  SlidersHorizontal,
  Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CAMERA_PRESETS,
  LENS_PRESETS,
  COLOR_GRADING_PRESETS,
} from "@/lib/cinema/presets";

export default function VideoStudioPage() {
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState("50mm-portrait");
  const [selectedGrading, setSelectedGrading] = useState("none");
  const [selectedModel, setSelectedModel] = useState("kling");
  const [selectedDuration, setSelectedDuration] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const VIDEO_MODELS = [
    { id: "kling", name: "Kling 2.1", desc: "El mas realista — ideal para anuncios", cost: "~$1.40/10s", maxDuration: 10 },
    { id: "kling-v3", name: "Kling 3.0", desc: "Ultima version — hasta 15s, audio nativo", cost: "~$2.10/15s", maxDuration: 15 },
    { id: "runway", name: "Runway Gen-3", desc: "Cinematografico, text-to-video", cost: "~$0.50/5s", maxDuration: 10 },
    { id: "minimax", name: "Minimax", desc: "Rapido y economico", cost: "~$0.10/5s", maxDuration: 6 },
    { id: "wan", name: "Wan 2.1", desc: "Economico, calidad basica", cost: "~$0.08/5s", maxDuration: 5 },
  ];

  const currentModel = VIDEO_MODELS.find((m) => m.id === selectedModel);
  const DURATIONS = [
    { value: "5", label: "5s" },
    { value: "10", label: "10s" },
    { value: "15", label: "15s" },
  ].filter((d) => parseInt(d.value) <= (currentModel?.maxDuration || 10));

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setVideoError(null);

    let enhancedPrompt = prompt;
    const camera = CAMERA_PRESETS.find((p) => p.id === selectedCamera);
    const lens = LENS_PRESETS.find((l) => l.id === selectedLens);

    if (camera) enhancedPrompt += `, ${camera.promptModifier}`;
    if (lens) enhancedPrompt += `, ${lens.promptModifier}`;

    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model: selectedModel,
          aspectRatio: "16:9",
          duration: selectedDuration,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedVideo(data.video.url);
      } else {
        setVideoError(data.error || "Error generando video");
      }
    } catch (err) {
      setVideoError("Error de conexion");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Video Studio</h1>
            <p className="text-sm text-muted-foreground">
              Genera, edita y produce video profesional con IA
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Subir video
            </Button>
            <Button className="gap-2">
              <Clapperboard className="h-4 w-4" />
              Storyboard
            </Button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex flex-1 items-center justify-center bg-black/50 p-8">
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-muted/20"
            style={{
              filter:
                COLOR_GRADING_PRESETS.find((p) => p.id === selectedGrading)
                  ?.cssFilter || "none",
            }}
          >
            {generatedVideo ? (
              <video
                src={generatedVideo}
                controls
                autoPlay
                loop
                className="h-full w-full object-contain"
              />
            ) : isGenerating ? (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Sparkles className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-sm text-muted-foreground">
                  Generando video... Esto puede tardar 30-60 segundos
                </p>
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                  <div className="h-full animate-pulse rounded-full bg-primary" style={{ width: "60%" }} />
                </div>
              </div>
            ) : videoError ? (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <p className="text-sm text-destructive">{videoError}</p>
                <Button variant="outline" size="sm" onClick={() => setVideoError(null)}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Film className="h-16 w-16 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  Escribe un prompt y genera tu video
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">16:9</Badge>
                  <Badge variant="outline">1920x1080</Badge>
                  <Badge variant="outline">30fps</Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompt area */}
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            {/* Model selector */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Modelo:</span>
              {VIDEO_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`rounded-full px-3 py-1 text-xs transition-all ${
                    selectedModel === m.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  title={`${m.desc} (${m.cost})`}
                >
                  {m.name}
                </button>
              ))}
              <span className="ml-2 text-xs text-muted-foreground">|</span>
              <span className="text-xs font-medium text-muted-foreground">Duracion:</span>
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDuration(d.value)}
                  className={`rounded-full px-3 py-1 text-xs transition-all ${
                    selectedDuration === d.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground">
                {currentModel?.desc} ({currentModel?.cost})
              </span>
            </div>

            <Textarea
              placeholder="Describe el video que quieres generar... (ej: 'Un reloj de lujo girando lentamente sobre marmol negro, luz cinematografica')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="mb-3"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {selectedCamera && (
                  <Badge variant="secondary" className="gap-1">
                    <Camera className="h-3 w-3" />
                    {CAMERA_PRESETS.find((p) => p.id === selectedCamera)?.name}
                  </Badge>
                )}
                <Badge variant="secondary" className="gap-1">
                  <SlidersHorizontal className="h-3 w-3" />
                  {LENS_PRESETS.find((l) => l.id === selectedLens)?.name}
                </Badge>
                {selectedGrading !== "none" && (
                  <Badge variant="secondary" className="gap-1">
                    <Palette className="h-3 w-3" />
                    {COLOR_GRADING_PRESETS.find((p) => p.id === selectedGrading)?.name}
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isGenerating ? "Generando..." : "Generar video"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Cinema Studio controls */}
      <div className="hidden w-80 border-l border-border bg-muted/20 lg:block">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full flex-col"
        >
          <TabsList className="mx-3 mt-3 grid grid-cols-4">
            <TabsTrigger value="generate" className="text-xs">
              <Camera className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger value="color" className="text-xs">
              <Palette className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger value="text" className="text-xs">
              <Type className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-xs">
              <Music className="h-3.5 w-3.5" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-3">
            {/* Camera presets */}
            <TabsContent value="generate" className="m-0 space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Movimiento de camara
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {CAMERA_PRESETS.filter((p) => p.category === "movement").map(
                    (preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          setSelectedCamera(
                            selectedCamera === preset.id ? null : preset.id
                          )
                        }
                        className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition-all ${
                          selectedCamera === preset.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        {preset.name}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Efectos cinematograficos
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {CAMERA_PRESETS.filter((p) => p.category === "effect").map(
                    (preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          setSelectedCamera(
                            selectedCamera === preset.id ? null : preset.id
                          )
                        }
                        className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition-all ${
                          selectedCamera === preset.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        {preset.name}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Lente
                </h3>
                <div className="space-y-1">
                  {LENS_PRESETS.map((lens) => (
                    <button
                      key={lens.id}
                      onClick={() => setSelectedLens(lens.id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                        selectedLens === lens.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="font-medium">{lens.name}</span>
                      <span className="text-muted-foreground">
                        {lens.aperture}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Color grading */}
            <TabsContent value="color" className="m-0 space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  LUT Presets
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_GRADING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedGrading(preset.id)}
                      className={`overflow-hidden rounded-lg border transition-all ${
                        selectedGrading === preset.id
                          ? "border-primary ring-1 ring-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div
                        className="aspect-video bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-orange-500/30"
                        style={{ filter: preset.cssFilter }}
                      />
                      <p className="p-1.5 text-center text-[10px] font-medium">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Text / Captions */}
            <TabsContent value="text" className="m-0 space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Subtitulos automaticos
                </h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Sube un video con audio y se transcribira automaticamente con Whisper
                </p>
                <div className="space-y-2">
                  {["TikTok Bold", "Minimal", "Outline", "Gradient", "Karaoke"].map(
                    (style) => (
                      <button
                        key={style}
                        className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left text-xs hover:border-primary/30"
                      >
                        <Type className="h-4 w-4 text-muted-foreground" />
                        {style}
                      </button>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Texto animado
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Fade Up", "Scale", "Typewriter", "Slide Left", "Blur In", "Bounce"].map(
                    (anim) => (
                      <button
                        key={anim}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] hover:border-primary/30"
                      >
                        {anim}
                      </button>
                    )
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Audio */}
            <TabsContent value="audio" className="m-0 space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Voiceover
                </h3>
                <Textarea
                  placeholder="Escribe el guion para el voiceover..."
                  rows={3}
                  className="text-xs"
                />
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                    <Mic className="h-3 w-3" />
                    ElevenLabs
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Musica de fondo
                </h3>
                <div className="space-y-1.5">
                  {["Lo-fi Chill", "Cinematic Epic", "Upbeat Pop", "Ambient Dark", "Corporate Clean"].map(
                    (music) => (
                      <button
                        key={music}
                        className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left text-xs hover:border-primary/30"
                      >
                        <Music className="h-4 w-4 text-muted-foreground" />
                        {music}
                      </button>
                    )
                  )}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
