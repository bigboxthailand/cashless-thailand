
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductSchema() {
    console.log("Checking products table schema...");
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error('Error selecting products:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Found product columns:', Object.keys(data[0]));
    } else {
        console.log('No products found or empty.');
    }
}

checkProductSchema();
