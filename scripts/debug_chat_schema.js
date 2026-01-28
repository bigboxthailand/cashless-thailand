
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugSchema() {
    console.log("🔍 Debugging 'conversations' table schema...");

    // Using RPC to call SQL if possible? No.
    // We can't query information_schema easily via JS client unless exposed.
    // Instead, we can try to just select * and see what we get.

    const { data, error } = await supabase.from('conversations').select('*').limit(1);

    if (error) {
        console.error("❌ Select * Error:", error.message);
        if (error.details) console.error("Details:", error.details);
        if (error.hint) console.error("Hint:", error.hint);
    } else {
        console.log("✅ Select * Success. Data:", data);
        if (data.length > 0) {
            console.log("Keys:", Object.keys(data[0]));
        } else {
            console.log("Table is empty, but query worked.");
        }
    }

    // Attempt to select specific column
    const { error: titleError } = await supabase.from('conversations').select('title').limit(1);
    if (titleError) {
        console.error("❌ Select 'title' Error:", titleError.message);
    } else {
        console.log("✅ Select 'title' Success.");
    }
}

debugSchema();
