import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
    try {
        const envFile = await readFile(join(__dirname, '../.env'), 'utf-8');
        const env = {};
        for (const line of envFile.split('\n')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        }
        return env;
    } catch (e) {
        return {};
    }
}

async function debug() {
    const env = await loadEnv();
    const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

    // Try to select just ID first to see if table exists
    console.log("Checking table existence...");
    const { data: d1, error: e1 } = await supabase.from('products').select('id').limit(1);
    if (e1) console.error("Error selecting id:", e1);
    else console.log("Can select id. Data:", d1);

    // Try to select category
    console.log("Checking category column...");
    const { data: d2, error: e2 } = await supabase.from('products').select('category').limit(1);
    if (e2) console.error("Error selecting category:", e2);
    else console.log("Can select category. Data:", d2);

}

debug();
