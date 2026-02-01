
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://euavftppzicwjhbugiys.supabase.co";
const SERVICE_KEY = "sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function check() {
    console.log("Checking last 10 messages...");
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching messages:", error);
        return;
    }

    if (messages.length === 0) {
        console.log("No messages found in DB.");
    } else {
        messages.forEach(m => {
            console.log(`[${m.created_at}] Sender: ${m.sender_id} (Admin: ${m.is_admin}) | Content: ${m.content}`);
        });
    }
}

check();
