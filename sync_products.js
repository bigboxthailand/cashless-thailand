
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Environment Variables manually since we are in a standalone script
// (Assuming .env is in root)
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(line => line.includes('=')).map(line => line.split('=')));

const supabaseUrl = env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_KEY; // If needed, but Anon with RLS policy might work if we set policy to true for insert?
// Actually simpler: just use Anon Key and ensure we have an INSERT policy for now or just generic policy.
// For this script, assume we might need to rely on the previously set "true" policies or just run this.

const supabase = createClient(supabaseUrl, supabaseKey);

// Read Products JSON
const productsPath = path.join(__dirname, 'src/data/products.json');
const productsRaw = fs.readFileSync(productsPath, 'utf8');
const products = JSON.parse(productsRaw);

async function sync() {
    console.log(`Found ${products.length} products to sync...`);

    const dbProducts = products.map(p => ({
        id: p.id,
        title: p.meta.title,
        price: p.pricing.basePrice,
        category: p.category,
        image_url: p.media.mainImage,
        stock: 50 // Default stock
    }));

    const { error } = await supabase.from('products').upsert(dbProducts);

    if (error) {
        console.error("Sync Error:", error);
    } else {
        console.log("✅ Products Synced Successfully!");
    }
}

sync();
