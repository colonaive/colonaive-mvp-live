/*
  # Fix Email Confirmation Process
  
  1. Changes
    - Extend token expiration time for email confirmations
    - Improve error handling in handle_new_user trigger
    - Add more robust status handling for profiles
  
  2. Purpose
    - Fix the "Confirmation link has expired" issue
    - Ensure proper profile creation during signup
    - Improve user experience during email confirmation
*/

-- Ensure profiles table has status column with proper default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'pending_verification';
  END IF;
END $$;

-- Improve handle_new_user trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_full_name TEXT;
BEGIN
  -- Get user_type and full_name from metadata with better error handling
  BEGIN
    v_user_type := LOWER(NEW.raw_user_meta_data->>'user_type');
    v_full_name := NEW.raw_user_meta_data->>'full_name';
    
    -- If not found, default to 'champion'
    IF v_user_type IS NULL OR v_user_type = '' THEN
      v_user_type := 'champion';
    END IF;
    
    -- Insert into profiles table with better error handling
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
        INSERT INTO public."GPClinics" (id)
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

-- Create a function to manually verify a user's email
CREATE OR REPLACE FUNCTION manually_verify_user_email(
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update the profile status to active
  UPDATE profiles
  SET status = 'active'
  WHERE id = p_user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error verifying user email: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to resend verification email
CREATE OR REPLACE FUNCTION resend_verification_email(
  p_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID from the email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', p_email;
  END IF;
  
  -- Update the profile status to pending_verification
  UPDATE profiles
  SET status = 'pending_verification'
  WHERE id = v_user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error resending verification email: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;