/*
  Migration: 20250703-202855_floral_resonance.sql
  Purpose   : Fix corporate-signup path (user_type, trigger, RLS)
  Updated   : 2025-07-06 – parameter-ordering for Postgres 42P13 compliance
*/

begin;

/* ------------------------------------------------------------------ *
 * 1.  ENUM-like CHECK on profiles.user_type                           *
 * ------------------------------------------------------------------ */
alter table if exists public.profiles
  drop constraint if exists profiles_user_type_check;

alter table public.profiles
  add  constraint profiles_user_type_check
  check (
    user_type in (
      'champion',
      'specialist',
      'gp_clinic',
      'corporate',
      'admin',
      'super_admin'
    )
  );

/* migrate the old temporary value */
update public.profiles
set    user_type = 'corporate'
where  user_type = 'corporate_contact';


/* ------------------------------------------------------------------ *
 * 2.  role tables (id = auth.users.id)                                *
 * ------------------------------------------------------------------ */
create table if not exists public.specialists (
  id uuid primary key references auth.users on delete cascade
);

create table if not exists public.gp_clinics (
  id uuid primary key references auth.users on delete cascade
);

create table if not exists public.corporates (
  id      uuid primary key references auth.users on delete cascade,
  user_id uuid references auth.users
);

create table if not exists public.champions (
  id uuid primary key references auth.users on delete cascade
);

alter table public.specialists  enable row level security;
alter table public.gp_clinics   enable row level security;
alter table public.corporates   enable row level security;
alter table public.champions    enable row level security;


/* ------------------------------------------------------------------ *
 * 3.  Trigger: handle_new_user                                        *
 * ------------------------------------------------------------------ */
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, auth
as $$
declare
  v_role text := lower(coalesce(new.raw_user_meta_data ->> 'user_type', 'champion'));
begin
  insert into public.profiles (id, email, full_name, user_type, status)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    v_role,
    'pending_verification'
  )
  on conflict (id) do nothing;

  case v_role
    when 'specialist' then
      insert into public.specialists(id) values (new.id)
      on conflict do nothing;
    when 'gp_clinic'  then
      insert into public.gp_clinics(id) values (new.id)
      on conflict do nothing;
    when 'corporate'  then
      insert into public.corporates(id, user_id) values (new.id, new.id)
      on conflict do nothing;
    else
      insert into public.champions(id) values (new.id)
      on conflict do nothing;
  end case;

  return new;
end;
$$;

/* (re)-attach trigger */
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


/* ------------------------------------------------------------------ *
 * 4.  Function: create_full_corporate_account                         *
 *     – parameter order fixed: all params after first DEFAULT param   *
 * ------------------------------------------------------------------ */
create or replace function public.create_full_corporate_account(
  p_contact_user_id        uuid,
  p_contact_user_email     text,
  p_company_name           text,
  p_uen                    text,
  p_industry               text,
  p_company_size           text,
  p_contact_person_name    text,
  p_phone_number           text,
  /* optional parameters start here – every one has DEFAULT */
  p_pledge_amount          numeric      default null,
  p_sponsorship_tier       text         default null,
  p_csr_options            text[]       default null,
  p_prefer_discussion      boolean      default false,
  p_additional_comments    text         default null
) returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_corporate_id uuid;
begin
  /* 4.1 update (or create) profile */
  insert into public.profiles (id, email, full_name, phone_number, user_type, status)
  values (
    p_contact_user_id,
    p_contact_user_email,
    p_contact_person_name,
    p_phone_number,
    'corporate',
    'pending_verification'
  )
  on conflict (id) do update
     set full_name   = excluded.full_name,
         phone_number= excluded.phone_number,
         user_type   = 'corporate',
         status      = 'pending_verification';

  /* 4.2 corporate row */
  insert into public.corporates (
    id, user_id,
    company_name, uen, industry, company_size, contact_person_name
  )
  values (
    p_contact_user_id,            -- id
    p_contact_user_id,            -- user_id owner
    p_company_name,
    p_uen,
    p_industry,
    p_company_size,
    p_contact_person_name
  )
  on conflict (id) do update
     set company_name        = excluded.company_name,
         uen                  = excluded.uen,
         industry             = excluded.industry,
         company_size         = excluded.company_size,
         contact_person_name  = excluded.contact_person_name
  returning id into v_corporate_id;

  /* 4.3 sponsorship row */
  insert into public.corporate_sponsorships (
    corporate_id,
    pledge_amount,
    sponsorship_tier,
    csr_options,
    prefer_discussion,
    additional_comments,
    status,
    is_publicly_visible
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


/* ------------------------------------------------------------------ *
 * 5.  RLS policies on corporates                                      *
 * ------------------------------------------------------------------ */
do $$
begin
  if not exists (
    select from pg_policies
    where  tablename = 'corporates'
    and    policyname = 'Corporates can view own data'
  ) then
    create policy "Corporates can view own data"
      on corporates
      for select
      using (id = auth.uid() or user_id = auth.uid());
  end if;

  if not exists (
    select from pg_policies
    where  tablename = 'corporates'
    and    policyname = 'Service role full access corporates'
  ) then
    create policy "Service role full access corporates"
      on corporates
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end;
$$;

alter table public.corporates enable row level security;

commit;
