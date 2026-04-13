"use client";

import { useState } from "react";
import {
  Plus,
  User,
  Upload,
  Sparkles,
  Trash2,
  Pencil,
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface SoulCharacter {
  id: string;
  name: string;
  description: string;
  gender: string;
  age: number;
  style: string;
  referenceImages: string[];
  status: "draft" | "training" | "ready";
}

// Demo data
const DEMO_CHARACTERS: SoulCharacter[] = [
  {
    id: "1",
    name: "Sofia",
    description: "Mujer profesional, pelo castano ondulado, estilo moderno y elegante",
    gender: "Femenino",
    age: 28,
    style: "Professional Modern",
    referenceImages: [],
    status: "ready",
  },
  {
    id: "2",
    name: "Marco",
    description: "Hombre atletico, barba recortada, estilo casual premium",
    gender: "Masculino",
    age: 35,
    style: "Casual Luxury",
    referenceImages: [],
    status: "ready",
  },
];

export default function SoulBuilderPage() {
  const [characters, setCharacters] = useState<SoulCharacter[]>(DEMO_CHARACTERS);
  const [isCreating, setIsCreating] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    gender: "Femenino",
    age: 28,
    style: "Professional",
  });

  const handleCreate = () => {
    const character: SoulCharacter = {
      id: Date.now().toString(),
      name: newCharacter.name,
      description: newCharacter.description,
      gender: newCharacter.gender,
      age: newCharacter.age,
      style: newCharacter.style,
      referenceImages: [],
      status: "draft",
    };
    setCharacters([...characters, character]);
    setIsCreating(false);
    setNewCharacter({ name: "", description: "", gender: "Femenino", age: 28, style: "Professional" });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Soul Builder</h1>
          <p className="text-sm text-muted-foreground">
            Crea personajes consistentes que mantienen su identidad en todas las generaciones
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <Button className="gap-2" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" />
            Nuevo personaje
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear personaje</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre (ej: Sofia, Marco)"
                value={newCharacter.name}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Descripcion detallada del personaje (apariencia, estilo, personalidad)"
                value={newCharacter.description}
                onChange={(e) =>
                  setNewCharacter({ ...newCharacter, description: e.target.value })
                }
                rows={3}
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Genero</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={newCharacter.gender}
                    onChange={(e) =>
                      setNewCharacter({ ...newCharacter, gender: e.target.value })
                    }
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
                    value={newCharacter.age}
                    onChange={(e) =>
                      setNewCharacter({ ...newCharacter, age: parseInt(e.target.value) || 28 })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Estilo</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={newCharacter.style}
                    onChange={(e) =>
                      setNewCharacter({ ...newCharacter, style: e.target.value })
                    }
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
              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Sube 3-10 fotos de referencia (opcional)
                </p>
                <p className="text-xs text-muted-foreground">
                  Mejor calidad = mejor consistencia
                </p>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={!newCharacter.name}>
                <Sparkles className="mr-2 h-4 w-4" />
                Crear personaje
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Characters grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <div
              key={character.id}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">@{character.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {character.gender}, {character.age} anos
                    </p>
                  </div>
                </div>
                <Badge
                  variant={character.status === "ready" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {character.status === "ready"
                    ? "Listo"
                    : character.status === "training"
                      ? "Entrenando..."
                      : "Borrador"}
                </Badge>
              </div>

              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {character.description}
              </p>

              <div className="mb-3 flex gap-1">
                <Badge variant="outline" className="text-[10px]">
                  {character.style}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {character.referenceImages.length} refs
                </Badge>
              </div>

              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                  <Pencil className="h-3 w-3" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="flex h-[50vh] items-center justify-center text-center">
            <div>
              <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">Sin personajes</h3>
              <p className="text-sm text-muted-foreground">
                Crea tu primer personaje para mantener consistencia visual en tus generaciones
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
