// Auto-derived from studio schema migration
// Schema: studio (isolated from ArbiOS public schema)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  studio: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          plan: "free" | "pro" | "agency" | "enterprise";
          whop_customer_id: string | null;
          meta_app_id: string | null;
          meta_access_token_encrypted: string | null;
          google_ads_customer_id: string | null;
          tiktok_advertiser_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["organizations"]["Row"],
          "id" | "created_at" | "updated_at" | "plan"
        > & {
          id?: string;
          plan?: "free" | "pro" | "agency" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["organizations"]["Insert"]
        >;
      };
      members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "admin" | "creator" | "collaborator" | "viewer";
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["members"]["Row"],
          "id" | "created_at" | "role"
        > & {
          id?: string;
          role?: "admin" | "creator" | "collaborator" | "viewer";
          created_at?: string;
        };
        Update: Partial<Database["studio"]["Tables"]["members"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          brand_guidelines: Json;
          target_audience: string | null;
          industry: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at" | "brand_guidelines"
        > & {
          id?: string;
          brand_guidelines?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["studio"]["Tables"]["projects"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          project_id: string | null;
          organization_id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["conversations"]["Row"],
          "id" | "created_at" | "updated_at" | "title"
        > & {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["conversations"]["Insert"]
        >;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["messages"]["Row"],
          "id" | "created_at" | "metadata"
        > & {
          id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["studio"]["Tables"]["messages"]["Insert"]>;
      };
      assets: {
        Row: {
          id: string;
          organization_id: string;
          project_id: string | null;
          conversation_id: string | null;
          type: "image" | "video" | "audio" | "document";
          status:
            | "generating"
            | "processing"
            | "ready"
            | "published"
            | "failed";
          file_url: string | null;
          thumbnail_url: string | null;
          prompt: string | null;
          model: string | null;
          metadata: Json;
          formats: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["assets"]["Row"],
          "id" | "created_at" | "status" | "metadata" | "formats"
        > & {
          id?: string;
          status?:
            | "generating"
            | "processing"
            | "ready"
            | "published"
            | "failed";
          metadata?: Json;
          formats?: Json;
          created_at?: string;
        };
        Update: Partial<Database["studio"]["Tables"]["assets"]["Insert"]>;
      };
      soul_characters: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          reference_images: string[];
          lora_model_id: string | null;
          attributes: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["soul_characters"]["Row"],
          "id" | "created_at" | "reference_images" | "attributes"
        > & {
          id?: string;
          reference_images?: string[];
          attributes?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["soul_characters"]["Insert"]
        >;
      };
      brand_identities: {
        Row: {
          id: string;
          project_id: string;
          primary_color: string;
          secondary_color: string;
          accent_color: string;
          font_family: string;
          logo_url: string | null;
          tone_of_voice: string;
          style_modifiers: string[];
          lut_preset: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["brand_identities"]["Row"],
          | "id"
          | "created_at"
          | "primary_color"
          | "secondary_color"
          | "accent_color"
          | "font_family"
          | "tone_of_voice"
          | "style_modifiers"
        > & {
          id?: string;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
          font_family?: string;
          tone_of_voice?: string;
          style_modifiers?: string[];
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["brand_identities"]["Insert"]
        >;
      };
      campaigns: {
        Row: {
          id: string;
          organization_id: string;
          project_id: string | null;
          platform: "meta" | "google" | "tiktok";
          platform_campaign_id: string | null;
          name: string;
          status: "draft" | "active" | "paused" | "completed";
          objective: string | null;
          budget_daily: number | null;
          budget_total: number | null;
          targeting: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["campaigns"]["Row"],
          "id" | "created_at" | "status" | "targeting"
        > & {
          id?: string;
          status?: "draft" | "active" | "paused" | "completed";
          targeting?: Json;
          created_at?: string;
        };
        Update: Partial<Database["studio"]["Tables"]["campaigns"]["Insert"]>;
      };
      ad_creatives: {
        Row: {
          id: string;
          campaign_id: string;
          asset_id: string | null;
          headline: string | null;
          primary_text: string | null;
          description: string | null;
          cta: string | null;
          platform_creative_id: string | null;
          performance: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["ad_creatives"]["Row"],
          "id" | "created_at" | "performance"
        > & {
          id?: string;
          performance?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["ad_creatives"]["Insert"]
        >;
      };
      competitor_analyses: {
        Row: {
          id: string;
          project_id: string;
          competitor_name: string;
          competitor_url: string | null;
          platform: string | null;
          scraped_data: Json;
          insights: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["competitor_analyses"]["Row"],
          "id" | "created_at" | "scraped_data" | "insights"
        > & {
          id?: string;
          scraped_data?: Json;
          insights?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["competitor_analyses"]["Insert"]
        >;
      };
      content_strategies: {
        Row: {
          id: string;
          project_id: string;
          period: string | null;
          strategy: Json;
          status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["content_strategies"]["Row"],
          "id" | "created_at" | "strategy" | "status"
        > & {
          id?: string;
          strategy?: Json;
          status?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["content_strategies"]["Insert"]
        >;
      };
      scheduled_posts: {
        Row: {
          id: string;
          project_id: string;
          asset_id: string | null;
          platform: string;
          platform_account_id: string | null;
          scheduled_at: string;
          published_at: string | null;
          status: "scheduled" | "published" | "failed" | "cancelled";
          caption: string | null;
          hashtags: string[];
          created_at: string;
        };
        Insert: Omit<
          Database["studio"]["Tables"]["scheduled_posts"]["Row"],
          "id" | "created_at" | "status" | "hashtags"
        > & {
          id?: string;
          status?: "scheduled" | "published" | "failed" | "cancelled";
          hashtags?: string[];
          created_at?: string;
        };
        Update: Partial<
          Database["studio"]["Tables"]["scheduled_posts"]["Insert"]
        >;
      };
    };
  };
}

// Convenience types
export type StudioTable = keyof Database["studio"]["Tables"];
export type StudioRow<T extends StudioTable> =
  Database["studio"]["Tables"][T]["Row"];
export type StudioInsert<T extends StudioTable> =
  Database["studio"]["Tables"][T]["Insert"];
export type StudioUpdate<T extends StudioTable> =
  Database["studio"]["Tables"][T]["Update"];

// Commonly used
export type Organization = StudioRow<"organizations">;
export type Project = StudioRow<"projects">;
export type Conversation = StudioRow<"conversations">;
export type Message = StudioRow<"messages">;
export type Asset = StudioRow<"assets">;
export type SoulCharacter = StudioRow<"soul_characters">;
export type BrandIdentity = StudioRow<"brand_identities">;
export type Campaign = StudioRow<"campaigns">;
