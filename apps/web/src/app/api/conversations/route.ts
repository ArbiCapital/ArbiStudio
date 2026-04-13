import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "studio" },
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

// GET — list conversations for current user
export async function GET() {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ conversations: [] });
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ conversations: data || [] });
  } catch {
    return NextResponse.json({ conversations: [] });
  }
}

// POST — save a conversation
export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();

    if (!user) {
      // Not authenticated — just return success (localStorage will handle it)
      return NextResponse.json({ success: true, source: "local" });
    }

    const { conversationId, title, messages } = body;

    // Upsert conversation
    const { error: convError } = await supabase
      .from("conversations")
      .upsert({
        id: conversationId,
        user_id: user.id,
        organization_id: user.user_metadata?.org_id || null,
        title: title || "Nueva conversacion",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (convError) throw convError;

    // Save messages (delete old ones and insert new)
    if (messages && messages.length > 0) {
      await supabase.from("messages").delete().eq("conversation_id", conversationId);

      const messageRows = messages.map((m: any) => ({
        conversation_id: conversationId,
        role: m.role,
        content: JSON.stringify(m.parts || []),
        metadata: { imageStyle: body.imageStyle, formats: body.selectedFormats },
      }));

      const { error: msgError } = await supabase.from("messages").insert(messageRows);
      if (msgError) throw msgError;
    }

    // Save generated assets
    if (messages) {
      for (const msg of messages) {
        if (msg.role !== "assistant") continue;
        for (const part of msg.parts || []) {
          if (part.type?.startsWith("tool-") && part.state === "output-available" && part.output?.success) {
            const images = part.output.images as Array<{ url: string; width: number; height: number }> | undefined;
            if (!images) continue;
            for (const img of images) {
              if (img.url.startsWith("data:")) continue;
              await supabase.from("assets").upsert({
                organization_id: user.user_metadata?.org_id || null,
                conversation_id: conversationId,
                type: "image",
                status: "ready",
                file_url: img.url,
                prompt: part.output.prompt || "",
                model: part.output.model || "",
                metadata: { width: img.width, height: img.height, ratio: part.output.ratio },
              }, { onConflict: "id" });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, source: "supabase" });
  } catch (error) {
    return NextResponse.json({ success: true, source: "local", error: String(error) });
  }
}
