"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  User,
  Upload,
  Sparkles,
  Trash2,
  Loader2,
  Check,
  Image as ImageIcon,
  Type,
  X,
} from "lucide-react";
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

interface SoulCharacter {
  id: string;
  name: string;
  description: string;
  gender: string;
  age: number;
  style: string;
  variants: { url: string; width: number; height: number }[];
  selectedVariant: number;
  status: "generating" | "ready";
  fromPhoto?: boolean;
}

const STORAGE_KEY = "arbistudio-characters";

function loadCharacters(): SoulCharacter[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveCharacters(chars: SoulCharacter[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

type CreationMode = "photo" | "text";

export default function SoulBuilderPage() {
  const [characters, setCharacters] = useState<SoulCharacter[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<CreationMode>("photo");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newChar, setNewChar] = useState({
    name: "", description: "", gender: "Femenino", age: 28, style: "Professional",
  });

  useEffect(() => { setCharacters(loadCharacters()); }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imagenes (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen no puede superar 10MB");
      return;
    }
    setPhotoFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateFromPhoto = async () => {
    if (!photoFile || !newChar.name) return;
    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", photoFile);
      formData.append("name", newChar.name);
      formData.append("style", newChar.style);
      formData.append("numVariants", "4");

      const res = await fetch("/api/soul", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        const character: SoulCharacter = {
          id: Date.now().toString(),
          name: newChar.name,
          description: "Generado desde foto de referencia",
          gender: newChar.gender,
          age: newChar.age,
          style: newChar.style,
          variants: data.character.variants,
          selectedVariant: 0,
          status: "ready",
          fromPhoto: true,
        };
        const updated = [...characters, character];
        setCharacters(updated);
        saveCharacters(updated);
        resetForm();
      } else {
        setError(data.error || "Error generando personaje desde foto");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateFromText = async () => {
    if (!newChar.name || !newChar.description) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/soul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChar),
      });
      const data = await res.json();

      if (data.success) {
        const character: SoulCharacter = {
          id: Date.now().toString(),
          name: newChar.name,
          description: newChar.description,
          gender: newChar.gender,
          age: newChar.age,
          style: newChar.style,
          variants: data.character.variants,
          selectedVariant: 0,
          status: "ready",
          fromPhoto: false,
        };
        const updated = [...characters, character];
        setCharacters(updated);
        saveCharacters(updated);
        resetForm();
      } else {
        setError(data.error || "Error generando personaje");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setNewChar({ name: "", description: "", gender: "Femenino", age: 28, style: "Professional" });
    clearPhoto();
    setError(null);
  };

  const handleDelete = (id: string) => {
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
    saveCharacters(updated);
  };

  const handleSelectVariant = (charId: string, variantIdx: number) => {
    const updated = characters.map((c) =>
      c.id === charId ? { ...c, selectedVariant: variantIdx } : c
    );
    setCharacters(updated);
    saveCharacters(updated);
  };

  const canSubmit = mode === "photo"
    ? !!newChar.name && !!photoFile
    : !!newChar.name && !!newChar.description;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Soul Builder</h1>
          <p className="text-sm text-muted-foreground">
            {characters.length} personaje{characters.length !== 1 ? "s" : ""} — Usa @nombre en el chat para incluirlos
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={(open) => { if (!open) resetForm(); else setIsCreating(true); }}>
          <Button className="gap-2" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" />
            Nuevo personaje
          </Button>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear personaje con IA</DialogTitle>
            </DialogHeader>

            {/* Mode selector */}
            <div className="flex gap-2 rounded-lg border border-border p-1 bg-muted/30">
              <button
                onClick={() => setMode("photo")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  mode === "photo"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Desde foto
              </button>
              <button
                onClick={() => setMode("text")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  mode === "text"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Type className="h-4 w-4" />
                Desde texto
              </button>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Nombre (ej: Sofia, Marco)"
                value={newChar.name}
                onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
              />

              {mode === "photo" ? (
                /* Photo upload area */
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-48 w-full rounded-lg border border-border object-cover"
                      />
                      <button
                        onClick={clearPhoto}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                        La IA generara 4 variantes profesionales manteniendo la identidad facial
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/40"
                    >
                      <div className="rounded-full bg-primary/10 p-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Sube una foto del personaje</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG o WebP — max 10MB</p>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                /* Text description */
                <>
                  <Textarea
                    placeholder="Descripcion detallada: apariencia fisica, pelo, ojos, ropa, expresion..."
                    value={newChar.description}
                    onChange={(e) => setNewChar({ ...newChar, description: e.target.value })}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Genero</label>
                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        value={newChar.gender}
                        onChange={(e) => setNewChar({ ...newChar, gender: e.target.value })}
                      >
                        <option>Femenino</option>
                        <option>Masculino</option>
                        <option>No binario</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Edad</label>
                      <Input
                        type="number"
                        value={newChar.age}
                        onChange={(e) => setNewChar({ ...newChar, age: parseInt(e.target.value) || 28 })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Style selector — shared between modes */}
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Estilo visual</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Professional", "Casual", "Streetwear", "Luxury", "Sporty", "Creative"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewChar({ ...newChar, style: s })}
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        newChar.style === s
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={mode === "photo" ? handleCreateFromPhoto : handleCreateFromText}
                className="w-full gap-2"
                disabled={!canSubmit || isGenerating}
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generando 4 variantes con IA...</>
                ) : mode === "photo" ? (
                  <><Upload className="h-4 w-4" /> Generar desde foto</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generar desde texto</>
                )}
              </Button>
              {isGenerating && (
                <p className="text-center text-xs text-muted-foreground">
                  {mode === "photo"
                    ? "Flux Kontext esta analizando la foto y generando variantes (30-90s)"
                    : "Esto puede tardar 30-60 segundos (4 imagenes con Flux Pro)"}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((char) => (
            <div key={char.id} className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
              {/* Selected variant image */}
              {char.variants.length > 0 && (
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={char.variants[char.selectedVariant]?.url}
                    alt={char.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Variant selector */}
              {char.variants.length > 1 && (
                <div className="flex gap-1 p-2 bg-muted/30">
                  {char.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectVariant(char.id, i)}
                      className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${
                        i === char.selectedVariant ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={v.url} alt="" className="h-full w-full object-cover" />
                      {i === char.selectedVariant && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">@{char.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {char.fromPhoto ? "Desde foto" : `${char.gender}, ${char.age} anos`} · {char.style}
                    </p>
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    {char.fromPhoto ? "Foto" : "IA"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{char.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs text-destructive"
                    onClick={() => handleDelete(char.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="flex h-[50vh] items-center justify-center text-center">
            <div>
              <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">Sin personajes</h3>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Sube una foto real o describe un personaje ficticio. La IA generara 4 variantes profesionales para usar en videos y contenido.
              </p>
              <Button onClick={() => setIsCreating(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear personaje
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
