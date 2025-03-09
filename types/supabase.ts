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
      incidents: {
        Row: {
          id: string
          type: string
          description: string
          location: string
          severity: 'low' | 'medium' | 'high'
          time: string
          date: string
          reportedBy: string
          coordinates?: { latitude: number; longitude: number }
          created_at?: string
        }
        Insert: {
          id?: string
          type: string
          description: string
          location: string
          severity: 'low' | 'medium' | 'high'
          time: string
          date: string
          reportedBy: string
          coordinates?: { latitude: number; longitude: number }
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          description?: string
          location?: string
          severity?: 'low' | 'medium' | 'high'
          time?: string
          date?: string
          reportedBy?: string
          coordinates?: { latitude: number; longitude: number }
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string
          safetyScore: number
          recentIncidents: number
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          safetyScore?: number
          recentIncidents?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          safetyScore?: number
          recentIncidents?: number
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