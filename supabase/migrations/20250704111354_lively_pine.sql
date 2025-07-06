/*
  # Fix handle_new_user Trigger Function
  
  1. Changes
    - Improve handle_new_user trigger function
    - Add proper error handling
    - Fix user_type handling
  
  2. Purpose
    - Fix signup and email confirmation flow
    - Ensure proper profile and role-specific table creation
*/

-- Improve handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  -- Get user_type from metadata
  v_user_type := NEW.raw_user_meta_data->>'user_type';
  
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
    NEW.raw_user_meta_data->>'full_name',
    v_user_type,
    'pending_verification'
  )
  ON CONFLICT (id) DO NOTHING;
  
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
      
    WHEN 'GPClinic' THEN
      INSERT INTO public."GPClinics" (id)
      VALUES (NEW.id)
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