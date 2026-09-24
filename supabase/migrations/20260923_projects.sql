-- Bizorvia: projects table migration
-- Run this in Supabase → SQL Editor

-- 1. Create the projects table
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  slug              text not null unique,               -- becomes the subdomain: slug.bizorvia.com
  description       text,
  status            text not null default 'pending'     -- pending | deployed | partial | error
    check (status in ('pending', 'deployed', 'partial', 'error')),
  file_count        integer not null default 0,
  last_deployed_at  timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 2. Index for fast user lookups
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_slug_idx    on public.projects(slug);

-- 3. Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- 4. Row Level Security — users can only touch their own projects
alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- 5. Service role bypass (needed for the deploy API route which uses service key)
-- The service role ignores RLS by default — no extra policy needed.

-- Verify
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'projects'
order by ordinal_position;
