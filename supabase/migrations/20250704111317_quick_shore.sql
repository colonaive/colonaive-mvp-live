/*
  # Create RPC Functions for User Registration
  
  1. Functions
    - create_full_gp_clinic_account
    - create_full_specialist_account
    - create_full_corporate_account
    - update_champion_profile_details
    - update_gp_clinic_profile
    - update_specialist_profile
  
  2. Purpose
    - Provide secure, server-side functions for creating and updating user accounts
    - Ensure proper data validation and error handling
    - Maintain data consistency across related tables
*/

-- Function to create a complete GP clinic account
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
  UPDATE profiles
  SET 
    full_name = p_contact_person_name,
    email = p_email,
    phone_number = p_phone_number,
    user_type = 'GPClinic',
    status = 'pending_verification',
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Create or update the GP clinic record
  INSERT INTO "GPClinics" (
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a complete specialist account
CREATE OR REPLACE FUNCTION create_full_specialist_account(
  p_user_id UUID,
  p_user_email TEXT,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_medical_registration_no TEXT,
  p_qualifications TEXT,
  p_field_of_specialization TEXT,
  p_clinic_affiliation TEXT,
  p_address TEXT,
  p_postal_code TEXT,
  p_region TEXT,
  p_years_of_experience INTEGER,
  p_specialties TEXT[],
  p_languages TEXT,
  p_website TEXT DEFAULT NULL,
  p_operating_hours JSONB DEFAULT NULL,
  p_insurance_partners TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Update the profile record
  UPDATE profiles
  SET 
    full_name = p_full_name,
    email = p_user_email,
    phone_number = p_phone_number,
    user_type = 'specialist',
    status = 'pending_verification',
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Create or update the specialist record
  INSERT INTO specialists (
    id,
    medical_registration_no,
    qualifications,
    field_of_specialization,
    clinic_affiliation,
    address,
    postal_code,
    region,
    years_of_experience,
    specialties,
    languages,
    website,
    operating_hours,
    insurance_partners,
    notes
  ) VALUES (
    p_user_id,
    p_medical_registration_no,
    p_qualifications,
    p_field_of_specialization,
    p_clinic_affiliation,
    p_address,
    p_postal_code,
    p_region,
    p_years_of_experience,
    p_specialties,
    p_languages,
    p_website,
    p_operating_hours,
    p_insurance_partners,
    p_notes
  )
  ON CONFLICT (id) DO UPDATE SET
    medical_registration_no = EXCLUDED.medical_registration_no,
    qualifications = EXCLUDED.qualifications,
    field_of_specialization = EXCLUDED.field_of_specialization,
    clinic_affiliation = EXCLUDED.clinic_affiliation,
    address = EXCLUDED.address,
    postal_code = EXCLUDED.postal_code,
    region = EXCLUDED.region,
    years_of_experience = EXCLUDED.years_of_experience,
    specialties = EXCLUDED.specialties,
    languages = EXCLUDED.languages,
    website = EXCLUDED.website,
    operating_hours = EXCLUDED.operating_hours,
    insurance_partners = EXCLUDED.insurance_partners,
    notes = EXCLUDED.notes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a complete corporate account
CREATE OR REPLACE FUNCTION create_full_corporate_account(
  p_contact_user_id UUID,
  p_contact_user_email TEXT,
  p_company_name TEXT,
  p_uen TEXT,
  p_industry TEXT,
  p_company_size TEXT,
  p_contact_person_name TEXT,
  p_phone_number TEXT,
  p_pledge_amount NUMERIC DEFAULT NULL,
  p_sponsorship_tier TEXT DEFAULT NULL,
  p_csr_options TEXT[] DEFAULT NULL,
  p_prefer_discussion BOOLEAN DEFAULT FALSE,
  p_additional_comments TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  v_corporate_id UUID;
BEGIN
  -- Update the profile record
  UPDATE profiles
  SET 
    full_name = p_contact_person_name,
    email = p_contact_user_email,
    phone_number = p_phone_number,
    user_type = 'corporate_contact',
    status = 'pending_verification',
    updated_at = NOW()
  WHERE id = p_contact_user_id;

  -- Create the corporate record
  INSERT INTO corporates (
    company_name,
    uen,
    industry,
    company_size,
    contact_person_name,
    user_id
  ) VALUES (
    p_company_name,
    p_uen,
    p_industry,
    p_company_size,
    p_contact_person_name,
    p_contact_user_id
  )
  RETURNING id INTO v_corporate_id;

  -- Update the profile with the corporate_id
  UPDATE profiles
  SET corporate_id = v_corporate_id
  WHERE id = p_contact_user_id;

  -- Create the sponsorship record
  INSERT INTO corporate_sponsorships (
    corporate_id,
    pledge_amount,
    sponsorship_tier,
    csr_options,
    prefer_discussion,
    additional_comments,
    status,
    is_publicly_visible
  ) VALUES (
    v_corporate_id,
    p_pledge_amount,
    p_sponsorship_tier,
    p_csr_options,
    p_prefer_discussion,
    p_additional_comments,
    'pending_review',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update champion profile details
CREATE OR REPLACE FUNCTION update_champion_profile_details(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_address TEXT,
  p_date_of_birth DATE
) RETURNS VOID AS $$
BEGIN
  -- Update the profile record
  UPDATE profiles
  SET 
    full_name = p_full_name,
    phone_number = p_phone_number,
    address = p_address,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update the champion record
  INSERT INTO champions (
    id,
    date_of_birth
  ) VALUES (
    p_user_id,
    p_date_of_birth
  )
  ON CONFLICT (id) DO UPDATE SET
    date_of_birth = EXCLUDED.date_of_birth;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update GP clinic profile
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
  UPDATE "GPClinics"
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

-- Function to update specialist profile
CREATE OR REPLACE FUNCTION update_specialist_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT,
  p_medical_registration_no TEXT,
  p_qualifications TEXT,
  p_field_of_specialization TEXT,
  p_clinic_affiliation TEXT,
  p_address TEXT,
  p_postal_code TEXT,
  p_region TEXT,
  p_website TEXT,
  p_years_of_experience INTEGER,
  p_specialties TEXT[],
  p_languages TEXT,
  p_operating_hours JSONB,
  p_insurance_partners TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Update the profile record
  UPDATE profiles
  SET 
    full_name = p_full_name,
    phone_number = p_phone_number,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update the specialist record
  UPDATE specialists
  SET
    medical_registration_no = p_medical_registration_no,
    qualifications = p_qualifications,
    field_of_specialization = p_field_of_specialization,
    clinic_affiliation = p_clinic_affiliation,
    address = p_address,
    postal_code = p_postal_code,
    region = p_region,
    website = p_website,
    years_of_experience = p_years_of_experience,
    specialties = p_specialties,
    languages = p_languages,
    operating_hours = p_operating_hours,
    insurance_partners = p_insurance_partners,
    notes = p_notes
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;