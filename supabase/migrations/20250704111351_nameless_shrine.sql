/*
  # Fix User Type Constraint
  
  1. Changes
    - Update user_type constraint to include all valid user types
    - Ensure consistent naming across the application
  
  2. Purpose
    - Fix signup and email confirmation flow
    - Ensure proper profile creation
*/

-- Fix user_type constraint in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));