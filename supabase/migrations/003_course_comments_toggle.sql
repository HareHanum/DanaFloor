-- Add comments_enabled toggle to courses (default: true)
alter table public.courses add column comments_enabled boolean default true;
