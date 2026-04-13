import { NextRequest, NextResponse } from "next/server";

const META_API = "https://graph.facebook.com/v21.0";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "META_ACCESS_TOKEN not configured" }, { status: 500 });
    }

    // Fetch campaign details
    const campaignRes = await fetch(
      `${META_API}/${id}?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time,start_time,stop_time,buying_type&access_token=${token}`
    );
    const campaign = await campaignRes.json();
    if (campaign.error) {
      return NextResponse.json({ error: campaign.error.message }, { status: 400 });
    }

    // Fetch insights (last 30 days)
    const insightsRes = await fetch(
      `${META_API}/${id}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr,reach,frequency,actions,cost_per_action_type&date_preset=last_30d&access_token=${token}`
    );
    const insightsData = await insightsRes.json();
    const insights = insightsData.data?.[0] || {};

    // Fetch ad sets
    const adSetsRes = await fetch(
      `${META_API}/${id}/adsets?fields=id,name,status,daily_budget,targeting,optimization_goal&limit=20&access_token=${token}`
    );
    const adSetsData = await adSetsRes.json();

    // Fetch ads
    const adsRes = await fetch(
      `${META_API}/${id}/ads?fields=id,name,status,creative{title,body,image_url,thumbnail_url}&limit=20&access_token=${token}`
    );
    const adsData = await adsRes.json();

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign,
        dailyBudget: campaign.daily_budget ? parseInt(campaign.daily_budget) / 100 : 0,
      },
      insights: {
        spend: parseFloat(insights.spend || "0"),
        impressions: parseInt(insights.impressions || "0"),
        clicks: parseInt(insights.clicks || "0"),
        reach: parseInt(insights.reach || "0"),
        ctr: parseFloat(insights.ctr || "0"),
        cpc: parseFloat(insights.cpc || "0"),
        cpm: parseFloat(insights.cpm || "0"),
        frequency: parseFloat(insights.frequency || "0"),
        actions: insights.actions || [],
        costPerAction: insights.cost_per_action_type || [],
      },
      adSets: adSetsData.data || [],
      ads: adsData.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
