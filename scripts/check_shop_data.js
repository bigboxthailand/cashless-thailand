
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkShopColumns() {
    console.log("Fetching a single shop to inspect columns...");
    const { data, error } = await supabase
        .from('shops')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching shop:", error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log("Shop Keys:", Object.keys(data[0]));
        console.log("Sample Shop Data:", data[0]);
    } else {
        console.log("No shops found in DB.");
    }
}

checkShopColumns();
