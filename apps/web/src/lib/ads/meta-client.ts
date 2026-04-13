/**
 * Meta Marketing API Client
 *
 * This module handles Meta (Facebook + Instagram) Ads API integration.
 * Requires a Meta Developer App with Marketing API enabled.
 *
 * Setup: developers.facebook.com → Create App → Business type → Add Marketing API
 *
 * Required scopes: ads_management, ads_read, business_management,
 * pages_manage_posts, instagram_content_publish
 */

export interface MetaCampaignConfig {
  name: string;
  objective:
    | "OUTCOME_AWARENESS"
    | "OUTCOME_TRAFFIC"
    | "OUTCOME_ENGAGEMENT"
    | "OUTCOME_LEADS"
    | "OUTCOME_SALES";
  dailyBudget: number; // in cents
  targeting: MetaTargeting;
  creative: MetaCreative;
}

export interface MetaTargeting {
  geoLocations: { countries: string[] };
  ageMin: number;
  ageMax: number;
  genders?: number[]; // 1=male, 2=female
  interests?: { id: string; name: string }[];
}

export interface MetaCreative {
  imageUrl?: string;
  videoUrl?: string;
  headline: string;
  primaryText: string;
  description?: string;
  callToAction:
    | "SHOP_NOW"
    | "LEARN_MORE"
    | "SIGN_UP"
    | "CONTACT_US"
    | "BOOK_NOW"
    | "DOWNLOAD"
    | "GET_QUOTE"
    | "SUBSCRIBE";
  linkUrl: string;
}

export interface MetaCampaignResult {
  campaignId: string;
  adSetId: string;
  adId: string;
  creativeId: string;
  status: "PAUSED";
}

const META_API_VERSION = "v21.0";
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAdsClient {
  private accessToken: string;
  private adAccountId: string;

  constructor(accessToken: string, adAccountId: string) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId.startsWith("act_")
      ? adAccountId
      : `act_${adAccountId}`;
  }

  private async apiCall(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: Record<string, unknown>
  ) {
    const url = `${META_API_BASE}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    if (body && method === "POST") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      method === "GET" && body
        ? `${url}?${new URLSearchParams(body as Record<string, string>)}`
        : url,
      options
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || `Meta API error: ${response.status}`
      );
    }

    return response.json();
  }

  async createCampaign(
    config: MetaCampaignConfig
  ): Promise<MetaCampaignResult> {
    // 1. Create campaign
    const campaign = await this.apiCall(
      `/${this.adAccountId}/campaigns`,
      "POST",
      {
        name: config.name,
        objective: config.objective,
        status: "PAUSED",
        special_ad_categories: [],
      }
    );

    // 2. Create ad set
    const adSet = await this.apiCall(
      `/${this.adAccountId}/adsets`,
      "POST",
      {
        name: `${config.name} — Ad Set`,
        campaign_id: campaign.id,
        daily_budget: config.dailyBudget,
        billing_event: "IMPRESSIONS",
        optimization_goal: this.objectiveToGoal(config.objective),
        targeting: {
          geo_locations: config.targeting.geoLocations,
          age_min: config.targeting.ageMin,
          age_max: config.targeting.ageMax,
          genders: config.targeting.genders,
          flexible_spec: config.targeting.interests
            ? [{ interests: config.targeting.interests }]
            : undefined,
        },
        status: "PAUSED",
      }
    );

    // 3. Upload image and create creative
    const creative = await this.apiCall(
      `/${this.adAccountId}/adcreatives`,
      "POST",
      {
        name: `${config.name} — Creative`,
        object_story_spec: {
          link_data: {
            image_url: config.creative.imageUrl,
            link: config.creative.linkUrl,
            message: config.creative.primaryText,
            name: config.creative.headline,
            description: config.creative.description,
            call_to_action: { type: config.creative.callToAction },
          },
        },
      }
    );

    // 4. Create ad
    const ad = await this.apiCall(`/${this.adAccountId}/ads`, "POST", {
      name: `${config.name} — Ad`,
      adset_id: adSet.id,
      creative: { creative_id: creative.id },
      status: "PAUSED",
    });

    return {
      campaignId: campaign.id,
      adSetId: adSet.id,
      adId: ad.id,
      creativeId: creative.id,
      status: "PAUSED",
    };
  }

  async getCampaignInsights(campaignId: string) {
    return this.apiCall(`/${campaignId}/insights`, "GET", {
      fields:
        "impressions,clicks,spend,cpc,cpm,ctr,actions,cost_per_action_type",
      date_preset: "last_7d",
    } as any);
  }

  async publishToInstagram(params: {
    igUserId: string;
    imageUrl: string;
    caption: string;
  }) {
    // Step 1: Create media container
    const container = await this.apiCall(
      `/${params.igUserId}/media`,
      "POST",
      {
        image_url: params.imageUrl,
        caption: params.caption,
      }
    );

    // Step 2: Publish
    const publish = await this.apiCall(
      `/${params.igUserId}/media_publish`,
      "POST",
      {
        creation_id: container.id,
      }
    );

    return publish;
  }

  private objectiveToGoal(objective: string): string {
    const map: Record<string, string> = {
      OUTCOME_AWARENESS: "REACH",
      OUTCOME_TRAFFIC: "LINK_CLICKS",
      OUTCOME_ENGAGEMENT: "POST_ENGAGEMENT",
      OUTCOME_LEADS: "LEAD_GENERATION",
      OUTCOME_SALES: "OFFSITE_CONVERSIONS",
    };
    return map[objective] || "LINK_CLICKS";
  }
}
