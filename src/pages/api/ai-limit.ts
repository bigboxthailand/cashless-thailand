import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { user_id, conversation_id, action } = await request.json();

        if (!user_id || !conversation_id) {
            return new Response(JSON.stringify({ 
                error: 'Missing user_id or conversation_id' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (action === 'check') {
            // Check if user can send more messages
            const { data, error } = await supabase.rpc('check_ai_limit', {
                p_user_id: user_id,
                p_conversation_id: conversation_id
            });

            if (error) {
                console.error('Error checking AI limit:', error);
                return new Response(JSON.stringify({ 
                    error: error.message 
                }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (action === 'increment') {
            // Increment usage counter after AI responds
            const { data, error } = await supabase.rpc('increment_ai_usage', {
                p_user_id: user_id,
                p_conversation_id: conversation_id
            });

            if (error) {
                console.error('Error incrementing AI usage:', error);
                return new Response(JSON.stringify({ 
                    error: error.message 
                }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else if (action === 'stats') {
            // Get user's usage statistics
            const { data, error } = await supabase.rpc('get_ai_usage_stats', {
                p_user_id: user_id
            });

            if (error) {
                console.error('Error getting AI stats:', error);
                return new Response(JSON.stringify({ 
                    error: error.message 
                }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            return new Response(JSON.stringify({ 
                error: 'Invalid action. Use: check, increment, or stats' 
            }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('AI limit API error:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error' 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
