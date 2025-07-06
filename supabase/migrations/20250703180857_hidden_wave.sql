/*
  # Comprehensive Auth System Fix - 2025-07-05
  
  1. Changes
    - Fix handle_new_user trigger function
    - Ensure proper RLS policies for all tables
    - Fix user_type constraints
    - Add proper error handling
    - Fix corporate account creation
  
  2. Purpose
    - Fix signup and email confirmation flow
    - Ensure proper profile and role-specific table creation
    - Fix RLS policies to allow proper access
*/

-- Fix user_type constraint in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

-- Ensure status column exists in profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'pending_verification';
  END IF;
END $$;

-- Improve handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_full_name TEXT;
BEGIN
  -- Get user_type and full_name from metadata
  v_user_type := NEW.raw_user_meta_data->>'user_type';
  v_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- If not found, default to 'champion'
  IF v_user_type IS NULL THEN
    v_user_type := 'champion';
  END IF;
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    user_type,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_user_type,
    'pending_verification'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    full_name = v_full_name,
    user_type = v_user_type;
  
  -- Based on user_type, insert into role-specific table
  CASE v_user_type
    WHEN 'champion' THEN
      INSERT INTO public.champions (id)
      VALUES (NEW.id)
      ON CONFLICT (id) DO NOTHING;
      
    WHEN 'specialist' THEN
      -- Create empty specialist record to be filled later
      INSERT INTO public.specialists (
        id, 
        medical_registration_no, 
        qualifications, 
        field_of_specialization,
        clinic_affiliation,
        address,
        postal_code,
        region,
        years_of_experience,
        specialties,
        languages
      )
      VALUES (
        NEW.id,
        '', -- These empty values will be updated later
        '',
        '',
        '',
        '',
        '',
        '',
        0,
        ARRAY[]::text[],
        ''
      )
      ON CONFLICT (id) DO NOTHING;
      
    WHEN 'GPClinic' THEN
      -- Create empty GP clinic record to be filled later
      INSERT INTO public."GPClinics" (
        id,
        clinic_name,
        doctor_full_name,
        license_number,
        address,
        postal_code,
        region,
        services_offered
      )
      VALUES (
        NEW.id,
        '', -- These empty values will be updated later
        '',
        '',
        '',
        '',
        '',
        ARRAY[]::text[]
      )
      ON CONFLICT (id) DO NOTHING;
      
    WHEN 'corporate_contact' THEN
      -- Corporate records are handled by the create_full_corporate_account function
      NULL;
      
    ELSE
      -- For other user types, do nothing special
      NULL;
  END CASE;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE NOTICE 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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

-- Fix the champions table and policies
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

-- Fix the corporate account creation function
CREATE OR REPLACE FUNCTION create_full_corporate_account(
  p_contact_user_id UUID,
  p_contact_user_email TEXT,
  p_company_name TEXT,
  p_uen TEXT,
  p_industry TEXT,
  p_company_size TEXT,
  p_contact_person_name TEXT,
  p_phone_number TEXT,
  p_pledge_amount NUMERIC DEFAULT NULL,
  p_sponsorship_tier TEXT DEFAULT NULL,
  p_csr_options TEXT[] DEFAULT NULL,
  p_prefer_discussion BOOLEAN DEFAULT false,
  p_additional_comments TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  v_corporate_id UUID;
BEGIN
  -- Create the corporate record with error handling
  BEGIN
    INSERT INTO corporates (
      company_name,
      uen,
      industry,
      company_size,
      user_id
    ) VALUES (
      p_company_name,
      p_uen,
      p_industry,
      p_company_size,
      p_contact_user_id
    ) RETURNING id INTO v_corporate_id;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating corporate record: %', SQLERRM;
    -- Try to get existing corporate ID if insert failed
    SELECT id INTO v_corporate_id FROM corporates WHERE user_id = p_contact_user_id LIMIT 1;
    IF v_corporate_id IS NULL THEN
      RAISE EXCEPTION 'Failed to create or find corporate record';
    END IF;
  END;

  -- Create or update the profile record with error handling
  BEGIN
    INSERT INTO profiles (
      id,
      email,
      full_name,
      phone_number,
      user_type,
      corporate_id,
      status
    ) VALUES (
      p_contact_user_id,
      p_contact_user_email,
      p_contact_person_name,
      p_phone_number,
      'corporate_contact',
      v_corporate_id,
      'pending_verification'
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = p_contact_person_name,
      phone_number = p_phone_number,
      user_type = 'corporate_contact',
      corporate_id = v_corporate_id,
      status = 'pending_verification';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating/updating profile: %', SQLERRM;
    -- Continue anyway to try creating the sponsorship
  END;

  -- Create the sponsorship record with error handling
  BEGIN
    INSERT INTO corporate_sponsorships (
      corporate_id,
      contact_person_id,
      pledge_amount,
      sponsorship_tier,
      csr_options,
      prefer_discussion,
      additional_comments,
      status,
      is_publicly_visible
    ) VALUES (
      v_corporate_id,
      p_contact_user_id,
      p_pledge_amount,
      p_sponsorship_tier,
      p_csr_options,
      p_prefer_discussion,
      p_additional_comments,
      'pending_review',
      false
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating sponsorship record: %', SQLERRM;
    -- Continue anyway as the core corporate and profile records are more important
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure proper RLS policies for corporates table
DO $$ 
BEGIN
  -- Allow corporate contacts to view their company
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporates' AND policyname = 'Corporate contacts can view their company'
  ) THEN
    CREATE POLICY "Corporate contacts can view their company"
      ON corporates
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.corporate_id = corporates.id
      ));
  END IF;

  -- Allow corporates to insert self
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporates' AND policyname = 'Corporates can insert self'
  ) THEN
    CREATE POLICY "Corporates can insert self"
      ON corporates
      FOR INSERT
      TO public
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Allow corporates to update own row
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporates' AND policyname = 'Corporates can update own row'
  ) THEN
    CREATE POLICY "Corporates can update own row"
      ON corporates
      FOR UPDATE
      TO public
      USING (user_id = auth.uid());
  END IF;

  -- Allow service role full access
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporates' AND policyname = 'Service role full access corporates'
  ) THEN
    CREATE POLICY "Service role full access corporates"
      ON corporates
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure corporates table has RLS enabled
ALTER TABLE corporates ENABLE ROW LEVEL SECURITY;

-- Ensure proper RLS policies for corporate_sponsorships table
DO $$ 
BEGIN
  -- Allow corporate contacts to view their sponsorships
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporate_sponsorships' AND policyname = 'Corporate contacts can view their sponsorships'
  ) THEN
    CREATE POLICY "Corporate contacts can view their sponsorships"
      ON corporate_sponsorships
      FOR SELECT
      TO public
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.corporate_id = corporate_sponsorships.corporate_id
      ));
  END IF;

  -- Allow service role full access
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'corporate_sponsorships' AND policyname = 'Service role full access sponsorships'
  ) THEN
    CREATE POLICY "Service role full access sponsorships"
      ON corporate_sponsorships
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure corporate_sponsorships table has RLS enabled
ALTER TABLE corporate_sponsorships ENABLE ROW LEVEL SECURITY;

-- Fix the champion profile update function
CREATE OR REPLACE FUNCTION update_champion_profile_details(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_address TEXT,
  p_date_of_birth DATE
) RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET full_name = p_full_name,
      phone_number = p_phone_number,
      address = p_address,
      updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO champions (id, date_of_birth)
  VALUES (p_user_id, p_date_of_birth)
  ON CONFLICT (id) DO UPDATE SET
    date_of_birth = p_date_of_birth;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;