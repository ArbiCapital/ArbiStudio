import { NextRequest, NextResponse } from "next/server";

const META_API = "https://graph.facebook.com/v21.0";
const IG_ACCOUNT_ID = "17841473983273998";

// GET — fetch Instagram profile + media with video URLs
export async function GET(req: NextRequest) {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "META_ACCESS_TOKEN not configured" }, { status: 500 });

    const searchUser = req.nextUrl.searchParams.get("search");

    // If searching external user
    if (searchUser) {
      const searchRes = await fetch(
        `${META_API}/ig_hashtag_search?user_id=${IG_ACCOUNT_ID}&q=${encodeURIComponent(searchUser)}&access_token=${token}`
      );
      // Instagram API doesn't allow searching other users directly
      // Return info that we need to use scraping for external profiles
      return NextResponse.json({
        success: true,
        note: "external_profile_search",
        username: searchUser,
      });
    }

    // Profile
    const profileRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}?fields=username,profile_picture_url,followers_count,follows_count,media_count,biography&access_token=${token}`
    );
    const profile = await profileRes.json();

    // Media with ALL fields including video
    const mediaRes = await fetch(
      `${META_API}/${IG_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,media_product_type&limit=50&access_token=${token}`
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
        id: IG_ACCOUNT_ID,
      },
      media: (mediaData.data || []).map((m: any) => ({
        id: m.id,
        caption: m.caption || "",
        type: m.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
        mediaUrl: m.media_url || "",
        thumbnailUrl: m.thumbnail_url || m.media_url || "",
        permalink: m.permalink,
        timestamp: m.timestamp,
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        productType: m.media_product_type || "", // REELS, FEED, STORY
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

    const { imageUrl, caption } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 });

    // Create container
    const containerRes = await fetch(`${META_API}/${IG_ACCOUNT_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption: caption || "", access_token: token }),
    });
    const container = await containerRes.json();
    if (container.error) return NextResponse.json({ error: container.error.message }, { status: 400 });

    // Publish
    const publishRes = await fetch(`${META_API}/${IG_ACCOUNT_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id, access_token: token }),
    });
    const published = await publishRes.json();
    if (published.error) return NextResponse.json({ error: published.error.message }, { status: 400 });

    return NextResponse.json({ success: true, mediaId: published.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Publish failed" }, { status: 500 });
  }
}
