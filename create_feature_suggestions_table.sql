-- Create table for storing feature suggestions
CREATE TABLE IF NOT EXISTS feature_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, implemented, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_feature_suggestions_status ON feature_suggestions(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_feature_suggestions_created_at ON feature_suggestions(created_at DESC); 