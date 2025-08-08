export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author: string
          author_email: string | null
          content: string
          created_at: string | null
          id: string
          likes: number | null
          post_id: string
          status: string | null
        }
        Insert: {
          author: string
          author_email?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id: string
          status?: string | null
        }
        Update: {
          author?: string
          author_email?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          post_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tag"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          likes: number | null
          published_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          likes?: number | null
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          likes?: number | null
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      pr_metrics: {
        Row: {
          ai_tools: string[] | null
          created_at: string | null
          developer_email: string
          developer_name: string
          id: string
          merged_at: string | null
          pr_number: number
          pr_status: string
          pr_title: string
          repository: string
        }
        Insert: {
          ai_tools?: string[] | null
          created_at?: string | null
          developer_email: string
          developer_name: string
          id?: string
          merged_at?: string | null
          pr_number: number
          pr_status: string
          pr_title: string
          repository: string
        }
        Update: {
          ai_tools?: string[] | null
          created_at?: string | null
          developer_email?: string
          developer_name?: string
          id?: string
          merged_at?: string | null
          pr_number?: number
          pr_status?: string
          pr_title?: string
          repository?: string
        }
        Relationships: []
      }
      pr_metrics_v2: {
        Row: {
          added_lines: number | null
          created_at: string | null
          developer_email: string | null
          developer_name: string | null
          first_commit_date: string | null
          ia_tool_used: string | null
          ia_usage_scenarios: string | null
          merged_at: string | null
          pr_body: string | null
          pr_number: number
          pr_status: string | null
          pr_title: string | null
          productivity_reason: string | null
          productivity_score: number | null
          removed_lines: number | null
          repository: string
          updated_at: string | null
        }
        Insert: {
          added_lines?: number | null
          created_at?: string | null
          developer_email?: string | null
          developer_name?: string | null
          first_commit_date?: string | null
          ia_tool_used?: string | null
          ia_usage_scenarios?: string | null
          merged_at?: string | null
          pr_body?: string | null
          pr_number: number
          pr_status?: string | null
          pr_title?: string | null
          productivity_reason?: string | null
          productivity_score?: number | null
          removed_lines?: number | null
          repository: string
          updated_at?: string | null
        }
        Update: {
          added_lines?: number | null
          created_at?: string | null
          developer_email?: string | null
          developer_name?: string | null
          first_commit_date?: string | null
          ia_tool_used?: string | null
          ia_usage_scenarios?: string | null
          merged_at?: string | null
          pr_body?: string | null
          pr_number?: number
          pr_status?: string | null
          pr_title?: string | null
          productivity_reason?: string | null
          productivity_score?: number | null
          removed_lines?: number | null
          repository?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_saude_conecta_schema: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_user_profile: {
        Args: {
          _id: string
          _name: string
          _company_name: string
          _email: string
        }
        Returns: undefined
      }
      create_user_profile_preve_ai: {
        Args: { _id: string; _name: string; _company: string }
        Returns: undefined
      }
      get_plan_name_from_price_id: {
        Args: { price_id: string }
        Returns: string
      }
      increment_comment_likes: {
        Args: { comment_id: string }
        Returns: undefined
      }
      increment_post_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_post_views: {
        Args: { post_id: string }
        Returns: undefined
      }
      register_user: {
        Args: {
          p_user_id: string
          p_user_name: string
          p_user_email: string
          p_user_city: string
          p_user_profile_type: string
          p_user_country?: string
        }
        Returns: Json
      }
      update_user_subscription_status: {
        Args:
          | {
              customer_id: string
              subscription_id?: string
              price_id?: string
              status?: string
              current_period_end?: number
              trial_end?: number
            }
          | {
              customer_id: string
              subscription_id?: string
              price_id?: string
              status?: string
              current_period_end?: number
              trial_end?: number
            }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
