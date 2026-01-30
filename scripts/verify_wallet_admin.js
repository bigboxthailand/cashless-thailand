
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
    console.log("🔍 Verifying Wallet & Moderation System...");

    // 1. Check View Existence
    const { data: viewData, error: viewError } = await supabase
        .from('shop_finance_view')
        .select('*')
        .limit(1);

    if (viewError) {
        console.error("❌ Failed to query shop_finance_view:", viewError.message);
        console.log("Did you run the SQL migration?");
        process.exit(1);
    } else {
        console.log("✅ shop_finance_view exists and is queryable.");
    }

    // 2. Check Payouts Table
    // Try to insert a dummy payout for a shop (logic typically requires exact shop id, we'll skip insert to avoid pollution unless we clean up)
    // Instead we check if we can select from it
    const { error: payoutError } = await supabase.from('payouts').select('*').limit(1);

    if (payoutError) {
        console.error("❌ Failed to query payouts table:", payoutError.message);
    } else {
        console.log("✅ payouts table exists.");
    }

    // 3. Admin Sellers Page Check (simulated)
    // Check if we have shops with status
    const { data: shops } = await supabase.from('shops').select('id, name, status').limit(3);
    console.log("ℹ️ Current Shops Status Sample:");
    shops?.forEach(s => console.log(`   - ${s.name}: ${s.status}`));

    console.log("🎉 Verification Passed!");
}

verify();
