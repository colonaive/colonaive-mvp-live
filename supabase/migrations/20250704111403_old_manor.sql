/*
  # Fix RLS Policies
  
  1. Changes
    - Fix RLS policies for all tables
    - Ensure proper access control
  
  2. Purpose
    - Fix access control issues
    - Ensure proper data security
*/

-- Fix RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow profile creation') THEN
    DROP POLICY "Allow profile creation" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public can insert profiles during signup') THEN
    DROP POLICY "Public can insert profiles during signup" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    DROP POLICY "Users can insert own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    DROP POLICY "Users can view own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable profile creation during signup') THEN
    DROP POLICY "Enable profile creation during signup" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Service role has full access') THEN
    DROP POLICY "Service role has full access" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Service role full access') THEN
    DROP POLICY "Service role full access" ON profiles;
  END IF;
END $$;

-- Create comprehensive policies for profile management
CREATE POLICY "Enable profile creation during signup"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role has full access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix RLS policies for champions table
DO $$ 
BEGIN
  -- Create champions table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'champions') THEN
    CREATE TABLE public.champions (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      date_of_birth date,
      gender text,
      emergency_contact_name text,
      emergency_contact_phone text,
      medical_conditions text[],
      screening_status text DEFAULT 'not_screened',
      last_screening_date date,
      next_screening_date date,
      created_at timestamptz DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for champions table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can insert their own data') THEN
    CREATE POLICY "Champions can insert their own data"
      ON public.champions
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can select their own data') THEN
    CREATE POLICY "Champions can select their own data"
      ON public.champions
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can update their own data') THEN
    CREATE POLICY "Champions can update their own data"
      ON public.champions
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Service role full access champions') THEN
    CREATE POLICY "Service role full access champions"
      ON public.champions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fix RLS policies for GPClinics table
DO $$ 
BEGIN
  -- Create GPClinics table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'GPClinics') THEN
    CREATE TABLE public."GPClinics" (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      clinic_name text,
      doctor_full_name text,
      license_number text,
      address text,
      postal_code text,
      region text,
      services_offered text[],
      operating_hours jsonb,
      languages_spoken text,
      website text,
      description text,
      created_at timestamptz DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE public."GPClinics" ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for GPClinics table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics' AND policyname = 'GPClinics can insert their own data') THEN
    CREATE POLICY "GPClinics can insert their own data"
      ON public."GPClinics"
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics' AND policyname = 'GPClinics can select their own data') THEN
    CREATE POLICY "GPClinics can select their own data"
      ON public."GPClinics"
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics' AND policyname = 'GPClinics can update their own data') THEN
    CREATE POLICY "GPClinics can update their own data"
      ON public."GPClinics"
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics' AND policyname = 'Service role full access GPClinics') THEN
    CREATE POLICY "Service role full access GPClinics"
      ON public."GPClinics"
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics' AND policyname = 'Public can view active GPClinics') THEN
    CREATE POLICY "Public can view active GPClinics"
      ON public."GPClinics"
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = "GPClinics".id AND profiles.status = 'active'
      ));
  END IF;
END $$;

-- Fix RLS policies for specialists table
DO $$ 
BEGIN
  -- Create specialists table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'specialists') THEN
    CREATE TABLE public.specialists (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      medical_registration_no text,
      qualifications text,
      field_of_specialization text,
      clinic_affiliation text,
      address text,
      postal_code text,
      region text,
      website text,
      years_of_experience integer,
      specialties text[],
      languages text,
      operating_hours jsonb,
      insurance_partners text,
      notes text,
      created_at timestamptz DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for specialists table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'specialists' AND policyname = 'Specialists can insert their own data') THEN
    CREATE POLICY "Specialists can insert their own data"
      ON public.specialists
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'specialists' AND policyname = 'Specialists can select their own data') THEN
    CREATE POLICY "Specialists can select their own data"
      ON public.specialists
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'specialists' AND policyname = 'Specialists can update their own data') THEN
    CREATE POLICY "Specialists can update their own data"
      ON public.specialists
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'specialists' AND policyname = 'Service role full access specialists') THEN
    CREATE POLICY "Service role full access specialists"
      ON public.specialists
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'specialists' AND policyname = 'Public can view active specialists') THEN
    CREATE POLICY "Public can view active specialists"
      ON public.specialists
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = specialists.id AND profiles.status = 'active'
      ));
  END IF;
END $$;

-- Fix RLS policies for corporates table
DO $$ 
BEGIN
  -- Create corporates table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'corporates') THEN
    CREATE TABLE public.corporates (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_name text NOT NULL,
      uen text NOT NULL UNIQUE,
      industry text NOT NULL,
      company_size text NOT NULL,
      contact_person_name text NOT NULL,
      designation text,
      created_at timestamptz DEFAULT now(),
      user_id uuid NOT NULL
    );
    
    -- Enable RLS
    ALTER TABLE public.corporates ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for corporates table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporates' AND policyname = 'Corporate contacts can view their company') THEN
    CREATE POLICY "Corporate contacts can view their company"
      ON corporates
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.corporate_id = corporates.id
      ));
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporates' AND policyname = 'Corporates can insert self') THEN
    CREATE POLICY "Corporates can insert self"
      ON corporates
      FOR INSERT
      TO public
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporates' AND policyname = 'Corporates can update own row') THEN
    CREATE POLICY "Corporates can update own row"
      ON corporates
      FOR UPDATE
      TO public
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporates' AND policyname = 'Service role full access corporates') THEN
    CREATE POLICY "Service role full access corporates"
      ON corporates
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fix RLS policies for corporate_sponsorships table
DO $$ 
BEGIN
  -- Create corporate_sponsorships table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'corporate_sponsorships') THEN
    CREATE TABLE public.corporate_sponsorships (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      corporate_id uuid NOT NULL REFERENCES corporates(id) ON DELETE CASCADE,
      pledge_amount numeric(10,2),
      sponsorship_tier text,
      csr_options text[],
      prefer_discussion boolean DEFAULT false,
      additional_comments text,
      status text DEFAULT 'pending_review',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      is_publicly_visible boolean DEFAULT false
    );
    
    -- Enable RLS
    ALTER TABLE public.corporate_sponsorships ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for corporate_sponsorships table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporate_sponsorships' AND policyname = 'Corporate contacts can view their sponsorships') THEN
    CREATE POLICY "Corporate contacts can view their sponsorships"
      ON corporate_sponsorships
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.corporate_id = corporate_sponsorships.corporate_id
      ));
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'corporate_sponsorships' AND policyname = 'Service role full access sponsorships') THEN
    CREATE POLICY "Service role full access sponsorships"
      ON corporate_sponsorships
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;