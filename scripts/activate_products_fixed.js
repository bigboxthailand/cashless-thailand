
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY);

async function activateProducts() {
    console.log("Activating products (setting status='active')...");
    const { error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .neq('status', 'active'); // Update all that are not active

    if (error) console.error("Error:", error);
    else console.log("Products activated successfully!");
}

activateProducts();
