-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    message_count INTEGER DEFAULT 0,
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, conversation_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_last_reset ON ai_usage_tracking(last_reset_at);

-- Enable RLS
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage
CREATE POLICY "Users can view their own AI usage" ON ai_usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: System can insert/update (we'll use service role for this)
CREATE POLICY "Service role can manage AI usage" ON ai_usage_tracking
    FOR ALL USING (true);

-- Function to check if user has exceeded daily limit
CREATE OR REPLACE FUNCTION check_ai_limit(p_user_id UUID, p_conversation_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_count INTEGER;
    v_last_reset TIMESTAMP WITH TIME ZONE;
    v_limit INTEGER := 20;
    v_now TIMESTAMP WITH TIME ZONE := NOW();
    v_today_start TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate today's midnight (start of day)
    v_today_start := DATE_TRUNC('day', v_now);
    
    -- Get or create usage record
    SELECT message_count, last_reset_at INTO v_count, v_last_reset
    FROM ai_usage_tracking
    WHERE user_id = p_user_id AND conversation_id = p_conversation_id;
    
    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO ai_usage_tracking (user_id, conversation_id, message_count, last_reset_at)
        VALUES (p_user_id, p_conversation_id, 0, v_today_start)
        RETURNING message_count, last_reset_at INTO v_count, v_last_reset;
    END IF;
    
    -- Check if we need to reset (new day)
    IF v_last_reset < v_today_start THEN
        -- Reset counter for new day
        UPDATE ai_usage_tracking
        SET message_count = 0, last_reset_at = v_today_start, updated_at = v_now
        WHERE user_id = p_user_id AND conversation_id = p_conversation_id;
        v_count := 0;
    END IF;
    
    -- Return status
    RETURN jsonb_build_object(
        'allowed', v_count < v_limit,
        'current_count', v_count,
        'limit', v_limit,
        'remaining', GREATEST(0, v_limit - v_count),
        'reset_at', v_today_start + INTERVAL '1 day'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment AI usage counter
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID, p_conversation_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_new_count INTEGER;
    v_limit INTEGER := 120;
    v_now TIMESTAMP WITH TIME ZONE := NOW();
    v_today_start TIMESTAMP WITH TIME ZONE;
BEGIN
    v_today_start := DATE_TRUNC('day', v_now);
    
    -- Insert or update usage count
    INSERT INTO ai_usage_tracking (user_id, conversation_id, message_count, last_reset_at, updated_at)
    VALUES (p_user_id, p_conversation_id, 1, v_today_start, v_now)
    ON CONFLICT (user_id, conversation_id) 
    DO UPDATE SET 
        message_count = CASE 
            WHEN ai_usage_tracking.last_reset_at < v_today_start THEN 1
            ELSE ai_usage_tracking.message_count + 1
        END,
        last_reset_at = CASE
            WHEN ai_usage_tracking.last_reset_at < v_today_start THEN v_today_start
            ELSE ai_usage_tracking.last_reset_at
        END,
        updated_at = v_now
    RETURNING message_count INTO v_new_count;
    
    RETURN jsonb_build_object(
        'success', true,
        'current_count', v_new_count,
        'limit', v_limit,
        'remaining', GREATEST(0, v_limit - v_new_count),
        'limit_reached', v_new_count >= v_limit
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current AI usage stats
CREATE OR REPLACE FUNCTION get_ai_usage_stats(p_user_id UUID)
RETURNS TABLE(
    conversation_id UUID,
    message_count INTEGER,
    limit_value INTEGER,
    remaining INTEGER,
    reset_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_limit INTEGER := 120;
    v_today_start TIMESTAMP WITH TIME ZONE := DATE_TRUNC('day', NOW());
BEGIN
    RETURN QUERY
    SELECT 
        aut.conversation_id,
        CASE 
            WHEN aut.last_reset_at < v_today_start THEN 0
            ELSE aut.message_count
        END as message_count,
        v_limit as limit_value,
        GREATEST(0, v_limit - CASE 
            WHEN aut.last_reset_at < v_today_start THEN 0
            ELSE aut.message_count
        END) as remaining,
        v_today_start + INTERVAL '1 day' as reset_at
    FROM ai_usage_tracking aut
    WHERE aut.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up old records (optional, keeps table clean)
-- This would typically be done via pg_cron or external scheduler
-- For now, we'll just document it as a manual cleanup query:
-- DELETE FROM ai_usage_tracking WHERE updated_at < NOW() - INTERVAL '30 days';
