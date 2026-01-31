
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use ANON key to simulate frontend/client access
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVisibility() {
    console.log("--- Debugging Shop Visibility (Anon Key) ---");

    // 1. Fetch All Profiles
    console.log("\n1. Fetching Profiles...");
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

    if (profileError) console.error("❌ Error fetching profiles:", profileError);
    else console.log(`✅ Found ${profiles.length} profiles.`, profiles);

    // 2. Fetch All Shops
    console.log("\n2. Fetching Shops...");
    const { data: shops, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .limit(5);

    if (shopError) console.error("❌ Error fetching shops:", shopError);
    else console.log(`✅ Found ${shops.length} shops.`, shops);

    // 3. Check for specific pending status
    if (shops && shops.length > 0) {
        const pendingShops = shops.filter(s => s.status === 'pending');
        console.log(`\nFound ${pendingShops.length} PENDING shops.`);
        pendingShops.forEach(s => console.log(`- Shop: ${s.name} (Owner: ${s.owner_id})`));
    }
}

debugVisibility();
