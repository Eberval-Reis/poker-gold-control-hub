export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      tournament_performance: {
        Row: {
          addon_amount: number | null
          addon_enabled: boolean | null
          buyin_amount: number
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
          tournament_id: string | null
          updated_at: string
        }
        Insert: {
          addon_amount?: number | null
          addon_enabled?: boolean | null
          buyin_amount: number
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
          tournament_id?: string | null
          updated_at?: string
        }
        Update: {
          addon_amount?: number | null
          addon_enabled?: boolean | null
          buyin_amount?: number
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
          tournament_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_performance_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_results: {
        Row: {
          club_id: string
          created_at: string
          date: string
          ft_achieved: boolean | null
          ft_photo_url: string | null
          id: string
          itm_achieved: boolean | null
          news_link: string | null
          position: number | null
          prize_amount: number | null
          tournament_id: string
          updated_at: string
        }
        Insert: {
          club_id: string
          created_at?: string
          date: string
          ft_achieved?: boolean | null
          ft_photo_url?: string | null
          id?: string
          itm_achieved?: boolean | null
          news_link?: string | null
          position?: number | null
          prize_amount?: number | null
          tournament_id: string
          updated_at?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          date?: string
          ft_achieved?: boolean | null
          ft_photo_url?: string | null
          id?: string
          itm_achieved?: boolean | null
          news_link?: string | null
          position?: number | null
          prize_amount?: number | null
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_results_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "Cadastro Clube"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          blind_structure: string | null
          club_id: string
          created_at: string
          date: string
          id: string
          initial_stack: string | null
          name: string
          notes: string | null
          prizes: string | null
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          blind_structure?: string | null
          club_id: string
          created_at?: string
          date?: string
          id?: string
          initial_stack?: string | null
          name: string
          notes?: string | null
          prizes?: string | null
          time?: string
          type: string
          updated_at?: string
        }
        Update: {
          blind_structure?: string | null
          club_id?: string
          created_at?: string
          date?: string
          id?: string
          initial_stack?: string | null
          name?: string
          notes?: string | null
          prizes?: string | null
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "Cadastro Clube"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
