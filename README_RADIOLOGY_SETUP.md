# Radiology Master Setup Instructions

## Problem
The radiology tests are not displaying in the Radiology Master page because the data hasn't been added to the database yet.

## Solution
Follow these steps to add 50 common radiological investigations to your Supabase database:

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to the **SQL Editor** tab
3. Click **New Query**

### Step 2: Run the Radiology Data Script
1. Copy the entire content from `radiology_investigations_data.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify the Data
After running the script, you should see:
- 50 radiology investigations added to the `investigations` table
- All investigations have codes starting with "R-" (R-001 to R-050)
- A summary showing the count and pricing statistics

### Step 4: Check the Application
1. Go back to your application
2. Navigate to **Radiology Master** from the sidebar
3. You should now see all 50 radiological investigations displayed

## What the Script Adds

### Investigation Categories:
- **X-Ray Studies** (15 investigations): Basic X-rays for chest, skeletal system
- **CT Scans** (5 investigations): Head, chest, abdomen with/without contrast
- **MRI Studies** (5 investigations): Brain, spine, joints
- **Ultrasound Studies** (8 investigations): Abdomen, pelvis, pregnancy, thyroid, etc.
- **Specialized Studies** (7 investigations): Barium studies, IVP, HSG, MRCP
- **Nuclear Medicine** (3 investigations): Bone scan, thyroid scan, renal scan
- **Interventional Radiology** (2 investigations): CT/USG guided biopsies
- **Mammography** (2 investigations): Bilateral and unilateral
- **Cardiac Imaging** (3 investigations): Echo, stress echo, ECG

### Price Range:
- **Minimum**: ₹300 (ECG)
- **Maximum**: ₹25,000 (Upper GI Endoscopy with Ultrasound)
- **Average**: ₹5,500 approximately

## Troubleshooting

### If investigations still don't show:
1. Check browser console for any errors
2. Refresh the page
3. Verify the script ran successfully in Supabase
4. Check that the `investigations` table exists and has data

### If you get permission errors:
1. Make sure you have proper access to the Supabase project
2. Check that RLS (Row Level Security) policies allow reading from `investigations` table

## Additional Notes
- The script uses `ON CONFLICT` handling, so it's safe to run multiple times
- All investigations are properly categorized with realistic Indian hospital pricing
- The data includes comprehensive coverage of common radiological procedures
- Codes follow the pattern R-001, R-002, etc. for easy identification 