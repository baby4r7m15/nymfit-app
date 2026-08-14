-- ============================================================
-- midnight.exe builder — Supabase schema
-- Run this whole file once in the Supabase SQL editor
-- (Project -> SQL Editor -> New query -> paste -> Run)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
-- one row per auth.users row, holds username + role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------- pages ----------
-- one page per user for the MVP (can be relaxed to many later)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  title text not null default 'My Page',
  theme jsonb not null default '{
    "bg": "#060309",
    "panel": "#0b0710",
    "border": "#3a1c46",
    "accent": "#ff2fc9",
    "accent2": "#39e6e6",
    "text": "#eee3f2",
    "textDim": "#9884a6",
    "font": "mono"
  }'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "published pages are publicly readable"
  on public.pages for select
  using (published = true or auth.uid() = user_id);

create policy "owners can insert their page"
  on public.pages for insert
  with check (auth.uid() = user_id);

create policy "owners can update their page"
  on public.pages for update
  using (auth.uid() = user_id);

create policy "owners can delete their page"
  on public.pages for delete
  using (auth.uid() = user_id);

-- ---------- blocks ----------
-- the "cards" that make up a page, ordered by position
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blocks enable row level security;

create policy "blocks of published pages are publicly readable"
  on public.blocks for select
  using (
    exists (
      select 1 from public.pages p
      where p.id = blocks.page_id
        and (p.published = true or p.user_id = auth.uid())
    )
  );

create policy "owners can insert blocks on their page"
  on public.blocks for insert
  with check (
    exists (select 1 from public.pages p where p.id = page_id and p.user_id = auth.uid())
  );

create policy "owners can update blocks on their page"
  on public.blocks for update
  using (
    exists (select 1 from public.pages p where p.id = page_id and p.user_id = auth.uid())
  );

create policy "owners can delete blocks on their page"
  on public.blocks for delete
  using (
    exists (select 1 from public.pages p where p.id = page_id and p.user_id = auth.uid())
  );

-- ---------- admin override policies ----------
-- admins can read/update/delete everything, anywhere
create policy "admins can select all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

create policy "admins can update all profiles"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

create policy "admins can do everything on pages"
  on public.pages for all
  using (
    exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

create policy "admins can do everything on blocks"
  on public.blocks for all
  using (
    exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'admin')
  );

-- ---------- auto-create profile + starter page on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  base_username := lower(regexp_replace(base_username, '[^a-z0-9_]', '', 'g'));
  if base_username is null or base_username = '' then
    base_username := 'user';
  end if;
  if base_username in ('admin','login','signup','logout','dashboard','auth','api','www','app','settings') then
    base_username := base_username || '_';
  end if;

  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, role)
  values (new.id, final_username, 'user');

  insert into public.pages (user_id, title)
  values (new.id, final_username || '''s page');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- updated_at bookkeeping ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at before update on public.pages
  for each row execute procedure public.set_updated_at();

drop trigger if exists blocks_set_updated_at on public.blocks;
create trigger blocks_set_updated_at before update on public.blocks
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- After running this file: sign up through the app once, then
-- promote yourself to admin by running:
--
--   update public.profiles set role = 'admin' where username = 'YOUR_USERNAME';
--
-- ============================================================
