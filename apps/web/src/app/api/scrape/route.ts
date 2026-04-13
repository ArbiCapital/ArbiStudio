import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/api-auth");
    const auth = await requireAuth();
    if (!auth.authenticated) return auth.error!;

    // Rate limit + SSRF protection
    const { rateLimit, getClientIp, isSafeUrl } = await import("@/lib/rate-limit");
    const ip = getClientIp(req);
    const { success } = rateLimit(`scrape:${ip}`, 10, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // SSRF protection: block internal/private URLs
    if (!isSafeUrl(url)) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ArbiStudio/1.0; +https://arbistudio.com)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract basic metadata
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    const priceMatch = html.match(
      /(?:price|precio)[^>]*>?\s*[€$£]?\s*([\d,.]+)\s*[€$£]?/i
    );

    // Extract all images
    const imageMatches = html.matchAll(
      /<img[^>]*src=["']([^"']+)["'][^>]*/gi
    );
    const images = Array.from(imageMatches)
      .map((m) => m[1])
      .filter((src) => src.startsWith("http") && !src.includes("icon") && !src.includes("logo"))
      .slice(0, 10);

    // Extract headings for content analysis
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h2Matches = Array.from(
      html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)
    ).map((m) => m[1]);

    return NextResponse.json({
      success: true,
      data: {
        url,
        title: ogTitleMatch?.[1] || titleMatch?.[1] || "",
        description: descMatch?.[1] || "",
        ogImage: ogImageMatch?.[1] || "",
        price: priceMatch?.[1] || null,
        mainHeading: h1Match?.[1] || "",
        subHeadings: h2Matches.slice(0, 5),
        images,
      },
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scraping failed" },
      { status: 500 }
    );
  }
}
