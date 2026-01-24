
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during build)
// This excludes the client from working at runtime but allows the build to pass.
const createMockClient = () => {
    const mockBuilder = {
        select: () => mockBuilder,
        insert: () => mockBuilder,
        update: () => mockBuilder,
        upsert: () => mockBuilder,
        delete: () => mockBuilder,
        eq: () => mockBuilder,
        neq: () => mockBuilder,
        gt: () => mockBuilder,
        lt: () => mockBuilder,
        gte: () => mockBuilder,
        lte: () => mockBuilder,
        in: () => mockBuilder,
        is: () => mockBuilder,
        like: () => mockBuilder,
        ilike: () => mockBuilder,
        contains: () => mockBuilder,
        order: () => mockBuilder,
        limit: () => mockBuilder,
        single: () => mockBuilder,
        maybeSingle: () => mockBuilder,
        upload: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase Config' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        then: (resolve) => resolve({ data: [], error: { message: 'Missing Supabase Config' } })
    };

    return {
        from: () => mockBuilder,
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase Config' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                list: () => Promise.resolve({ data: [], error: { message: 'Missing Supabase Config' } }),
                remove: () => Promise.resolve({ data: [], error: { message: 'Missing Supabase Config' } })
            })
        },
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Missing Config' } }),
            signOut: () => Promise.resolve({ error: null })
        }
    };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();
