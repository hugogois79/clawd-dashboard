import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zyziolikudoczsthyoja.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5emlvbGlrdWRvY3pzdGh5b2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMjAxMzAsImV4cCI6MjA1NDg5NjEzMH0.PE0gfXVcnGBCfMRGXYwfnUNKLBBfLlps2i3BhsAv4EQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Board configuration for Clawd Dashboard
export const CLAWD_BOARD = {
  id: '0f42f99c-d694-4fc8-a337-4fa24959a35b',
  lists: {
    todo: 'b5227a2d-a9aa-4b8f-96ca-99d03eb140c8',
    inProgress: '18cb5e67-7c1b-44b9-8b3c-7430920c3b7a',
    done: '009f3a4d-09e6-4822-a9c6-e3685085952f',
    archived: 'abbd686e-3b69-42ff-9267-e049d9f60bc4'
  }
}
