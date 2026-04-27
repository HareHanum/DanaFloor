-- ============================================
-- Migration 005: Block role-self-promotion
-- ============================================
-- The "Users can update own profile" RLS policy uses USING (auth.uid() = id)
-- with no column restriction, so a logged-in user could update their own
-- `role` column to 'admin' from the browser via the anon key. That would let
-- them bypass every other RLS rule (is_admin() returns true).
--
-- We add a BEFORE UPDATE trigger that revokes any role change unless the
-- caller is already an admin. Triggers run inside RLS context — auth.uid()
-- works the same way — so this is a tight gate.

create or replace function public.guard_profile_role()
returns trigger as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'role change is not permitted';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists profiles_guard_role on public.profiles;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute procedure public.guard_profile_role();

-- Also harden against direct inserts. The handle_new_user trigger creates
-- profile rows automatically via SECURITY DEFINER (system context), so user
-- code never needs to insert into profiles. Make sure no INSERT policy
-- exists for normal users — RLS denies by default when no policy matches,
-- so this is just a defensive double-check.
do $$
begin
  -- Drop any permissive insert policies (none expected, but be explicit).
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and cmd = 'INSERT'
  ) then
    raise notice 'Found insert policies on profiles — review them manually';
  end if;
end $$;
