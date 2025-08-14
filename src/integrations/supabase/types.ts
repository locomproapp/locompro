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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      buy_request_offers: {
        Row: {
          buy_request_id: string
          characteristics: Json | null
          created_at: string
          description: string | null
          id: string
          images: string[]
          price: number
          rejection_reason: string | null
          seller_id: string
          status: string
          title: string
          updated_at: string
          zone: string
        }
        Insert: {
          buy_request_id: string
          characteristics?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          price: number
          rejection_reason?: string | null
          seller_id: string
          status?: string
          title: string
          updated_at?: string
          zone: string
        }
        Update: {
          buy_request_id?: string
          characteristics?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          price?: number
          rejection_reason?: string | null
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "buy_request_offers_buy_request_id_fkey"
            columns: ["buy_request_id"]
            isOneToOne: false
            referencedRelation: "buy_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      buy_requests: {
        Row: {
          condition: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          max_price: number
          min_price: number
          reference_image: string | null
          reference_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          zone: string
        }
        Insert: {
          condition: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_price: number
          min_price: number
          reference_image?: string | null
          reference_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          zone: string
        }
        Update: {
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_price?: number
          min_price?: number
          reference_image?: string | null
          reference_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "buy_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          buy_request_id: string
          buyer_id: string
          created_at: string
          id: string
          offer_id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buy_request_id: string
          buyer_id: string
          created_at?: string
          id?: string
          offer_id: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buy_request_id?: string
          buyer_id?: string
          created_at?: string
          id?: string
          offer_id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "public_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buy_request_id: string
          buyer_rating: number | null
          contact_info: Json | null
          created_at: string
          delivery_time: string | null
          description: string | null
          id: string
          images: string[] | null
          message: string | null
          price: number
          price_history: Json | null
          public_visibility: boolean | null
          rejection_reason: string | null
          seller_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          buy_request_id: string
          buyer_rating?: number | null
          contact_info?: Json | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          message?: string | null
          price: number
          price_history?: Json | null
          public_visibility?: boolean | null
          rejection_reason?: string | null
          seller_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          buy_request_id?: string
          buyer_rating?: number | null
          contact_info?: Json | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          message?: string | null
          price?: number
          price_history?: Json | null
          public_visibility?: boolean | null
          rejection_reason?: string | null
          seller_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_buy_request_id_fkey"
            columns: ["buy_request_id"]
            isOneToOne: false
            referencedRelation: "buy_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          characteristics: Json | null
          contact_info: Json | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          max_price: number | null
          min_price: number | null
          reference_link: string | null
          title: string
          updated_at: string
          user_id: string
          zone: string
        }
        Insert: {
          characteristics?: Json | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_price?: number | null
          min_price?: number | null
          reference_link?: string | null
          title: string
          updated_at?: string
          user_id: string
          zone: string
        }
        Update: {
          characteristics?: Json | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_price?: number | null
          min_price?: number | null
          reference_link?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          offer_id: string | null
          rating: number
          review_text: string | null
          seller_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          offer_id?: string | null
          rating: number
          review_text?: string | null
          seller_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          offer_id?: string | null
          rating?: number
          review_text?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "public_offers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_buy_request_offers: {
        Row: {
          buy_request_id: string | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          price: number | null
          seller_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          buy_request_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          price?: number | null
          seller_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          buy_request_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          price?: number | null
          seller_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buy_request_offers_buy_request_id_fkey"
            columns: ["buy_request_id"]
            isOneToOne: false
            referencedRelation: "buy_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      public_offers: {
        Row: {
          buy_request_id: string | null
          buyer_rating: number | null
          created_at: string | null
          delivery_time: string | null
          description: string | null
          id: string | null
          images: string[] | null
          message: string | null
          price: number | null
          price_history: Json | null
          public_visibility: boolean | null
          rejection_reason: string | null
          seller_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          buy_request_id?: string | null
          buyer_rating?: number | null
          created_at?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          message?: string | null
          price?: number | null
          price_history?: Json | null
          public_visibility?: boolean | null
          rejection_reason?: string | null
          seller_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          buy_request_id?: string | null
          buyer_rating?: number | null
          created_at?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          message?: string | null
          price?: number | null
          price_history?: Json | null
          public_visibility?: boolean | null
          rejection_reason?: string | null
          seller_id?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_buy_request_id_fkey"
            columns: ["buy_request_id"]
            isOneToOne: false
            referencedRelation: "buy_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_posts: {
        Row: {
          characteristics: Json | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          max_price: number | null
          min_price: number | null
          reference_link: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          zone: string | null
        }
        Insert: {
          characteristics?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          max_price?: number | null
          min_price?: number | null
          reference_link?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          zone?: string | null
        }
        Update: {
          characteristics?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          max_price?: number | null
          min_price?: number | null
          reference_link?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_basic_profile_data: {
        Args: { profile_id: string }
        Returns: Json
      }
      get_buy_request_offer_contact_info: {
        Args: { offer_id: string; requesting_user_id: string }
        Returns: Json
      }
      get_offer_contact_info: {
        Args: { offer_id: string; requesting_user_id: string }
        Returns: Json
      }
      get_offer_for_user: {
        Args: { offer_id: string; user_id?: string }
        Returns: Json
      }
      get_post_contact_info: {
        Args: { post_id: string; requesting_user_id: string }
        Returns: Json
      }
      get_public_profile_data: {
        Args: { profile_id: string }
        Returns: Json
      }
      get_safe_profile_data: {
        Args: { profile_id: string }
        Returns: Json
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
