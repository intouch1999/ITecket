
import { createClient } from '@supabase/supabase-js'

let supabaseClient = null

export const useSupabase = () => {
    const config = useRuntimeConfig()
    
    if (!supabaseClient) {
        supabaseClient = createClient(
            config.public.supabaseUrl,
            config.public.supabaseKey
        )
    }
    
    return supabaseClient
}