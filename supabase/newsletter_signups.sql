-- Run this once in the Supabase SQL editor for your project.
-- Creates the newsletter_signups table used by js/newsletter.js and
-- locks it down so the public anon key can only INSERT, never read back.

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

create policy "Allow public inserts"
  on public.newsletter_signups
  for insert
  to anon
  with check (true);

-- No select/update/delete policy is created for anon on purpose —
-- the public site can add rows but cannot read or modify the list.
