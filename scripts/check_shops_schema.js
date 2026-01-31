
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkSchema() {
    // Get one shop to inspect keys
    // We can't query information_schema easily via client, so we insert/select mock or just select one
    const { data, error } = await supabase.from('shops').select('*').limit(1);

    if (error) {
        console.error('Error selecting shops:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Found columns:', Object.keys(data[0]));
    } else {
        console.log('No shops found to inspect columns. RLS might be hiding them?');
    }
}

checkSchema();
