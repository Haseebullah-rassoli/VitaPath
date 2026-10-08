-- Contact messages, account support and Premium interest share a private queue.
create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  category text not null check (category in ('general','account','technical','documents','privacy','premium','feedback')),
  subject text not null check (char_length(btrim(subject)) between 5 and 160),
  message text not null check (char_length(btrim(message)) between 20 and 5000),
  status text not null default 'open' check (status in ('open','in_review','answered','closed')),
  admin_reply text check (char_length(admin_reply) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.support_requests enable row level security;
revoke all on public.support_requests from public, anon, authenticated;
-- Public visitors may send a message but cannot read the queue or set reply/status.
grant insert (id,user_id,name,email,category,subject,message) on public.support_requests to anon,authenticated;
grant select on public.support_requests to authenticated;
grant all on public.support_requests to service_role;
create policy support_submit on public.support_requests for insert to anon,authenticated
  with check (user_id is not distinct from (select auth.uid()) and status='open' and admin_reply is null);
create policy support_read_own on public.support_requests for select to authenticated
  using (user_id=(select auth.uid()));
create index support_requests_owner_created_idx on public.support_requests(user_id,created_at desc);
create index support_requests_email_created_idx on public.support_requests(lower(email),created_at desc);
create index support_requests_created_idx on public.support_requests(created_at desc);
-- A trigger can count the queue without giving visitors permission to read it.
-- It is private, has no direct EXECUTE grants, and always validates the owner.
create function private.guard_support_request() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.user_id is distinct from (select auth.uid()) then
    raise exception 'Request owner does not match the signed-in account' using errcode='42501';
  end if;
  new.name=btrim(new.name);
  new.email=lower(btrim(new.email));
  new.subject=btrim(new.subject);
  new.message=btrim(new.message);
  new.created_at=clock_timestamp();
  new.updated_at=new.created_at;
  -- Serialize capacity checks so concurrent submissions cannot evade the limits.
  perform pg_catalog.pg_advisory_xact_lock(729410284015::bigint);
  if (select count(*) from public.support_requests where lower(email)=new.email and created_at>now()-interval '1 hour')>=5 then
    raise exception 'Support request limit reached';
  end if;
  if new.user_id is not null and (select count(*) from public.support_requests where user_id=new.user_id and created_at>now()-interval '1 hour')>=5 then
    raise exception 'Support request limit reached';
  end if;
  if (select count(*) from public.support_requests where created_at>now()-interval '1 hour')>=100 then
    raise exception 'Support is temporarily busy';
  end if;
  return new;
end;
$$;
revoke all on function private.guard_support_request() from public,anon,authenticated;
create trigger support_request_guard before insert on public.support_requests for each row execute function private.guard_support_request();
create trigger support_request_timestamp before update on public.support_requests for each row execute function private.touch_updated_at();
comment on table public.support_requests is 'Private support queue; public insert-only, authenticated owner read-only. Replies/status are maintained by the project administrator. Contact emails are not verified by this form.';
