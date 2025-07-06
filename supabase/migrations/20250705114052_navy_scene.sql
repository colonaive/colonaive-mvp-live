/*
  # Standardize GP Clinic Table Name and User Type
  
  1. Changes
    - Rename "GPClinics" table to "gpclinics" (lowercase)
    - Update user_type constraint to use 'gpclinic' instead of 'GPClinic'
    - Update handle_new_user trigger function to use 'gpclinic'
    - Update RLS policies
  
  2. Purpose
    - Standardize naming conventions across the application
    - Ensure consistency between frontend and backend
*/

-- Rename the table from "GPClinics" to "gpclinics"
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'GPClinics'
  ) THEN
    ALTER TABLE public."GPClinics" RENAME TO gpclinics;
  END IF;
END $$;

-- Update user_type constraint in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'gpclinic', 'specialist', 'corporate_contact'));

-- Update existing profiles with GPClinic to gpclinic
UPDATE profiles
SET user_type = 'gpclinic'
WHERE user_type = 'GPClinic';

-- Update handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_full_name TEXT;
BEGIN
  -- Get user_type and full_name from metadata
  v_user_type := LOWER(NEW.raw_user_meta_data->>'user_type');
  v_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- If not found, default to 'champion'
  IF v_user_type IS NULL OR v_user_type = '' THEN
    v_user_type := 'champion';
  END IF;
  
  -- Insert into profiles table with better error handling
  BEGIN
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
        INSERT INTO public.specialists (id)
        VALUES (NEW.id)
        ON CONFLICT (id) DO NOTHING;
        
      WHEN 'gpclinic' THEN
        INSERT INTO public.gpclinics (id)
        VALUES (NEW.id)
        ON CONFLICT (id) DO NOTHING;
        
      WHEN 'corporate_contact' THEN
        -- Corporate records are handled by the create_full_corporate_account function
        NULL;
        
      ELSE
        -- For other user types, default to champion
        INSERT INTO public.champions (id)
        VALUES (NEW.id)
        ON CONFLICT (id) DO NOTHING;
    END CASE;
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE NOTICE 'Error in handle_new_user trigger: %', SQLERRM;
      -- Continue anyway to avoid failing the transaction
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies for gpclinics table
DO $$ 
BEGIN
  -- Drop old policies if they exist
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'GPClinics') THEN
    DROP POLICY IF EXISTS "GPClinics can insert their own data" ON public."GPClinics";
    DROP POLICY IF EXISTS "GPClinics can select their own data" ON public."GPClinics";
    DROP POLICY IF EXISTS "GPClinics can update their own data" ON public."GPClinics";
    DROP POLICY IF EXISTS "Service role full access GPClinics" ON public."GPClinics";
    DROP POLICY IF EXISTS "Public can view active GPClinics" ON public."GPClinics";
    DROP POLICY IF EXISTS "Public can insert GPClinics during signup" ON public."GPClinics";
  END IF;
  
  -- Create new policies for gpclinics table
  CREATE POLICY "gpclinics can insert their own data"
    ON public.gpclinics
    FOR INSERT
    TO public
    WITH CHECK (auth.uid() = id);
  
  CREATE POLICY "gpclinics can select their own data"
    ON public.gpclinics
    FOR SELECT
    TO public
    USING (auth.uid() = id);
  
  CREATE POLICY "gpclinics can update their own data"
    ON public.gpclinics
    FOR UPDATE
    TO public
    USING (auth.uid() = id);
  
  CREATE POLICY "Service role full access gpclinics"
    ON public.gpclinics
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  
  CREATE POLICY "Public can view active gpclinics"
    ON public.gpclinics
    FOR SELECT
    TO public
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = gpclinics.id AND profiles.status = 'active'
    ));
  
  CREATE POLICY "Public can insert gpclinics during signup"
    ON public.gpclinics
    FOR INSERT
    TO public
    WITH CHECK (true);
END $$;

-- Update create_full_gp_clinic_account function
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
      user_type = 'gpclinic',
      status = 'pending_verification',
      updated_at = NOW()
    WHERE id = p_user_id;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error updating profile: %', SQLERRM;
    -- Continue anyway to try updating gpclinics
  END;

  -- Create or update the GP clinic record
  BEGIN
    INSERT INTO gpclinics (
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

-- Update update_gp_clinic_profile function
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
  -- Update the profile record
  UPDATE profiles
  SET 
    full_name = p_contact_person_name,
    phone_number = p_phone_number,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update the GP clinic record
  UPDATE gpclinics
  SET
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
    description = p_description
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;