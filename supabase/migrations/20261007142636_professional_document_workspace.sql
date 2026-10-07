-- Add the personal statement builder and tighten existing document access.
alter table public.documents drop constraint if exists documents_document_type_check;
alter table public.documents add constraint documents_document_type_check check (document_type in ('resume','scholarship_cv','cover_letter','motivation_letter','recommendation_letter','personal_statement'));
alter table public.documents add constraint documents_title_length check (char_length(title) between 1 and 160);
alter table public.documents add constraint documents_content_object check (jsonb_typeof(content)='object' and octet_length(content::text)<=250000);
alter table public.profiles add constraint profiles_full_name_length check (char_length(full_name)<=120);
alter table public.profiles add constraint profiles_headline_length check (char_length(headline)<=180);
create index if not exists documents_owner_updated_idx on public.documents(user_id,updated_at desc);
alter table public.documents enable row level security;
alter table public.profiles enable row level security;
-- RLS does not protect TRUNCATE. Grant only the operations the app needs.
revoke all on public.documents,public.profiles from anon;
revoke all on public.documents,public.profiles from authenticated;
grant select,insert,update,delete on public.documents to authenticated;
grant select,insert,update on public.profiles to authenticated;
-- Preserve the signup trigger while removing its function from the exposed schema.
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
alter function public.handle_new_user() set schema private;
alter function private.handle_new_user() set search_path = '';
revoke all on function private.handle_new_user() from public,anon,authenticated;
create function private.touch_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at=clock_timestamp();
  return new;
end;
$$;
revoke all on function private.touch_updated_at() from public,anon,authenticated;
create trigger documents_touch_updated_at before update on public.documents for each row execute function private.touch_updated_at();
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function private.touch_updated_at();
