// scripts/refill_stock.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bulk update
);

async function refillStock() {
    console.log('🔍 Fetching all products...');
    const { data: products, error } = await supabase.from('products').select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    let updateCount = 0;

    for (const product of products) {
        let hasChanged = false;
        let config = product.config || {};
        let totalStockBefore = 0;

        // Calculate Stock
        if (config.hasVariants && config.variants?.length > 0) {
            totalStockBefore = config.variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0);
        } else {
            totalStockBefore = parseInt(config.inventory?.stock || 0);
        }

        // Only process if out of stock
        if (totalStockBefore <= 0) {
            console.log(`📦 Refilling: ${product.meta?.title || product.id}`);

            if (config.hasVariants && config.variants?.length > 0) {
                // Refill all variants to 10
                config.variants = config.variants.map(v => ({
                    ...v,
                    stock: 10
                }));
                hasChanged = true;
            } else {
                // Refill main stock to 10
                if (!config.inventory) config.inventory = {};
                config.inventory.stock = 10;
                hasChanged = true;
            }
        }

        if (hasChanged) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ config })
                .eq('id', product.id);

            if (updateError) {
                console.error(`❌ Failed to update ${product.id}:`, updateError);
            } else {
                console.log(`✅ Success: ${product.meta?.title || product.id} is now back in stock (10 units)`);
                updateCount++;
            }
        }
    }

    console.log(`\n🎉 Task Completed. Updated ${updateCount} products.`);
}

refillStock();
