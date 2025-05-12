# ESIC Hospital Management System

A comprehensive hospital management system for ESIC hospitals that helps manage patients, diagnoses, surgeries, complications, and billing.

## Features

- **Patient Dashboard**: View and manage patient information
- **Diagnosis Management**: Track diagnoses with approval status
- **Surgery Management**: Schedule and track surgeries with associated costs
- **Complications Tracking**: Monitor complications related to diagnoses and surgeries
- **Clinical Notes**: Maintain detailed clinical notes for each diagnosis
- **Invoicing System**: Generate professional invoices for patients

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/chatgptnotes/adamrit.in.git
   cd adamrit.in
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Copy the environment variables example and fill in your Supabase details
   ```bash
   cp .env.example .env.local
   ```

4. Set up your Supabase project (see Supabase Setup below)

5. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup

This project uses [Supabase](https://supabase.com/) as its database. Follow these steps to set it up:

1. Create a free account at [Supabase](https://supabase.com/)

2. Create a new project with a name like "ESIC Hospital System"

3. Once your project is ready, go to SQL Editor and create a new query

4. Copy the entire contents of `lib/supabase/schema.sql` and run the query to create all tables

5. Go to Settings > API in the Supabase dashboard and find:
   - Project URL
   - anon/public key

6. Create a `.env.local` file in the project root with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

7. Restart your development server

### Current Supabase Connection

The project is currently connected to Supabase with the following configuration:
- **Project URL**: https://jtlbkmwwaivkqlwqdryb.supabase.co
- **Environment**: The connection details are stored in `.env.local` (not tracked in git for security)

## Project Structure

- `app/`: Next.js app directory with pages and routes
- `components/`: React components used throughout the application
- `lib/`: Utility functions and API clients
  - `supabase/`: Supabase client and API functions
- `public/`: Static assets
- `styles/`: Global CSS styles

## Database Schema

The database includes tables for:

- Patients
- Medical staff
- Diagnoses
- Surgeries
- Patient visits
- Clinical notes
- Complications
- Investigations
- Medications
- Invoices

For detailed schema information, see `lib/supabase/README.md`

## Adding Authentication

To add user authentication:

1. Enable authentication in your Supabase project (Settings > Authentication)
2. Follow Supabase Auth documentation to implement sign-in/sign-up
3. Update row-level security policies as needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. # adamrit.in
