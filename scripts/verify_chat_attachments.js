
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyAttachments() {
    console.log("🧪 Verifying Chat Attachments Logic...");

    const TEST_USER_ID = '3b5859ea-8a64-41f1-8071-75d35efa67a7';
    
    // 1. Create a test conversation
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ type: 'p2p', title: 'Attachment Test' })
        .select()
        .single();

    if (convError) {
        console.error("❌ Failed to create conversation:", convError.message);
        return;
    }
    console.log(`✅ Created Conversation: ${conv.id}`);

    try {
        // 2. Test Message with Image and Order
        const { data: msg, error: msgError } = await supabase.from('messages').insert({
            conversation_id: conv.id,
            sender_id: TEST_USER_ID,
            content: 'Testing attachments',
            image_url: 'https://placehold.co/600x400',
            order_id: 'ORD-TEST-1234',
            type: 'image',
            metadata: { test: true }
        }).select().single();

        if (msgError) {
            console.error("❌ Failed to send message with attachments:", msgError.message);
            console.log("Note: This might be due to missing columns in the 'messages' table.");
        } else {
            console.log(`✅ Sent Message with Attachments: ${msg.id}`);
            console.log(`   - Image: ${msg.image_url}`);
            console.log(`   - Order: ${msg.order_id}`);
            console.log(`   - Type: ${msg.type}`);
        }

        // 3. Verify Bucket (Basic check if we can list - might fail if empty but schema should exist)
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        const chatBucket = buckets?.find(b => b.id === 'chat-images');
        if (chatBucket) {
            console.log("✅ 'chat-images' bucket exists.");
        } else {
            console.warn("⚠️ 'chat-images' bucket not found or not accessible.");
        }

    } finally {
        // Cleanup
        await supabase.from('messages').delete().eq('conversation_id', conv.id);
        await supabase.from('conversations').delete().eq('id', conv.id);
        console.log("🧹 Cleaned up test data.");
    }
}

verifyAttachments();
