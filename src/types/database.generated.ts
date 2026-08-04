export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      gallery_albums: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          order_index: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          order_index?: number
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          order_index?: number
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          album_id: string | null
          caption: string | null
          category: string | null
          created_at: string
          id: string
          is_featured: boolean
          media_id: string
          order_index: number
          photographer: string | null
          program_id: string | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          album_id?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          media_id: string
          order_index?: number
          photographer?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          album_id?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          media_id?: string
          order_index?: number
          photographer?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          order_index: number
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label: string
          order_index?: number
          suffix?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          order_index?: number
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string
          bucket_id: string
          caption: string | null
          consent_verified: boolean
          created_at: string
          file_name: string
          height: number | null
          id: string
          mime_type: string
          size_bytes: number
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string
          bucket_id?: string
          caption?: string | null
          consent_verified?: boolean
          created_at?: string
          file_name: string
          height?: number | null
          id?: string
          mime_type: string
          size_bytes: number
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          bucket_id?: string
          caption?: string | null
          consent_verified?: boolean
          created_at?: string
          file_name?: string
          height?: number | null
          id?: string
          mime_type?: string
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_available: boolean
          label: string
          order_index: number
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_available?: boolean
          label: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_available?: boolean
          label?: string
          order_index?: number
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json
          created_at: string
          hero_media_id: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_media_id: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          hero_media_id?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_media_id?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          hero_media_id?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_media_id?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          activities: string | null
          body: string | null
          category: Database["public"]["Enums"]["program_category"]
          cover_media_id: string | null
          created_at: string
          event_date: string | null
          id: string
          is_featured: boolean
          location: string | null
          meta_description: string | null
          meta_title: string | null
          objectives: string[]
          order_index: number
          participation: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
          updated_by: string | null
          volunteers: string[]
        }
        Insert: {
          activities?: string | null
          body?: string | null
          category: Database["public"]["Enums"]["program_category"]
          cover_media_id?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          is_featured?: boolean
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          objectives?: string[]
          order_index?: number
          participation?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at?: string
          updated_by?: string | null
          volunteers?: string[]
        }
        Update: {
          activities?: string | null
          body?: string | null
          category?: Database["public"]["Enums"]["program_category"]
          cover_media_id?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          is_featured?: boolean
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          objectives?: string[]
          order_index?: number
          participation?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          volunteers?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "programs_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          campaign_description: string | null
          campaign_eyebrow: string | null
          campaign_media_id: string | null
          campaign_title: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          default_meta_description: string | null
          default_meta_title: string | null
          default_og_media_id: string | null
          description: string | null
          id: string
          is_singleton: boolean
          location: string | null
          logo_media_id: string | null
          org_name: string
          org_name_bn: string | null
          primary_cta_enabled: boolean
          primary_cta_href: string | null
          primary_cta_label: string | null
          tagline: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          campaign_description?: string | null
          campaign_eyebrow?: string | null
          campaign_media_id?: string | null
          campaign_title?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_media_id?: string | null
          description?: string | null
          id?: string
          is_singleton?: boolean
          location?: string | null
          logo_media_id?: string | null
          org_name: string
          org_name_bn?: string | null
          primary_cta_enabled?: boolean
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          campaign_description?: string | null
          campaign_eyebrow?: string | null
          campaign_media_id?: string | null
          campaign_title?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_meta_description?: string | null
          default_meta_title?: string | null
          default_og_media_id?: string | null
          description?: string | null
          id?: string
          is_singleton?: boolean
          location?: string | null
          logo_media_id?: string | null
          org_name?: string
          org_name_bn?: string | null
          primary_cta_enabled?: boolean
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_campaign_media_id_fkey"
            columns: ["campaign_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_default_og_media_id_fkey"
            columns: ["default_og_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          href: string
          id: string
          is_visible: boolean
          label: string
          order_index: number
          platform: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_visible?: boolean
          label: string
          order_index?: number
          platform: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          order_index?: number
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_name: string | null
          body: string | null
          created_at: string
          excerpt: string
          hero_media_id: string | null
          id: string
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          order_index: number
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_name?: string | null
          body?: string | null
          created_at?: string
          excerpt: string
          hero_media_id?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_name?: string | null
          body?: string | null
          created_at?: string
          excerpt?: string
          hero_media_id?: string | null
          id?: string
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_meta: string | null
          author_name: string
          avatar_media_id: string | null
          created_at: string
          id: string
          order_index: number
          quote: string
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_meta?: string | null
          author_name: string
          avatar_media_id?: string | null
          created_at?: string
          id?: string
          order_index?: number
          quote: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_meta?: string | null
          author_name?: string
          avatar_media_id?: string | null
          created_at?: string
          id?: string
          order_index?: number
          quote?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_avatar_media_id_fkey"
            columns: ["avatar_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: { Args: never; Returns: boolean }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      program_category: "art" | "education" | "community"
      user_role: "super_admin" | "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_status: ["draft", "published", "archived"],
      program_category: ["art", "education", "community"],
      user_role: ["super_admin", "admin", "editor"],
    },
  },
} as const
