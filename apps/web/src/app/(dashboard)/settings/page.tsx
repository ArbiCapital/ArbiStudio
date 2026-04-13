"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Building2,
  Key,
  Palette,
  CreditCard,
  Bell,
  Shield,
  ExternalLink,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Configura tu cuenta, integraciones y preferencias
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-6">
          <Tabs defaultValue="account">
            <TabsList className="mb-6 grid w-full grid-cols-5">
              <TabsTrigger value="account" className="gap-1 text-xs">
                <User className="h-3.5 w-3.5" />
                Cuenta
              </TabsTrigger>
              <TabsTrigger value="org" className="gap-1 text-xs">
                <Building2 className="h-3.5 w-3.5" />
                Organizacion
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-1 text-xs">
                <Key className="h-3.5 w-3.5" />
                Integraciones
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-1 text-xs">
                <CreditCard className="h-3.5 w-3.5" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="brand" className="gap-1 text-xs">
                <Palette className="h-3.5 w-3.5" />
                Marca
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Section title="Perfil">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-muted-foreground">Email</label>
                    <Input placeholder="tu@email.com" disabled />
                  </div>
                </div>
                <Button className="mt-4">Guardar cambios</Button>
              </Section>

              <Section title="Seguridad">
                <Button variant="outline">Cambiar contrasena</Button>
              </Section>
            </TabsContent>

            <TabsContent value="org" className="space-y-6">
              <Section title="Organizacion">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm text-muted-foreground">Nombre</label>
                    <Input defaultValue="Arbi Capital" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-muted-foreground">Slug</label>
                    <Input defaultValue="arbi-capital" />
                  </div>
                </div>
              </Section>

              <Section title="Equipo">
                <p className="text-sm text-muted-foreground">Gestiona los miembros de tu organizacion</p>
                <Button variant="outline" className="mt-2">Invitar miembro</Button>
              </Section>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Section title="Plataformas de Ads">
                <IntegrationRow
                  name="Meta Ads"
                  description="Facebook + Instagram Ads"
                  connected={false}
                  instructions="Necesitas crear una Meta Developer App en developers.facebook.com"
                />
                <IntegrationRow
                  name="Google Ads"
                  description="Search, Display, YouTube"
                  connected={false}
                  instructions="Requiere Developer Token de Google Ads API"
                />
                <IntegrationRow
                  name="TikTok Ads"
                  description="In-Feed, TopView, Spark Ads"
                  connected={false}
                  instructions="Solicita acceso en TikTok Marketing API"
                />
              </Section>

              <Section title="Publicacion Organica">
                <IntegrationRow name="Instagram" description="Posts, Reels, Stories" connected={false} />
                <IntegrationRow name="TikTok" description="Videos" connected={false} />
                <IntegrationRow name="YouTube" description="Videos, Shorts" connected={false} />
                <IntegrationRow name="LinkedIn" description="Posts, Articulos" connected={false} />
              </Section>

              <Section title="API Keys de IA">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm">Anthropic API Key</label>
                    <Input type="password" placeholder="sk-ant-..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">fal.ai API Key</label>
                    <Input type="password" placeholder="fal-..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Google Gemini API Key</label>
                    <Input type="password" placeholder="AIza..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">ElevenLabs API Key</label>
                    <Input type="password" placeholder="..." />
                  </div>
                </div>
                <Button className="mt-4">Guardar API Keys</Button>
              </Section>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Section title="Plan actual">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2">Internal</Badge>
                      <h3 className="text-lg font-bold">Arbi Capital — Uso Interno</h3>
                      <p className="text-sm text-muted-foreground">Sin limites de generacion</p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Planes (cuando se comercialice)">
                <div className="grid grid-cols-3 gap-4">
                  <PlanCard name="Free" price="0€" features={["50 imagenes/mes", "5 videos/mes", "5GB storage"]} />
                  <PlanCard name="Pro" price="49€" features={["500 imagenes/mes", "50 videos/mes", "1 plataforma ads", "50GB"]} highlighted />
                  <PlanCard name="Agency" price="149€" features={["Ilimitado", "Todas las plataformas", "500GB", "5 miembros"]} />
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="brand" className="space-y-6">
              <Section title="Identidad de marca">
                <p className="text-sm text-muted-foreground">
                  Define tu marca para que ArbiStudio aplique automaticamente tu estilo en todas las generaciones
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm">Color primario</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#000000" className="h-9 w-12 cursor-pointer rounded border border-border" />
                      <Input defaultValue="#000000" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Color secundario</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#ffffff" className="h-9 w-12 cursor-pointer rounded border border-border" />
                      <Input defaultValue="#ffffff" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Color acento</label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#6366f1" className="h-9 w-12 cursor-pointer rounded border border-border" />
                      <Input defaultValue="#6366f1" className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-sm">Tono de voz</label>
                  <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option>Profesional</option>
                    <option>Casual</option>
                    <option>Aspiracional</option>
                    <option>Tecnico</option>
                    <option>Humoristico</option>
                  </select>
                </div>
                <div className="mt-4 rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <Palette className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Sube tu logo (PNG, SVG)</p>
                </div>
                <Button className="mt-4">Guardar identidad de marca</Button>
              </Section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function IntegrationRow({
  name,
  description,
  connected,
  instructions,
}: {
  name: string;
  description: string;
  connected: boolean;
  instructions?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        {instructions && !connected && (
          <p className="mt-1 text-xs text-yellow-400">{instructions}</p>
        )}
      </div>
      {connected ? (
        <Badge className="gap-1 bg-green-500/10 text-green-400">
          <Check className="h-3 w-3" />
          Conectado
        </Badge>
      ) : (
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Key className="h-3 w-3" />
          Conectar
        </Button>
      )}
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <h4 className="font-semibold">{name}</h4>
      <p className="mt-1 text-2xl font-bold">
        {price}
        <span className="text-sm font-normal text-muted-foreground">/mes</span>
      </p>
      <ul className="mt-3 space-y-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3 w-3 text-primary" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
