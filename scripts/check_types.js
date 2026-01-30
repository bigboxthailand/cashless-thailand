
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumnTypes() {
    console.log("🔍 Checking 'orders' table column types...");

    // We can't easily get types via simple select, but we can infer from a record
    // Or better, since we have the error, we know 'id' is text.
    // Let's check 'user_id' type by fetching one record.

    const { data, error } = await supabase
        .from('orders')
        .select('id, user_id')
        .limit(1);

    if (error) {
        console.error("Error fetching orders:", error);
        return;
    }

    if (data && data.length > 0) {
        const order = data[0];
        console.log("Sample Order Data:", order);
        console.log("Type of id:", typeof order.id);
        console.log("Type of user_id:", typeof order.user_id);
        // Note: JS typeof is 'string' for both UUID and Text, but formatted UUID check helps.
    } else {
        console.log("⚠️ No orders found.");
    }
}

checkColumnTypes();
