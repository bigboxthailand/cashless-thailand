
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // Try to find the product by ID or partial match
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .ilike('id', '%bitcoin%');

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(products, null, 2));
}

run();
