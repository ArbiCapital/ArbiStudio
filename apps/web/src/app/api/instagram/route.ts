import { NextRequest, NextResponse } from "next/server";

const META_API = "https://graph.facebook.com/v21.0";
const IG_ACCOUNT_ID = "17841473983273998";
const PAGE_ID = "727741633746899";

// GET — fetch Instagram profile + recent media
export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "META_ACCESS_TOKEN not configured" }, { status: 500 });

    // Profile
    const profileRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${token}`
    );
    const profile = await profileRes.json();

    // Recent media
    const mediaRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();

    return NextResponse.json({
      success: true,
      profile: {
        username: profile.username,
        profilePicture: profile.profile_picture_url,
        followers: profile.followers_count,
        following: profile.follows_count,
        posts: profile.media_count,
        bio: profile.biography,
      },
      media: (mediaData.data || []).map((m: any) => ({
        id: m.id,
        caption: m.caption || "",
        type: m.media_type,
        url: m.media_url || m.thumbnail_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

// POST — publish to Instagram
export async function POST(req: NextRequest) {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "META_ACCESS_TOKEN not configured" }, { status: 500 });

    const { imageUrl, caption, mediaType } = await req.json();

    if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 });

    // Step 1: Create media container
    const containerRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption || "",
          access_token: token,
        }),
      }
    );
    const container = await containerRes.json();

    if (container.error) {
      return NextResponse.json({ error: container.error.message }, { status: 400 });
    }

    // Step 2: Publish
    const publishRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: token,
        }),
      }
    );
    const published = await publishRes.json();

    if (published.error) {
      return NextResponse.json({ error: published.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, mediaId: published.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Publish failed" }, { status: 500 });
  }
}
