
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY);

async function checkProductStatus() {
    console.log("Checking product status...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name, status, is_active')
        .limit(10);

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (data.length === 0) {
        console.log("No products found.");
    } else {
        console.log("Found products:");
        data.forEach(p => console.log(`- ${p.name || p.id}: status='${p.status}', is_active=${p.is_active}`));
    }
}

checkProductStatus();
