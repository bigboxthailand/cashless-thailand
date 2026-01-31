
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

async function checkProducts() {
    console.log("Checking products table...");
    const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' });

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Total products: ${count}`);

    const activeProducts = data.filter(p => p.is_active);
    console.log(`Active products: ${activeProducts.length}`);

    if (data.length > 0) {
        console.log("Sample product:", {
            id: data[0].id,
            name: data[0].name,
            is_active: data[0].is_active
        });
    }
}

checkProducts();
