/*
  # Fix Email Confirmation Flow
  
  1. Changes
    - Add function to manually verify email
    - Ensure proper status handling in profiles table
    - Fix RLS policies to allow email confirmation
  
  2. Purpose
    - Fix the email confirmation flow
    - Ensure users can confirm their email and access their account
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

-- Create a function to check if a user's email is confirmed
CREATE OR REPLACE FUNCTION is_email_confirmed(
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_confirmed BOOLEAN;
BEGIN
  -- Check if the user's email is confirmed in auth.users
  SELECT email_confirmed_at IS NOT NULL INTO v_confirmed
  FROM auth.users
  WHERE id = p_user_id;
  
  -- If confirmed in auth.users, update the profile status
  IF v_confirmed THEN
    UPDATE profiles
    SET status = 'active'
    WHERE id = p_user_id AND status = 'pending_verification';
  END IF;
  
  RETURN v_confirmed;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error checking email confirmation: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update profile status when email is confirmed
CREATE OR REPLACE FUNCTION handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is confirmed, update profile status
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE profiles
    SET status = 'active'
    WHERE id = NEW.id AND status = 'pending_verification';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
EXECUTE FUNCTION handle_email_confirmation();

-- Add RLS policies to allow public access to email confirmation
DO $$ 
BEGIN
  -- Allow public to view profiles for email confirmation
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Allow trigger inserts'
  ) THEN
    CREATE POLICY "Allow trigger inserts"
      ON profiles
      FOR INSERT
      TO supabase_auth_admin
      WITH CHECK (true);
  END IF;
END $$;