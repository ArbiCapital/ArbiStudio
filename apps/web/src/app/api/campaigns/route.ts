import { NextResponse } from "next/server";

const META_API = "https://graph.facebook.com/v21.0";
const AD_ACCOUNT_ID = "act_1464389474581528";

export async function GET() {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "META_ACCESS_TOKEN not configured" }, { status: 500 });
    }

    // Fetch campaigns
    const campaignsRes = await fetch(
      `${META_API}/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=50&access_token=${token}`
    );
    const campaignsData = await campaignsRes.json();

    if (campaignsData.error) {
      return NextResponse.json({ error: campaignsData.error.message }, { status: 400 });
    }

    // Fetch insights for active campaigns
    const campaigns = await Promise.all(
      (campaignsData.data || []).map(async (campaign: any) => {
        let insights = null;
        try {
          const insightsRes = await fetch(
            `${META_API}/${campaign.id}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr,actions&date_preset=last_30d&access_token=${token}`
          );
          const insightsData = await insightsRes.json();
          if (insightsData.data?.[0]) {
            insights = insightsData.data[0];
          }
        } catch {}

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status?.toLowerCase() || "unknown",
          objective: campaign.objective || "",
          dailyBudget: campaign.daily_budget ? parseInt(campaign.daily_budget) / 100 : 0,
          createdAt: campaign.created_time || "",
          platform: "meta",
          // Insights
          spend: insights ? parseFloat(insights.spend || "0") : 0,
          impressions: insights ? parseInt(insights.impressions || "0") : 0,
          clicks: insights ? parseInt(insights.clicks || "0") : 0,
          ctr: insights ? parseFloat(insights.ctr || "0") : 0,
          cpc: insights ? parseFloat(insights.cpc || "0") : 0,
          conversions: insights?.actions?.find((a: any) => a.action_type === "lead")?.value || 0,
        };
      })
    );

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
