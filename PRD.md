# ArbiStudio — AI Content Creation Platform

## Product Requirements Document v1.1

**Arbi Capital — Producto Interno (Standalone)**
**Version 1.1 · Abril 2026**
**Confidencial**
**Benchmark de calidad: Higgsfield AI (valoracion $1.3B, 4M videos/dia)**

---

## Tabla de Contenidos

1. Resumen Ejecutivo
2. Vision y Posicionamiento
3. Usuarios y Personas
4. Arquitectura Tecnica
5. Modulos del Producto
6. Modulo 1: Generacion de Imagen IA
7. Modulo 2: Edicion y Produccion de Video IA
8. Modulo 3: Cinema Studio — Controles Cinematograficos *(NUEVO v1.1)*
9. Modulo 4: Soul System — Personajes Consistentes e Identidad Visual *(NUEVO v1.1)*
10. Modulo 5: Click-to-Ad — Generacion Automatica de Anuncios *(NUEVO v1.1)*
11. Modulo 6: Lipsync Studio — Talking Heads con Sincronizacion Labial *(NUEVO v1.1)*
12. Modulo 7: Conexion con Plataformas de Ads
13. Modulo 8: Analisis de Competencia y Scraping
14. Modulo 9: Estrategia de Contenido IA
15. Experiencia de Usuario — Interfaz Conversacional + Studio
16. Sistema de Formatos y Canvas Multi-Plataforma
17. AI Copilot — Asistente Creativo Inteligente *(NUEVO v1.1)*
18. Storyboard & Keyframes IA *(NUEVO v1.1)*
19. Asset Management y Libreria de Medios
20. Integraciones API Completas
21. Meta Developer App — Setup y Arquitectura
22. Infraestructura y Deploy
23. Seguridad y Privacidad
24. Monetizacion (Whop)
25. Recursos Existentes Reutilizados
26. Roadmap de Desarrollo
27. Metricas de Exito
28. Gestion de Riesgos
29. Apendice: Benchmark vs Higgsfield *(NUEVO v1.1)*

---

## 1. Resumen Ejecutivo

**ArbiStudio** es una plataforma de creacion de contenido impulsada por inteligencia artificial generativa de ultima generacion. Combina generacion de imagenes fotorrealistas, edicion y produccion de video profesional, y publicacion directa en plataformas de publicidad — todo desde una interfaz conversacional tipo chat.

### 1.1 Que es ArbiStudio

Un software 360 de content creation que permite:

- **Generar imagenes** en calidad fotografica/realista mediante prompts, con control total de formato, estilo y composicion
- **Editar y producir video** profesional: subtitulos, motion graphics, transiciones, cortes automaticos, multi-formato
- **Publicar directamente** en Meta Ads, Google Ads, TikTok Ads y plataformas organicas (IG, TikTok, YouTube, LinkedIn, X)
- **Analizar competencia** scrapeando anuncios, reels, landings y estrategias de contenido de cualquier marca
- **Disenar estrategias de contenido** basadas en datos, tendencias y analisis de competencia

### 1.2 Experiencia de usuario

La interaccion principal es un **chat conversacional** (tipo ChatGPT / Gemini / NanoBanana). El usuario:

1. Escribe un prompt o sube un asset (imagen, video bruto, URL)
2. ArbiStudio procesa, genera y muestra una **previsualizacion en tiempo real**
3. El usuario itera con instrucciones adicionales ("mas oscuro", "cambia el copy", "hazlo vertical")
4. Cuando esta satisfecho, exporta o publica directamente

No hay curva de aprendizaje. No hay menus complejos. Todo es lenguaje natural + previews interactivos.

### 1.3 Diferenciacion

| Competidor | Que hace | Gap que ArbiStudio cubre |
|---|---|---|
| **Higgsfield** ($1.3B) | Video/imagen cinematografico, 15+ modelos, Cinema Studio, Soul Cast | **Sin workflow de ads, sin scraping, sin estrategia, sin publicacion directa. Solo creacion, no marketing.** |
| NanoBanana | Generacion de imagenes con Gemini | Solo imagen, sin video, sin ads, sin estrategia |
| Canva AI | Diseno con asistencia IA | Generalista, no especializado en performance marketing |
| Runway ML | Generacion de video IA con VFX | Solo API/editor, sin workflow de marketing |
| AdCreative.ai | Generacion de ads | Solo estaticos, sin video, sin scraping |
| Jasper AI | Copywriting IA | Solo texto, sin visual, sin publicacion |
| **ArbiStudio** | **Higgsfield-level quality + Marketing 360** | **Calidad cinematografica + Ads + Scraping + Estrategia + Publicacion en un solo producto** |

### 1.4 Benchmark: ArbiStudio vs Higgsfield

ArbiStudio toma la calidad cinematografica de Higgsfield y la combina con el workflow completo de marketing que Higgsfield NO tiene:

| Capacidad | Higgsfield | ArbiStudio |
|---|---|---|
| Generacion de imagen top-tier | ✅ Soul 2.0 | ✅ Flux Pro + Gemini 4K + Ideogram |
| Video cinematografico | ✅ DOP + 15 modelos | ✅ Kling 3.0 + Runway + Pika via fal.ai |
| Controles de camara | ✅ 70+ presets, simulacion optica | ✅ Cinema Studio (inspirado, via Remotion) |
| Personajes consistentes | ✅ Soul Cast + Soul ID | ✅ Soul System (IP-Adapter + LoRA) |
| Click-to-Ad (URL → anuncio) | ✅ Basico | ✅ **Avanzado** — scraping + analisis + multi-formato + publicacion |
| Lipsync / talking head | ✅ Lipsync Studio | ✅ Lipsync Studio (ElevenLabs + SadTalker/Wav2Lip) |
| Publicacion directa en ads | ❌ No tiene | ✅ Meta + Google + TikTok Ads |
| Publicacion organica | ❌ No tiene | ✅ IG, TikTok, YouTube, LinkedIn, X |
| Scraping de competencia | ❌ No tiene | ✅ Ad Library + social + landings |
| Estrategia de contenido | ❌ No tiene | ✅ Calendario editorial IA |
| Multi-tenant (agencia) | ❌ Solo individual | ✅ Multi-proyecto, multi-equipo |
| Billing flexible | ❌ Creditos caros | ✅ Whop (suscripcion plana) |
| Chat-first UX | ❌ Studio complejo | ✅ Chat + Studio hibrido |

### 1.4 Para quien

ArbiStudio se construye primero para **Arbi Capital** (uso interno). La arquitectura es multi-tenant desde el dia 1 para futura comercializacion.

---

## 2. Vision y Posicionamiento

### 2.1 Vision

"El creador de contenido mas potente del mercado. Un chat que entiende marketing, genera assets visuales de clase mundial, y los publica por ti."

### 2.2 Principios de producto

1. **Chat-first**: Todo se hace desde el chat. Cero menus innecesarios.
2. **Preview-everything**: Nada se publica sin que el usuario lo haya visto y aprobado.
3. **Calidad > Cantidad**: Cada output debe ser indistinguible de trabajo profesional humano.
4. **Velocidad radical**: De idea a asset publicado en < 2 minutos.
5. **Data-driven**: Toda decision creativa esta respaldada por datos de rendimiento y competencia.
6. **Multi-formato nativo**: Un asset se adapta automaticamente a todos los formatos de todas las plataformas.

### 2.3 Posicionamiento de mercado

**Categoria**: AI Content Creation Suite for Performance Marketing
**Target primario**: Agencias de marketing digital, equipos de growth, freelancers de ads
**Target secundario**: Marcas D2C, ecommerce, SaaS que gestionan su propio marketing
**Mercado geografico**: Espana primero, expansion LATAM y US despues

---

## 3. Usuarios y Personas

### 3.1 Persona 1 — El CEO de Agencia (Oscar)

- **Perfil**: Fundador de agencia de marketing. Gestiona 5-20 clientes. Equipo pequeno (3-8 personas).
- **Pain**: Producir contenido de calidad a la velocidad que los clientes exigen es imposible sin escalar equipo.
- **Necesita**: Generar 50+ piezas de contenido al dia (estatico + video) sin contratar a nadie mas.
- **UX esperada**: Escribir "Crea 5 variantes de anuncio para [cliente] en formato stories" y tenerlo en 90 segundos.

### 3.2 Persona 2 — El Media Buyer

- **Perfil**: Gestor de campanas paid. Maneja Meta Ads + Google Ads + TikTok Ads.
- **Pain**: Crear creatividades es cuello de botella. Depende de disenadores que tardan dias.
- **Necesita**: Generar creatividades A/B testing en todos los formatos, publicarlas directo a la plataforma.
- **UX esperada**: "Analiza los mejores anuncios de [competidor], genera 10 variantes similares para mi marca, sube las 3 mejores a mi campana de Meta".

### 3.3 Persona 3 — El Content Creator

- **Perfil**: Gestor de redes sociales. Publica contenido organico diariamente.
- **Pain**: Necesita contenido visual constante y no domina herramientas de diseno/video.
- **Necesita**: Producir reels, carruseles, stories con acabado profesional desde texto.
- **UX esperada**: "Sube este video de 3 minutos, cortalo en 5 clips para reels, anade subtitulos y musica".

### 3.4 Roles del sistema

| Rol | Acceso | Descripcion |
|---|---|---|
| Admin | Total | Configura la cuenta, gestiona miembros del equipo, billing |
| Creator | Completo | Crea contenido, publica, conecta cuentas de ads |
| Collaborator | Limitado | Crea contenido, no puede publicar ni conectar cuentas |
| Viewer | Solo lectura | Ve el contenido generado y los dashboards |

---

## 4. Arquitectura Tecnica

### 4.1 Stack tecnologico

| Capa | Tecnologia | Justificacion |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | Server Components, streaming, edge rendering, App Router maduro |
| **Lenguaje** | TypeScript 5.x strict | Type safety completo |
| **UI Components** | shadcn/ui + Radix UI | Accesibles, composables, altamente personalizables |
| **Estilos** | Tailwind CSS v4 | Utility-first, design tokens, dark mode nativo |
| **Animaciones** | Framer Motion 11 + Magic UI | Physics-based + componentes animados premium |
| **Chat/AI** | Vercel AI SDK 4.x | Streaming, tool calling, multi-provider, structured output |
| **State** | Zustand 5 | Ligero, sin boilerplate, perfecto para estado de chat + canvas |
| **Base de datos** | Supabase (Postgres + Auth + Storage + Realtime) | All-in-one, row-level security, storage para assets, realtime para colaboracion |
| **Imagen IA** | fal.ai (multi-modelo) | Flux Pro 1.1, SDXL, Ideogram v3, Recraft v3 — routing inteligente |
| **Imagen IA (alt)** | Google Gemini (Nano Banana) | Gemini 3.1 Flash Image — 4K, grounding, text rendering |
| **Imagen IA (alt)** | Replicate | Acceso a SDXL fine-tuned, ControlNet, IP-Adapter |
| **Video IA gen** | fal.ai | Kling 1.6, Runway Gen-3, Pika 2.0, Wan 2.1 |
| **Video render** | Remotion 5 | Composicion programatica de video en React. Render server-side |
| **Video editing** | FFmpeg (WASM) | Procesamiento de video en browser (corte, merge, transcode) |
| **Subtitulos** | Whisper API (OpenAI) + Deepgram | Transcripcion word-level, multi-idioma |
| **Voz/Audio** | ElevenLabs | Voiceover, clonacion de voz, multilingual |
| **Musica IA** | Suno v4 / Udio | Generacion de musica y jingles para contenido |
| **Scraping** | Firecrawl + Apify + Cheerio | Deep scraping de webs, ads, social media |
| **Meta Ads** | Meta Marketing API v21 | Creacion y gestion de campanas FB + IG |
| **Google Ads** | Google Ads API v17 | Search, Display, YouTube, Shopping |
| **TikTok Ads** | TikTok Marketing API v1.3 | In-Feed, TopView, Spark Ads |
| **Pagos** | Whop | Suscripciones, billing, checkout |
| **Deploy** | Vercel | Edge runtime, preview deployments, analytics |
| **Monorepo** | Turborepo | Shared packages entre web, api, video-worker |
| **Queue** | BullMQ (Redis via Upstash) | Cola de trabajos para render de video y generacion de imagenes |
| **Realtime** | Supabase Realtime + SSE | Progreso de generacion en vivo, colaboracion |

### 4.2 Arquitectura de alto nivel

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Chat UI  │  │ Canvas   │  │ Preview  │         │
│  │ (Vercel  │  │ Multi-   │  │ Panel    │         │
│  │  AI SDK) │  │ Format   │  │ (Live)   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │              │              │               │
│  ┌────┴──────────────┴──────────────┴─────┐        │
│  │         State Manager (Zustand)         │        │
│  └────────────────────┬────────────────────┘        │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│                  NEXT.JS API LAYER                    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Chat     │  │ Assets   │  │ Publish  │          │
│  │ Routes   │  │ Routes   │  │ Routes   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
└───────┼──────────────┼──────────────┼────────────────┘
        │              │              │
┌───────┼──────────────┼──────────────┼────────────────┐
│       │        AI ORCHESTRATOR      │                │
│  ┌────┴────┐  ┌─────┴─────┐  ┌─────┴─────┐         │
│  │ Image   │  │ Video     │  │ Ads       │         │
│  │ Pipeline│  │ Pipeline  │  │ Publisher │         │
│  └────┬────┘  └─────┬─────┘  └─────┬─────┘         │
│       │              │              │                │
│  ┌────┴────┐  ┌─────┴─────┐  ┌─────┴─────┐         │
│  │ fal.ai  │  │ Remotion  │  │ Meta API  │         │
│  │ Gemini  │  │ FFmpeg    │  │ Google API│         │
│  │Replicate│  │ Whisper   │  │ TikTok API│         │
│  └─────────┘  └───────────┘  └───────────┘         │
└──────────────────────────────────────────────────────┘
        │              │              │
┌───────┴──────────────┴──────────────┴────────────────┐
│                    SUPABASE                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Postgres │  │ Storage  │  │ Realtime │          │
│  │ (datos)  │  │ (assets) │  │ (progreso│          │
│  └──────────┘  └──────────┘  └──────────┘          │
└──────────────────────────────────────────────────────┘
```

### 4.3 Modelo de datos principal

```sql
-- Organizaciones (multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan TEXT DEFAULT 'free', -- free, pro, agency
  whop_customer_id TEXT,
  meta_app_id TEXT, -- Meta Developer App ID
  meta_access_token TEXT, -- encrypted
  google_ads_customer_id TEXT,
  tiktok_advertiser_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Miembros del equipo
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'creator', -- admin, creator, collaborator, viewer
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proyectos (agrupan contenido por cliente/campana)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  brand_guidelines JSONB, -- colores, tipografia, tono, assets de marca
  target_audience TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversaciones de chat
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensajes del chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role TEXT NOT NULL, -- user, assistant, system, tool
  content TEXT,
  metadata JSONB, -- tool calls, generated assets, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets generados (imagenes, videos, audios)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id),
  conversation_id UUID REFERENCES conversations(id),
  type TEXT NOT NULL, -- image, video, audio, document
  status TEXT DEFAULT 'generating', -- generating, ready, published, failed
  file_url TEXT, -- Supabase Storage URL
  thumbnail_url TEXT,
  metadata JSONB, -- dimensions, duration, format, model_used, prompt, etc.
  formats JSONB, -- {  "1:1": "url", "4:5": "url", "16:9": "url", "9:16": "url" }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campanas de ads
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id),
  platform TEXT NOT NULL, -- meta, google, tiktok
  platform_campaign_id TEXT, -- ID en la plataforma
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, active, paused, completed
  objective TEXT, -- awareness, traffic, conversions, leads
  budget_daily DECIMAL,
  budget_total DECIMAL,
  targeting JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creatividades de ads (vinculan asset con campana)
CREATE TABLE ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  asset_id UUID REFERENCES assets(id),
  headline TEXT,
  primary_text TEXT,
  description TEXT,
  cta TEXT,
  platform_creative_id TEXT,
  performance JSONB, -- impressions, clicks, ctr, cpc, conversions, roas
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analisis de competencia
CREATE TABLE competitor_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  competitor_name TEXT NOT NULL,
  competitor_url TEXT,
  platform TEXT, -- meta, google, tiktok, instagram, web
  scraped_data JSONB, -- ads, posts, creatives, landing pages
  insights JSONB, -- AI-generated analysis
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estrategias de contenido
CREATE TABLE content_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  period TEXT, -- weekly, monthly, quarterly
  strategy JSONB, -- calendar, themes, formats, platforms
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publicaciones programadas
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  asset_id UUID REFERENCES assets(id),
  platform TEXT NOT NULL,
  platform_account_id TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled', -- scheduled, published, failed, cancelled
  caption TEXT,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 Estructura del monorepo

```
arbistudio/
├── apps/
│   ├── web/                    # Next.js 15 App (frontend + API routes)
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, register, onboarding
│   │   │   ├── (dashboard)/    # Main app
│   │   │   │   ├── chat/       # Chat conversacional principal
│   │   │   │   ├── library/    # Asset library / media manager
│   │   │   │   ├── campaigns/  # Gestion de campanas de ads
│   │   │   │   ├── analytics/  # Dashboards de rendimiento
│   │   │   │   ├── competitors/# Analisis de competencia
│   │   │   │   ├── strategy/   # Estrategia de contenido
│   │   │   │   └── settings/   # Configuracion de cuenta
│   │   │   └── api/            # API routes
│   │   │       ├── chat/       # Streaming de chat con AI
│   │   │       ├── generate/   # Generacion de imagen/video
│   │   │       ├── publish/    # Publicacion en plataformas
│   │   │       ├── scrape/     # Scraping de competencia
│   │   │       └── webhooks/   # Webhooks de Meta, Google, etc.
│   │   └── components/
│   │       ├── chat/           # Chat UI components
│   │       ├── canvas/         # Canvas multi-formato
│   │       ├── preview/        # Preview panel
│   │       ├── editor/         # Editor de imagen/video inline
│   │       └── ui/             # shadcn components
│   │
│   └── video-worker/           # Servicio de render de video
│       ├── remotion/           # Composiciones Remotion
│       │   ├── components/     # 25+ componentes (de editor-pro-max)
│       │   ├── templates/      # Templates por plataforma
│       │   └── compositions/   # Composiciones generadas
│       ├── scripts/            # Pipeline de procesamiento
│       │   ├── analyze-video.ts
│       │   ├── extract-audio.ts
│       │   ├── transcribe.ts
│       │   ├── detect-silence.ts
│       │   └── remove-background.ts
│       └── render/             # Render queue worker
│
├── packages/
│   ├── ai/                     # AI orchestration layer
│   │   ├── providers/          # fal, gemini, replicate, openai
│   │   ├── tools/              # Tool definitions para Vercel AI SDK
│   │   ├── pipelines/          # Image, video, strategy pipelines
│   │   └── prompts/            # System prompts optimizados
│   │
│   ├── db/                     # Supabase client + types generados
│   ├── ads/                    # Meta, Google, TikTok API clients
│   ├── scraper/                # Scraping utilities
│   ├── formats/                # Constantes de formatos por plataforma
│   └── shared/                 # Types, utils, constants compartidos
│
├── supabase/
│   ├── migrations/             # SQL migrations
│   ├── functions/              # Edge Functions
│   └── seed.sql
│
├── turbo.json
├── package.json
└── .env.example
```

---

## 5. Modulos del Producto

ArbiStudio se compone de 5 modulos principales, todos accesibles desde el chat:

| # | Modulo | Descripcion |
|---|---|---|
| 1 | **Image Studio** | Generacion y edicion de imagenes IA fotorrealistas, multi-formato |
| 2 | **Video Studio** | Edicion, produccion y generacion de video IA profesional |
| 3 | **Ads Hub** | Conexion y publicacion en Meta Ads, Google Ads, TikTok Ads |
| 4 | **Competitor Intel** | Scraping y analisis de competencia (ads, contenido, estrategia) |
| 5 | **Strategy Engine** | Planificacion de contenido basada en datos |

Cada modulo se activa automaticamente segun el intent del usuario en el chat. No hay navegacion manual necesaria.

---

## 6. Modulo 1: Image Studio — Generacion de Imagen IA

### 6.1 Capacidades

| Capacidad | Detalle |
|---|---|
| **Generacion text-to-image** | Desde prompt en lenguaje natural. Calidad fotografica/realista |
| **Image-to-image** | Sube una imagen como referencia, modifica con instrucciones |
| **Inpainting** | Edita partes especificas de una imagen (cambiar fondo, objeto, texto) |
| **Outpainting** | Expande los bordes de una imagen manteniendo coherencia |
| **Upscaling** | Ampliar resolucion hasta 4K manteniendo detalle |
| **Background removal** | Eliminar fondo con precision profesional |
| **Style transfer** | Aplicar estilo de una imagen a otra |
| **Text rendering** | Texto integrado en la imagen con tipografia legible |
| **Multi-formato automatico** | Un prompt genera la imagen en todos los formatos seleccionados |
| **Brand consistency** | Aplica guias de marca (colores, logo, tipografia) automaticamente |
| **Batch generation** | Genera multiples variantes para A/B testing |

### 6.2 Modelos de IA (routing inteligente)

El sistema selecciona automaticamente el mejor modelo segun el tipo de imagen:

| Modelo | Provider | Mejor para | Resolucion max |
|---|---|---|---|
| **Flux 1.1 Pro** | fal.ai | Fotorrealismo extremo, retratos, productos | 2048x2048 |
| **Flux Kontext Pro** | fal.ai | Edicion contextual, inpainting, style transfer | 2048x2048 |
| **Gemini 3.1 Flash Image** | Google | 4K, text rendering, subject consistency, velocidad | 3840x3840 |
| **Gemini 3 Pro Image** | Google | Composiciones complejas, razonamiento visual | 3840x3840 |
| **Ideogram v3** | fal.ai | Texto en imagenes, tipografia, logos | 2048x2048 |
| **Recraft v3** | fal.ai | Ilustraciones vectoriales, iconos, brand assets | 2048x2048 |
| **SDXL (fine-tuned)** | Replicate | Estilos de marca custom, LoRA personalizados | 1024x1024 |
| **Imagen 4 Pro** | Google | Fotorrealismo Google, precision anatomica | 2048x2048 |

### 6.3 Routing de modelos

```typescript
function selectImageModel(intent: ImageIntent): ModelConfig {
  // Fotografia realista / producto / retrato
  if (intent.style === 'photorealistic') return { model: 'flux-1.1-pro', provider: 'fal' };
  
  // Texto prominente en imagen (banners, ads con copy)
  if (intent.hasText) return { model: 'ideogram-v3', provider: 'fal' };
  
  // Edicion de imagen existente
  if (intent.type === 'edit') return { model: 'flux-kontext-pro', provider: 'fal' };
  
  // 4K con grounding (datos reales, landmarks, productos reales)
  if (intent.needs4K || intent.needsGrounding) return { model: 'gemini-3.1-flash', provider: 'google' };
  
  // Ilustracion / vectorial / brand assets
  if (intent.style === 'illustration') return { model: 'recraft-v3', provider: 'fal' };
  
  // Default: Flux Pro (mejor relacion calidad/versatilidad)
  return { model: 'flux-1.1-pro', provider: 'fal' };
}
```

### 6.4 Formatos de salida

| Plataforma | Formato | Dimensiones | Uso |
|---|---|---|---|
| Instagram Feed | 1:1 | 1080x1080 | Post cuadrado |
| Instagram Feed | 4:5 | 1080x1350 | Post vertical (recomendado) |
| Instagram Stories | 9:16 | 1080x1920 | Stories / Reels |
| Facebook Feed | 1.91:1 | 1200x628 | Link ads, posts |
| Facebook Feed | 1:1 | 1080x1080 | Carousel, post |
| TikTok | 9:16 | 1080x1920 | In-feed |
| YouTube Thumbnail | 16:9 | 1280x720 | Thumbnails |
| Google Display | Multiples | IAB standard | Banner ads |
| LinkedIn | 1.91:1 | 1200x627 | Posts, ads |
| X (Twitter) | 16:9 | 1600x900 | Posts, ads |
| Pinterest | 2:3 | 1000x1500 | Pins |
| Custom | Libre | Definido por usuario | Cualquier uso |

### 6.5 UX del flujo de generacion de imagen

```
USUARIO: "Crea una foto de producto para un reloj de lujo, fondo marmol blanco, 
          luz natural suave, para Instagram feed y stories"

ARBISTUDIO:
┌─────────────────────────────────────────────────────────┐
│ Generando imagen con Flux 1.1 Pro...                    │
│ ████████████████████░░░░ 78%                            │
│                                                         │
│ ┌─────────────┐  ┌─────────────┐                       │
│ │             │  │             │                        │
│ │   1:1       │  │   9:16      │                        │
│ │  (Feed)     │  │  (Stories)  │                        │
│ │             │  │             │                        │
│ └─────────────┘  └─────────────┘                        │
│                                                         │
│ [Regenerar] [Editar] [Variantes] [Exportar] [Publicar]  │
└─────────────────────────────────────────────────────────┘

USUARIO: "Hazlo mas calido y anade el logo de la marca en la esquina inferior derecha"

ARBISTUDIO: [Aplica edicion con Flux Kontext, overlay de logo, preview actualizado]
```

---

## 7. Modulo 2: Video Studio — Edicion y Produccion de Video IA

### 7.1 Capacidades

| Capacidad | Detalle |
|---|---|
| **Text-to-video** | Genera video desde prompt (Kling, Runway, Pika via fal.ai) |
| **Image-to-video** | Anima una imagen estatica en video |
| **Video editing** | Cortes, transiciones, reordenamiento de clips |
| **Auto-subtitulos** | Transcripcion con Whisper + subtitulos estilizados (TikTok-style) |
| **Motion graphics** | Texto animado, lower thirds, CTAs animados, progress bars |
| **Background music** | Musica IA (Suno) o libreria curada |
| **Voiceover** | Narraccion IA con ElevenLabs (multilingual, voz clonada) |
| **Auto-reformat** | Convierte 16:9 a 9:16 con reframing inteligente |
| **Silence removal** | Detecta y elimina silencios automaticamente |
| **Jump cuts** | Cortes automaticos de tipo talking-head |
| **Color grading** | Filtros y correccion de color profesional |
| **Templates** | TikTok, Reel, YouTube Short, Presentacion, Testimonial, etc. |
| **Batch render** | Renderiza multiples formatos en paralelo |

### 7.2 Stack de video (basado en editor-pro-max)

Se reutiliza el 100% de la arquitectura de **editor-pro-max** (Hainrixz):

- **25 componentes Remotion**: AnimatedTitle, CaptionOverlay, ParticleField, FitVideo, Slideshow, SplitScreen, PictureInPicture, etc.
- **10 templates**: TikTok, InstagramReel, YouTubeShort, Presentation, Testimonial, Announcement, BeforeAfter, TalkingHead, PodcastClip, Showcase
- **Pipeline scripts**: analyze-video, extract-audio, transcribe (Whisper), detect-silence, remove-background
- **Presets**: 7 paletas de color, 8 gradientes, 12 easings, 5 fonts, 9 dimensiones de plataforma

### 7.3 Formatos de video

| Plataforma | Formato | Dimensiones | FPS | Duracion tipica |
|---|---|---|---|---|
| Instagram Reels | 9:16 | 1080x1920 | 30 | 15-90s |
| TikTok | 9:16 | 1080x1920 | 30 | 15-180s |
| YouTube Shorts | 9:16 | 1080x1920 | 30 | 15-60s |
| YouTube | 16:9 | 1920x1080 | 30 | Variable |
| Facebook Feed | 1:1 / 4:5 | 1080x1080 / 1080x1350 | 30 | 15-60s |
| LinkedIn | 1:1 / 16:9 | 1080x1080 / 1920x1080 | 30 | 30-120s |
| Stories (IG/FB) | 9:16 | 1080x1920 | 30 | 5-15s |
| X (Twitter) | 16:9 | 1920x1080 | 30 | 15-140s |
| Google Ads Video | 16:9 | 1920x1080 | 30 | 6-30s |

### 7.4 Modelos de video IA

| Modelo | Provider | Mejor para | Max duracion |
|---|---|---|---|
| **Kling 1.6 Pro** | fal.ai | Video realista, movimiento fluido, personas | 10s |
| **Runway Gen-3 Alpha Turbo** | fal.ai | Image-to-video, efectos cinematograficos | 10s |
| **Pika 2.0** | fal.ai | Transiciones creativas, efectos especiales | 5s |
| **Wan 2.1** | fal.ai | Texto-a-video rapido, buena relacion calidad/coste | 5s |
| **Remotion** | Local | Composicion, motion graphics, subtitulos, templates | Ilimitado |

### 7.5 Pipeline de edicion de video

```
1. INGESTA
   └── Upload de video bruto (MP4, MOV, WebM)
       └── analyze-video.ts → metadata (duracion, fps, resolucion)

2. PROCESAMIENTO
   ├── extract-audio.ts → WAV
   ├── transcribe.ts (Whisper) → captions word-level con timestamps
   ├── detect-silence.ts → segmentos de silencio
   └── (opcional) remove-background.ts → video sin fondo

3. EDICION IA (segun instrucciones del chat)
   ├── Auto-cortes (eliminar silencios)
   ├── Subtitulos estilizados (5 presets: TikTok, Minimal, Bold, Outline, Gradient)
   ├── Motion graphics (titulo, lower third, CTA, progress bar)
   ├── Musica de fondo (libreria o generada con Suno)
   ├── Voiceover (ElevenLabs)
   ├── Color grading
   └── Reformat multi-plataforma

4. COMPOSICION (Remotion)
   └── Combina todo en una composicion React
       └── Preview en Remotion Studio (streaming al browser)

5. RENDER
   └── Server-side render con Remotion Lambda o local
       └── Output: MP4 en todos los formatos solicitados

6. ENTREGA
   └── Preview en el chat
       └── [Descargar] [Publicar en IG] [Subir a Meta Ads] [Programar]
```

### 7.6 UX del flujo de video

```
USUARIO: "Sube este video de mi grabacion de 5 minutos y hazme 3 clips para reels. 
          Anade subtitulos estilo TikTok y musica de fondo chill"

ARBISTUDIO:
┌─────────────────────────────────────────────────────────┐
│ Procesando video...                                      │
│                                                          │
│ ✅ Video analizado: 5:23 min, 1920x1080, 30fps          │
│ ✅ Audio extraido y transcrito (847 palabras)            │
│ ✅ 12 segmentos de silencio detectados                   │
│ ✅ 3 momentos clave identificados para clips             │
│                                                          │
│ Clip 1 (0:42-1:15) — "La clave del marketing en 2026"  │
│ ┌──────────────────┐                                     │
│ │ ▶ Preview 9:16   │  Subtitulos: TikTok Bold           │
│ │   [33 segundos]  │  Musica: Lo-fi chill                │
│ └──────────────────┘  Hook score: 87/100                 │
│                                                          │
│ Clip 2 (2:08-2:55) — "El error que todos cometen"       │
│ ┌──────────────────┐                                     │
│ │ ▶ Preview 9:16   │  Subtitulos: TikTok Bold           │
│ │   [47 segundos]  │  Musica: Lo-fi chill                │
│ └──────────────────┘  Hook score: 92/100                 │
│                                                          │
│ Clip 3 (4:01-4:38) — "Lo que nadie te cuenta"           │
│ ┌──────────────────┐                                     │
│ │ ▶ Preview 9:16   │  Subtitulos: TikTok Bold           │
│ │   [37 segundos]  │  Musica: Lo-fi chill                │
│ └──────────────────┘  Hook score: 79/100                 │
│                                                          │
│ [Editar clips] [Cambiar subtitulos] [Otra musica]        │
│ [Renderizar todos] [Publicar]                            │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Modulo 3: Cinema Studio — Controles Cinematograficos *(NUEVO v1.1)*

Inspirado directamente en Higgsfield Cinema Studio. ArbiStudio ofrece controles cinematograficos profesionales sobre el video generado.

### 8.1 Sistema de camara virtual

| Categoria | Controles |
|---|---|
| **Movimientos de camara** | Pan, Tilt, Dolly, Truck, Pedestal, Arc, Crane, Steadicam, Handheld |
| **Presets cinematograficos** | Bullet Time, Crash Zoom, Dolly Zoom (Vertigo), 360 Rotation, Slow Motion Reveal, Parallax, Whip Pan, Jib Shot |
| **Tipos de lente** | Esferica, Anamorfica, Macro, Fisheye, Tilt-Shift |
| **Distancia focal** | 14mm a 200mm (slider continuo) |
| **Profundidad de campo** | Control de apertura (f/1.4 a f/22), bokeh personalizable |
| **Sensor** | Full Frame, Super 35, APS-C (afecta al crop factor) |

### 8.2 Implementacion tecnica

Los controles de camara se aplican de dos maneras:

1. **En generacion**: Los parametros de camara se traducen a prompt engineering optimizado para cada modelo de video (Kling, Runway, Pika). Ejemplo: "cinematic dolly zoom shot, anamorphic lens, shallow depth of field f/1.8, 85mm focal length"

2. **En post-produccion (Remotion)**: Para motion graphics y composiciones, los movimientos de camara se aplican programaticamente sobre el canvas:

```typescript
// packages/ai/cinema/camera-presets.ts
export const CINEMA_PRESETS = {
  dolly_zoom: {
    name: 'Dolly Zoom (Vertigo)',
    description: 'Zoom in while dollying out — creates disorienting effect',
    remotion: {
      scale: { from: 1, to: 1.5, easing: 'easeInOutCubic' },
      translateZ: { from: 0, to: -200, easing: 'easeInOutCubic' },
    },
    prompt_modifier: 'dolly zoom vertigo effect, background stretches while subject stays same size',
  },
  bullet_time: {
    name: 'Bullet Time',
    description: '360-degree rotation around frozen subject',
    prompt_modifier: 'slow motion 360 rotation around subject, frozen in time, Matrix bullet time effect',
  },
  crash_zoom: {
    name: 'Crash Zoom',
    description: 'Sudden fast zoom into subject',
    remotion: {
      scale: { from: 1, to: 3, easing: 'easeInExpo', duration: 15 }, // 0.5s at 30fps
    },
    prompt_modifier: 'sudden dramatic zoom into subject, fast push in',
  },
  parallax: {
    name: 'Parallax Scroll',
    description: 'Layered depth movement for static images',
    remotion: {
      layers: [
        { depth: 'far', speed: 0.2 },
        { depth: 'mid', speed: 0.5 },
        { depth: 'near', speed: 1.0 },
      ],
    },
  },
  // ... 30+ presets mas
} as const;
```

### 8.3 Color grading post-generacion (sin re-render)

Una vez generado el video o imagen, el usuario puede ajustar la estetica visual sin regenerar:

| Control | Rango | Descripcion |
|---|---|---|
| Temperatura | -100 a +100 | Frio (azul) a calido (naranja) |
| Contraste | -100 a +100 | Plano a alto contraste |
| Saturacion | -100 a +100 | Desaturado a hipersaturado |
| Grano | 0 a 100 | Grano cinematografico analogico |
| Bloom | 0 a 100 | Resplandor suave en highlights |
| Exposicion | -3 EV a +3 EV | Oscurecer o aclarar |
| Sombras | -100 a +100 | Levantar o aplastar sombras |
| Highlights | -100 a +100 | Recuperar o quemar altas luces |
| Vignette | 0 a 100 | Oscurecimiento de bordes |
| LUT presets | 20+ | Cinematic, Warm Vintage, Cool Teal, Film Noir, etc. |

**Implementacion**: CSS filters + WebGL shaders aplicados sobre el canvas de preview. Para el export final, se aplican via FFmpeg filters.

```typescript
// Ejemplo de LUT presets
const LUT_PRESETS = {
  cinematic: { temperature: 15, contrast: 20, saturation: -10, grain: 25, shadows: -15 },
  warm_vintage: { temperature: 30, contrast: 10, saturation: -20, grain: 40, vignette: 30 },
  cool_teal: { temperature: -25, contrast: 15, saturation: 10, shadows: 10 },
  film_noir: { temperature: -10, contrast: 40, saturation: -80, grain: 50, vignette: 50 },
  neon_nights: { temperature: -15, contrast: 30, saturation: 40, bloom: 40 },
  // ... 15+ mas
};
```

### 8.4 UX del Cinema Studio

```
USUARIO: "Genera un video de un reloj girando lentamente, estilo cinematografico, 
          lente anamorfica, profundidad de campo corta"

ARBISTUDIO:
┌──────────────────────────────────────────────────────────────┐
│ Cinema Studio                                                │
│                                                              │
│ ┌────────────────────────────────┐  ┌──────────────────────┐│
│ │                                │  │ CAMERA CONTROLS      ││
│ │     ▶ VIDEO PREVIEW            │  │                      ││
│ │     [reloj girando]            │  │ Lens: Anamorphic     ││
│ │                                │  │ Focal: 85mm    [━━━] ││
│ │                                │  │ Aperture: f/1.8[━━━] ││
│ │                                │  │ Sensor: Super 35     ││
│ │                                │  │ Motion: Slow Rotate  ││
│ │                                │  │                      ││
│ └────────────────────────────────┘  │ COLOR GRADING        ││
│                                     │                      ││
│ ┌────────────────────────────────┐  │ Temp:    [━━━━━░━━━] ││
│ │ Timeline: ████████░░░ 3.2s    │  │ Contrast:[━━━━━━░━━] ││
│ └────────────────────────────────┘  │ Grain:   [━━░━━━━━━] ││
│                                     │ LUT: [Cinematic  ▼]  ││
│ [Regenerar] [Editar prompt]         └──────────────────────┘│
│ [Exportar] [Variantes] [Publicar]                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Modulo 4: Soul System — Personajes Consistentes e Identidad Visual *(NUEVO v1.1)*

Inspirado en Soul Cast y Soul ID de Higgsfield. Permite crear personajes IA que mantienen su identidad visual a traves de multiples generaciones.

### 9.1 Creacion de personaje (Soul Builder)

El usuario crea un personaje cargando imagenes de referencia o describiendolo:

| Atributo | Control |
|---|---|
| **Rostro** | Upload de 3-10 fotos de referencia o descripcion detallada |
| **Genero** | Masculino, Femenino, No binario |
| **Edad** | Slider 18-80 |
| **Etnia** | Seleccion libre o descripcion |
| **Fisico** | Complexion, altura relativa |
| **Estilo de vestimenta** | Casual, Formal, Deportivo, Streetwear, Lujo, Custom |
| **Epoca** | Contemporaneo, Retro, Futurista, Historico |
| **Expresiones** | Neutro, Sonriente, Serio, Reflexivo, Energetico |
| **Imperfecciones** | Pecas, cicatrices, tatuajes — para realismo |

### 9.2 Implementacion tecnica

| Tecnologia | Uso |
|---|---|
| **IP-Adapter** (via Replicate/fal.ai) | Inyecta la identidad facial en cualquier generacion de imagen |
| **LoRA training** (via Replicate) | Fine-tune personalizado del modelo con las fotos del personaje. 15-20 min de training |
| **Face embedding** | Vector de 512 dimensiones que captura la identidad unica |
| **Consistencia cross-model** | El embedding se adapta como condicionamiento para Flux, SDXL, Kling, etc. |

### 9.3 Uso en el chat

```
USUARIO: "Crea un personaje llamado 'Sofia' — mujer, 28 anos, pelo castano ondulado, 
          estilo profesional pero moderno, para una campana de coaching"

ARBISTUDIO:
┌──────────────────────────────────────────────────────────┐
│ Soul Builder — Creando personaje "Sofia"                  │
│                                                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Variante│ │ Variante│ │ Variante│ │ Variante│        │
│ │    1    │ │    2    │ │    3    │ │    4    │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                                                           │
│ [Seleccionar favorita] [Refinar] [Subir foto referencia] │
│                                                           │
│ Una vez confirmada, Sofia estara disponible en todas      │
│ tus generaciones con @Sofia                               │
└──────────────────────────────────────────────────────────┘

--- despues ---

USUARIO: "@Sofia en una oficina moderna sonriendo, para post de LinkedIn"

ARBISTUDIO: [Genera imagen con la identidad de Sofia consistente]
```

### 9.4 Brand Identity System (Soul HEX)

Ademas de personajes, ArbiStudio mantiene consistencia de marca:

| Elemento | Persistencia |
|---|---|
| **Paleta de colores** | Se aplica automaticamente a toda generacion del proyecto |
| **Tipografia** | Consistente en todos los motion graphics y overlays |
| **Logo** | Overlay automatico configurable (posicion, tamano, opacidad) |
| **Tono visual** | LUT/color grading persistente del proyecto |
| **Estilo fotografico** | Prompt modifiers guardados (e.g., "editorial luxury, soft natural light") |

---

## 10. Modulo 5: Click-to-Ad — Generacion Automatica de Anuncios *(NUEVO v1.1)*

Feature inspirada en Higgsfield Click-to-Ad pero **muy superior** porque incluye todo el workflow de publicacion.

### 10.1 Flujo completo

```
1. USUARIO pega una URL (producto, landing, ecommerce)

2. ARBISTUDIO SCRAPING:
   ├── Firecrawl extrae: texto, imagenes, precios, CTAs, valor propuesta
   ├── Screenshot de la landing
   └── Analisis IA: identifica producto, audiencia, puntos de venta

3. ARBISTUDIO ANALISIS:
   ├── Busca competidores en Meta Ad Library
   ├── Analiza los ads mas exitosos del sector
   └── Identifica gaps y oportunidades

4. ARBISTUDIO GENERACION:
   ├── Genera 5-10 variantes de imagen/video para ads
   ├── Cada variante en multiples formatos (feed, stories, reels)
   ├── Copy optimizado para cada plataforma
   ├── CTAs sugeridos basados en competencia
   └── Targeting sugerido basado en analisis

5. USUARIO revisa y edita en el chat:
   ├── "Cambia el headline del 3"
   ├── "Hazlo mas calido"
   ├── "Anade @Sofia al video"
   └── "Aprobado, publica en Meta con 30€/dia"

6. ARBISTUDIO PUBLICA:
   └── Crea campana en Meta Ads con todo configurado
```

### 10.2 UX del Click-to-Ad

```
USUARIO: "https://ejemplo.com/producto-premium — crea anuncios para Meta"

ARBISTUDIO:
┌──────────────────────────────────────────────────────────────┐
│ Click-to-Ad — Analizando URL...                              │
│                                                              │
│ ✅ Producto detectado: "Reloj Premium Titanium Edition"      │
│ ✅ Precio: 299€                                              │
│ ✅ Audiencia sugerida: Hombres 30-50, interes lujo, ES       │
│ ✅ 8 ads de competidores analizados en Ad Library             │
│                                                              │
│ Generando variantes de anuncio...                            │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│ │ Variante 1 │ │ Variante 2 │ │ Variante 3 │               │
│ │ Producto   │ │ Lifestyle  │ │ Video 9:16 │               │
│ │ fondo min. │ │ en muneca  │ │ unboxing   │               │
│ │ ★★★★★     │ │ ★★★★☆     │ │ ★★★★★     │               │
│ └────────────┘ └────────────┘ └────────────┘               │
│                                                              │
│ Cada variante disponible en: 1:1, 4:5, 9:16, 16:9          │
│                                                              │
│ Copy sugerido:                                               │
│ "El tiempo es una inversion. El Titanium Edition, ahora     │
│  a 299€ con envio gratuito. Solo esta semana."              │
│                                                              │
│ [✅ Aprobar todas] [✏️ Editar] [🔄 Mas variantes]           │
│ [📤 Publicar en Meta] [📤 Publicar en TikTok]               │
└──────────────────────────────────────────────────────────────┘
```

---

## 11. Modulo 6: Lipsync Studio — Talking Heads con Sincronizacion Labial *(NUEVO v1.1)*

Produccion de videos talking-head con lip sync profesional, emociones controlables y traduccion multi-idioma.

### 11.1 Capacidades

| Funcion | Detalle |
|---|---|
| **Script-to-video** | Escribe un guion → avatar lo habla con lip sync perfecto |
| **Audio-to-video** | Sube un audio → avatar lo sincroniza |
| **Voz clonada** | Clonacion de voz del usuario/cliente con ElevenLabs (1 min de muestra) |
| **Libreria de voces** | 100+ voces preconfiguradas, multilingual |
| **Control de emociones** | Neutral, Feliz, Serio, Entusiasta, Preocupado, Confiado |
| **Traduccion + lip sync** | Traduce el script a otro idioma y sincroniza labios al nuevo audio |
| **Face swap** | Aplica un rostro (Soul Character o foto) sobre cualquier video talking head |
| **Idiomas** | ES, EN, PT, FR, DE, IT, AR, ZH, JA, KO + 20 mas (ElevenLabs multilingual v2) |

### 11.2 Stack tecnico

| Componente | Tecnologia |
|---|---|
| Text-to-speech | ElevenLabs Multilingual v2 |
| Voz clonada | ElevenLabs Voice Cloning |
| Lip sync | SadTalker / Wav2Lip (via Replicate) |
| Face swap | InsightFace / roop (via Replicate) |
| Traduccion | DeepL API + Whisper (para timing) |
| Composicion | Remotion (overlay de subtitulos, branding) |

### 11.3 Casos de uso

- **UGC ads**: Crear "testimonios" con avatares para campanas de ads
- **Explicaciones de producto**: Avatar habla sobre el producto con branding
- **Multi-idioma**: Un video, 10 idiomas, labios sincronizados en cada uno
- **CEO updates**: Clonar la voz del CEO, generar video con avatar

### 11.4 UX

```
USUARIO: "Crea un video de @Sofia presentando nuestro nuevo servicio de coaching.
          Guion: 'Hola, soy Sofia y quiero contarte como transformamos negocios...'
          Tono entusiasta, duracion 30 segundos, subtitulos bold"

ARBISTUDIO:
┌─────────────────────────────────────────────────────────┐
│ Lipsync Studio — Generando...                            │
│                                                          │
│ ✅ Voz generada (ElevenLabs — Isabella, entusiasta)     │
│ ✅ Lip sync aplicado sobre @Sofia                        │
│ ✅ Subtitulos TikTok Bold anadidos                       │
│ ✅ Branding overlay aplicado                             │
│                                                          │
│ ┌──────────────────────┐                                │
│ │                      │   Duracion: 28s                │
│ │  ▶ PREVIEW           │   Formato: 9:16               │
│ │  [Sofia hablando]    │   Voz: Isabella (ES)           │
│ │                      │   Emocion: Entusiasta          │
│ └──────────────────────┘                                │
│                                                          │
│ [Cambiar voz] [Otra emocion] [Traducir a EN]            │
│ [Editar guion] [Exportar] [Publicar]                    │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Modulo 7: Ads Hub — Conexion con Plataformas de Publicidad

### 8.1 Meta Developer App — Setup completo

Para conectar ArbiStudio con Meta Ads es necesario crear una **Meta App** en el portal de desarrolladores. Esto es lo que hay que configurar:

#### 8.1.1 Crear la Meta App

1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Crear una app tipo **Business** (no Consumer ni Gaming)
3. Seleccionar el **Business Manager** de Arbi Capital (o crear uno)
4. Nombre de la app: "ArbiStudio"
5. Agregar los productos:
   - **Marketing API** — para gestionar campanas, ad sets, ads
   - **Instagram Graph API** — para publicar contenido organico
   - **Facebook Login for Business** — para autenticar usuarios

#### 8.1.2 Permisos necesarios (scopes)

| Permiso | Tipo | Para que |
|---|---|---|
| `ads_management` | Extended | Crear, editar, pausar campanas |
| `ads_read` | Standard | Leer metricas de campanas |
| `business_management` | Extended | Gestionar Business Manager |
| `pages_manage_posts` | Extended | Publicar en paginas de Facebook |
| `pages_read_engagement` | Standard | Leer interacciones |
| `instagram_basic` | Standard | Acceso basico a IG |
| `instagram_content_publish` | Extended | Publicar en Instagram |
| `instagram_manage_comments` | Extended | Gestionar comentarios |
| `instagram_manage_insights` | Standard | Metricas de Instagram |
| `leads_retrieval` | Standard | Lead Ads data |
| `read_insights` | Standard | Metricas de pagina |

#### 8.1.3 Flujo de autenticacion

```
1. Usuario en ArbiStudio → "Conectar Meta Ads"
2. ArbiStudio redirige a Facebook Login (OAuth 2.0)
3. Usuario autoriza permisos
4. Facebook devuelve access_token de corta duracion
5. ArbiStudio intercambia por long-lived token (60 dias)
6. ArbiStudio almacena token encriptado en Supabase
7. Renovacion automatica antes de expiracion
```

#### 8.1.4 Endpoints principales de Meta Marketing API v21

| Endpoint | Uso en ArbiStudio |
|---|---|
| `POST /act_{ad_account_id}/campaigns` | Crear campana |
| `POST /act_{ad_account_id}/adsets` | Crear ad set con targeting |
| `POST /act_{ad_account_id}/ads` | Crear anuncio con creative |
| `POST /act_{ad_account_id}/adcreatives` | Subir creative (imagen/video + copy) |
| `POST /{ad_account_id}/adimages` | Subir imagen para ads |
| `POST /{ad_account_id}/advideos` | Subir video para ads |
| `GET /act_{ad_account_id}/insights` | Metricas de rendimiento |
| `GET /act_{ad_account_id}/adspixels` | Pixel de conversion |
| `POST /{page_id}/photos` | Publicar imagen en pagina FB |
| `POST /{ig_user_id}/media` | Publicar en Instagram |
| `POST /{ig_user_id}/media_publish` | Confirmar publicacion IG |

#### 8.1.5 App Review de Meta

Para que otros usuarios (no solo el admin) puedan usar la app, hay que pasar el **App Review de Meta**:

1. Completar la **Data Use Checkup**
2. Proporcionar **screencasts** mostrando como se usan los permisos
3. Enlazar **Privacy Policy** y **Terms of Service**
4. Documentar el caso de uso de cada permiso
5. Tiempo estimado de aprobacion: 2-4 semanas

> **Para uso interno de Arbi Capital**: Se puede usar en modo desarrollo sin App Review (limitado a admins de la app).

### 8.2 Google Ads API

| Paso | Detalle |
|---|---|
| 1. Google Cloud Project | Crear proyecto en console.cloud.google.com |
| 2. Habilitar Google Ads API | En la libreria de APIs |
| 3. OAuth 2.0 credentials | Client ID + Secret para web app |
| 4. Developer Token | Solicitar en Google Ads > Tools > API Center |
| 5. MCC Account | Manager account para gestionar multiples clientes |

**Endpoints clave**:
- `googleads.v17.CampaignService` — CRUD de campanas
- `googleads.v17.AdGroupService` — Grupos de anuncios
- `googleads.v17.AdService` — Anuncios individuales
- `googleads.v17.AssetService` — Subir imagenes/videos
- `googleads.v17.GoogleAdsService` — Consultas GAQL para metricas

### 8.3 TikTok Marketing API

| Paso | Detalle |
|---|---|
| 1. TikTok for Business account | business.tiktok.com |
| 2. Crear App en TikTok Marketing API | developers.tiktok.com |
| 3. Solicitar acceso a Marketing API | Formulario de aplicacion |
| 4. OAuth 2.0 | Autorizacion del advertiser |

**Endpoints clave**:
- `POST /open_api/v1.3/campaign/create/` — Crear campana
- `POST /open_api/v1.3/adgroup/create/` — Crear ad group
- `POST /open_api/v1.3/ad/create/` — Crear anuncio
- `POST /open_api/v1.3/file/image/ad/upload/` — Subir imagen
- `POST /open_api/v1.3/file/video/ad/upload/` — Subir video
- `GET /open_api/v1.3/report/integrated/get/` — Metricas

### 8.4 Publicacion organica

| Plataforma | API | Capacidad |
|---|---|---|
| Instagram | Graph API v21 | Posts, Reels, Stories, Carruseles |
| Facebook | Graph API v21 | Posts, Videos, Stories |
| TikTok | Content Posting API | Videos directos |
| YouTube | Data API v3 | Videos, Shorts, Community posts |
| LinkedIn | Marketing API v2 | Posts, articulos, videos |
| X (Twitter) | API v2 | Posts, imagenes, videos |

### 8.5 UX del flujo de publicacion

```
USUARIO: "Publica la imagen del reloj en una campana de conversiones en Meta,
          targeting hombres 25-45 interesados en relojes de lujo en Espana,
          presupuesto 50€/dia"

ARBISTUDIO:
┌─────────────────────────────────────────────────────────┐
│ Campana preparada para Meta Ads:                        │
│                                                         │
│ 📋 Campana: "Reloj Lujo — Conversiones"                │
│ 🎯 Objetivo: Conversiones                              │
│ 💰 Presupuesto: 50€/dia                                │
│ 👥 Audiencia: Hombres 25-45, Espana                    │
│    Intereses: Relojes de lujo, Rolex, Omega, Joyeria   │
│ 📐 Formatos: Feed (4:5) + Stories (9:16)               │
│                                                         │
│ Creatividades:                                          │
│ ┌──────┐ ┌──────┐ ┌──────┐                            │
│ │ 4:5  │ │ 9:16 │ │ 1:1  │                            │
│ │ Feed │ │Story │ │ Feed │                             │
│ └──────┘ └──────┘ └──────┘                             │
│                                                         │
│ Copy: "El tiempo es lujo. Descubre nuestra coleccion." │
│ CTA: "Comprar ahora"                                   │
│                                                         │
│ ⚠️ Requiere tu aprobacion para publicar                │
│ [✅ Aprobar y publicar] [✏️ Editar] [❌ Cancelar]      │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Modulo 4: Competitor Intel — Analisis de Competencia

### 9.1 Capacidades

| Funcion | Detalle |
|---|---|
| **Ad Library scraping** | Escanea Meta Ad Library, Google Ads Transparency, TikTok Creative Center |
| **Social media scraping** | Descarga posts, reels, stories de cuentas publicas de competidores |
| **Landing page scraping** | Extrae texto, imagenes, estructura, CTAs de landing pages |
| **Web scraping general** | Firecrawl para deep crawling de cualquier URL |
| **Analisis IA** | Claude analiza todo el contenido scrapeado y genera insights accionables |
| **Trend detection** | Detecta patrones en la estrategia del competidor |

### 9.2 Fuentes de datos

| Fuente | Metodo | Datos |
|---|---|---|
| Meta Ad Library | API oficial + scraping | Todos los anuncios activos de cualquier pagina |
| Google Ads Transparency | Scraping | Anuncios activos por dominio |
| TikTok Creative Center | API + scraping | Top ads, trending sounds, hashtags |
| Instagram (publico) | Apify + scraping | Posts, reels, bio, hashtags, engagement |
| TikTok (publico) | Apify + scraping | Videos, sounds, hashtags, engagement |
| YouTube | Data API | Videos, thumbnails, tags, engagement |
| Paginas web | Firecrawl | Texto completo, imagenes, estructura |
| X (Twitter) | Xquik API | Posts, engagement, tendencias |

### 9.3 Output del analisis

```
USUARIO: "Analiza la estrategia de contenido de @competidor en Instagram"

ARBISTUDIO:
┌─────────────────────────────────────────────────────────┐
│ Analisis de @competidor — Ultimos 30 dias              │
│                                                         │
│ 📊 Metricas generales:                                 │
│    Posts: 45 | Reels: 28 | Stories: ~120               │
│    Engagement rate: 3.2% | Frecuencia: 1.5 posts/dia  │
│                                                         │
│ 🎨 Estrategia visual:                                  │
│    - Paleta dominante: azul oscuro + dorado            │
│    - 60% foto producto, 30% lifestyle, 10% UGC        │
│    - Reels: talking head + subtitulos blancos           │
│                                                         │
│ 📝 Estrategia de copy:                                 │
│    - Tono: aspiracional + urgencia                     │
│    - CTA mas usado: "Link en bio"                      │
│    - Hashtags: #luxury #watches #lifestyle (15 avg)    │
│                                                         │
│ 🏆 Top 5 posts por engagement:                        │
│    1. [Preview] Reel unboxing — 45K views, 4.8% ER    │
│    2. [Preview] Carrusel educativo — 12K likes         │
│    3. [Preview] Foto producto macro — 8K likes         │
│    ...                                                  │
│                                                         │
│ 💡 Insights accionables:                               │
│    1. Los reels de unboxing tienen 3x mas engagement   │
│    2. Los carruseles educativos generan mas saves       │
│    3. Publican a las 19:00 CET (hora optima ES)        │
│    4. No usan Spark Ads en TikTok — oportunidad        │
│                                                         │
│ [Crear contenido similar] [Exportar analisis]           │
│ [Comparar con mi marca] [Monitorear semanalmente]       │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Modulo 5: Strategy Engine — Estrategia de Contenido IA

### 10.1 Capacidades

| Funcion | Detalle |
|---|---|
| **Calendario editorial** | Genera calendario mensual con tematicas, formatos y plataformas |
| **Content pillars** | Define pilares de contenido basados en marca + competencia + tendencias |
| **Trend integration** | Integra tendencias detectadas en el calendario automaticamente |
| **A/B test strategy** | Sugiere variantes de contenido para testing continuo |
| **Performance-based** | Ajusta la estrategia segun metricas reales de publicaciones anteriores |
| **Multi-platform** | Adapta la estrategia por plataforma (IG, TikTok, YouTube, LinkedIn, etc.) |
| **Brand voice** | Mantiene consistencia de tono y estilo en todo el contenido |

### 10.2 Flujo

```
1. Input: Brand guidelines + competidores + datos de rendimiento
2. Analisis: IA analiza competencia, tendencias, historico
3. Propuesta: Calendario editorial de 30 dias
4. Iteracion: Usuario ajusta tematicas, formatos, frecuencia
5. Generacion: ArbiStudio genera automaticamente cada pieza del calendario
6. Aprobacion: Preview de cada pieza antes de publicar
7. Publicacion: Automatica o manual segun preferencia
8. Optimizacion: Ajuste continuo basado en metricas
```

---

## 11. Experiencia de Usuario — Interfaz Conversacional

### 11.1 Layout principal

```
┌────────────────────────────────────────────────────────────────┐
│ ┌──────┐                              ArbiStudio         [⚙️] │
│ │ Logo │  [💬 Chat]  [📚 Library]  [📊 Campaigns]  [🔍 Intel] │
│ └──────┘                                                       │
├────────────────────────────┬───────────────────────────────────┤
│                            │                                   │
│  SIDEBAR                   │        MAIN AREA                  │
│                            │                                   │
│  Conversaciones            │  ┌─────────────────────────────┐ │
│                            │  │                              │ │
│  [+ Nueva]                 │  │     PREVIEW / CANVAS         │ │
│                            │  │                              │ │
│  📁 Campana Relojes        │  │     (Preview en tiempo       │ │
│  📁 Reels Marzo            │  │      real del contenido      │ │
│  📁 Competencia Q1         │  │      generado)               │ │
│  📁 Estrategia Abril       │  │                              │ │
│                            │  │                              │ │
│  ─────────────             │  └─────────────────────────────┘ │
│                            │                                   │
│  Proyectos                 │  ┌─────────────────────────────┐ │
│                            │  │                              │ │
│  🏢 Cliente A              │  │     CHAT AREA                │ │
│  🏢 Cliente B              │  │                              │ │
│  🏢 Arbi Capital           │  │  🤖 ArbiStudio:              │ │
│                            │  │  "He generado 3 variantes    │ │
│                            │  │   del anuncio..."            │ │
│                            │  │                              │ │
│                            │  │  ┌──────────────────────┐   │ │
│                            │  │  │ 📎 Subir archivo      │   │ │
│                            │  │  │ Escribe tu mensaje... │   │ │
│                            │  │  └──────────────────────┘   │ │
│                            │  └─────────────────────────────┘ │
└────────────────────────────┴───────────────────────────────────┘
```

### 11.2 Interacciones del chat

El chat soporta:

- **Texto libre**: Cualquier instruccion en lenguaje natural
- **Upload de archivos**: Imagenes (JPG, PNG, WebP), Videos (MP4, MOV), PDFs, URLs
- **Comandos rapidos**: `/image`, `/video`, `/analyze`, `/campaign`, `/strategy`
- **Inline previews**: Las imagenes y videos generados se muestran directamente en el chat
- **Acciones inline**: Botones de [Editar] [Variantes] [Publicar] [Descargar] en cada output
- **Referencias**: "@" para referenciar assets anteriores ("usa @imagen-reloj como base")
- **Contexto persistente**: ArbiStudio recuerda el proyecto, la marca, el historial completo

### 11.3 Principios de diseno

| Principio | Implementacion |
|---|---|
| **Velocidad** | Streaming de respuestas. Previews progresivos. Skeleton loaders. |
| **Feedback inmediato** | Cada accion tiene feedback visual instantaneo |
| **Previews interactivos** | Click para expandir, hover para opciones, drag para reordenar |
| **Dark mode first** | Interfaz oscura por defecto (como herramientas pro). Light mode disponible |
| **Responsive** | Desktop-first pero funcional en tablet. No mobile (es herramienta de trabajo) |
| **Shortcuts** | Cmd+K para busqueda global, Cmd+N nueva conversacion, Cmd+Enter enviar |
| **Accesibilidad** | WCAG 2.1 AA minimo |

### 11.4 Componentes UI clave

| Componente | Descripcion |
|---|---|
| **ChatPanel** | Area de conversacion con streaming, markdown, code blocks, inline media |
| **PreviewCanvas** | Canvas interactivo que muestra el asset en formato real con controles de zoom, formato |
| **FormatSwitcher** | Toggle para cambiar entre formatos (1:1, 4:5, 9:16, 16:9) con preview en vivo |
| **AssetCard** | Tarjeta de asset con thumbnail, tipo, estado, acciones rapidas |
| **CampaignBuilder** | Panel lateral para construir campanas paso a paso |
| **CompetitorGrid** | Grid de resultados de analisis de competencia con previews |
| **CalendarView** | Vista de calendario editorial con drag & drop |
| **RenderProgress** | Barra de progreso con estimacion de tiempo para renders de video |
| **MediaUploader** | Drag & drop de archivos con preview inmediato |
| **ExportPanel** | Panel de exportacion con opciones de formato, calidad, destino |

---

## 12. Sistema de Formatos y Canvas Multi-Plataforma

### 12.1 Motor de formatos

ArbiStudio maneja un sistema de formatos que automaticamente adapta cualquier asset a multiples plataformas:

```typescript
const PLATFORM_FORMATS = {
  instagram: {
    feed_square: { width: 1080, height: 1080, ratio: '1:1', label: 'Feed Cuadrado' },
    feed_portrait: { width: 1080, height: 1350, ratio: '4:5', label: 'Feed Vertical' },
    stories: { width: 1080, height: 1920, ratio: '9:16', label: 'Stories/Reels' },
    carousel: { width: 1080, height: 1080, ratio: '1:1', label: 'Carousel', maxSlides: 10 },
  },
  facebook: {
    feed: { width: 1200, height: 628, ratio: '1.91:1', label: 'Feed' },
    feed_square: { width: 1080, height: 1080, ratio: '1:1', label: 'Feed Cuadrado' },
    stories: { width: 1080, height: 1920, ratio: '9:16', label: 'Stories' },
    cover: { width: 820, height: 312, ratio: '2.63:1', label: 'Cover' },
  },
  tiktok: {
    feed: { width: 1080, height: 1920, ratio: '9:16', label: 'In-Feed' },
  },
  youtube: {
    video: { width: 1920, height: 1080, ratio: '16:9', label: 'Video' },
    shorts: { width: 1080, height: 1920, ratio: '9:16', label: 'Shorts' },
    thumbnail: { width: 1280, height: 720, ratio: '16:9', label: 'Thumbnail' },
  },
  linkedin: {
    feed: { width: 1200, height: 627, ratio: '1.91:1', label: 'Feed' },
    feed_square: { width: 1080, height: 1080, ratio: '1:1', label: 'Feed Cuadrado' },
  },
  x_twitter: {
    feed: { width: 1600, height: 900, ratio: '16:9', label: 'Feed' },
    feed_square: { width: 1080, height: 1080, ratio: '1:1', label: 'Cuadrado' },
  },
  google_ads: {
    responsive_display: [
      { width: 1200, height: 628, ratio: '1.91:1', label: 'Landscape' },
      { width: 1080, height: 1080, ratio: '1:1', label: 'Square' },
      { width: 300, height: 250, label: 'Medium Rectangle' },
      { width: 728, height: 90, label: 'Leaderboard' },
      { width: 160, height: 600, label: 'Skyscraper' },
    ],
  },
  pinterest: {
    pin: { width: 1000, height: 1500, ratio: '2:3', label: 'Pin' },
    pin_square: { width: 1000, height: 1000, ratio: '1:1', label: 'Pin Cuadrado' },
  },
} as const;
```

### 12.2 Smart reformatting

Cuando el usuario genera una imagen en un formato, ArbiStudio puede automaticamente generar las versiones para otros formatos:

- **Crop inteligente**: Detecta el sujeto principal y recorta sin perder informacion clave
- **Outpainting**: Si el formato destino es mas ancho/alto, usa IA para extender la imagen
- **Recomposicion**: Ajusta la posicion de texto y elementos graficos por formato
- **Aspect-aware generation**: Si se seleccionan multiples formatos antes de generar, cada formato se genera nativamente (no recortado de uno original)

---

## 13. AI Copilot — Asistente Creativo Inteligente *(NUEVO v1.1)*

Inspirado en Higgsfield Assist (GPT-5). ArbiStudio tiene un copilot integrado que potencia la creatividad del usuario.

### 13.1 Capacidades del Copilot

| Funcion | Detalle |
|---|---|
| **Prompt engineering** | El usuario describe vagamente lo que quiere. El copilot genera el prompt optimizado para el modelo seleccionado |
| **Script generation** | Genera guiones completos para videos con hook, desarrollo, CTA, indicaciones de camara |
| **Storyboard automatico** | A partir de un brief, genera un storyboard visual con keyframes |
| **Sugerencias de mejora** | Analiza el asset generado y sugiere mejoras concretas |
| **Brand voice adaptation** | Adapta cualquier copy al tono de marca del proyecto |
| **Competitive insights** | Sugiere ideas basadas en lo que funciona en competidores analizados |
| **Platform optimization** | Sugiere ajustes especificos por plataforma (IG vs TikTok vs YouTube) |

### 13.2 Implementacion

El Copilot es el propio sistema de chat de ArbiStudio, potenciado con:

- **Claude 4 Sonnet** como modelo principal (razonamiento, estrategia, copy en espanol)
- **System prompt** inyectado con: brand guidelines del proyecto, historico de assets, metricas de rendimiento, analisis de competidores
- **Tool calling** via Vercel AI SDK: el copilot puede invocar herramientas de generacion, scraping, publicacion directamente

### 13.3 Ejemplo de flujo

```
USUARIO: "Necesito contenido para promocionar un webinar de marketing digital"

COPILOT: Entendido. Basandome en tu marca y en lo que funciona en tu sector, 
te propongo esta estrategia de contenido:

📋 PLAN DE CONTENIDO — Webinar Marketing Digital

PRE-EVENTO (7 dias antes):
- 3 posts teaser (carrusel countdown, video hook, imagen CTA)
- 2 stories/dia con stickers de cuenta atras
- 1 reel de 30s "3 cosas que aprenderas"

DIA DEL EVENTO:
- 1 post recordatorio (imagen)
- 3-5 stories en directo
- 1 anuncio de ultima hora en Meta Ads

POST-EVENTO:
- 5 clips del webinar para reels/shorts
- 1 carrusel resumen "5 takeaways"
- 1 email sequence de follow-up

¿Quieres que genere todo esto ahora? Puedo empezar por los teasers.

USUARIO: "Si, empieza por los teasers"

COPILOT: [Genera 3 piezas con preview, copy, y formatos adaptados]
```

---

## 14. Storyboard & Keyframes IA *(NUEVO v1.1)*

Herramienta de planificacion visual para videos multi-shot antes de comprometer creditos de generacion.

### 14.1 Flujo

```
1. BRIEF: Usuario describe el video que quiere
2. STORYBOARD: ArbiStudio genera 4-12 keyframes como bocetos visuales
3. REVISION: Usuario reordena, edita, elimina, anade shots
4. GENERACION: Una vez aprobado, cada keyframe se genera como clip de video
5. COMPOSICION: Los clips se unen automaticamente con transiciones
```

### 14.2 Formato del storyboard

Cada keyframe incluye:
- **Thumbnail visual** (imagen boceto generada con modelo rapido)
- **Descripcion de la toma** (que pasa en la escena)
- **Tipo de plano** (Close-up, Medium, Wide, Aerial, POV)
- **Movimiento de camara** (seleccionado de Cinema Studio presets)
- **Duracion estimada** (2-10 segundos)
- **Audio/musica** sugerida
- **Texto overlay** si aplica

### 14.3 UX

```
USUARIO: "Haz un storyboard para un video de 30s de producto para un perfume de lujo"

ARBISTUDIO:
┌──────────────────────────────────────────────────────────────┐
│ Storyboard — "Perfume de Lujo" (30s)                        │
│                                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ │ Shot 1  │ │ Shot 2  │ │ Shot 3  │ │ Shot 4  │ │ Shot 5 ││
│ │ [thumb] │ │ [thumb] │ │ [thumb] │ │ [thumb] │ │ [thumb]││
│ │ 3s      │ │ 5s      │ │ 8s      │ │ 7s      │ │ 7s     ││
│ │ Extreme │ │ Slow    │ │ Medium  │ │ Close   │ │ Wide   ││
│ │ close-up│ │ dolly   │ │ model   │ │ spray   │ │ product││
│ │ botella │ │ reveal  │ │ usando  │ │ detail  │ │ + logo ││
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘│
│                                                              │
│ Total: 30s | 5 shots | Musica: Ambiental elegante           │
│                                                              │
│ [↔ Reordenar] [+ Anadir shot] [✏️ Editar shot]              │
│ [🎬 Generar video completo] [💾 Guardar storyboard]          │
└──────────────────────────────────────────────────────────────┘
```

---

## 15. Asset Management y Libreria de Medios

### 13.1 Organizacion

```
Libreria
├── Por proyecto
│   ├── Cliente A
│   │   ├── Campana Q1 2026
│   │   │   ├── Imagenes (15)
│   │   │   ├── Videos (8)
│   │   │   └── Audios (3)
│   │   └── Organico Abril
│   │       ├── Reels (12)
│   │       └── Posts (20)
│   └── Arbi Capital
│       └── ...
├── Por tipo
│   ├── Imagenes
│   ├── Videos
│   ├── Audios
│   └── Templates
├── Por plataforma
│   ├── Instagram
│   ├── TikTok
│   ├── YouTube
│   └── ...
└── Busqueda inteligente (por prompt, fecha, tipo, rendimiento)
```

### 13.2 Almacenamiento

- **Supabase Storage** para todos los assets
- **Buckets separados** por organizacion (multi-tenant)
- **Thumbnails auto-generados** para previews rapidos
- **CDN edge caching** via Supabase/Vercel
- **Limites por plan**: Free (5GB), Pro (50GB), Agency (500GB)

---

## 14. Integraciones API Completas

### 14.1 Resumen de todas las APIs

| Categoria | API | Uso |
|---|---|---|
| **IA Imagen** | fal.ai (Flux, SDXL, Ideogram, Recraft) | Generacion principal |
| **IA Imagen** | Google Gemini (3.1 Flash, 3 Pro) | 4K, text rendering |
| **IA Imagen** | Replicate (SDXL fine-tuned, ControlNet) | Estilos custom |
| **IA Video** | fal.ai (Kling, Runway, Pika, Wan) | Generacion de video |
| **Video Render** | Remotion 5 | Composicion y render |
| **Video Process** | FFmpeg (WASM) | Procesamiento local |
| **Transcripcion** | OpenAI Whisper | Subtitulos |
| **Transcripcion** | Deepgram Nova 2 | Real-time ASR |
| **Voz** | ElevenLabs Multilingual v2 | Voiceover |
| **Musica** | Suno v4 | Generacion de musica |
| **LLM** | Anthropic Claude 4 Sonnet | Razonamiento, estrategia, copy |
| **LLM** | OpenAI GPT-4o | Structured outputs, vision |
| **LLM** | Google Gemini 2.5 Pro | Contexto largo, multimedia |
| **Ads** | Meta Marketing API v21 | Campanas FB + IG |
| **Ads** | Google Ads API v17 | Search, Display, YouTube |
| **Ads** | TikTok Marketing API v1.3 | In-Feed, TopView, Spark |
| **Social** | Instagram Graph API | Publicacion organica |
| **Social** | YouTube Data API v3 | Videos, Shorts |
| **Social** | TikTok Content Posting API | Videos directos |
| **Social** | LinkedIn Marketing API v2 | Posts, videos |
| **Social** | X API v2 | Posts |
| **Scraping** | Firecrawl | Deep web scraping |
| **Scraping** | Apify | Social media scraping |
| **Scraping** | Cheerio | HTML parsing |
| **Auth** | Supabase Auth | SSO, email, social login |
| **DB** | Supabase Postgres | Datos principales |
| **Storage** | Supabase Storage | Assets |
| **Realtime** | Supabase Realtime | Progreso, colaboracion |
| **Queue** | BullMQ (Upstash Redis) | Jobs de render/generacion |
| **Payments** | Whop | Suscripciones |
| **Analytics** | Vercel Analytics | Web analytics |
| **Monitoring** | Sentry | Error tracking |

---

## 15. Meta Developer App — Guia Completa

### 15.1 Prerequisitos

1. **Facebook Business Manager** activo (business.facebook.com)
2. **Pagina de Facebook** conectada al Business Manager
3. **Cuenta de Instagram Business** conectada a la pagina
4. **Cuenta publicitaria de Meta** verificada

### 15.2 Paso a paso de creacion

```
1. developers.facebook.com → "My Apps" → "Create App"
2. Tipo: "Business" (Other → Business)
3. Nombre: "ArbiStudio"
4. Contact email: arbicapitaluae@gmail.com
5. Business Manager: Seleccionar el de Arbi Capital

6. Agregar productos:
   a) Facebook Login for Business
      - OAuth redirect URI: https://arbistudio.vercel.app/api/auth/callback/meta
      - Scopes solicitados (ver seccion 8.1.2)
   
   b) Marketing API
      - System User: crear usuario de sistema con permisos de admin
      - Token: generar long-lived access token
   
   c) Instagram Basic Display → Instagram Graph API
      - Webhook URL: https://arbistudio.vercel.app/api/webhooks/instagram

7. Configuracion de la app:
   - Privacy Policy URL: https://arbistudio.vercel.app/privacy
   - Terms of Service URL: https://arbistudio.vercel.app/terms
   - App Domains: arbistudio.vercel.app
   - Site URL: https://arbistudio.vercel.app
   - Deauthorize callback URL: https://arbistudio.vercel.app/api/auth/deauthorize/meta
   - Data Deletion Request URL: https://arbistudio.vercel.app/api/data-deletion/meta

8. Para uso interno (sin App Review):
   - Agregar a los usuarios del equipo como "Testers" en la app
   - Cada tester acepta la invitacion desde su cuenta de Facebook
   - Limitado a 25 testers en modo desarrollo
```

### 15.3 Implementacion en codigo

```typescript
// packages/ads/meta/client.ts
import { FacebookAdsApi, AdAccount, Campaign, AdSet, Ad, AdCreative } from 'facebook-nodejs-business-sdk';

export class MetaAdsClient {
  private api: FacebookAdsApi;
  private adAccountId: string;

  constructor(accessToken: string, adAccountId: string) {
    this.api = FacebookAdsApi.init(accessToken);
    this.adAccountId = `act_${adAccountId}`;
  }

  // Crear campana completa
  async createCampaign(params: {
    name: string;
    objective: 'OUTCOME_AWARENESS' | 'OUTCOME_TRAFFIC' | 'OUTCOME_ENGAGEMENT' | 'OUTCOME_LEADS' | 'OUTCOME_SALES';
    dailyBudget: number;
    targeting: MetaTargeting;
    creative: { imageUrl?: string; videoUrl?: string; headline: string; primaryText: string; cta: string; };
  }) {
    // 1. Crear campana
    const campaign = await new AdAccount(this.adAccountId).createCampaign([], {
      name: params.name,
      objective: params.objective,
      status: 'PAUSED', // Siempre pausada hasta aprobacion del usuario
      special_ad_categories: [],
    });

    // 2. Crear ad set con targeting
    const adSet = await new AdAccount(this.adAccountId).createAdSet([], {
      name: `${params.name} - Ad Set`,
      campaign_id: campaign.id,
      daily_budget: params.dailyBudget * 100, // centimos
      billing_event: 'IMPRESSIONS',
      optimization_goal: this.objectiveToGoal(params.objective),
      targeting: params.targeting,
      status: 'PAUSED',
    });

    // 3. Subir creative
    let imageHash: string | undefined;
    if (params.creative.imageUrl) {
      const image = await new AdAccount(this.adAccountId).createAdImage([], {
        filename: params.creative.imageUrl,
      });
      imageHash = image.hash;
    }

    // 4. Crear ad creative
    const creative = await new AdAccount(this.adAccountId).createAdCreative([], {
      name: `${params.name} - Creative`,
      object_story_spec: {
        page_id: this.pageId,
        link_data: {
          image_hash: imageHash,
          link: params.creative.linkUrl,
          message: params.creative.primaryText,
          name: params.creative.headline,
          call_to_action: { type: params.creative.cta },
        },
      },
    });

    // 5. Crear ad
    const ad = await new AdAccount(this.adAccountId).createAd([], {
      name: `${params.name} - Ad`,
      adset_id: adSet.id,
      creative: { creative_id: creative.id },
      status: 'PAUSED',
    });

    return { campaign, adSet, creative, ad };
  }
}
```

---

## 16. Infraestructura y Deploy

### 16.1 Entornos

| Entorno | URL | Descripcion |
|---|---|---|
| Development | localhost:3000 | Desarrollo local |
| Preview | arbistudio-*.vercel.app | Preview per-branch |
| Staging | staging.arbistudio.com | Pre-produccion |
| Production | app.arbistudio.com | Produccion |

### 16.2 Servicios externos

| Servicio | Uso | Cuenta |
|---|---|---|
| Vercel | Deploy + Edge Functions | vercel-arbi |
| Supabase | DB + Auth + Storage + Realtime | supabase-arbi |
| Upstash | Redis (BullMQ queue) | Nueva cuenta |
| fal.ai | IA generativa (imagen + video) | Nueva cuenta |
| Replicate | Modelos custom | Nueva cuenta |
| OpenAI | Whisper + GPT-4o | Existente o nueva |
| Anthropic | Claude 4 Sonnet | Existente |
| Google Cloud | Gemini + Ads API | Nueva |
| ElevenLabs | Voz | Nueva cuenta |
| Sentry | Error tracking | Nueva o existente |

### 16.3 Video render

El render de video con Remotion necesita mas recursos que un edge function. Opciones:

1. **Remotion Lambda** (recomendado para produccion): Render distribuido en AWS Lambda. Hasta 4K. Pago por uso.
2. **Remotion Cloud Run**: Alternativa en GCP.
3. **Self-hosted render server**: Para desarrollo y testing.

---

## 17. Seguridad y Privacidad

| Medida | Implementacion |
|---|---|
| Auth | Supabase Auth con email + Google SSO |
| Row Level Security | Activado en todas las tablas. Cada org ve solo sus datos |
| Tokens de API | Encriptados en DB. Nunca expuestos al frontend |
| HTTPS | Forzado en Vercel |
| CSP | Content Security Policy configurado |
| Rate limiting | Upstash Ratelimit en API routes |
| GDPR | Endpoints de data export y deletion |
| SOC 2 | Preparado para auditoria (Supabase + Vercel son SOC 2) |

---

## 18. Monetizacion (Whop)

### 18.1 Planes

| Plan | Precio | Limites |
|---|---|---|
| **Free** | 0€/mes | 50 generaciones de imagen, 5 videos, sin ads connection, 5GB storage |
| **Pro** | 49€/mes | 500 generaciones, 50 videos, 1 plataforma de ads, 50GB, 1 proyecto |
| **Agency** | 149€/mes | Generaciones ilimitadas, videos ilimitados, todas las plataformas, 500GB, proyectos ilimitados, 5 miembros |
| **Enterprise** | Custom | White-label, API access, SLA, soporte dedicado |

### 18.2 Integracion con Whop

- Checkout y billing via Whop
- Webhooks de Whop para activar/desactivar features
- Portal de facturacion embebido
- Metricas de MRR en dashboard interno

---

## 19. Recursos Existentes Reutilizados

### 19.1 De la coleccion ArbiCapital

| Recurso | Que reutilizamos | Como |
|---|---|---|
| **editor-pro-max** | 25 componentes Remotion, 10 templates, pipeline de video | Fork directo como base de `apps/video-worker` |
| **nanobanana-mcp-server** | Integracion Gemini para generacion de imagenes 4K | Adaptar como provider en `packages/ai/providers/gemini.ts` |
| **anthropic-sdk-typescript** | SDK oficial de Anthropic | Dependencia directa |
| **anthropic-cookbook** | Patrones de tool-use, streaming | Referencia de implementacion |
| **marketingskills** | Skills de ad-creative y content-strategy | Integrar como system prompts |
| **agency-agents** | Patrones de orquestacion de agentes | Referencia de arquitectura |
| **ai-website-cloner-template** | Scraping de landing pages | Adaptar para competitor intel |

### 19.2 Repos publicos de GitHub reutilizables *(NUEVO v1.1)*

| Repo | Stars | Que aporta | Uso en ArbiStudio |
|---|---|---|---|
| **Anil-matcha/Open-Generative-AI** | 4,540 | Alternativa open-source a Higgsfield. 20+ modelos. ⚠️ SIN LICENCIA — all rights reserved. | **Solo referencia visual/conceptual**. NO copiar codigo. Inspiracion de UI para generacion multi-modelo. |
| **higgsfield-ai/higgsfield** | 3,575 | GPU orchestration framework oficial de Higgsfield. Training de modelos a escala. | **Referencia** para entender su infra. No usar directamente (es para training, no inference). |
| **higgsfield-ai/higgsfield-client** | 32 | Python SDK oficial de Higgsfield API | **Opcional**: integrar como provider adicional de video/imagen si se decide usar Higgsfield como backend |
| **higgsfield-ai/higgsfield-js** | 15 | Node.js/TypeScript SDK oficial de Higgsfield | **Opcional**: misma integracion pero para nuestro stack TS |
| **OSideMedia/higgsfield-ai-prompt-skill** | 16 | Claude skill para prompts cinematograficos de Higgsfield. MCSLA formula, Soul ID, Cinema Studio 2.5, 10 templates de genero | **MUY UTIL**: Instalar como skill. Contiene la formula de prompt engineering cinematografico que podemos adaptar para nuestro Cinema Studio |
| **beshuaxian/higgsfield-seedance2-jineng** | 28 | 15 Claude prompt skills para video IA. Framework de hook de 2 segundos, enciclopedia de camara, prompts de produccion | **MUY UTIL**: Templates de prompts cinematograficos para video generation |
| **geopopos/higgsfield_ai_mcp** | 13 | MCP server para Higgsfield AI | **Opcional**: si queremos usar Higgsfield como provider adicional via MCP |
| **Anil-matcha/Open-Higgsfield-Popcorn** | 16 | Implementacion open-source del generador de storyboards de Higgsfield | **UTIL**: Base para nuestro modulo de Storyboard & Keyframes |
| **OpenTalker/SadTalker** | 13,721 | CVPR 2023. Lip sync realista 3D desde una sola imagen + audio | **CRITICO**: Motor principal para Lipsync Studio. Disponible en Replicate como API. |
| **Kedreamix/Linly-Talker** | 3,246 | Sistema completo de avatar digital conversacional. Whisper + LLM + SadTalker | **Referencia** para el flujo completo de talking head con IA |
| **Zz-ww/SadTalker-Video-Lip-Sync** | 2,011 | Lip sync sobre video (no solo imagen). DAIN interpolacion para fluidez | **UTIL**: Para lip sync sobre video existente (no solo avatar generado) |
| **clawnify/open-studio** | 3 | Alternativa open-source a Higgsfield. Preact + Tailwind + Hono + SQLite. Gallery justificada + workflows de nodos | **Referencia** de UI para galeria de assets |

### 19.3 Skills reutilizadas

| Skill | Uso en ArbiStudio |
|---|---|
| `fal-generate` + `fal-image-edit` + `fal-workflow` | Patron de integracion con fal.ai |
| `remotion` + `remotion-best-practices` | Buenas practicas de composicion de video |
| `videodb` + `videodb-skills` | Indexacion y busqueda en video |
| `ad-creative` | System prompt para generacion de ad copy |
| `content-creator` + `content-strategy` | System prompts para estrategia de contenido |
| `social-orchestrator` | Patron de publicacion cross-platform |
| `instagram-automation` + `tiktok-automation` + `youtube-automation` | Patrones de publicacion por plataforma |
| `web-scraper` + `firecrawl-scraper` + `x-twitter-scraper` | Scraping de competencia |
| `paid-ads` | System prompt para creacion de campanas |
| `seek-and-analyze-video` | Analisis de video de competidores |

---

## 20. Roadmap de Desarrollo

### Fase 0 — Setup (Semana 1)

- [ ] Crear repo `ArbiCapital/ArbiStudio`
- [ ] Setup Turborepo monorepo
- [ ] Setup Next.js 15 con App Router
- [ ] Setup Supabase project (supabase-arbi)
- [ ] Setup shadcn/ui + Tailwind CSS v4
- [ ] Configurar variables de entorno
- [ ] Crear Meta Developer App (modo desarrollo)
- [ ] Fork y adaptar editor-pro-max como video-worker

### Fase 1 — Core Chat + Image Studio (Semanas 2-5)

- [ ] Chat UI con Vercel AI SDK (streaming)
- [ ] AI Copilot con Claude 4 Sonnet (system prompts, tool calling)
- [ ] Integracion fal.ai (Flux Pro, Ideogram, Recraft)
- [ ] Integracion Gemini (NanoBanana — imagen 4K)
- [ ] Routing inteligente de modelos por tipo de imagen
- [ ] Sistema de formatos multi-plataforma con FormatSwitcher
- [ ] Preview en tiempo real de imagenes generadas
- [ ] Image-to-image, inpainting, upscaling, background removal
- [ ] Batch generation (multiples variantes para A/B testing)
- [ ] Soul Builder — creacion de personajes con IP-Adapter
- [ ] Brand Identity System (colores, logo overlay, estilo persistente)
- [ ] Asset library basica (upload, organize, search)
- [ ] Auth con Supabase (email + Google SSO)

### Fase 2 — Video Studio + Cinema Studio (Semanas 6-10)

- [ ] Integracion video IA (Kling 3.0, Runway Gen-3, Pika 2.0 via fal.ai)
- [ ] Pipeline de video (analisis, transcripcion, silencios)
- [ ] Subtitulos automaticos con Whisper (5 estilos TikTok)
- [ ] Templates de video (TikTok, Reel, Short, Presentation, etc.)
- [ ] Motion graphics (AnimatedTitle, LowerThird, CTA, ProgressBar)
- [ ] Musica de fondo (libreria curada + Suno)
- [ ] Voiceover con ElevenLabs (multilingual)
- [ ] Render server con Remotion Lambda
- [ ] Multi-format video export automatico
- [ ] **Cinema Studio** — 30+ camera presets, controles de lente/apertura
- [ ] **Color grading** post-generacion (temperatura, contraste, grain, LUTs)
- [ ] **Storyboard & Keyframes** — planificacion visual pre-generacion
- [ ] **Lipsync Studio** — talking head con SadTalker + ElevenLabs
- [ ] **Face swap** — InsightFace via Replicate

### Fase 3 — Click-to-Ad + Ads Hub (Semanas 11-14)

- [ ] **Click-to-Ad** — URL → scraping → analisis → generacion → publicacion
- [ ] Conexion Meta Marketing API (OAuth, campanas, creatives, metrics)
- [ ] Crear campanas completas desde el chat
- [ ] Subir creatividades a Meta Ads automaticamente
- [ ] Publicacion organica en Instagram (Graph API)
- [ ] Conexion Google Ads API (campanas, assets, reports)
- [ ] Conexion TikTok Marketing API (campanas, videos)
- [ ] Dashboard de metricas de rendimiento
- [ ] Programacion de publicaciones (Buffer-like)
- [ ] Publicacion en YouTube, LinkedIn, X

### Fase 4 — Competitor Intel + Strategy (Semanas 15-18)

- [ ] Scraping de Meta Ad Library (Firecrawl + parsing)
- [ ] Scraping de Google Ads Transparency Center
- [ ] Scraping de TikTok Creative Center
- [ ] Scraping de perfiles sociales publicos (Apify)
- [ ] Analisis IA de competencia con insights accionables
- [ ] Scraping de landing pages
- [ ] Estrategia de contenido generada por IA
- [ ] Calendario editorial interactivo con drag & drop
- [ ] Deteccion de tendencias en tiempo real
- [ ] Sugerencias automaticas basadas en competencia + tendencias

### Fase 5 — Polish + Launch (Semanas 19-22)

- [ ] Integracion Whop (billing, plans, webhooks)
- [ ] Onboarding flow interactivo
- [ ] Dark mode refinado + animaciones de calidad
- [ ] Performance optimization (lazy loading, image optimization, edge caching)
- [ ] Error handling completo + Sentry
- [ ] Rate limiting + proteccion de API keys
- [ ] Documentacion de usuario
- [ ] Landing page de producto (arbistudio.com)
- [ ] Beta testing con equipo Arbi Capital
- [ ] Launch interno
- [ ] Preparar App Review de Meta (para acceso publico)
- [ ] Publicacion en Product Hunt (opcional)

---

## 21. Metricas de Exito

### 21.1 Metricas de producto

| Metrica | Target (Mes 3) | Target (Mes 6) |
|---|---|---|
| Assets generados/dia | 100+ | 500+ |
| Tiempo medio de generacion (imagen) | < 15s | < 10s |
| Tiempo medio de generacion (video) | < 3min | < 2min |
| Tasa de aprobacion primera iteracion | > 60% | > 75% |
| Campanas publicadas via ArbiStudio | 10/semana | 50/semana |
| Usuarios activos diarios | 5 (interno) | 50+ (con clientes) |

### 21.2 Metricas de negocio

| Metrica | Target |
|---|---|
| Reduccion de tiempo de produccion | -80% vs proceso manual |
| Coste por asset | < 0.50€ vs 20-50€ con disenador |
| ROAS de campanas creadas con ArbiStudio | > 3x |
| MRR (tras comercializacion) | 10K€ en mes 6 |

---

## 22. Gestion de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|---|---|---|---|
| APIs de IA cambian precios drasticamente | Media | Alto | Multi-provider. Si fal.ai sube, se rota a Replicate o Google |
| App Review de Meta rechazada | Baja | Medio | Usar en modo desarrollo primero. Documentar todo bien |
| Calidad de imagen no suficiente | Baja | Alto | Multi-modelo con routing inteligente. El usuario elige el modelo |
| Render de video lento | Media | Medio | Remotion Lambda para render distribuido. Queue con prioridades |
| Competidores lanzan producto similar | Alta | Medio | Velocidad de ejecucion. Enfoque en nicho (performance marketing ES) |
| Limites de rate de APIs de social | Media | Medio | Caching agresivo. Retry con backoff. Multiples tokens |
| Costes de IA generativa altos | Media | Alto | Limites por plan. Caching de generaciones similares. Modelos small para drafts |

---

## Apendice A — Variables de Entorno

```env
# App
NEXT_PUBLIC_APP_URL=https://app.arbistudio.com
NEXT_PUBLIC_APP_NAME=ArbiStudio

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
FAL_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
REPLICATE_API_TOKEN=
ELEVENLABS_API_KEY=

# Meta
META_APP_ID=
META_APP_SECRET=
META_SYSTEM_USER_TOKEN=

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=

# TikTok
TIKTOK_APP_ID=
TIKTOK_APP_SECRET=

# Queue
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Whop
WHOP_API_KEY=
WHOP_WEBHOOK_SECRET=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

---

## Apendice B — Benchmark Detallado vs Higgsfield *(NUEVO v1.1)*

### B.1 Higgsfield: lo que hacen bien (y copiamos/mejoramos)

| Feature Higgsfield | Como lo implementa ArbiStudio | Ventaja ArbiStudio |
|---|---|---|
| **Cinema Studio** (70+ camera presets, optica real) | Cinema Studio module con 30+ presets via Remotion + prompt engineering para modelos de video | Igual calidad + integrado con workflow de ads |
| **Soul 2.0** (imagen sin "plastificado IA") | Multi-modelo routing (Flux Pro para realismo, Gemini 4K para detalle, Ideogram para texto) | Mas modelos = mas versatilidad por caso de uso |
| **Soul Cast** (14 generos, 12 arquetipos) | Soul Builder con IP-Adapter + LoRA custom training | Personajes usables en imagen Y video, no solo imagen |
| **Soul ID** (consistencia cross-shot) | Face embedding 512D + conditioning cross-model | Misma capacidad |
| **Click-to-Ad** (URL → video ad) | Click-to-Ad con scraping profundo + Ad Library + multi-plataforma + publicacion directa | **MUY SUPERIOR** — Higgsfield solo genera el video. ArbiStudio lo publica. |
| **Lipsync Studio** (talking head + emociones) | ElevenLabs + SadTalker/Wav2Lip + face swap | Igual + traduccion multi-idioma + publicacion |
| **Color grading sin re-render** | CSS filters + WebGL shaders en preview, FFmpeg en export | Igual |
| **Multi-modelo** (15+ modelos, 1 workspace) | fal.ai (10+ modelos) + Gemini + Replicate | Comparable, mas enfocado en marketing |
| **AI Copilot** (GPT-5) | Claude 4 Sonnet con tool calling + brand context | **Superior** — el copilot tiene contexto de marca, competencia, metricas |
| **Keyframes** (storyboard) | Storyboard module con previews visuales + generacion batch | Igual |
| **DOP model** (biomecanica humana) | Kling 3.0 (mejor movimiento humano actual) via fal.ai | Comparable |
| **Face Swap** | InsightFace via Replicate | Comparable |

### B.2 Lo que Higgsfield NO tiene (y ArbiStudio SI)

| Capacidad exclusiva ArbiStudio | Impacto |
|---|---|
| **Publicacion directa en Meta/Google/TikTok Ads** | De idea a campana activa sin salir de la app |
| **Publicacion organica** en IG, TikTok, YouTube, LinkedIn, X | Content creation to publishing en un flujo |
| **Scraping de Ad Library** + analisis de competencia | Data-driven creativity |
| **Estrategia de contenido IA** con calendario editorial | Planificacion a largo plazo, no solo piezas sueltas |
| **Multi-tenant / multi-proyecto** | Agencias con multiples clientes |
| **Billing por suscripcion** (Whop) vs creditos | Mas predecible para el usuario, mas rentable |
| **Auto-subtitulos editables** (5 estilos TikTok) | Edicion de video post-produccion completa |
| **Motion graphics** (Remotion) | Titulos animados, lower thirds, CTAs, barras de progreso |
| **Pipeline de video** (cortes, silencios, reformat) | Edicion real de metraje existente, no solo generacion |

### B.3 Modelos IA — Comparativa de calidad

| Capacidad | Higgsfield usa | ArbiStudio usa | Notas |
|---|---|---|---|
| Imagen realista | Soul 2.0 (propietario) | Flux 1.1 Pro (fal.ai) | Flux Pro es el mejor modelo open de 2026 |
| Imagen 4K | Soul Cinema | Gemini 3.1 Flash Image | Google Gemini tiene 4K nativo + grounding |
| Texto en imagen | Soul 2.0 | Ideogram v3 | Ideogram es el mejor para tipografia |
| Video realista | Kling 3.0, Sora 2, Veo 3.1 | Kling 3.0, Runway Gen-3, Pika 2.0 (via fal.ai) | Acceso a los mismos modelos top via fal.ai |
| Video cinematografico | DOP (propietario) | Kling 3.0 + Cinema Studio presets | DOP es propietario, pero Kling 3.0 es comparable |
| Voz | No especificado | ElevenLabs Multilingual v2 | ElevenLabs es el lider absoluto |
| Lip sync | Lipsync Studio (propietario) | SadTalker + Wav2Lip (via Replicate) | Open source de calidad comparable |

### B.4 Conclusion del benchmark

ArbiStudio no intenta ser un clon de Higgsfield. La propuesta es:

**"La calidad creativa de Higgsfield + el workflow completo de marketing que Higgsfield no tiene"**

Higgsfield es una herramienta de **creacion** pura. ArbiStudio es una herramienta de **creacion + distribucion + estrategia**. Un media buyer o content manager necesita las tres cosas. Hoy usa Higgsfield para crear + Meta Ads Manager para publicar + SEMrush para analizar + Notion para planificar. Con ArbiStudio, todo esta en un solo lugar.

---

**Documento preparado por ArbiStudio AI Team — Arbi Capital**
**Version 1.1 · Abril 2026**
**Benchmark: Higgsfield AI ($1.3B valuation)**
