-- ============================================
-- Migration 006: Split sensitive lesson content into separate table
-- ============================================
-- Background: migration 004 created a SECURITY DEFINER view (lesson_summaries)
-- so non-enrolled users could browse lesson titles in the catalog while the
-- main `lessons` table stayed locked behind enrollment. Supabase flags
-- SECURITY DEFINER views as a risk because they bypass RLS — even though
-- the view here intentionally only exposes safe columns.
--
-- Cleaner architecture: move the truly sensitive columns (content_html,
-- download_url) into a separate `lesson_content` table with strict RLS.
-- Then `lessons` itself can be publicly readable for published courses, and
-- the view is no longer needed. mux_playback_id stays in `lessons` because
-- it's useless without a server-signed playback token.

-- ============================================
-- 1. New table: lesson_content
-- ============================================
create table if not exists public.lesson_content (
  lesson_id uuid primary key references public.lessons on delete cascade,
  content_html text,
  download_url text,
  updated_at timestamptz default now()
);

create trigger lesson_content_updated_at
  before update on public.lesson_content
  for each row execute procedure public.update_updated_at();

-- ============================================
-- 2. Migrate data from lessons → lesson_content
-- ============================================
insert into public.lesson_content (lesson_id, content_html, download_url)
select id, content_html, download_url
from public.lessons
where content_html is not null or download_url is not null
on conflict (lesson_id) do nothing;

-- ============================================
-- 3. Drop sensitive columns from lessons
-- ============================================
alter table public.lessons drop column if exists content_html;
alter table public.lessons drop column if exists download_url;

-- ============================================
-- 4. lessons RLS — relax to public-read for published courses
-- ============================================
-- Sensitive content lives in lesson_content now, so lessons itself is
-- catalog-safe.
drop policy if exists "Lessons visible to admins" on public.lessons;
drop policy if exists "Preview lessons visible to all" on public.lessons;
drop policy if exists "Enrolled users can read course lessons" on public.lessons;

create policy "Published-course lessons are readable by all"
  on public.lessons for select using (
    public.is_admin()
    or exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and c.status = 'published'
    )
  );

-- ============================================
-- 5. lesson_content RLS — strict
-- ============================================
alter table public.lesson_content enable row level security;

create policy "Lesson content for admins"
  on public.lesson_content for select
  using (public.is_admin());

create policy "Lesson content for preview lessons"
  on public.lesson_content for select
  using (
    exists (
      select 1 from public.lessons l
      where l.id = lesson_id and l.is_preview = true
        and exists (
          select 1 from public.modules m
          join public.courses c on c.id = m.course_id
          where m.id = l.module_id and c.status = 'published'
        )
    )
  );

create policy "Lesson content for enrolled users"
  on public.lesson_content for select
  using (
    exists (
      select 1 from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = lesson_id and public.is_enrolled(m.course_id)
    )
  );

create policy "Admins can insert lesson content"
  on public.lesson_content for insert
  with check (public.is_admin());

create policy "Admins can update lesson content"
  on public.lesson_content for update
  using (public.is_admin());

create policy "Admins can delete lesson content"
  on public.lesson_content for delete
  using (public.is_admin());

-- ============================================
-- 6. Drop the security-definer view
-- ============================================
drop view if exists public.lesson_summaries;
