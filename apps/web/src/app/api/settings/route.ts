import { NextResponse } from "next/server";

// GET — check which API keys are configured
export async function GET() {
  const keys = {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    fal: !!process.env.FAL_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    gemini: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    meta: !!process.env.META_APP_ID,
    google_ads: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    tiktok: !!process.env.TIKTOK_APP_ID,
  };

  return NextResponse.json({ keys });
}
