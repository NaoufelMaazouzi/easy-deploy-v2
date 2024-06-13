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
      pages: {
        Row: {
          content: string
          created_at: string
          description: string
          h1: string
          id: number
          published: boolean
          site_id: number
          slug: string
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          description?: string
          h1?: string
          id?: number
          published?: boolean
          site_id: number
          slug?: string
          title?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          h1?: string
          id?: number
          published?: boolean
          site_id?: number
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites_without_users"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          contactMail: string
          contactPhone: string
          corporateName: string
          created_at: string
          customDomain: string | null
          description: string
          headquartersCity: Json
          id: number
          mainActivityCity: Json | null
          name: string | null
          radius: number | null
          secondaryActivityCities: Json[] | null
          services: Json[] | null
          subdomain: string
          user_id: string
        }
        Insert: {
          contactMail?: string
          contactPhone?: string
          corporateName?: string
          created_at?: string
          customDomain?: string | null
          description?: string
          headquartersCity: Json
          id?: number
          mainActivityCity?: Json | null
          name?: string | null
          radius?: number | null
          secondaryActivityCities?: Json[] | null
          services?: Json[] | null
          subdomain?: string
          user_id: string
        }
        Update: {
          contactMail?: string
          contactPhone?: string
          corporateName?: string
          created_at?: string
          customDomain?: string | null
          description?: string
          headquartersCity?: Json
          id?: number
          mainActivityCity?: Json | null
          name?: string | null
          radius?: number | null
          secondaryActivityCities?: Json[] | null
          services?: Json[] | null
          subdomain?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      pages_with_sites_values: {
        Row: {
          content: string | null
          created_at: string | null
          customdomain: string | null
          description: string | null
          h1: string | null
          id: number | null
          published: boolean | null
          site_id: number | null
          slug: string | null
          subdomain: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites_without_users"
            referencedColumns: ["id"]
          },
        ]
      }
      sites_with_users: {
        Row: {
          contactMail: string | null
          contactPhone: string | null
          corporateName: string | null
          created_at: string | null
          customDomain: string | null
          description: string | null
          email: string | null
          headquartersCity: Json | null
          id: number | null
          mainActivityCity: Json | null
          name: string | null
          radius: number | null
          secondaryActivityCities: Json[] | null
          services: Json[] | null
          subdomain: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sites_without_users: {
        Row: {
          contactMail: string | null
          contactPhone: string | null
          corporateName: string | null
          created_at: string | null
          customDomain: string | null
          description: string | null
          headquartersCity: Json | null
          id: number | null
          mainActivityCity: Json | null
          name: string | null
          radius: number | null
          secondaryActivityCities: Json[] | null
          services: Json[] | null
          subdomain: string | null
        }
        Insert: {
          contactMail?: string | null
          contactPhone?: string | null
          corporateName?: string | null
          created_at?: string | null
          customDomain?: string | null
          description?: string | null
          headquartersCity?: Json | null
          id?: number | null
          mainActivityCity?: Json | null
          name?: string | null
          radius?: number | null
          secondaryActivityCities?: Json[] | null
          services?: Json[] | null
          subdomain?: string | null
        }
        Update: {
          contactMail?: string | null
          contactPhone?: string | null
          corporateName?: string | null
          created_at?: string | null
          customDomain?: string | null
          description?: string | null
          headquartersCity?: Json | null
          id?: number | null
          mainActivityCity?: Json | null
          name?: string | null
          radius?: number | null
          secondaryActivityCities?: Json[] | null
          services?: Json[] | null
          subdomain?: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
