/*
  # Fix Email Verification and User Creation Process

  1. Changes
    - Fix user_type constraint in profiles table
    - Improve handle_new_user trigger function
    - Add status column to profiles if it doesn't exist
    - Ensure proper RLS policies for all tables
  
  2. Purpose
    - Fix email verification process
    - Ensure proper profile creation during signup
    - Improve security and access control
*/

-- Fix user_type constraint in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

-- Add status column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'pending_verification';
  END IF;
END $$;

-- Ensure champions table exists with proper structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'champions') THEN
    CREATE TABLE public.champions (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      date_of_birth date,
      gender text,
      emergency_contact_name text,
      emergency_contact_phone text,
      medical_conditions text[],
      screening_status text,
      last_screening_date date,
      next_screening_date date,
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

-- Improve handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Get user_type from metadata
  DECLARE
    v_user_type TEXT;
  BEGIN
    -- Try to get user_type from metadata
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
    
    -- If user_type is 'champion', also insert into champions table
    IF v_user_type = 'champion' THEN
      INSERT INTO public.champions (id)
      VALUES (NEW.id)
      ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure proper RLS policies for profiles table
DO $$ 
BEGIN
  -- Allow users to view their own profile
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Allow users to update their own profile
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
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

  -- Allow users to insert their own profile
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Allow public (anonymous) users to insert profiles during signup
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public can insert profiles during signup'
  ) THEN
    CREATE POLICY "Public can insert profiles during signup"
      ON profiles
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;