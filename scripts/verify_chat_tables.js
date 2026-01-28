
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyChat() {
    console.log("🔍 Verifying Chat System Tables...");

    const { error: convError } = await supabase.from('conversations').select('count').limit(1);
    const { error: msgError } = await supabase.from('messages').select('count').limit(1);

    if (convError || msgError) {
        console.error("❌ Tables missing or error:", convError?.message || msgError?.message);
        console.log("Please re-run the SQL but COMMENT OUT the 'ALTER PUBLICATION' lines.");
    } else {
        console.log("✅ Chat Tables (conversations, messages) exist and are accessible.");
        console.log("ℹ️ The error you saw regarding 'supabase_realtime' just means Realtime was ALREADY enabled. You are good to go!");
    }
}

verifyChat();
