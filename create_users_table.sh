#!/bin/bash

# Exit on error
set -e

# Supabase project URL and anon key
SUPABASE_URL="https://jtlbkmwwaivkqlwqdryb.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGJrbXd3YWl2a3Fsd3FkcnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTU3NjcsImV4cCI6MjA2MjE3MTc2N30.6Y7gYCO2pNh9-Ab5bH4AnauMC3UCFNSixjiT8y_m6LU"

# Step 1: Create the users table
echo "Creating users table..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, full_name TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('"'"'admin'"'"', '"'"'doctor'"'"', '"'"'nurse'"'"', '"'"'receptionist'"'"')), department TEXT, profile_image_url TEXT, phone TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

# Step 2: Enable Row Level Security
echo "Enabling Row Level Security..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "ALTER TABLE users ENABLE ROW LEVEL SECURITY;"
  }'

# Step 3: Create security policies
echo "Creating security policies..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE POLICY \"Users are viewable by authenticated users\" ON users FOR SELECT TO authenticated USING (true); CREATE POLICY \"Users can update own record\" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);"
  }'

# Step 4: Insert dummy users
echo "Inserting dummy users..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "INSERT INTO users (username, email, full_name, role, department, phone) VALUES ('"'"'dr_sharma'"'"', '"'"'dr.sharma@adamrit.in'"'"', '"'"'Dr. Rakesh Sharma'"'"', '"'"'doctor'"'"', '"'"'Cardiology'"'"', '"'"'+91-9876543210'"'"'), ('"'"'dr_patel'"'"', '"'"'dr.patel@adamrit.in'"'"', '"'"'Dr. Meena Patel'"'"', '"'"'doctor'"'"', '"'"'Neurology'"'"', '"'"'+91-9876543211'"'"'), ('"'"'nurse_khan'"'"', '"'"'nurse.khan@adamrit.in'"'"', '"'"'Amir Khan'"'"', '"'"'nurse'"'"', '"'"'General'"'"', '"'"'+91-9876543212'"'"'), ('"'"'admin_singh'"'"', '"'"'admin.singh@adamrit.in'"'"', '"'"'Amarjeet Singh'"'"', '"'"'admin'"'"', '"'"'Administration'"'"', '"'"'+91-9876543213'"'"'), ('"'"'reception_roy'"'"', '"'"'reception.roy@adamrit.in'"'"', '"'"'Priya Roy'"'"', '"'"'receptionist'"'"', '"'"'Front Desk'"'"', '"'"'+91-9876543214'"'"'), ('"'"'dr_gupta'"'"', '"'"'dr.gupta@adamrit.in'"'"', '"'"'Dr. Sunita Gupta'"'"', '"'"'doctor'"'"', '"'"'Pediatrics'"'"', '"'"'+91-9876543215'"'"'), ('"'"'nurse_kumar'"'"', '"'"'nurse.kumar@adamrit.in'"'"', '"'"'Rajesh Kumar'"'"', '"'"'nurse'"'"', '"'"'Emergency'"'"', '"'"'+91-9876543216'"'"'), ('"'"'dr_reddy'"'"', '"'"'dr.reddy@adamrit.in'"'"', '"'"'Dr. Venkat Reddy'"'"', '"'"'doctor'"'"', '"'"'Orthopedics'"'"', '"'"'+91-9876543217'"'"'), ('"'"'admin_joshi'"'"', '"'"'admin.joshi@adamrit.in'"'"', '"'"'Neha Joshi'"'"', '"'"'admin'"'"', '"'"'IT Department'"'"', '"'"'+91-9876543218'"'"'), ('"'"'dr_sen'"'"', '"'"'dr.sen@adamrit.in'"'"', '"'"'Dr. Amitabh Sen'"'"', '"'"'doctor'"'"', '"'"'General Medicine'"'"', '"'"'+91-9876543219'"'"');"
  }'

# Step 5: Create indexes
echo "Creating indexes..."
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE INDEX IF NOT EXISTS users_email_idx ON users (email); CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);"
  }'

echo "Done! Users table created with dummy data." 