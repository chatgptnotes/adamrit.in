# How to Set Up Feature Suggestions Table 💡

## Quick Setup Steps!

### Step 1: Open Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Click on your project

### Step 2: Run the SQL
1. Click on **SQL Editor** in the left sidebar (it has a database icon)
2. Click on **New query** button
3. Copy ALL the text from the file `create_feature_suggestions_table.sql`
4. Paste it into the SQL Editor
5. Click the **Run** button (or press Ctrl+Enter on Windows / Cmd+Enter on Mac)

### Step 3: Check if it worked
You should see a green message saying "Success. No rows returned"

### That's it! 🎉
Now when users submit suggestions on your landing page, they will be saved to the database!

## To View Suggestions Later:
1. Go back to SQL Editor
2. Run this query:
```sql
SELECT * FROM feature_suggestions ORDER BY created_at DESC;
```

This will show you all suggestions, newest first! 