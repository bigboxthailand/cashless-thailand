/**
 * Test AI Rate Limiting System
 * 
 * This script tests the AI rate limiting functions
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAIRateLimit() {
    console.log('🧪 Testing AI Rate Limiting System\n');

    // Test user and conversation IDs (replace with real ones from your DB)
    const testUserId = 'test-user-id';
    const testConversationId = 'test-conversation-id';

    try {
        // 1. Test check_ai_limit function
        console.log('1️⃣ Testing check_ai_limit...');
        const { data: checkData, error: checkError } = await supabase.rpc('check_ai_limit', {
            p_user_id: testUserId,
            p_conversation_id: testConversationId
        });

        if (checkError) {
            console.error('❌ Error:', checkError);
        } else {
            console.log('✅ Check result:', checkData);
            console.log(`   - Allowed: ${checkData.allowed}`);
            console.log(`   - Current count: ${checkData.current_count}`);
            console.log(`   - Remaining: ${checkData.remaining}`);
            console.log(`   - Limit: ${checkData.limit}`);
        }

        // 2. Test increment_ai_usage function
        console.log('\n2️⃣ Testing increment_ai_usage...');
        const { data: incrementData, error: incrementError } = await supabase.rpc('increment_ai_usage', {
            p_user_id: testUserId,
            p_conversation_id: testConversationId
        });

        if (incrementError) {
            console.error('❌ Error:', incrementError);
        } else {
            console.log('✅ Increment result:', incrementData);
            console.log(`   - Success: ${incrementData.success}`);
            console.log(`   - New count: ${incrementData.current_count}`);
            console.log(`   - Remaining: ${incrementData.remaining}`);
            console.log(`   - Limit reached: ${incrementData.limit_reached}`);
        }

        // 3. Test get_ai_usage_stats function
        console.log('\n3️⃣ Testing get_ai_usage_stats...');
        const { data: statsData, error: statsError } = await supabase.rpc('get_ai_usage_stats', {
            p_user_id: testUserId
        });

        if (statsError) {
            console.error('❌ Error:', statsError);
        } else {
            console.log('✅ Stats result:', statsData);
            if (statsData && statsData.length > 0) {
                statsData.forEach((stat, index) => {
                    console.log(`   Conversation ${index + 1}:`);
                    console.log(`   - ID: ${stat.conversation_id}`);
                    console.log(`   - Messages: ${stat.message_count}/${stat.limit_value}`);
                    console.log(`   - Remaining: ${stat.remaining}`);
                    console.log(`   - Resets at: ${stat.reset_at}`);
                });
            }
        }

        // 4. Test rapid increment (simulate multiple AI responses)
        console.log('\n4️⃣ Testing rapid increments (5 times)...');
        for (let i = 0; i < 5; i++) {
            const { data } = await supabase.rpc('increment_ai_usage', {
                p_user_id: testUserId,
                p_conversation_id: testConversationId
            });
            console.log(`   Increment ${i + 1}: Count = ${data.current_count}, Remaining = ${data.remaining}`);
        }

        // 5. Check final state
        console.log('\n5️⃣ Final state check...');
        const { data: finalCheck } = await supabase.rpc('check_ai_limit', {
            p_user_id: testUserId,
            p_conversation_id: testConversationId
        });
        console.log('✅ Final state:', finalCheck);

        console.log('\n✨ All tests completed!');

    } catch (error) {
        console.error('💥 Test failed:', error);
    }
}

// Run tests
testAIRateLimit();
