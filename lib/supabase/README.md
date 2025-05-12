# Supabase Integration for ESIC Hospital Management System

This folder contains all the necessary code to connect your ESIC Hospital Management System to a Supabase database.

## What is Supabase?

Supabase is like a friendly database that lives on the internet! It stores all your hospital data safely and lets you access it from anywhere. Think of it like a big digital filing cabinet for all your patient information, surgeries, and bills.

## Setup Instructions

### 1. Create a Supabase Account

1. Go to [https://supabase.com/](https://supabase.com/) and sign up for a free account
2. Once logged in, click "New Project" to create a new project
3. Give your project a name (like "ESIC Hospital System")
4. Set a secure password
5. Choose a region closest to your location
6. Click "Create new project"

### 2. Set Up Database Tables

After your project is created:

1. Click on the "SQL Editor" tab in the Supabase dashboard
2. Create a new query
3. Copy all the SQL code from the `schema.sql` file in this folder
4. Run the query to create all the necessary tables for your hospital system

### 3. Configure Environment Variables

1. In the Supabase dashboard, go to "Settings" > "API"
2. Find your project URL and anon/public key
3. Create a `.env.local` file in the root of your project with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Using the Database

Now all the API functions in the `api` folder are ready to use! You can:

- Store patient information
- Save diagnoses and surgeries
- Track complications
- Generate and save invoices

## Features

This Supabase integration includes:

- **Patient Management**: Store and retrieve patient details
- **Diagnosis Tracking**: Manage diagnoses with approval status
- **Surgery Management**: Track surgeries and their costs
- **Complications Handling**: Link complications to diagnoses or surgeries
- **Clinical Notes**: Store detailed notes for each diagnosis
- **Invoicing System**: Generate and store invoices with line items

## File Structure

- `client.ts` - Sets up the Supabase client connection
- `schema.sql` - Contains all the database table definitions
- `api/` - Contains API functions for each major feature:
  - `patients.ts` - Patient management functions
  - `diagnoses.ts` - Diagnosis and clinical notes functions
  - `surgeries.ts` - Surgery management functions
  - `complications.ts` - Complication tracking functions
  - `invoices.ts` - Invoice generation and management functions

## Making Changes

If you need to make changes to the database structure:

1. Create a new SQL query in the Supabase dashboard
2. Write your SQL commands (CREATE, ALTER, etc.)
3. Run the query to update your database
4. Update the corresponding TypeScript types and functions in this codebase

## Next Steps

To integrate this with your application:

1. Replace the mock data in your components with API calls to these functions
2. Update the user interface to handle loading states and errors
3. Implement authentication to protect patient data 