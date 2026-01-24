
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during build)
// This excludes the client from working at runtime but allows the build to pass.
// We use a Proxy to handle ANY chained method call dynamically.
const createMockClient = () => {
    const noop = () => proxy; // Any method call returns the proxy again to allow chaining

    // The default response when 'await' is finally called or data is accessed
    const defaultResponse = {
        data: [],
        error: { message: 'Missing Supabase Config (Build Mode)' },
        count: 0
    };

    const proxy = new Proxy(() => { }, {
        get: (target, prop) => {
            // Handle 'then' to make it compatible with await
            if (prop === 'then') {
                return (resolve) => resolve(defaultResponse);
            }
            // Handle properties that should return specific structural data
            if (prop === 'storage') {
                return new Proxy({}, {
                    get: () => noop // storage.from(...).upload(...) -> returns proxy
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
            // For all other properties (select, from, eq, url, etc.), return the function that returns the proxy
            return noop;
        },
        apply: (target, thisArg, argumentsList) => {
            // If the proxy itself is called as a function (e.g. supabase.from('table')), return the proxy
            return proxy;
        }
    });

    return proxy;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();
