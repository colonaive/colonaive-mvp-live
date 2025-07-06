/*
  # Fix for Manual Signup Process
  
  1. Changes
    - Ensure GPClinics table has proper structure
    - Add RLS policies for manual record creation
    - Fix user_type constraint
  
  2. Purpose
    - Support manual profile and GPClinics record creation
    - Ensure proper access control
*/

-- Fix user_type constraint to ensure 'GPClinic' is accepted
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

-- Ensure GPClinics table exists with proper structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'GPClinics') THEN
    CREATE TABLE public."GPClinics" (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      clinic_name text DEFAULT '',
      doctor_full_name text DEFAULT '',
      license_number text DEFAULT '',
      address text DEFAULT '',
      postal_code text DEFAULT '',
      region text DEFAULT '',
      services_offered text[] DEFAULT ARRAY[]::text[],
      operating_hours jsonb DEFAULT '{"weekdays": "", "saturday": "", "sunday": "", "publicHoliday": ""}'::jsonb,
      languages_spoken text DEFAULT NULL,
      website text DEFAULT NULL,
      description text DEFAULT NULL,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public."GPClinics" ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add RLS policies for GPClinics table
DO $$ 
BEGIN
  -- Allow public to insert GPClinics records during signup
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'Public can insert GPClinics during signup'
  ) THEN
    CREATE POLICY "Public can insert GPClinics during signup"
      ON public."GPClinics"
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
  
  -- Allow GP clinics to select their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'GPClinics can select their own data'
  ) THEN
    CREATE POLICY "GPClinics can select their own data"
      ON public."GPClinics"
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;
  
  -- Allow GP clinics to update their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'GPClinics can update their own data'
  ) THEN
    CREATE POLICY "GPClinics can update their own data"
      ON public."GPClinics"
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
  
  -- Allow service role full access
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'Service role full access GPClinics'
  ) THEN
    CREATE POLICY "Service role full access GPClinics"
      ON public."GPClinics"
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  -- Allow public to view active GP clinics
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'Public can view active GPClinics'
  ) THEN
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

-- Add RLS policies for profiles table to allow manual creation
DO $$ 
BEGIN
  -- Allow public to insert profiles during signup
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public can insert profiles during signup'
  ) THEN
    CREATE POLICY "Public can insert profiles during signup"
      ON public.profiles
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Create or replace the create_full_gp_clinic_account function with better error handling
CREATE OR REPLACE FUNCTION create_full_gp_clinic_account(
  p_user_id UUID,
  p_contact_person_name TEXT,
  p_email TEXT,
  p_phone_number TEXT,
  p_clinic_name TEXT,
  p_doctor_full_name TEXT,
  p_license_number TEXT,
  p_address TEXT,
  p_postal_code TEXT,
  p_region TEXT,
  p_services_offered TEXT[],
  p_operating_hours JSONB,
  p_languages_spoken TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Update the profile record
  BEGIN
    UPDATE profiles
    SET 
      full_name = p_contact_person_name,
      email = p_email,
      phone_number = p_phone_number,
      user_type = 'GPClinic',
      status = 'pending_verification',
      updated_at = NOW()
    WHERE id = p_user_id;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error updating profile: %', SQLERRM;
    -- Continue anyway to try updating GPClinics
  END;

  -- Create or update the GP clinic record
  BEGIN
    INSERT INTO "GPClinics" (
      id,
      clinic_name,
      doctor_full_name,
      license_number,
      address,
      postal_code,
      region,
      services_offered,
      operating_hours,
      languages_spoken,
      website,
      description
    ) VALUES (
      p_user_id,
      p_clinic_name,
      p_doctor_full_name,
      p_license_number,
      p_address,
      p_postal_code,
      p_region,
      p_services_offered,
      p_operating_hours,
      p_languages_spoken,
      p_website,
      p_description
    )
    ON CONFLICT (id) DO UPDATE SET
      clinic_name = EXCLUDED.clinic_name,
      doctor_full_name = EXCLUDED.doctor_full_name,
      license_number = EXCLUDED.license_number,
      address = EXCLUDED.address,
      postal_code = EXCLUDED.postal_code,
      region = EXCLUDED.region,
      services_offered = EXCLUDED.services_offered,
      operating_hours = EXCLUDED.operating_hours,
      languages_spoken = EXCLUDED.languages_spoken,
      website = EXCLUDED.website,
      description = EXCLUDED.description;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error updating GP clinic record: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;