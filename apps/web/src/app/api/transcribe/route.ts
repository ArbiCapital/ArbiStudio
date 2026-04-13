import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { requireAuth, safeError } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`transcribe:${getClientIp(req)}`, 5, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "es";

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file required" }, { status: 400 });
    }

    // File size limit: 25MB (Whisper API max)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 25MB." }, { status: 400 });
    }

    // Call OpenAI Whisper API
    const whisperForm = new FormData();
    whisperForm.append("file", audioFile);
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", language);
    whisperForm.append("response_format", "verbose_json");
    whisperForm.append("timestamp_granularities[]", "word");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Whisper API error: ${err}` }, { status: 500 });
    }

    const result = await response.json();

    // Extract word-level timestamps for caption overlay
    const words = result.words?.map((w: { word: string; start: number; end: number }) => ({
      text: w.word,
      start: w.start,
      end: w.end,
    })) || [];

    return NextResponse.json({
      success: true,
      text: result.text,
      language: result.language,
      duration: result.duration,
      words,
      segments: result.segments?.map((s: { text: string; start: number; end: number }) => ({
        text: s.text,
        start: s.start,
        end: s.end,
      })) || [],
    });
  } catch (error) {
    const { safeError } = await import("@/lib/api-auth");
    return NextResponse.json({ error: safeError(error) }, { status: 500 });
  }
}
