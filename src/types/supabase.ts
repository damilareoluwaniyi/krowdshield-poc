export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          role: 'individual' | 'business'
          safety_score: number
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          role: 'individual' | 'business'
          safety_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          role?: 'individual' | 'business'
          safety_score?: number
          created_at?: string
        }
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
  }
}