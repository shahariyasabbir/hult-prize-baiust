-- =====================================================================
-- Hult Prize @ BAIUST — registrations table + Row Level Security
-- Run this whole script once in: Supabase Dashboard → SQL Editor
-- =====================================================================

create table if not exists public.registrations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references auth.users (id) on delete cascade,

  team_name        text not null check (char_length(team_name)    between 2 and 80),
  leader_name      text not null check (char_length(leader_name)  between 2 and 80),
  email            text not null check (char_length(email)        between 5 and 254),
  phone            text not null check (phone ~ '^\+?[0-9][0-9\s-]{6,19}$'),
  institution      text not null check (char_length(institution)  between 2 and 150),

  -- Other team members (leader is NOT included): [{ "name": "...", "email": "..." }]
  team_members     jsonb not null default '[]'::jsonb
                   check (jsonb_typeof(team_members) = 'array' and jsonb_array_length(team_members) <= 3),

  project_title    text not null check (char_length(project_title)    between 2 and 120),
  problem_summary  text not null check (char_length(problem_summary)  between 30 and 1000),
  solution_summary text not null check (char_length(solution_summary) between 30 and 1000),

  status           text not null default 'submitted'
                   check (status in ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Keep updated_at fresh ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();

-- Row Level Security ---------------------------------------------------
alter table public.registrations enable row level security;

revoke all on public.registrations from anon;
grant select, insert, update on public.registrations to authenticated;

drop policy if exists "Contestants can view their own registration"   on public.registrations;
drop policy if exists "Contestants can create their own registration" on public.registrations;
drop policy if exists "Contestants can update their own registration" on public.registrations;

create policy "Contestants can view their own registration"
  on public.registrations for select to authenticated
  using ((select auth.uid()) = user_id);

-- A contestant can only create a row for themselves, and can never
-- self-assign 'under_review' / 'accepted' / 'rejected'.
create policy "Contestants can create their own registration"
  on public.registrations for insert to authenticated
  with check ((select auth.uid()) = user_id and status in ('draft', 'submitted'));

-- Editing is allowed only while the registration is still draft/submitted.
-- Once organisers move it to under_review/accepted/rejected it is locked.
create policy "Contestants can update their own registration"
  on public.registrations for update to authenticated
  using      ((select auth.uid()) = user_id and status in ('draft', 'submitted'))
  with check ((select auth.uid()) = user_id and status in ('draft', 'submitted'));

-- No DELETE policy on purpose: contestants cannot delete registrations.
-- Organisers change status from the Supabase dashboard (Table Editor),
-- which uses the service role and bypasses RLS.
