/*
  # Update Email Confirmation Flow
  
  1. Changes
    - Add function to handle email confirmation
    - Update trigger to set profile status to active when email is confirmed
  
  2. Purpose
    - Streamline email confirmation flow
    - Ensure profiles are marked as active when email is confirmed
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