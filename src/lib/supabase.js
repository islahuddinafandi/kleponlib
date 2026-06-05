import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://ltjbewwrweirtaxzefvx.supabase.co
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0amJld3dyd2VpcnRheHplZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDU2MzMsImV4cCI6MjA5NjE4MTYzM30.pcmcVR2_siZdMLtmg_iIwEKxTiQvn-8TSVCe3R6iTd4

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase URL atau Anon Key belum diset di file .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
