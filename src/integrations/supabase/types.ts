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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blockchain_stats: {
        Row: {
          circulating_supply: number
          current_phase: number | null
          id: string
          total_can_supply: number
          total_holders: number | null
          total_transactions: number | null
          total_value_locked: number | null
          updated_at: string
        }
        Insert: {
          circulating_supply: number
          current_phase?: number | null
          id?: string
          total_can_supply: number
          total_holders?: number | null
          total_transactions?: number | null
          total_value_locked?: number | null
          updated_at?: string
        }
        Update: {
          circulating_supply?: number
          current_phase?: number | null
          id?: string
          total_can_supply?: number
          total_holders?: number | null
          total_transactions?: number | null
          total_value_locked?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "news_events"
            referencedColumns: ["id"]
          },
        ]
      }
      news_events: {
        Row: {
          content: string | null
          created_at: string
          description: string
          end_time: string | null
          event_date: string | null
          event_type: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          max_attendees: number | null
          start_time: string | null
          title: string
          zoom_link: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description: string
          end_time?: string | null
          event_date?: string | null
          event_type: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_attendees?: number | null
          start_time?: string | null
          title: string
          zoom_link?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string
          end_time?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_attendees?: number | null
          start_time?: string | null
          title?: string
          zoom_link?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          can_balance: number
          created_at: string
          id: string
          membership_tier: string | null
          total_invested: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          can_balance?: number
          created_at?: string
          id: string
          membership_tier?: string | null
          total_invested?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          can_balance?: number
          created_at?: string
          id?: string
          membership_tier?: string | null
          total_invested?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      staking_coin: {
        Row: {
          amount_staked: number
          apy: number
          created_at: string
          id: string
          locked_until: string
          rewards: number
          staked_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_staked?: number
          apy?: number
          created_at?: string
          id?: string
          locked_until: string
          rewards?: number
          staked_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_staked?: number
          apy?: number
          created_at?: string
          id?: string
          locked_until?: string
          rewards?: number
          staked_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staking_nft: {
        Row: {
          apy: number
          created_at: string
          id: string
          locked_until: string
          nft_id: string
          nft_name: string
          nft_value: number
          rewards: number
          staked_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apy?: number
          created_at?: string
          id?: string
          locked_until: string
          nft_id: string
          nft_name: string
          nft_value?: number
          rewards?: number
          staked_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apy?: number
          created_at?: string
          id?: string
          locked_until?: string
          nft_id?: string
          nft_name?: string
          nft_value?: number
          rewards?: number
          staked_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          phase: number
          price_per_token: number
          status: string
          total_value: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          phase: number
          price_per_token: number
          status?: string
          total_value: number
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          phase?: number
          price_per_token?: number
          status?: string
          total_value?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
