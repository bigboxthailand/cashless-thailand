
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://euavftppzicwjhbugiys.supabase.co";
const SERVICE_KEY = "sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw";
const BOT_ID = '00000000-0000-0000-0000-000000000000';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function createBotProfile() {
    console.log("Creating bot profile...");

    // Check if exists
    const { data: existing } = await supabase.from('profiles').select('id').eq('id', BOT_ID).single();

    if (existing) {
        console.log("Bot profile already exists.");
        return;
    }

    const { error } = await supabase.from('profiles').insert({
        id: BOT_ID,
        full_name: 'AI Chatbot',
        role: 'admin', // Make it admin so it is trusted
        updated_at: new Date()
    });

    if (error) {
        console.error("Failed to create bot profile:", error);
    } else {
        console.log("Success! Bot profile created.");
    }
}

createBotProfile();
