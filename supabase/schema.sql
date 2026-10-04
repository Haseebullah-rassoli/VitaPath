-- Run in Supabase SQL Editor. RLS ensures users can access only their own profile.
create table if not exists public.profiles (user_id uuid primary key references auth.users(id) on delete cascade,full_name text check(char_length(full_name)<=120),headline text check(char_length(headline)<=180),updated_at timestamptz not null default now());
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid()=user_id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid()=user_id);
create policy "update own profile" on public.profiles for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
