import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const VOICE_MAP: Record<string, string> = {
  // ElevenLabs voice IDs — popular multilingual voices
  "isabella-es": "LcfcDJNlP1WERjJ8eyKu", // Isabella - Spanish female
  "carlos-es": "IKne3meq5aSn9XLyUdCD",   // Carlos - Spanish male
  "aria-en": "9BWtsMINqrJLrRacOk9x",      // Aria - English female
  "roger-en": "CwhRBWXzGAHq8TQ4Fs17",     // Roger - English male
};

export async function POST(req: NextRequest) {
  try {
    const { requireAuth, validateText } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`tts:${getClientIp(req)}`, 10, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
    }

    const { text, voiceId, language } = await req.json();

    const validation = validateText(text, 5000, "text");
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Resolve voice: check map first, then use as raw ElevenLabs ID (for custom voices)
    const selectedVoice = VOICE_MAP[voiceId] || voiceId || "LcfcDJNlP1WERjJ8eyKu";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 500 });
    }

    // Return audio as blob
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      audio: {
        base64: base64Audio,
        mimeType: "audio/mpeg",
        dataUrl: `data:audio/mpeg;base64,${base64Audio}`,
      },
      voice: selectedVoice,
      textLength: text.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS failed" },
      { status: 500 }
    );
  }
}
