
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin tasks in test
);

async function verifySellerOrders() {
    console.log("🔍 Starting Verification: Seller Order Logic");


    let shopId, testProductId, testOrderId; // Declare variables for cleanup
    const testUserId = '3b5859ea-8a64-41f1-8071-75d35efa67a7'; // Existing ID

    try {

        // 1. Setup Data
        console.log(`📝 Setting up Test Data for User: ${testUserId}`);

        // Ensure Profile Exists
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: testUserId,
            email: 'existing.user@example.com',
            full_name: 'Existing Verify User'
        });
        if (profileError) console.warn('Profile upsert warning:', profileError.message);

        // Create or Get Shop
        const { data: existingShop } = await supabase.from('shops').select('*').eq('owner_id', testUserId).single();

        if (existingShop) {
            shopId = existingShop.id;
            console.log(`   Using Existing Shop: ${shopId}`);
        } else {
            const testShopSlug = `shop-${Date.now()}`;
            const { data: shopData, error: shopError } = await supabase.from('shops').insert({
                owner_id: testUserId,
                name: 'Test Setup Shop ' + Date.now(),
                slug: testShopSlug,
                description: 'Created by verification script',
                status: 'active'
            }).select().single();

            if (shopError) throw new Error('Shop Creation Failed: ' + shopError.message);
            shopId = shopData.id;
            console.log(`   Created Test Shop: ${shopId}`);
        }

        testProductId = 'test-prod-' + Date.now();
        testOrderId = 'ORD-TEST-' + Date.now();

        // Insert Test Product linked to this shop
        // Schema: name -> meta.title, price -> pricing.basePrice, stock -> config.inventory.stock
        const { error: prodError } = await supabase.from('products').insert({
            id: testProductId,
            shop_id: shopId,
            category: 'Test',
            meta: {
                title: 'Test Product for Verification',
                description: 'Test Description'
            },
            pricing: {
                basePrice: 100
            },
            config: {
                inventory: { stock: 10 }
            },
            media: {
                mainImage: 'https://placehold.co/100'
            }
        });
        if (prodError) throw new Error('Product Creation Failed: ' + prodError.message);

        // Insert Test Order
        const { error: orderError } = await supabase.from('orders').insert({
            id: testOrderId,
            user_id: testUserId,
            total_price: 200,
            payment_status: 'paid',
            payment_method: 'PromptPay', // Required field
            shipping_status: 'pending'
        });
        if (orderError) throw new Error('Order Creation Failed: ' + orderError.message);

        // Insert Test Order Item
        const { error: itemError } = await supabase.from('order_items').insert({
            order_id: testOrderId,
            product_id: testProductId,
            quantity: 2,
            price: 100,
            title: 'Test Product',
            variant_name: 'Standard'
        });
        if (itemError) throw new Error('Order Item Creation Failed: ' + itemError.message);


        // 2. Execute the Logic (Replicating `orders.astro`)
        console.log("⚙️  Executing Query Logic...");

        // Step A: Get My Products
        const { data: myProducts, error: myProdError } = await supabase
            .from('products')
            .select('id')
            .eq('shop_id', shopId);

        if (myProdError) throw new Error('Query MyProducts failed: ' + myProdError.message);

        const myProductIds = myProducts.map(p => p.id);
        console.log(`   Found ${myProductIds.length} products for this shop.`);
        if (!myProductIds.includes(testProductId)) throw new Error("Newly created product not found in shop products!");

        // Step B: Get Order Items
        const { data: orderItems } = await supabase
            .from('order_items')
            .select('order_id')
            .in('product_id', myProductIds);

        // Step C: Get Unique Orders
        const uniqueOrderIds = [...new Set(orderItems.map(item => item.order_id))];
        console.log(`   Found ${uniqueOrderIds.length} unique orders.`);
        if (!uniqueOrderIds.includes(testOrderId)) throw new Error("Test order not found in search results!");

        // Step D: Fetch Full Orders
        const { data: fullOrders } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    product:products (
                        id, meta, shop_id
                    )
                )
            `)
            .in('id', uniqueOrderIds);

        if (!fullOrders) throw new Error("Fetch Full Orders returned null. Likely query error.");

        // Step E: Filter & Calculate
        const targetOrder = fullOrders.find(o => o.id === testOrderId);
        // Emulate frontend filtering logic
        const myItems = targetOrder.order_items.filter(item =>
            (item.product && item.product.shop_id === shopId) || myProductIds.includes(item.product_id)
        );
        const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        console.log(`   Calculated Revenue: ${myTotal}`);

        if (myTotal !== 200) throw new Error(`Expected revenue 200, got ${myTotal}`);

        console.log("✅ Query Verification Passed!");

        // 3. Verify Tracking Update (Append Logic)
        console.log("⚙️  Verifying Tracking Update...");
        // Initial Update
        const shopName = "TestShop";
        const newTracking = "TRK-001";
        const entry1 = `${shopName}: ${newTracking}`;

        const { error: updateError1 } = await supabase.from('orders')
            .update({ tracking_number: entry1, shipping_status: 'shipped' })
            .eq('id', testOrderId);
        if (updateError1) throw updateError1;

        // Second Update (Different Shop)
        const shopName2 = "OtherShop";
        const newTracking2 = "TRK-002";
        const currentTracking = entry1;
        const entry2 = `${shopName2}: ${newTracking2}`;
        const finalTracking = `${currentTracking}, ${entry2}`;

        const { error: updateError2 } = await supabase.from('orders')
            .update({ tracking_number: finalTracking })
            .eq('id', testOrderId);
        if (updateError2) throw updateError2;

        // Verify Final
        const { data: finalOrder } = await supabase.from('orders').select('tracking_number').eq('id', testOrderId).single();
        if (finalOrder.tracking_number !== "TestShop: TRK-001, OtherShop: TRK-002") {
            throw new Error(`Tracking update mismatch. Got: ${finalOrder.tracking_number}`);
        }
        console.log("✅ Tracking Verification Passed!");


        // Cleanup
        console.log("🧹 Cleaning up...");
        await supabase.from('order_items').delete().eq('order_id', testOrderId);
        await supabase.from('orders').delete().eq('id', testOrderId);
        await supabase.from('products').delete().eq('id', testProductId);
        // Only delete shop if it was our test one? 
        // For safety, let's NOT delete existing shops. 
        // If we created it, we could delete it, but detecting that state requires logic.
        // For now, let's assume we keep the shop if it exists.
        // await supabase.from('shops').delete().eq('id', shopId); 
        // Do NOT delete the user



    } catch (err) {
        console.error("❌ Verification Failed:", err.message);
        process.exit(1);
    }
}

verifySellerOrders();
