import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

/**
 * Transcribe a video from URL using OpenAI Whisper.
 * Downloads the video, extracts audio, sends to Whisper API.
 */
export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`transcribe-url:${getClientIp(req)}`, 3, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const { videoUrl, language } = await req.json();
    if (!videoUrl) return NextResponse.json({ error: "videoUrl required" }, { status: 400 });

    // Step 1: Download the video
    const videoRes = await fetch(videoUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!videoRes.ok) {
      return NextResponse.json({ error: "Could not download video" }, { status: 400 });
    }

    const videoBlob = await videoRes.blob();

    // Check size (max 25MB for Whisper)
    if (videoBlob.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Video too large (max 25MB)" }, { status: 400 });
    }

    // Step 2: Send to Whisper
    const formData = new FormData();
    formData.append("file", videoBlob, "video.mp4");
    formData.append("model", "whisper-1");
    formData.append("language", language || "es");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities[]", "word");
    formData.append("timestamp_granularities[]", "segment");

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      return NextResponse.json({ error: `Whisper error: ${err.substring(0, 200)}` }, { status: 500 });
    }

    const result = await whisperRes.json();

    return NextResponse.json({
      success: true,
      text: result.text,
      language: result.language,
      duration: result.duration,
      segments: result.segments?.map((s: any) => ({
        text: s.text,
        start: s.start,
        end: s.end,
      })) || [],
      words: result.words?.map((w: any) => ({
        text: w.word,
        start: w.start,
        end: w.end,
      })) || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
