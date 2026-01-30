import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during build)
const createMockClient = () => {
    // The default response when 'await' is finally called or data is accessed
    const defaultResponse = {
        data: [],
        error: { message: 'Missing Supabase Config (Build Mode)' },
        count: 0
    };

    // Helper to return a proxy that absorbs all calls
    // @ts-ignore
    const createChainableProxy = () => new Proxy(() => { }, {
        get: (target, prop) => {
            if (prop === 'then') {
                return (resolve: any) => resolve(defaultResponse);
            }
            return () => createChainableProxy(); // Return function that returns proxy
        },
        apply: () => createChainableProxy()
    });

    return new Proxy({}, { // Target is an object, not a function
        get: (target, prop) => {
            if (prop === 'storage') {
                return new Proxy({}, {
                    get: () => () => createChainableProxy() // storage.from(...) -> returns chainable
                });
            }
            if (prop === 'auth') {
                return {
                    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Missing Config' } }),
                    signOut: () => Promise.resolve({ error: null })
                }
            }
            // For from() and other root methods
            return () => createChainableProxy();
        }
    }) as unknown as SupabaseClient;
};

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : createMockClient();

// Admin client for server-side only (bypasses RLS)
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = (supabaseUrl && serviceKey)
    ? createClient(supabaseUrl, serviceKey)
    : supabase; // Fallback to normal client if no service key
