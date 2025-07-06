import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  occupation?: string
  medical_history?: Record<string, any>
  emergency_contact?: Record<string, any>
  role: 'member' | 'admin' | 'super_admin'
  membership_status: 'pending' | 'active' | 'inactive' | 'suspended'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  user_id: string
  membership_type: string
  start_date: string
  end_date?: string
  is_active: boolean
  payment_status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ScreeningRecord {
  id: string
  user_id: string
  screening_type: string
  screening_date: string
  results: Record<string, any>
  recommendations?: string
  follow_up_date?: string
  status: string
  healthcare_provider?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  is_read: boolean
  action_url?: string
  created_at: string
}