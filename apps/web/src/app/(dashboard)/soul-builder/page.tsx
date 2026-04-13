"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  User,
  Upload,
  Sparkles,
  Trash2,
  Loader2,
  Check,
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

export default function SoulBuilderPage() {
  const [characters, setCharacters] = useState<SoulCharacter[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newChar, setNewChar] = useState({
    name: "", description: "", gender: "Femenino", age: 28, style: "Professional",
  });

  useEffect(() => { setCharacters(loadCharacters()); }, []);

  const handleCreate = async () => {
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
        };
        const updated = [...characters, character];
        setCharacters(updated);
        saveCharacters(updated);
        setIsCreating(false);
        setNewChar({ name: "", description: "", gender: "Femenino", age: 28, style: "Professional" });
      } else {
        setError(data.error || "Error generando personaje");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Soul Builder</h1>
          <p className="text-sm text-muted-foreground">
            {characters.length} personaje{characters.length !== 1 ? "s" : ""} — Usa @nombre en el chat para incluirlos
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <Button className="gap-2" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" />
            Nuevo personaje
          </Button>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear personaje con IA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre (ej: Sofia, Marco)"
                value={newChar.name}
                onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
              />
              <Textarea
                placeholder="Descripcion detallada: apariencia fisica, pelo, ojos, ropa, expresion..."
                value={newChar.description}
                onChange={(e) => setNewChar({ ...newChar, description: e.target.value })}
                rows={3}
              />
              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Estilo</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={newChar.style}
                    onChange={(e) => setNewChar({ ...newChar, style: e.target.value })}
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Streetwear</option>
                    <option>Luxury</option>
                    <option>Sporty</option>
                    <option>Creative</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={handleCreate}
                className="w-full gap-2"
                disabled={!newChar.name || !newChar.description || isGenerating}
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generando 4 variantes con IA...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generar personaje</>
                )}
              </Button>
              {isGenerating && (
                <p className="text-center text-xs text-muted-foreground">
                  Esto puede tardar 30-60 segundos (4 imagenes con Flux Pro)
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
                    <p className="text-xs text-muted-foreground">{char.gender}, {char.age} anos · {char.style}</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">Listo</Badge>
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
              <p className="mb-4 text-sm text-muted-foreground">
                Crea tu primer personaje y ArbiStudio generara 4 variantes para elegir
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
