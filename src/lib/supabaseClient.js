
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during build)
// This excludes the client from working at runtime but allows the build to pass.
// We use a Proxy to handle ANY chained method call dynamically.
// Fail gracefully if env vars are missing (e.g. during build)
// This excludes the client from working at runtime but allows the build to pass.
// We use a Proxy to handle ANY chained method call dynamically.
const createMockClient = () => {
    // The default response when 'await' is finally called or data is accessed
    const defaultResponse = {
        data: [],
        error: { message: 'Missing Supabase Config (Build Mode)' },
        count: 0
    };

    // Helper to return a proxy that absorbs all calls
    const createChainableProxy = () => new Proxy(() => { }, {
        get: (target, prop) => {
            if (prop === 'then') {
                return (resolve) => resolve(defaultResponse);
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
    });
};

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();
