import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Simple .env parser to avoid adding dotenv dependency
async function loadEnv() {
    try {
        const envFile = await readFile(join(__dirname, '../.env'), 'utf-8');
        const env = {};
        for (const line of envFile.split('\n')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        }
        return env;
    } catch (e) {
        console.error('Could not read .env file', e);
        return {};
    }
}

async function seed() {
    const env = await loadEnv();
    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials in .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const productsData = await readFile(join(__dirname, '../src/data/products.json'), 'utf-8');
        const products = JSON.parse(productsData);

        console.log(`Found ${products.length} products to seed.`);

        for (const product of products) {
            const dbProduct = {
                id: product.id,
                category: product.category,
                meta: product.meta,
                marketing: product.marketing,
                tech_specs: product.techSpecs, // Map camelCase to snake_case
                config: product.config,
                pricing: product.pricing,
                media: product.media,
                manual_link: product.manualLink, // Map camelCase to snake_case
            };

            const { error } = await supabase
                .from('products')
                .upsert(dbProduct, { onConflict: 'id' });

            if (error) {
                console.error(`Error upserting product ${product.id}:`, error);
            } else {
                console.log(`Synced product: ${product.id}`);
            }
        }

        console.log('Success');
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
