/*
  # Fix GPClinic Signup and Email Confirmation
  
  1. Changes
    - Fix user_type constraint to include 'GPClinic'
    - Update handle_new_user trigger function to properly handle GPClinic
    - Fix RLS policies for GPClinics table
    - Add function to update GPClinic profile
  
  2. Purpose
    - Fix the issue where GPClinic users are being registered as champions
    - Ensure proper email confirmation flow for GPClinic users
*/

-- Fix user_type constraint to include 'GPClinic'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

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

-- Ensure GPClinics table exists with proper structure
DO $$ 
BEGIN
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
END $$;

-- Add RLS policies for GPClinics table
DO $$ 
BEGIN
  -- Allow GP clinics to select their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'GP clinics can select their own data'
  ) THEN
    CREATE POLICY "GP clinics can select their own data"
      ON public."GPClinics"
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;

  -- Allow GP clinics to update their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'GPClinics' AND policyname = 'GP clinics can update their own data'
  ) THEN
    CREATE POLICY "GP clinics can update their own data"
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
END $$;

-- Create function to update GP clinic profile
CREATE OR REPLACE FUNCTION update_gp_clinic_profile(
  p_user_id UUID,
  p_contact_person_name TEXT,
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
  -- Update profiles table
  UPDATE profiles
  SET 
    full_name = p_contact_person_name,
    phone_number = p_phone_number,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update GPClinics table
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
    clinic_name = p_clinic_name,
    doctor_full_name = p_doctor_full_name,
    license_number = p_license_number,
    address = p_address,
    postal_code = p_postal_code,
    region = p_region,
    services_offered = p_services_offered,
    operating_hours = p_operating_hours,
    languages_spoken = p_languages_spoken,
    website = p_website,
    description = p_description;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create full GP clinic account
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
  -- Create or update the profile record
  INSERT INTO profiles (
    id,
    email,
    full_name,
    phone_number,
    user_type,
    status
  ) VALUES (
    p_user_id,
    p_email,
    p_contact_person_name,
    p_phone_number,
    'GPClinic',
    'pending_verification'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = p_contact_person_name,
    phone_number = p_phone_number,
    user_type = 'GPClinic',
    status = 'pending_verification';

  -- Create or update the GP clinic record
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
    clinic_name = p_clinic_name,
    doctor_full_name = p_doctor_full_name,
    license_number = p_license_number,
    address = p_address,
    postal_code = p_postal_code,
    region = p_region,
    services_offered = p_services_offered,
    operating_hours = p_operating_hours,
    languages_spoken = p_languages_spoken,
    website = p_website,
    description = p_description;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;