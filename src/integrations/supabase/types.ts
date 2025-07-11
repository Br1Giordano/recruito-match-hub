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
      company_registrations: {
        Row: {
          created_at: string
          email: string
          id: string
          messaggio: string | null
          nome_azienda: string
          settore: string | null
          status: string | null
          telefono: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          messaggio?: string | null
          nome_azienda: string
          settore?: string | null
          status?: string | null
          telefono?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          messaggio?: string | null
          nome_azienda?: string
          settore?: string | null
          status?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      job_offers: {
        Row: {
          benefits: string | null
          company_id: string | null
          company_name: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_offers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_time: string | null
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          attempt_time?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          attempt_time?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      proposal_responses: {
        Row: {
          company_id: string
          created_at: string
          feedback_notes: string | null
          id: string
          interview_date: string | null
          proposal_id: string
          response_message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          feedback_notes?: string | null
          id?: string
          interview_date?: string | null
          proposal_id: string
          response_message?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          feedback_notes?: string | null
          id?: string
          interview_date?: string | null
          proposal_id?: string
          response_message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_responses_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          availability_weeks: number | null
          candidate_cv_url: string | null
          candidate_email: string
          candidate_linkedin: string | null
          candidate_name: string
          candidate_phone: string | null
          company_id: string | null
          created_at: string
          current_salary: number | null
          expected_salary: number | null
          id: string
          job_offer_id: string | null
          proposal_description: string | null
          recruiter_email: string | null
          recruiter_fee_percentage: number | null
          recruiter_id: string | null
          recruiter_name: string | null
          recruiter_phone: string | null
          status: string | null
          submitted_by_user_id: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability_weeks?: number | null
          candidate_cv_url?: string | null
          candidate_email: string
          candidate_linkedin?: string | null
          candidate_name: string
          candidate_phone?: string | null
          company_id?: string | null
          created_at?: string
          current_salary?: number | null
          expected_salary?: number | null
          id?: string
          job_offer_id?: string | null
          proposal_description?: string | null
          recruiter_email?: string | null
          recruiter_fee_percentage?: number | null
          recruiter_id?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          status?: string | null
          submitted_by_user_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability_weeks?: number | null
          candidate_cv_url?: string | null
          candidate_email?: string
          candidate_linkedin?: string | null
          candidate_name?: string
          candidate_phone?: string | null
          company_id?: string | null
          created_at?: string
          current_salary?: number | null
          expected_salary?: number | null
          id?: string
          job_offer_id?: string | null
          proposal_description?: string | null
          recruiter_email?: string | null
          recruiter_fee_percentage?: number | null
          recruiter_id?: string | null
          recruiter_name?: string | null
          recruiter_phone?: string | null
          status?: string | null
          submitted_by_user_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_job_offer_id_fkey"
            columns: ["job_offer_id"]
            isOneToOne: false
            referencedRelation: "job_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_registrations: {
        Row: {
          avatar_url: string | null
          azienda: string | null
          bio: string | null
          cognome: string
          created_at: string
          email: string
          esperienza: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          messaggio: string | null
          nome: string
          settori: string | null
          specializations: string[] | null
          status: string | null
          telefono: string | null
          website_url: string | null
          years_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          azienda?: string | null
          bio?: string | null
          cognome: string
          created_at?: string
          email: string
          esperienza?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          messaggio?: string | null
          nome: string
          settori?: string | null
          specializations?: string[] | null
          status?: string | null
          telefono?: string | null
          website_url?: string | null
          years_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          azienda?: string | null
          bio?: string | null
          cognome?: string
          created_at?: string
          email?: string
          esperienza?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          messaggio?: string | null
          nome?: string
          settori?: string | null
          specializations?: string[] | null
          status?: string | null
          telefono?: string | null
          website_url?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          auth_user_id: string | null
          created_at: string
          id: string
          registration_id: string
          updated_at: string
          user_type: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          id?: string
          registration_id: string
          updated_at?: string
          user_type: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          id?: string
          registration_id?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_login_attempts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      link_user_to_registration: {
        Args: { p_registration_id: string; p_user_type: string }
        Returns: boolean
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
