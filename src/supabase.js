import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zyziolikudoczsthyoja.supabase.co'
// Using service role key for now (dashboard is password protected anyway)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5emlvbGlrdWRvY3pzdGh5b2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTMyMDEzMCwiZXhwIjoyMDU0ODk2MTMwfQ.GcYnQqjiGq-mgU_PqwlQV2UAQKm59xfRYRL1b9jRqEw'

export const supabase = createClient(supabaseUrl, supabaseKey)

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
