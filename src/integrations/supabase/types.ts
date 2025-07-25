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
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          role?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      company_registrations: {
        Row: {
          created_at: string
          email: string
          employee_count_range: string | null
          id: string
          logo_url: string | null
          messaggio: string | null
          nome_azienda: string
          sede: string | null
          settore: string | null
          status: string | null
          telefono: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          employee_count_range?: string | null
          id?: string
          logo_url?: string | null
          messaggio?: string | null
          nome_azienda: string
          sede?: string | null
          settore?: string | null
          status?: string | null
          telefono?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          employee_count_range?: string | null
          id?: string
          logo_url?: string | null
          messaggio?: string | null
          nome_azienda?: string
          sede?: string | null
          settore?: string | null
          status?: string | null
          telefono?: string | null
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          website_url?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      recruiter_reviews: {
        Row: {
          company_email: string
          created_at: string
          id: string
          proposal_id: string | null
          rating: number
          recruiter_email: string
          review_text: string | null
          updated_at: string
        }
        Insert: {
          company_email: string
          created_at?: string
          id?: string
          proposal_id?: string | null
          rating: number
          recruiter_email: string
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          company_email?: string
          created_at?: string
          id?: string
          proposal_id?: string | null
          rating?: number
          recruiter_email?: string
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_reviews_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
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
      get_current_user_registration_id: {
        Args: { table_name: string }
        Returns: string
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      link_user_to_registration: {
        Args: { p_registration_id: string; p_user_type: string }
        Returns: boolean
      }
      populate_user_ids: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      test_email_system: {
        Args: Record<PropertyKey, never>
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
