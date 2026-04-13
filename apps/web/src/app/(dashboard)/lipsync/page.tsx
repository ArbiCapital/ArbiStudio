"use client";

import { useState } from "react";
import { Mic, Play, Loader2, Download, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const VOICES = [
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

export default function LipsyncPage() {
  const [script, setScript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("isabella-es");
  const [selectedEmotion, setSelectedEmotion] = useState("neutral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex w-full flex-col border-r border-border p-4 md:w-96">
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
            <label className="mb-2 block text-sm font-medium">Voz</label>
            <div className="grid grid-cols-2 gap-2">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`rounded-lg border p-2 text-left text-xs transition-all ${
                    selectedVoice === voice.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium">{voice.name}</p>
                  <p className="text-muted-foreground">{voice.gender} · {voice.lang}</p>
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
            className="mt-auto gap-2"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
            {isGenerating ? "Generando..." : "Generar voiceover"}
          </Button>
        </div>

        {/* Right — Preview */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          {audioUrl ? (
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Volume2 className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Voiceover generado</h3>
                <div className="mt-2 flex justify-center gap-2">
                  <Badge variant="secondary">{VOICES.find((v) => v.id === selectedVoice)?.name}</Badge>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
