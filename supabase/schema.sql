-- Reference snapshot of the VitaPath schema after the professional workspace migration.
-- For a NEW database only. Do not run this over the existing project.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check(char_length(full_name)<=120),
  headline text check(char_length(headline)<=180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check(document_type in ('resume','scholarship_cv','cover_letter','motivation_letter','recommendation_letter','personal_statement')),
  title text not null default 'Untitled' check(char_length(title) between 1 and 160),
  content jsonb not null default '{}' check(jsonb_typeof(content)='object' and octet_length(content::text)<=250000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_owner_updated_idx on public.documents(user_id,updated_at desc);
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
create policy profiles_select_own on public.profiles for select to authenticated using((select auth.uid())=id);
create policy profiles_insert_own on public.profiles for insert to authenticated with check((select auth.uid())=id);
create policy profiles_update_own on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);
create policy documents_select_own on public.documents for select to authenticated using((select auth.uid())=user_id);
create policy documents_insert_own on public.documents for insert to authenticated with check((select auth.uid())=user_id);
create policy documents_update_own on public.documents for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy documents_delete_own on public.documents for delete to authenticated using((select auth.uid())=user_id);
revoke all on public.documents,public.profiles from anon,authenticated;
grant select,insert,update,delete on public.documents to authenticated;
grant select,insert,update on public.profiles to authenticated;
create function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''));
 return new;
end;
$$;
revoke all on function private.handle_new_user() from public,anon,authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
create function private.touch_updated_at() returns trigger language plpgsql security invoker set search_path='' as $$
begin new.updated_at=clock_timestamp(); return new; end;
$$;
revoke all on function private.touch_updated_at() from public,anon,authenticated;
create trigger documents_touch_updated_at before update on public.documents for each row execute function private.touch_updated_at();
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function private.touch_updated_at();
