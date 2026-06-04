import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://yzaiqyinpscbdsbvtuip.supabase.co
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWlxeWlucHNjYmRzYnZ0dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjI4NjMsImV4cCI6MjA5NjA5ODg2M30.Gv5Rnc6Lyclc8cDRJffUi6cBBcdiaBMrFOK_qlAXztA

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
