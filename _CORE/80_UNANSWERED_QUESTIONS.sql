-- Create table for tracking unanswered questions
CREATE TABLE IF NOT EXISTS unanswered_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    context TEXT, -- Previous conversation context
    user_id UUID REFERENCES profiles(id),
    conversation_id UUID,
    reason TEXT DEFAULT 'no_context',
    asked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Admin response fields
    answered BOOLEAN DEFAULT FALSE,
    admin_answer TEXT,
    admin_id UUID REFERENCES profiles(id),
    answered_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    frequency INTEGER DEFAULT 1, -- How many times this question was asked
    category TEXT, -- Admin can categorize (product, bitcoin, system, etc)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_answered ON unanswered_questions(answered);
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_asked_at ON unanswered_questions(asked_at DESC);
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_frequency ON unanswered_questions(frequency DESC);

-- RLS Policies
ALTER TABLE unanswered_questions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage unanswered questions"
    ON unanswered_questions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Function to increment frequency if duplicate question
CREATE OR REPLACE FUNCTION increment_question_frequency()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if similar question exists (case-insensitive, trimmed)
    UPDATE unanswered_questions
    SET frequency = frequency + 1,
        updated_at = NOW()
    WHERE LOWER(TRIM(question)) = LOWER(TRIM(NEW.question))
    AND id != NEW.id
    AND answered = FALSE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_question_frequency
    AFTER INSERT ON unanswered_questions
    FOR EACH ROW
    EXECUTE FUNCTION increment_question_frequency();

-- Update timestamp trigger
CREATE TRIGGER update_unanswered_questions_updated_at
    BEFORE UPDATE ON unanswered_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
