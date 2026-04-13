export interface CameraPreset {
  id: string;
  name: string;
  category: "movement" | "effect" | "transition";
  description: string;
  promptModifier: string;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  // Movements
  { id: "dolly-in", name: "Dolly In", category: "movement", description: "Acercamiento suave hacia el sujeto", promptModifier: "smooth dolly in camera movement towards subject" },
  { id: "dolly-out", name: "Dolly Out", category: "movement", description: "Alejamiento suave del sujeto", promptModifier: "smooth dolly out camera movement away from subject" },
  { id: "dolly-zoom", name: "Dolly Zoom (Vertigo)", category: "effect", description: "Efecto vertigo — zoom in con dolly out", promptModifier: "dolly zoom vertigo effect, background stretches while subject stays same size" },
  { id: "pan-left", name: "Pan Left", category: "movement", description: "Panoramica hacia la izquierda", promptModifier: "smooth pan left camera movement" },
  { id: "pan-right", name: "Pan Right", category: "movement", description: "Panoramica hacia la derecha", promptModifier: "smooth pan right camera movement" },
  { id: "tilt-up", name: "Tilt Up", category: "movement", description: "Tilt ascendente", promptModifier: "camera tilting upward slowly" },
  { id: "tilt-down", name: "Tilt Down", category: "movement", description: "Tilt descendente", promptModifier: "camera tilting downward slowly" },
  { id: "orbit-360", name: "Orbit 360", category: "movement", description: "Rotacion completa alrededor del sujeto", promptModifier: "360 degree orbit rotation around subject, smooth circular camera movement" },
  { id: "crane-up", name: "Crane Up", category: "movement", description: "Movimiento de grua ascendente", promptModifier: "crane shot moving upward revealing the scene from above" },
  { id: "steadicam", name: "Steadicam Follow", category: "movement", description: "Seguimiento tipo steadicam", promptModifier: "steadicam following shot, smooth tracking movement" },
  { id: "handheld", name: "Handheld", category: "movement", description: "Camara en mano con ligero temblor", promptModifier: "handheld camera with subtle natural shake, documentary style" },
  // Effects
  { id: "bullet-time", name: "Bullet Time", category: "effect", description: "Rotacion 360 en camara lenta", promptModifier: "slow motion 360 rotation around frozen subject, Matrix bullet time effect" },
  { id: "crash-zoom", name: "Crash Zoom", category: "effect", description: "Zoom dramatico rapido", promptModifier: "sudden dramatic crash zoom into subject, fast push in" },
  { id: "whip-pan", name: "Whip Pan", category: "effect", description: "Pan ultra rapido con motion blur", promptModifier: "fast whip pan with motion blur between two subjects" },
  { id: "slow-reveal", name: "Slow Reveal", category: "effect", description: "Revelacion lenta del sujeto", promptModifier: "slow cinematic reveal, gradually unveiling the subject" },
  { id: "parallax", name: "Parallax", category: "effect", description: "Efecto de profundidad multi-capa", promptModifier: "parallax depth effect with layered foreground and background movement" },
  { id: "rack-focus", name: "Rack Focus", category: "effect", description: "Cambio de foco entre planos", promptModifier: "rack focus shifting from foreground to background subject" },
  { id: "bokeh-drift", name: "Bokeh Drift", category: "effect", description: "Luces desenfocadas flotando", promptModifier: "beautiful bokeh lights drifting in the background, shallow depth of field" },
  // Transitions
  { id: "fade-black", name: "Fade to Black", category: "transition", description: "Fundido a negro", promptModifier: "fade to black transition" },
  { id: "crossfade", name: "Crossfade", category: "transition", description: "Fundido cruzado entre escenas", promptModifier: "smooth crossfade transition between scenes" },
  { id: "wipe-left", name: "Wipe Left", category: "transition", description: "Transicion de barrido lateral", promptModifier: "wipe transition from right to left" },
];

export interface LensPreset {
  id: string;
  name: string;
  focalLength: number;
  type: "spherical" | "anamorphic" | "macro" | "fisheye" | "tilt-shift";
  aperture: string;
  promptModifier: string;
}

export const LENS_PRESETS: LensPreset[] = [
  { id: "24mm-wide", name: "24mm Wide", focalLength: 24, type: "spherical", aperture: "f/2.8", promptModifier: "24mm wide angle lens, deep depth of field" },
  { id: "35mm-standard", name: "35mm Standard", focalLength: 35, type: "spherical", aperture: "f/1.8", promptModifier: "35mm lens, natural perspective, shallow depth of field f/1.8" },
  { id: "50mm-portrait", name: "50mm Nifty Fifty", focalLength: 50, type: "spherical", aperture: "f/1.4", promptModifier: "50mm lens, portrait perspective, beautiful bokeh f/1.4" },
  { id: "85mm-portrait", name: "85mm Portrait", focalLength: 85, type: "spherical", aperture: "f/1.2", promptModifier: "85mm portrait lens, creamy bokeh, compressed background, f/1.2" },
  { id: "135mm-tele", name: "135mm Telephoto", focalLength: 135, type: "spherical", aperture: "f/2", promptModifier: "135mm telephoto lens, heavily compressed background, shallow DOF" },
  { id: "anamorphic-40", name: "40mm Anamorphic", focalLength: 40, type: "anamorphic", aperture: "f/2", promptModifier: "anamorphic lens, horizontal lens flares, oval bokeh, cinematic 2.39:1 feel" },
  { id: "macro-100", name: "100mm Macro", focalLength: 100, type: "macro", aperture: "f/2.8", promptModifier: "macro lens extreme close-up, incredible detail, razor thin depth of field" },
  { id: "fisheye-16", name: "16mm Fisheye", focalLength: 16, type: "fisheye", aperture: "f/2.8", promptModifier: "fisheye lens, barrel distortion, ultra wide 180 degree perspective" },
  { id: "tilt-shift", name: "Tilt-Shift", focalLength: 45, type: "tilt-shift", aperture: "f/2.8", promptModifier: "tilt-shift lens, miniature effect, selective focus plane" },
];

export interface ColorGradingPreset {
  id: string;
  name: string;
  cssFilter: string;
  settings: {
    temperature: number;
    contrast: number;
    saturation: number;
    grain: number;
    bloom: number;
    vignette: number;
  };
}

export const COLOR_GRADING_PRESETS: ColorGradingPreset[] = [
  { id: "none", name: "Original", cssFilter: "none", settings: { temperature: 0, contrast: 0, saturation: 0, grain: 0, bloom: 0, vignette: 0 } },
  { id: "cinematic", name: "Cinematic", cssFilter: "contrast(1.15) saturate(0.9) brightness(0.95) sepia(0.1)", settings: { temperature: 15, contrast: 20, saturation: -10, grain: 25, bloom: 10, vignette: 20 } },
  { id: "warm-vintage", name: "Warm Vintage", cssFilter: "sepia(0.3) contrast(1.1) saturate(0.8) brightness(1.05)", settings: { temperature: 30, contrast: 10, saturation: -20, grain: 40, bloom: 5, vignette: 30 } },
  { id: "cool-teal", name: "Cool Teal & Orange", cssFilter: "contrast(1.15) saturate(1.2) hue-rotate(-10deg)", settings: { temperature: -25, contrast: 15, saturation: 10, grain: 10, bloom: 0, vignette: 10 } },
  { id: "film-noir", name: "Film Noir", cssFilter: "grayscale(0.8) contrast(1.4) brightness(0.9)", settings: { temperature: -10, contrast: 40, saturation: -80, grain: 50, bloom: 0, vignette: 50 } },
  { id: "neon-nights", name: "Neon Nights", cssFilter: "contrast(1.3) saturate(1.5) brightness(0.9) hue-rotate(10deg)", settings: { temperature: -15, contrast: 30, saturation: 40, grain: 5, bloom: 40, vignette: 15 } },
  { id: "golden-hour", name: "Golden Hour", cssFilter: "sepia(0.2) contrast(1.05) saturate(1.15) brightness(1.1)", settings: { temperature: 40, contrast: 5, saturation: 15, grain: 15, bloom: 20, vignette: 10 } },
  { id: "arctic", name: "Arctic", cssFilter: "contrast(1.1) saturate(0.6) brightness(1.1) hue-rotate(200deg)", settings: { temperature: -40, contrast: 10, saturation: -40, grain: 10, bloom: 15, vignette: 5 } },
  { id: "moody-dark", name: "Moody Dark", cssFilter: "contrast(1.3) brightness(0.8) saturate(0.7)", settings: { temperature: -5, contrast: 35, saturation: -30, grain: 20, bloom: 0, vignette: 40 } },
  { id: "pastel-dream", name: "Pastel Dream", cssFilter: "contrast(0.9) saturate(0.7) brightness(1.15)", settings: { temperature: 10, contrast: -10, saturation: -30, grain: 0, bloom: 30, vignette: 0 } },
];
