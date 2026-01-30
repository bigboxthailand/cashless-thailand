
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role to simulate "Success" locally without login flow
);

async function verifyChatFlow() {
    console.log("🔍 Verifying Chat Logic...");

    const TEST_USER_ID = '3b5859ea-8a64-41f1-8071-75d35efa67a7'; // Using known user

    // 1. Create Conversation
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ type: 'support', title: 'Test Chat' })
        .select()
        .single();

    if (convError) {
        console.error("❌ Failed to create conversation:", convError.message);
        process.exit(1);
    }
    console.log(`✅ Created Conversation: ${conv.id}`);

    // 2. Add Participant
    const { error: partError } = await supabase.from('conversation_participants').insert({
        conversation_id: conv.id,
        user_id: TEST_USER_ID
    });

    if (partError) console.error("❌ Failed to add participant:", partError.message);
    else console.log("✅ Added Participant");

    // 3. Send Message
    const { data: msg, error: msgError } = await supabase.from('messages').insert({
        conversation_id: conv.id,
        sender_id: TEST_USER_ID,
        content: 'Hello World from Test Script'
    }).select().single();

    if (msgError) console.error("❌ Failed to send message:", msgError.message);
    else console.log(`✅ Sent Message: "${msg.content}"`);

    // Cleanup
    await supabase.from('conversations').delete().eq('id', conv.id);
    console.log("🧹 Cleaned up test conversation.");
}

verifyChatFlow();
