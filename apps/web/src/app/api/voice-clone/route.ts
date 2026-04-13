import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    const { rateLimit, getClientIp } = await import("@/lib/rate-limit");
    const { success } = rateLimit(`voice-clone:${getClientIp(req)}`, 3, 60_000);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("files") as File | null;
    const name = (formData.get("name") as string) || "Custom Voice";

    if (!file) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    // Forward to ElevenLabs Add Voice API (instant voice cloning)
    const elevenLabsForm = new FormData();
    elevenLabsForm.append("name", `ArbiStudio - ${name}`);
    elevenLabsForm.append("files", file);
    elevenLabsForm.append("description", `Custom voice cloned via ArbiStudio for ${name}`);

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: elevenLabsForm,
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `ElevenLabs clone error: ${err}` }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      voiceId: data.voice_id,
      name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Voice cloning failed" },
      { status: 500 }
    );
  }
}
