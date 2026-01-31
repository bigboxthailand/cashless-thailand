
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function activateProducts() {
    console.log("Activating products...");

    // First get some IDs
    const { data: products } = await supabase
        .from('products')
        .select('id')
        .limit(8);

    if (!products || products.length === 0) {
        console.log("No products found to activate.");
        return;
    }

    const ids = products.map(p => p.id);
    console.log(`Found ${ids.length} products. Activating...`);

    const { error } = await supabase
        .from('products')
        .update({ is_active: true })
        .in('id', ids);

    if (error) {
        console.error("Error activating products:", error);
    } else {
        console.log("Products activated successfully!");
    }
}

activateProducts();
