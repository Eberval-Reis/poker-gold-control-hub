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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      backer_payouts: {
        Row: {
          backing_investment_id: string
          backing_result_id: string
          created_at: string
          id: string
          payment_status: string | null
          payout_amount: number
          roi_percentage: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          backing_investment_id: string
          backing_result_id: string
          created_at?: string
          id?: string
          payment_status?: string | null
          payout_amount: number
          roi_percentage: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          backing_investment_id?: string
          backing_result_id?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          payout_amount?: number
          roi_percentage?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backer_payouts_backing_investment_id_fkey"
            columns: ["backing_investment_id"]
            isOneToOne: false
            referencedRelation: "backing_investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backer_payouts_backing_result_id_fkey"
            columns: ["backing_result_id"]
            isOneToOne: false
            referencedRelation: "backing_results"
            referencedColumns: ["id"]
          },
        ]
      }
      backing_investments: {
        Row: {
          amount_paid: number
          backer_name: string
          backing_offer_id: string
          created_at: string
          id: string
          payment_status: string | null
          percentage_bought: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          backer_name: string
          backing_offer_id: string
          created_at?: string
          id?: string
          payment_status?: string | null
          percentage_bought: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          backer_name?: string
          backing_offer_id?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          percentage_bought?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backing_investments_backing_offer_id_fkey"
            columns: ["backing_offer_id"]
            isOneToOne: false
            referencedRelation: "backing_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      backing_offers: {
        Row: {
          available_percentage: number
          buy_in_amount: number
          collective_financing: boolean | null
          created_at: string
          end_date: string | null
          id: string
          markup_percentage: number
          offer_type: string
          period_description: string | null
          player_name: string
          start_date: string | null
          status: string | null
          total_bankroll: number | null
          tournament_date: string
          tournament_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_percentage: number
          buy_in_amount: number
          collective_financing?: boolean | null
          created_at?: string
          end_date?: string | null
          id?: string
          markup_percentage?: number
          offer_type?: string
          period_description?: string | null
          player_name: string
          start_date?: string | null
          status?: string | null
          total_bankroll?: number | null
          tournament_date: string
          tournament_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_percentage?: number
          buy_in_amount?: number
          collective_financing?: boolean | null
          created_at?: string
          end_date?: string | null
          id?: string
          markup_percentage?: number
          offer_type?: string
          period_description?: string | null
          player_name?: string
          start_date?: string | null
          status?: string | null
          total_bankroll?: number | null
          tournament_date?: string
          tournament_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backing_offers_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      backing_results: {
        Row: {
          backing_offer_id: string
          created_at: string
          id: string
          net_prize: number | null
          player_profit: number | null
          prize_amount: number | null
          result_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          backing_offer_id: string
          created_at?: string
          id?: string
          net_prize?: number | null
          player_profit?: number | null
          prize_amount?: number | null
          result_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          backing_offer_id?: string
          created_at?: string
          id?: string
          net_prize?: number | null
          player_profit?: number | null
          prize_amount?: number | null
          result_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backing_results_backing_offer_id_fkey"
            columns: ["backing_offer_id"]
            isOneToOne: false
            referencedRelation: "backing_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      "Cadastro Clube": {
        Row: {
          address_link: string | null
          contact_person: string | null
          created_at: string
          id: string
          location: string
          name: string
          observations: string | null
          phone: string | null
          reference: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_link?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          location: string
          name: string
          observations?: string | null
          phone?: string | null
          reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_link?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          location?: string
          name?: string
          observations?: string | null
          phone?: string | null
          reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string | null
          id: string
          receipt_url: string | null
          tournament_id: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          tournament_id?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          tournament_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      financiadores: {
        Row: {
          cpf: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          name: string
          nickname: string | null
          updated_at: string
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          name: string
          nickname?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          name?: string
          nickname?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      schedule_events: {
        Row: {
          created_at: string
          date: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tournament_performance: {
        Row: {
          addon_amount: number | null
          addon_enabled: boolean | null
          buyin_amount: number
          club_id: string | null
          created_at: string
          final_table_achieved: boolean | null
          ft_photo_url: string | null
          id: string
          itm_achieved: boolean | null
          news_link: string | null
          position: number | null
          prize_amount: number | null
          rebuy_amount: number | null
          rebuy_quantity: number | null
          tournament_date: string
          tournament_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          addon_amount?: number | null
          addon_enabled?: boolean | null
          buyin_amount: number
          club_id?: string | null
          created_at?: string
          final_table_achieved?: boolean | null
          ft_photo_url?: string | null
          id?: string
          itm_achieved?: boolean | null
          news_link?: string | null
          position?: number | null
          prize_amount?: number | null
          rebuy_amount?: number | null
          rebuy_quantity?: number | null
          tournament_date: string
          tournament_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          addon_amount?: number | null
          addon_enabled?: boolean | null
          buyin_amount?: number
          club_id?: string | null
          created_at?: string
          final_table_achieved?: boolean | null
          ft_photo_url?: string | null
          id?: string
          itm_achieved?: boolean | null
          news_link?: string | null
          position?: number | null
          prize_amount?: number | null
          rebuy_amount?: number | null
          rebuy_quantity?: number | null
          tournament_date?: string
          tournament_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_performance_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "Cadastro Clube"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_performance_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_schedules: {
        Row: {
          buy_in: number
          created_at: string
          date: string
          event_id: string | null
          event_name: string | null
          id: string
          reason: string | null
          rebuys: number
          status: string
          time: string
          tournament_id: string | null
          tournament_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          buy_in?: number
          created_at?: string
          date: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          reason?: string | null
          rebuys?: number
          status?: string
          time: string
          tournament_id?: string | null
          tournament_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          buy_in?: number
          created_at?: string
          date?: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          reason?: string | null
          rebuys?: number
          status?: string
          time?: string
          tournament_id?: string | null
          tournament_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_schedules_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          addon_amount: number | null
          blind_structure: string | null
          buyin_amount: number | null
          club_id: string
          created_at: string
          date: string
          event_id: string | null
          id: string
          initial_stack: string | null
          name: string
          notes: string | null
          prizes: string | null
          rebuy_amount: number | null
          time: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          addon_amount?: number | null
          blind_structure?: string | null
          buyin_amount?: number | null
          club_id: string
          created_at?: string
          date?: string
          event_id?: string | null
          id?: string
          initial_stack?: string | null
          name: string
          notes?: string | null
          prizes?: string | null
          rebuy_amount?: number | null
          time?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          addon_amount?: number | null
          blind_structure?: string | null
          buyin_amount?: number | null
          club_id?: string
          created_at?: string
          date?: string
          event_id?: string | null
          id?: string
          initial_stack?: string | null
          name?: string
          notes?: string | null
          prizes?: string | null
          rebuy_amount?: number | null
          time?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "Cadastro Clube"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
        ]
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
