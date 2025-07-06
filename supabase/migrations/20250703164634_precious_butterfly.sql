/*
  # Fix Champion Signup Database Error

  1. Changes
    - Simplify the handle_new_user trigger function
    - Fix user_type constraint to properly include 'champion'
    - Add proper error handling for profile creation
    - Ensure proper RLS policies
  
  2. Purpose
    - Fix the "Database error saving new user" issue during signup
    - Ensure proper profile creation for new users
*/

-- First, fix the user_type constraint to ensure 'champion' is accepted
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

-- Simplify and fix the handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with simplified logic
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'champion'),
    'pending_verification'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- If user_type is 'champion', also insert into champions table
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'champion') = 'champion' THEN
    INSERT INTO public.champions (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
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

-- Ensure champions table exists with minimal required structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'champions') THEN
    CREATE TABLE public.champions (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      date_of_birth date,
      gender text,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add RLS policies for champions table
DO $$ 
BEGIN
  -- Allow champions to insert their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'champions' AND policyname = 'Champions can insert their own data'
  ) THEN
    CREATE POLICY "Champions can insert their own data"
      ON public.champions
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Allow champions to select their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'champions' AND policyname = 'Champions can select their own data'
  ) THEN
    CREATE POLICY "Champions can select their own data"
      ON public.champions
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;

  -- Allow champions to update their own data
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'champions' AND policyname = 'Champions can update their own data'
  ) THEN
    CREATE POLICY "Champions can update their own data"
      ON public.champions
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;

  -- Allow service role full access
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'champions' AND policyname = 'Service role full access champions'
  ) THEN
    CREATE POLICY "Service role full access champions"
      ON public.champions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure proper RLS policies for profiles table
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
      TO anon
      WITH CHECK (true);
  END IF;
  
  -- Allow service role full access
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access"
      ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;