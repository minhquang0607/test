// Hand-written to match supabase/migrations. Regenerate with
//   npx supabase gen types typescript --linked > lib/supabase/database.types.ts
// once the project is linked; the shape below follows that output.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string;
          bio: string;
          avatar_url: string | null;
          role: "creator" | "admin";
          plan: "free" | "pro";
          plan_expires_at: string | null;
          is_verified: boolean;
          is_banned: boolean;
          username_changed_at: string | null;
          onboarded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          display_name?: string;
          bio?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          user_id: string;
          theme: Json;
          draft_blocks: Json;
          published_theme: Json | null;
          published_blocks: Json | null;
          published_at: string | null;
          is_sensitive: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          theme?: Json;
          draft_blocks?: Json;
          is_sensitive?: boolean;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      username_status: { Args: { candidate: string }; Returns: string };
      claim_username: { Args: { new_username: string }; Returns: string };
      publish_page: { Args: Record<string, never>; Returns: string };
      unpublish_page: { Args: Record<string, never>; Returns: undefined };
      complete_onboarding: { Args: Record<string, never>; Returns: boolean };
      get_public_page: { Args: { handle: string }; Returns: Json };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type PageRow = Database["public"]["Tables"]["pages"]["Row"];
