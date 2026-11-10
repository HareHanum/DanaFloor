-- 008: Course testimonials
--
-- Testimonials shown on a course's sales page (/catalog/[slug]): a face photo,
-- name, role, optional quote, and an optional video that opens in a popup.
-- Managed by admins from the course editor.
--
-- Videos are uploaded to Mux with a PUBLIC playback policy (they are marketing
-- content shown to logged-out visitors, unlike lesson videos which are signed).
-- Flow mirrors lessons: the editor stores the Mux upload id in mux_upload_id,
-- and the Mux webhook fills mux_playback_id when the asset is ready.
--
-- Photos reuse the existing public `course-thumbnails` storage bucket
-- (admin-write, public-read — see 002), so no storage changes are needed.

create table if not exists public.course_testimonials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  author_name text not null,
  author_role text,
  quote text,
  photo_url text,
  mux_upload_id text,
  mux_playback_id text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists course_testimonials_course_idx
  on public.course_testimonials (course_id, sort_order);

create index if not exists course_testimonials_upload_idx
  on public.course_testimonials (mux_upload_id);

alter table public.course_testimonials enable row level security;

-- Same visibility rule as modules: everyone sees testimonials of published
-- courses; admins see all (so draft previews show them too).
create policy "Testimonials visible for published courses"
  on public.course_testimonials for select using (
    exists (select 1 from public.courses where id = course_id and status = 'published')
    or public.is_admin()
  );
create policy "Admins can insert testimonials"
  on public.course_testimonials for insert with check (public.is_admin());
create policy "Admins can update testimonials"
  on public.course_testimonials for update using (public.is_admin());
create policy "Admins can delete testimonials"
  on public.course_testimonials for delete using (public.is_admin());
