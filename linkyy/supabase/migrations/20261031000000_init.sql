-- Linkyy · Week 1 schema: profiles, pages, username rules.
--
-- Security model
--   * RLS is on for every table. Owners can read their own rows.
--   * Column-level grants decide WHAT an owner may change directly
--     (e.g. display_name yes, plan/role no). Supabase grants ALL on new
--     tables to anon/authenticated by default, so we revoke first.
--   * Anything that needs validation or touches several rows goes through a
--     SECURITY DEFINER function with an empty search_path.
--   * Public data (the published page) is only exposed through
--     get_public_page(); anon cannot select tables directly.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Format rules (keep in sync with lib/username.ts, both are tested
-- against tests/fixtures/username-cases.ts):
--   3–24 chars, a-z 0-9 . _, starts and ends with a letter/digit,
--   no two separators in a row.
create or replace function public.is_valid_username_format(candidate text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select candidate is not null
     and candidate ~ '^[a-z0-9][a-z0-9._]{1,22}[a-z0-9]$'
     and candidate !~ '[._]{2}';
$$;

-- ---------------------------------------------------------------------------
-- Username rules
-- ---------------------------------------------------------------------------

create table public.reserved_usernames (
  name text primary key
);

-- match = 'word'      → blocked when a segment (split by . _ digits) equals term
-- match = 'substring' → blocked when the username contains term anywhere
create table public.blocked_username_terms (
  term  text primary key,
  match text not null check (match in ('word', 'substring'))
);

alter table public.reserved_usernames enable row level security;
alter table public.blocked_username_terms enable row level security;
revoke all on public.reserved_usernames from anon, authenticated;
revoke all on public.blocked_username_terms from anon, authenticated;

insert into public.reserved_usernames (name) values
  ('about'), ('account'), ('accounts'), ('admin'), ('administrator'), ('api'),
  ('app'), ('assets'), ('auth'), ('billing'), ('blog'), ('callback'),
  ('checkout'), ('contact'), ('creator'), ('creators'), ('dashboard'),
  ('dev'), ('docs'), ('download'), ('downloads'), ('email'), ('explore'),
  ('faq'), ('help'), ('home'), ('legal'), ('login'), ('logout'), ('mail'),
  ('me'), ('mod'), ('moderator'), ('new'), ('null'), ('official'),
  ('onboarding'), ('order'), ('orders'), ('pay'), ('payment'), ('payments'),
  ('pricing'), ('privacy'), ('pro'), ('product'), ('products'), ('profile'),
  ('register'), ('report'), ('root'), ('security'), ('settings'), ('shop'),
  ('signin'), ('signout'), ('signup'), ('staff'), ('static'), ('status'),
  ('store'), ('support'), ('system'), ('team'), ('terms'), ('test'),
  ('undefined'), ('user'), ('users'), ('www');

insert into public.blocked_username_terms (term, match) values
  -- impersonation
  ('linkyy', 'substring'),
  -- English
  ('fuck', 'substring'), ('porn', 'substring'), ('shit', 'substring'),
  ('bitch', 'substring'), ('nigger', 'substring'), ('nigga', 'substring'),
  -- Vietnamese (no diacritics). Word-match only: as substrings these would
  -- block innocent names like "salon" or "cacao".
  ('dm', 'word'), ('dmm', 'word'), ('dcm', 'word'), ('dcmm', 'word'),
  ('dkm', 'word'), ('vcl', 'word'), ('vkl', 'word'), ('clm', 'word'),
  ('cmm', 'word'), ('dit', 'word'), ('lon', 'word'), ('cac', 'word'),
  ('buoi', 'word');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  username            text unique,
  display_name        text not null default '',
  bio                 text not null default '',
  avatar_url          text,
  role                text not null default 'creator' check (role in ('creator', 'admin')),
  plan                text not null default 'free' check (plan in ('free', 'pro')),
  plan_expires_at     timestamptz,
  is_verified         boolean not null default false,
  is_banned           boolean not null default false,
  username_changed_at timestamptz,
  onboarded_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint profiles_username_format check (username is null or public.is_valid_username_format(username)),
  constraint profiles_display_name_len check (char_length(display_name) <= 50),
  constraint profiles_bio_len check (char_length(bio) <= 160),
  constraint profiles_avatar_url_https check (avatar_url is null or (avatar_url ~ '^https://' and char_length(avatar_url) <= 1024))
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles: owner can read"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles: owner can update"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
-- Only these columns are directly editable. username → claim_username(),
-- onboarded_at → complete_onboarding(), plan/role/flags → server only.
grant update (display_name, bio, avatar_url) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Pages (one per creator)
-- ---------------------------------------------------------------------------

create table public.pages (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references public.profiles (id) on delete cascade,
  theme            jsonb not null default '{"preset": "clean"}'::jsonb,
  draft_blocks     jsonb not null default '[]'::jsonb,
  published_theme  jsonb,
  published_blocks jsonb,
  published_at     timestamptz,
  is_sensitive     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- Shape is validated in the app with Zod (and again when rendering);
  -- the database enforces type and size so nobody can store a novel.
  constraint pages_theme_object check (jsonb_typeof(theme) = 'object' and pg_column_size(theme) <= 4096),
  constraint pages_draft_blocks_array check (
    jsonb_typeof(draft_blocks) = 'array'
    and jsonb_array_length(draft_blocks) <= 100
    and pg_column_size(draft_blocks) <= 65536
  )
);

create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

alter table public.pages enable row level security;

create policy "pages: owner can read"
  on public.pages for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "pages: owner can update"
  on public.pages for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on public.pages from anon, authenticated;
grant select on public.pages to authenticated;
grant update (theme, draft_blocks, is_sensitive) on public.pages to authenticated;

-- ---------------------------------------------------------------------------
-- New user → profile + empty page
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta   jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  name   text  := coalesce(meta ->> 'full_name', meta ->> 'name', split_part(coalesce(new.email, ''), '@', 1), '');
  avatar text  := coalesce(meta ->> 'avatar_url', meta ->> 'picture');
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(trim(name), 50),
    case when avatar ~ '^https://' and char_length(avatar) <= 1024 then avatar end
  );

  insert into public.pages (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RPC: username
-- ---------------------------------------------------------------------------

-- Returns 'ok' | 'invalid' | 'reserved' | 'taken'.
-- A username the caller already owns counts as 'ok'.
create or replace function public.username_status(candidate text)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  u text := lower(trim(candidate));
begin
  if not public.is_valid_username_format(u) then
    return 'invalid';
  end if;

  if exists (select 1 from public.reserved_usernames r where r.name = u) then
    return 'reserved';
  end if;

  if exists (
    select 1
    from public.blocked_username_terms b
    where (b.match = 'substring' and position(b.term in u) > 0)
       or (b.match = 'word' and b.term = any (regexp_split_to_array(u, '[._0-9]+')))
  ) then
    return 'reserved';
  end if;

  if exists (
    select 1 from public.profiles p
    where p.username = u and p.id is distinct from auth.uid()
  ) then
    return 'taken';
  end if;

  return 'ok';
end;
$$;

-- Returns 'ok' | 'invalid' | 'reserved' | 'taken' | 'cooldown' | 'banned'.
-- Changing username is free until onboarding is done; after that there is
-- a 30-day cooldown between changes (anti-squatting / impersonation).
create or replace function public.claim_username(new_username text)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  uid    uuid := auth.uid();
  u      text := lower(trim(new_username));
  me     public.profiles%rowtype;
  status text;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into me from public.profiles where id = uid for update;
  if not found then
    raise exception 'profile not found' using errcode = 'P0002';
  end if;

  if me.is_banned then
    return 'banned';
  end if;

  if me.username = u then
    return 'ok';
  end if;

  status := public.username_status(u);
  if status <> 'ok' then
    return status;
  end if;

  if me.onboarded_at is not null
     and me.username_changed_at is not null
     and me.username_changed_at > now() - interval '30 days' then
    return 'cooldown';
  end if;

  begin
    update public.profiles
       set username = u,
           username_changed_at = case when me.onboarded_at is not null then now() else me.username_changed_at end
     where id = uid;
  exception when unique_violation then
    return 'taken';
  end;

  return 'ok';
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: page lifecycle
-- ---------------------------------------------------------------------------

-- Copies the draft to the live page. Returns the publish time.
create or replace function public.publish_page()
returns timestamptz
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  ts  timestamptz := now();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  if not exists (select 1 from public.profiles where id = uid and username is not null and not is_banned) then
    raise exception 'claim a username first' using errcode = 'P0001';
  end if;

  update public.pages
     set published_blocks = draft_blocks,
         published_theme  = theme,
         published_at     = ts
   where user_id = uid;

  return ts;
end;
$$;

create or replace function public.unpublish_page()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  update public.pages set published_at = null where user_id = auth.uid();
end;
$$;

-- Marks onboarding as done. Returns false if the user has no username yet.
create or replace function public.complete_onboarding()
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  update public.profiles
     set onboarded_at = coalesce(onboarded_at, now())
   where id = uid and username is not null;

  return found;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: public page (the only way anon reads creator data)
-- ---------------------------------------------------------------------------

create or replace function public.get_public_page(handle text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'username',     p.username,
    'display_name', p.display_name,
    'bio',          p.bio,
    'avatar_url',   p.avatar_url,
    'is_verified',  p.is_verified,
    'plan',         case when p.plan = 'pro' and (p.plan_expires_at is null or p.plan_expires_at > now()) then 'pro' else 'free' end,
    'theme',        coalesce(pg.published_theme, '{}'::jsonb),
    'blocks',       coalesce(pg.published_blocks, '[]'::jsonb),
    'is_sensitive', pg.is_sensitive,
    'published_at', pg.published_at
  )
  from public.profiles p
  join public.pages pg on pg.user_id = p.id
  where p.username = lower(trim(handle))
    and not p.is_banned
    and pg.published_at is not null;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges (Postgres grants EXECUTE to PUBLIC by default)
-- ---------------------------------------------------------------------------

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_valid_username_format(text) from public, anon, authenticated;
revoke execute on function public.username_status(text) from public, anon, authenticated;
revoke execute on function public.claim_username(text) from public, anon, authenticated;
revoke execute on function public.publish_page() from public, anon, authenticated;
revoke execute on function public.unpublish_page() from public, anon, authenticated;
revoke execute on function public.complete_onboarding() from public, anon, authenticated;
revoke execute on function public.get_public_page(text) from public, anon, authenticated;

-- Pure function used by the profiles CHECK constraint, which runs with the
-- caller's privileges, so editors of profiles need EXECUTE on it.
grant execute on function public.is_valid_username_format(text) to anon, authenticated;
grant execute on function public.username_status(text) to anon, authenticated;
grant execute on function public.get_public_page(text) to anon, authenticated;
grant execute on function public.claim_username(text) to authenticated;
grant execute on function public.publish_page() to authenticated;
grant execute on function public.unpublish_page() to authenticated;
grant execute on function public.complete_onboarding() to authenticated;
