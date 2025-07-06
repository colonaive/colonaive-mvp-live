-- Drop existing conflicting policies
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow profile creation') THEN
    DROP POLICY "Allow profile creation" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public can insert profiles during signup') THEN
    DROP POLICY "Public can insert profiles during signup" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    DROP POLICY "Users can insert own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    DROP POLICY "Users can view own profile" ON profiles;
  END IF;
END $$;

-- Create comprehensive policies for profile management
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable profile creation during signup') THEN
    CREATE POLICY "Enable profile creation during signup"
      ON profiles
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Service role has full access') THEN
    CREATE POLICY "Service role has full access"
      ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure the profiles table has RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Fix the champions table creation and policies
DO $$ 
BEGIN
  -- Create champions table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'champions') THEN
    CREATE TABLE public.champions (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      date_of_birth date,
      gender text,
      emergency_contact_name text,
      emergency_contact_phone text,
      medical_conditions text[],
      screening_status text DEFAULT 'not_screened',
      last_screening_date date,
      next_screening_date date,
      created_at timestamptz DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Add RLS policies for champions table
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can insert their own data') THEN
    CREATE POLICY "Champions can insert their own data"
      ON public.champions
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can select their own data') THEN
    CREATE POLICY "Champions can select their own data"
      ON public.champions
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Champions can update their own data') THEN
    CREATE POLICY "Champions can update their own data"
      ON public.champions
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'champions' AND policyname = 'Service role full access champions') THEN
    CREATE POLICY "Service role full access champions"
      ON public.champions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Improve the handle_new_user trigger function
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
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE NOTICE 'Error in handle_new_user trigger: %', SQLERRM;
      RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();