
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLS() {
    console.log("Testing Public Access to conversation_participants...");

    // Try to select participants knowing that 105_FIX_CHAT_ALL.sql set it to PUBLIC
    const { data, error } = await supabase
        .from('conversation_participants')
        .select('*, profile:profiles(full_name)')
        .limit(5);

    if (error) {
        console.error("❌ Query Failed:", error.message);
        console.error("Detail:", error.details);
        console.error("Hint:", error.hint);
    } else {
        console.log(`✅ Query Successful. Retrieved ${data.length} rows.`);
        console.log(JSON.stringify(data, null, 2));
    }
}

testRLS();
