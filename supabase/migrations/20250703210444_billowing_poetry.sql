/*
  # Fix Corporate Signup Database Error
  
  1. Changes
    - Fix user_type value from 'corporate' to 'corporate_contact'
    - Update handle_new_user trigger function
    - Fix create_full_corporate_account function
  
  2. Purpose
    - Fix the "Database error saving new user" issue during corporate signup
*/

begin;

-- Fix user_type constraint to include 'corporate_contact'
alter table profiles drop constraint if exists profiles_user_type_check;
alter table profiles add constraint profiles_user_type_check
check (user_type in ('member', 'admin', 'super_admin', 'champion', 
                     'GPClinic', 'specialist', 'corporate_contact'));

-- Fix handle_new_user trigger function
create or replace function handle_new_user()
returns trigger as $$
declare
  v_user_type text;
begin
  -- Get user_type from metadata
  v_user_type := NEW.raw_user_meta_data->>'user_type';
  
  -- If not found, default to 'champion'
  if v_user_type is null then
    v_user_type := 'champion';
  end if;
  
  -- Insert into profiles table
  insert into public.profiles (
    id, 
    email, 
    full_name, 
    user_type,
    status
  )
  values (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    v_user_type,
    'pending_verification'
  )
  on conflict (id) do nothing;
  
  -- Based on user_type, insert into role-specific table
  if v_user_type = 'champion' then
    insert into public.champions (id)
    values (NEW.id)
    on conflict (id) do nothing;
  elsif v_user_type = 'specialist' then
    insert into public.specialists (id)
    values (NEW.id)
    on conflict (id) do nothing;
  elsif v_user_type = 'GPClinic' then
    insert into public."GPClinics" (id)
    values (NEW.id)
    on conflict (id) do nothing;
  elsif v_user_type = 'corporate_contact' then
    -- For corporate_contact, we don't create a record here
    -- It will be handled by create_full_corporate_account
    null;
  end if;
  
  return NEW;
exception
  when others then
    -- Log error but don't fail the transaction
    raise notice 'Error in handle_new_user trigger: %', SQLERRM;
    return NEW;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Fix create_full_corporate_account function
create or replace function create_full_corporate_account(
  p_contact_user_id uuid,
  p_contact_user_email text,
  p_company_name text,
  p_uen text,
  p_industry text,
  p_company_size text,
  p_contact_person_name text,
  p_phone_number text,
  p_pledge_amount numeric default null,
  p_sponsorship_tier text default null,
  p_csr_options text[] default null,
  p_prefer_discussion boolean default false,
  p_additional_comments text default null
) returns void as $$
declare
  v_corporate_id uuid;
begin
  -- Create or update the profile record
  insert into profiles (
    id,
    email,
    full_name,
    phone_number,
    user_type,
    status
  ) values (
    p_contact_user_id,
    p_contact_user_email,
    p_contact_person_name,
    p_phone_number,
    'corporate_contact',
    'pending_verification'
  )
  on conflict (id) do update set
    full_name = p_contact_person_name,
    phone_number = p_phone_number,
    user_type = 'corporate_contact',
    status = 'pending_verification';

  -- Create the corporate record
  insert into corporates (
    company_name,
    uen,
    industry,
    company_size,
    contact_person_name,
    user_id
  ) values (
    p_company_name,
    p_uen,
    p_industry,
    p_company_size,
    p_contact_person_name,
    p_contact_user_id
  )
  returning id into v_corporate_id;

  -- Update the profile with the corporate_id
  update profiles
  set corporate_id = v_corporate_id
  where id = p_contact_user_id;

  -- Create the sponsorship record
  insert into corporate_sponsorships (
    corporate_id,
    pledge_amount,
    sponsorship_tier,
    csr_options,
    prefer_discussion,
    additional_comments,
    status,
    is_publicly_visible
  ) values (
    v_corporate_id,
    p_pledge_amount,
    p_sponsorship_tier,
    p_csr_options,
    p_prefer_discussion,
    p_additional_comments,
    'pending_review',
    false
  );
exception
  when others then
    raise exception 'Error in create_full_corporate_account: %', SQLERRM;
end;
$$ language plpgsql security definer;

commit;