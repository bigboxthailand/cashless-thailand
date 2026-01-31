
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listProducts() {
    console.log("Listing all products...");
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log("Found products:");
    data.forEach(p => {
        // Check if name is top-level or in meta
        const name = p.name || p.meta?.title || "Untitled";
        console.log(`- Slug: ${p.slug}, ID: ${p.id}, Name: ${name}`);
    });
}

listProducts();
