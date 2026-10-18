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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
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
  public: {
    Tables: {
      arquivos: {
        Row: {
          caminho_r2: string
          categoria: string
          created_at: string
          data_vencimento: string | null
          empresa_id: string
          id: string
          locacao_id: string | null
          locatario_id: string | null
          mime_type: string
          nome_original: string
          tamanho_bytes: number
          veiculo_id: string | null
          vistoria_id: string | null
        }
        Insert: {
          caminho_r2: string
          categoria: string
          created_at?: string
          data_vencimento?: string | null
          empresa_id: string
          id?: string
          locacao_id?: string | null
          locatario_id?: string | null
          mime_type: string
          nome_original: string
          tamanho_bytes: number
          veiculo_id?: string | null
          vistoria_id?: string | null
        }
        Update: {
          caminho_r2?: string
          categoria?: string
          created_at?: string
          data_vencimento?: string | null
          empresa_id?: string
          id?: string
          locacao_id?: string | null
          locatario_id?: string | null
          mime_type?: string
          nome_original?: string
          tamanho_bytes?: number
          veiculo_id?: string | null
          vistoria_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_empresa_id_locacao_id_fkey"
            columns: ["empresa_id", "locacao_id"]
            isOneToOne: false
            referencedRelation: "locacoes"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "arquivos_empresa_id_locatario_id_fkey"
            columns: ["empresa_id", "locatario_id"]
            isOneToOne: false
            referencedRelation: "locatarios"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "arquivos_empresa_id_veiculo_id_fkey"
            columns: ["empresa_id", "veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "arquivos_empresa_id_veiculo_id_fkey"
            columns: ["empresa_id", "veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos_com_status"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "arquivos_empresa_id_vistoria_id_fkey"
            columns: ["empresa_id", "vistoria_id"]
            isOneToOne: false
            referencedRelation: "vistorias"
            referencedColumns: ["empresa_id", "id"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      locacoes: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          empresa_id: string
          id: string
          locatario_id: string
          updated_at: string
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          empresa_id: string
          id?: string
          locatario_id: string
          updated_at?: string
          veiculo_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          empresa_id?: string
          id?: string
          locatario_id?: string
          updated_at?: string
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locacoes_empresa_id_locatario_id_fkey"
            columns: ["empresa_id", "locatario_id"]
            isOneToOne: false
            referencedRelation: "locatarios"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "locacoes_empresa_id_veiculo_id_fkey"
            columns: ["empresa_id", "veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["empresa_id", "id"]
          },
          {
            foreignKeyName: "locacoes_empresa_id_veiculo_id_fkey"
            columns: ["empresa_id", "veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos_com_status"
            referencedColumns: ["empresa_id", "id"]
          },
        ]
      }
      locatarios: {
        Row: {
          cnh_categoria: string
          cnh_numero: string
          cnh_validade: string
          cpf: string
          created_at: string
          email: string | null
          emergencia_nome: string
          emergencia_parentesco: string
          emergencia_telefone: string
          empresa_id: string
          endereco: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string
        }
        Insert: {
          cnh_categoria: string
          cnh_numero: string
          cnh_validade: string
          cpf: string
          created_at?: string
          email?: string | null
          emergencia_nome: string
          emergencia_parentesco: string
          emergencia_telefone: string
          empresa_id: string
          endereco?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string
        }
        Update: {
          cnh_categoria?: string
          cnh_numero?: string
          cnh_validade?: string
          cpf?: string
          created_at?: string
          email?: string | null
          emergencia_nome?: string
          emergencia_parentesco?: string
          emergencia_telefone?: string
          empresa_id?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locatarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number
          chassi: string
          created_at: string
          empresa_id: string
          id: string
          marca: string
          modelo: string
          placa: string
          updated_at: string
        }
        Insert: {
          ano: number
          chassi: string
          created_at?: string
          empresa_id: string
          id?: string
          marca: string
          modelo: string
          placa: string
          updated_at?: string
        }
        Update: {
          ano?: number
          chassi?: string
          created_at?: string
          empresa_id?: string
          id?: string
          marca?: string
          modelo?: string
          placa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vistorias: {
        Row: {
          created_at: string
          data: string
          empresa_id: string
          id: string
          km: number
          locacao_id: string
          tipo: string
        }
        Insert: {
          created_at?: string
          data: string
          empresa_id: string
          id?: string
          km: number
          locacao_id: string
          tipo: string
        }
        Update: {
          created_at?: string
          data?: string
          empresa_id?: string
          id?: string
          km?: number
          locacao_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "vistorias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistorias_empresa_id_locacao_id_fkey"
            columns: ["empresa_id", "locacao_id"]
            isOneToOne: false
            referencedRelation: "locacoes"
            referencedColumns: ["empresa_id", "id"]
          },
        ]
      }
    }
    Views: {
      veiculos_com_status: {
        Row: {
          ano: number | null
          chassi: string | null
          created_at: string | null
          empresa_id: string | null
          id: string | null
          marca: string | null
          modelo: string | null
          placa: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ano?: number | null
          chassi?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string | null
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          status?: never
          updated_at?: string | null
        }
        Update: {
          ano?: number | null
          chassi?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string | null
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          status?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
