
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for backend actions

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyStockDeduction() {
    console.log("🔍 Starting Stock Deduction Verification...");

    // 1. Find a target product (prefer one with stock > 0)
    const { data: products, error: pError } = await supabase
        .from('products')
        .select('*')
        .not('config', 'is', null) // Ensure config exists
        .limit(5);

    if (pError || !products.length) {
        console.error("❌ Failed to fetch products:", pError);
        return;
    }

    // Pick a product suitable for testing
    // Prefer one WITHOUT variants for simplicity first, or handle based on structure
    let targetProduct = products.find(p => !p.config.hasVariants && (parseInt(p.config.inventory?.stock) || 0) > 0);

    // If no simple product, try variant
    let isVariant = false;
    let variantName = null;

    if (!targetProduct) {
        targetProduct = products.find(p => p.config.hasVariants === true);
        isVariant = true;
        if (targetProduct) {
            variantName = targetProduct.config.variants[0].name;
        }
    }

    if (!targetProduct) {
        console.error("❌ No suitable product found for testing (Stock may be 0)");
        return;
    }

    const startStock = isVariant
        ? parseInt(targetProduct.config.variants.find(v => v.name === variantName).stock)
        : parseInt(targetProduct.config.inventory.stock);

    console.log(`📦 Target: ${targetProduct.name || targetProduct.meta.title} (ID: ${targetProduct.id})`);
    console.log(`   Type: ${isVariant ? `Variant (${variantName})` : 'Simple'}`);
    console.log(`   Start Stock: ${startStock}`);

    // 2. Create a Dummy Order
    const { data: order, error: oError } = await supabase
        .from('orders')
        .insert({
            id: `TEST-ORDER-${Date.now()}`,
            customer_name: 'Link Verification Bot',
            total_price: 100,
            payment_method: 'Test',
            payment_status: 'test_pending'
        })
        .select()
        .single();

    if (oError) {
        console.error("❌ Failed to create test order:", oError);
        return;
    }

    console.log(`📝 Order Created: ${order.id}`);

    // 3. Insert Order Item (This should trigger the deduction)
    const { error: iError } = await supabase
        .from('order_items')
        .insert({
            order_id: order.id,
            product_id: targetProduct.id,
            variant_name: variantName, // Will be null if simple
            title: 'Test Item',
            price: 100,
            quantity: 1
        });

    if (iError) {
        console.error("❌ Failed to insert order item:", iError);
        // Clean up order
        await supabase.from('orders').delete().eq('id', order.id);
        return;
    }

    console.log("✅ Order Item Inserted. Trigger should have fired.");

    // 4. Check Stock Again
    const { data: updatedProduct } = await supabase
        .from('products')
        .select('*')
        .eq('id', targetProduct.id)
        .single();

    const endStock = isVariant
        ? parseInt(updatedProduct.config.variants.find(v => v.name === variantName).stock)
        : parseInt(updatedProduct.config.inventory.stock);

    console.log(`   End Stock:   ${endStock}`);

    // 5. Assert
    if (startStock - 1 === endStock) {
        console.log("🎉 SUCCESS! Stock deducted by 1.");
    } else {
        console.error(`🚨 FAILURE! Stock did not change correctly. Expected ${startStock - 1}, gat ${endStock}`);
    }

    // 6. Cleanup (Optional: Keep order for user to see, or delete? Better delete to not junk up DB)
    console.log("sweeping up test data...");
    await supabase.from('order_items').delete().eq('order_id', order.id);
    await supabase.from('orders').delete().eq('id', order.id);

    // Restore stock (since we deleted the item, the trigger DOES NOT auto-restore unless we wrote a delete trigger too)
    // We manually restore for this test
    if (isVariant) {
        const variants = updatedProduct.config.variants;
        const vIndex = variants.findIndex(v => v.name === variantName);
        variants[vIndex].stock = startStock; // Restore original
        await supabase.from('products').update({ config: { ...updatedProduct.config, variants } }).eq('id', targetProduct.id);
    } else {
        const newConfig = { ...updatedProduct.config };
        newConfig.inventory.stock = startStock;
        await supabase.from('products').update({ config: newConfig }).eq('id', targetProduct.id);
    }
    console.log("🧹 Cleanup Complete & Stock Restored.");

}

verifyStockDeduction();
