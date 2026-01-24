'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseConfig) {
    return null
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  }
  
  return supabaseInstance
}
