
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during build)
// This prevents the build from crashing but will log a warning
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({ select: () => ({ data: [], error: 'Missing Supabase Config' }), upload: () => ({ error: 'Missing Config' }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }),
        storage: { from: () => ({ upload: () => ({ error: 'Missing Config' }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
        auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }), getSession: () => ({ data: { session: null } }) }
    }; // Mock client for build time validation
