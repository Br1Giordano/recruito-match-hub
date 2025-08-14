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
      company_fiscal_data: {
        Row: {
          cap_fatturazione: string | null
          citta_fatturazione: string | null
          codice_fiscale: string | null
          codice_sdi: string | null
          company_id: string
          created_at: string
          iban: string | null
          id: string
          indirizzo_fatturazione: string | null
          is_complete: boolean
          partita_iva: string | null
          pec: string | null
          provincia_fatturazione: string | null
          ragione_sociale: string | null
          swift: string | null
          updated_at: string
        }
        Insert: {
          cap_fatturazione?: string | null
          citta_fatturazione?: string | null
          codice_fiscale?: string | null
          codice_sdi?: string | null
          company_id: string
          created_at?: string
          iban?: string | null
          id?: string
          indirizzo_fatturazione?: string | null
          is_complete?: boolean
          partita_iva?: string | null
          pec?: string | null
          provincia_fatturazione?: string | null
          ragione_sociale?: string | null
          swift?: string | null
          updated_at?: string
        }
        Update: {
          cap_fatturazione?: string | null
          citta_fatturazione?: string | null
          codice_fiscale?: string | null
          codice_sdi?: string | null
          company_id?: string
          created_at?: string
          iban?: string | null
          id?: string
          indirizzo_fatturazione?: string | null
          is_complete?: boolean
          partita_iva?: string | null
          pec?: string | null
          provincia_fatturazione?: string | null
          ragione_sociale?: string | null
          swift?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_company_fiscal_data_company_id"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_registrations"
            referencedColumns: ["id"]
          },
        ]
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
      compliance_audit_log: {
        Row: {
          audit_type: string
          audited_by: string | null
          compliance_status: string
          created_at: string
          entity_id: string | null
          entity_type: string
          findings: string[] | null
          id: string
          metadata: Json | null
          recommendations: string[] | null
        }
        Insert: {
          audit_type: string
          audited_by?: string | null
          compliance_status: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          findings?: string[] | null
          id?: string
          metadata?: Json | null
          recommendations?: string[] | null
        }
        Update: {
          audit_type?: string
          audited_by?: string | null
          compliance_status?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          findings?: string[] | null
          id?: string
          metadata?: Json | null
          recommendations?: string[] | null
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_mandatory: boolean
          language: string
          name: string
          updated_at: string
          variables: Json | null
          version: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_mandatory?: boolean
          language?: string
          name: string
          updated_at?: string
          variables?: Json | null
          version?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_mandatory?: boolean
          language?: string
          name?: string
          updated_at?: string
          variables?: Json | null
          version?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          company_email: string
          created_at: string
          id: string
          last_message_at: string
          proposal_id: string | null
          recruiter_email: string
          updated_at: string
        }
        Insert: {
          company_email: string
          created_at?: string
          id?: string
          last_message_at?: string
          proposal_id?: string | null
          recruiter_email: string
          updated_at?: string
        }
        Update: {
          company_email?: string
          created_at?: string
          id?: string
          last_message_at?: string
          proposal_id?: string | null
          recruiter_email?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_contracts: {
        Row: {
          content: string
          contract_type: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          template_data: Json | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          contract_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          template_data?: Json | null
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          content?: string
          contract_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          template_data?: Json | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      gdpr_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          data_categories: string[] | null
          description: string
          id: string
          ip_address: unknown | null
          legal_basis: string | null
          metadata: Json | null
          processed_by: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          data_categories?: string[] | null
          description: string
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          metadata?: Json | null
          processed_by?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          data_categories?: string[] | null
          description?: string
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          metadata?: Json | null
          processed_by?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          processed_by: string | null
          rejection_reason: string | null
          request_type: string
          requested_data: string[] | null
          response_data: Json | null
          status: string
          updated_at: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          processed_by?: string | null
          rejection_reason?: string | null
          request_type: string
          requested_data?: string[] | null
          response_data?: Json | null
          status?: string
          updated_at?: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          processed_by?: string | null
          rejection_reason?: string | null
          request_type?: string
          requested_data?: string[] | null
          response_data?: Json | null
          status?: string
          updated_at?: string
          user_email?: string
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
      legal_notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          notification_type: string
          priority: string
          read_at: string | null
          target_audience: string
          target_user_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string
          read_at?: string | null
          target_audience: string
          target_user_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string
          read_at?: string | null
          target_audience?: string
          target_user_id?: string | null
          title?: string
        }
        Relationships: []
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
      messages: {
        Row: {
          attachment_url: string | null
          conversation_id: string
          created_at: string
          id: string
          message_content: string
          read_at: string | null
          sender_email: string
          sender_type: string
        }
        Insert: {
          attachment_url?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          message_content: string
          read_at?: string | null
          sender_email: string
          sender_type: string
        }
        Update: {
          attachment_url?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          message_content?: string
          read_at?: string | null
          sender_email?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
          candidate_cv_anonymized_url: string | null
          candidate_cv_url: string | null
          candidate_email: string
          candidate_linkedin: string | null
          candidate_name: string
          candidate_phone: string | null
          company_access_level:
            | Database["public"]["Enums"]["access_level_enum"]
            | null
          company_id: string | null
          contact_data_protected: boolean | null
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
          candidate_cv_anonymized_url?: string | null
          candidate_cv_url?: string | null
          candidate_email: string
          candidate_linkedin?: string | null
          candidate_name: string
          candidate_phone?: string | null
          company_access_level?:
            | Database["public"]["Enums"]["access_level_enum"]
            | null
          company_id?: string | null
          contact_data_protected?: boolean | null
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
          candidate_cv_anonymized_url?: string | null
          candidate_cv_url?: string | null
          candidate_email?: string
          candidate_linkedin?: string | null
          candidate_name?: string
          candidate_phone?: string | null
          company_access_level?:
            | Database["public"]["Enums"]["access_level_enum"]
            | null
          company_id?: string | null
          contact_data_protected?: boolean | null
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
      recruiter_achievements: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          progress: number | null
          recruiter_email: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          progress?: number | null
          recruiter_email: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          progress?: number | null
          recruiter_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_achievements_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "recruiter_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_badges: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          points: number
          rarity: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          points?: number
          rarity?: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          points?: number
          rarity?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      recruiter_job_interests: {
        Row: {
          created_at: string
          id: string
          job_offer_id: string
          notes: string | null
          recruiter_email: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_offer_id: string
          notes?: string | null
          recruiter_email: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_offer_id?: string
          notes?: string | null
          recruiter_email?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      recruiter_stats: {
        Row: {
          accepted_proposals: number
          best_streak: number
          created_at: string
          current_streak: number
          id: string
          last_proposal_date: string | null
          level: number
          recruiter_email: string
          total_points: number
          total_proposals: number
          updated_at: string
        }
        Insert: {
          accepted_proposals?: number
          best_streak?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_proposal_date?: string | null
          level?: number
          recruiter_email: string
          total_points?: number
          total_proposals?: number
          updated_at?: string
        }
        Update: {
          accepted_proposals?: number
          best_streak?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_proposal_date?: string | null
          level?: number
          recruiter_email?: string
          total_points?: number
          total_proposals?: number
          updated_at?: string
        }
        Relationships: []
      }
      signed_contracts: {
        Row: {
          contract_data: Json | null
          contract_id: string
          created_at: string
          expiry_date: string | null
          id: string
          ip_address: unknown | null
          signature_data: Json
          signed_at: string
          status: string
          user_agent: string | null
          user_email: string
          user_id: string
          user_type: string
        }
        Insert: {
          contract_data?: Json | null
          contract_id: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          ip_address?: unknown | null
          signature_data: Json
          signed_at?: string
          status?: string
          user_agent?: string | null
          user_email: string
          user_id: string
          user_type: string
        }
        Update: {
          contract_data?: Json | null
          contract_id?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          ip_address?: unknown | null
          signature_data?: Json
          signed_at?: string
          status?: string
          user_agent?: string | null
          user_email?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "signed_contracts_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "digital_contracts"
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
      calculate_level_from_points: {
        Args: { total_points: number }
        Returns: number
      }
      check_and_award_badges: {
        Args: { recruiter_email_param: string }
        Returns: undefined
      }
      cleanup_old_login_attempts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fix_test_users_profiles: {
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
      update_recruiter_stats: {
        Args: { recruiter_email_param: string }
        Returns: undefined
      }
    }
    Enums: {
      access_level_enum: "restricted" | "partial" | "full"
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
      access_level_enum: ["restricted", "partial", "full"],
    },
  },
} as const
