import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const maxDuration = 120;

const VOICE_MAP: Record<string, string> = {
  "isabella-es": "LcfcDJNlP1WERjJ8eyKu",
  "carlos-es": "IKne3meq5aSn9XLyUdCD",
  "aria-en": "9BWtsMINqrJLrRacOk9x",
  "roger-en": "CwhRBWXzGAHq8TQ4Fs17",
};

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`lipsync:${getClientIp(req)}`, 3, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const { imageUrl, audioUrl, text, voiceId } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    let finalAudioUrl = audioUrl;

    // If no audioUrl provided, generate TTS first
    if (!finalAudioUrl) {
      if (!text) {
        return NextResponse.json(
          { error: "Either audioUrl or text is required" },
          { status: 400 }
        );
      }

      if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
      }

      const selectedVoice = VOICE_MAP[voiceId ?? ""] || voiceId || "LcfcDJNlP1WERjJ8eyKu";

      // Generate TTS audio via ElevenLabs
      const ttsResponse = await fetch(
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

      if (!ttsResponse.ok) {
        const err = await ttsResponse.text();
        return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 500 });
      }

      // Upload the audio to fal.ai storage so SadTalker can access it
      const audioBuffer = await ttsResponse.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioFile = new File([audioBlob], "tts-audio.mp3", { type: "audio/mpeg" });

      finalAudioUrl = await fal.storage.upload(audioFile);
    }

    // Call SadTalker via fal.ai
    const result = await fal.subscribe("fal-ai/sadtalker", {
      input: {
        source_image_url: imageUrl,
        driven_audio_url: finalAudioUrl,
        face_model_resolution: "512",
        expression_scale: 1,
        face_enhancer: "gfpgan",
        preprocess: "crop",
      },
    });

    const data = result.data as {
      video: { url: string; content_type: string; file_name: string; file_size: number };
    };

    if (!data?.video?.url) {
      return NextResponse.json(
        { error: "SadTalker did not return a video" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      video: {
        url: data.video.url,
        contentType: data.video.content_type,
        fileName: data.video.file_name,
        fileSize: data.video.file_size,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lip sync generation failed" },
      { status: 500 }
    );
  }
}
