
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log("🔍 Checking 'orders' table columns...");

    // Trick: Select * from orders limit 1 and look at keys
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching orders:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Columns found:", Object.keys(data[0]));
        if (Object.keys(data[0]).includes('tracking_number')) {
            console.log("✅ 'tracking_number' column EXISTS.");
        } else {
            console.log("❌ 'tracking_number' column MISSING.");
        }
    } else {
        console.log("⚠️ No orders found to check columns. Assuming missing based on schema doc.");
    }
}

checkColumns();
