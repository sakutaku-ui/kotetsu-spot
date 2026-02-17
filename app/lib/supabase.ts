import { createBrowserClient } from '@supabase/ssr'

export type Database = {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string
          name: string
          area: string
          station: string
          walk_minutes: number
          address: string
          description: string
          place_type: string
          lines: string[]
          safety_rank: number
          safety_note: string | null
          image: string
          status: string
          submitted_by: string | null
          approved_at: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          area: string
          station: string
          walk_minutes: number
          address: string
          description: string
          place_type: string
          lines: string[]
          safety_rank: number
          safety_note?: string | null
          image: string
          status?: string
          submitted_by?: string | null
          approved_at?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          area?: string
          station?: string
          walk_minutes?: number
          address?: string
          description?: string
          place_type?: string
          lines?: string[]
          safety_rank?: number
          safety_note?: string | null
          image?: string
          status?: string
          submitted_by?: string | null
          approved_at?: string | null
          display_order?: number
          updated_at?: string
        }
      }
    }
  }
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}