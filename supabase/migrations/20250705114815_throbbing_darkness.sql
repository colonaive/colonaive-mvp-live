/*
  # Fix Email Confirmation Process
  
  1. Changes
    - Add handle_email_confirmation trigger function
    - Create trigger to update profile status when email is confirmed
    - Add function to manually verify email
  
  2. Purpose
    - Ensure profile status is updated when email is confirmed
    - Provide a way to manually verify email if needed
*/

-- Create a function to handle email confirmation
CREATE OR REPLACE FUNCTION handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is confirmed, update profile status
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE profiles
    SET status = 'active'
    WHERE id = NEW.id AND status = 'pending_verification';
    
    RAISE NOTICE 'Updated profile status to active for user %', NEW.id;
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
  
  RETURN v_confirmed;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error checking email confirmation: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;