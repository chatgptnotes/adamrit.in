# How to Set Up Billing Tables in Your Database 🏥

## Easy Steps to Fix the Billing Error!

### Step 1: Open Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Sign In" and log in with your account
3. Click on your project (it should be named something like your hospital project)

### Step 2: Go to SQL Editor
1. Look at the left sidebar
2. Find and click on "SQL Editor" (it has a little database icon)
3. You'll see a big empty box where you can type SQL commands

### Step 3: Copy the SQL Code
1. Open the file `create_billing_tables.sql` in your project folder
2. Select ALL the text in that file (Ctrl+A on Windows or Cmd+A on Mac)
3. Copy it (Ctrl+C on Windows or Cmd+C on Mac)

### Step 4: Run the SQL
1. Go back to Supabase SQL Editor
2. Paste the code you copied (Ctrl+V on Windows or Cmd+V on Mac)
3. Click the green "RUN" button at the bottom right
4. Wait a few seconds - you should see a green message saying "Success"

### Step 5: Check if it Worked
1. Look at the left sidebar again
2. Click on "Table Editor"
3. You should now see these new tables:
   - `patient_billing`
   - `billing_line_items`
   - `billing_diagnoses`
   - `billing_surgeries`
   - `billing_complications`
   - `billing_consultations`

### Step 6: Test Your App Again
1. Go back to your hospital app
2. Try saving to billing again - it should work now! 🎉

## If You Get Any Errors:
- Make sure you copied ALL the text from the SQL file
- Check that you're in the right Supabase project
- Try running the SQL again
- If still having issues, the error message will tell you what's wrong

## Need More Help?
The billing tables store all the invoice information for patients, including:
- Patient details and bill numbers
- Individual charges (consultations, medicines, surgeries, etc.)
- Diagnoses and complications
- Doctor consultations

Once these tables are created, your billing feature will work perfectly! 