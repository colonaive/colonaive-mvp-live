/*
  Migration: 20250706_auth_fix.sql
  Purpose   : companion patch – re-defines trigger + corporate FN
              (parameter ordering fixed to avoid 42P13)
  Updated   : 2025-07-06
*/

begin;

-------------------------------------------------------------------------------
-- 0.  Clean-slate – remove any earlier, wrongly-ordered version
-------------------------------------------------------------------------------
drop function if exists public.create_full_corporate_account cascade;
drop function if exists public.handle_new_user cascade;

-------------------------------------------------------------------------------
-- 1.  Trigger  (identical to the one in floral_resonance, included for safety)
-------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_role text := lower(coalesce(new.raw_user_meta_data ->> 'user_type','champion'));
begin
  insert into public.profiles (id,email,full_name,user_type,status)
  values (new.id,new.email,new.raw_user_meta_data ->> 'full_name',v_role,'pending_verification')
  on conflict (id) do nothing;

  case v_role
    when 'specialist' then insert into public.specialists(id) values(new.id) on conflict do nothing;
    when 'gp_clinic'  then insert into public.gp_clinics(id)  values(new.id) on conflict do nothing;
    when 'corporate'  then insert into public.corporates(id,user_id) values(new.id,new.id) on conflict do nothing;
    else                   insert into public.champions(id)   values(new.id) on conflict do nothing;
  end case;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-------------------------------------------------------------------------------
-- 2.  Function create_full_corporate_account – *parameter order fixed*
-------------------------------------------------------------------------------
create or replace function public.create_full_corporate_account(
  -- required first
  p_contact_user_id        uuid,
  p_contact_user_email     text,
  p_company_name           text,
  p_uen                    text,
  p_industry               text,
  p_company_size           text,
  p_contact_person_name    text,
  p_phone_number           text,
  -- every parameter *after* this line has an explicit DEFAULT
  p_pledge_amount          numeric  default null,
  p_sponsorship_tier       text     default null,
  p_csr_options            text[]   default null,
  p_prefer_discussion      boolean  default false,
  p_additional_comments    text     default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_corporate_id uuid;
begin
  -- 2.1  profile row ----------------------------------------------------------
  insert into public.profiles (id,email,full_name,phone_number,user_type,status)
  values (
    p_contact_user_id,
    p_contact_user_email,
    p_contact_person_name,
    p_phone_number,
    'corporate',
    'pending_verification'
  )
  on conflict (id) do update
     set full_name    = excluded.full_name,
         phone_number = excluded.phone_number,
         user_type    = 'corporate',
         status       = 'pending_verification';

  -- 2.2  corporates row -------------------------------------------------------
  insert into public.corporates (
    id, user_id,
    company_name, uen, industry, company_size, contact_person_name
  )
  values (
    p_contact_user_id,
    p_contact_user_id,
    p_company_name,
    p_uen,
    p_industry,
    p_company_size,
    p_contact_person_name
  )
  on conflict (id) do update
     set company_name       = excluded.company_name,
         uen                = excluded.uen,
         industry           = excluded.industry,
         company_size       = excluded.company_size,
         contact_person_name= excluded.contact_person_name
  returning id into v_corporate_id;

  -- 2.3  sponsorship row ------------------------------------------------------
  insert into public.corporate_sponsorships (
    corporate_id, pledge_amount, sponsorship_tier, csr_options,
    prefer_discussion, additional_comments, status, is_publicly_visible
  )
  values (
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
    raise exception 'create_full_corporate_account(): %', sqlerrm;
end;
$$;

commit;
