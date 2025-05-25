-- Test the feature_suggestions table

-- 1. Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'feature_suggestions';

-- 2. View table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'feature_suggestions'
ORDER BY ordinal_position;

-- 3. Insert a test suggestion (optional - you can skip this if you want to wait for real suggestions)
-- INSERT INTO feature_suggestions (suggestion) 
-- VALUES ('Test suggestion: Add dark mode to the application');

-- 4. View all suggestions
SELECT * FROM feature_suggestions ORDER BY created_at DESC; 