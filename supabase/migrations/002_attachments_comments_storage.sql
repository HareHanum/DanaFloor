-- ============================================
-- Migration 002: Attachments, Comments, Storage
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. LESSON ATTACHMENTS
-- ============================================
create table public.lesson_attachments (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons on delete cascade not null,
  title text not null,
  attachment_type text not null default 'file'
    check (attachment_type in ('file', 'link')),
  file_url text,          -- Supabase Storage URL for uploaded files
  link_url text,          -- External URL (Google Form, homework link, etc.)
  file_name text,         -- Original file name
  file_size integer,      -- File size in bytes
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index idx_lesson_attachments_lesson_id on public.lesson_attachments(lesson_id);

-- RLS
alter table public.lesson_attachments enable row level security;

create policy "Attachments visible for published course lessons"
  on lesson_attachments for select using (
    exists (
      select 1 from lessons l
      join modules m on m.id = l.module_id
      join courses c on c.id = m.course_id
      where l.id = lesson_id and (c.status = 'published' or public.is_admin())
    )
  );
create policy "Admins can manage attachments"
  on lesson_attachments for insert with check (public.is_admin());
create policy "Admins can update attachments"
  on lesson_attachments for update using (public.is_admin());
create policy "Admins can delete attachments"
  on lesson_attachments for delete using (public.is_admin());

-- ============================================
-- 2. LESSON COMMENTS
-- ============================================
create table public.lesson_comments (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null check (char_length(content) > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_lesson_comments_lesson_id on public.lesson_comments(lesson_id);
create index idx_lesson_comments_user_id on public.lesson_comments(user_id);

-- Updated_at trigger
create trigger lesson_comments_updated_at
  before update on public.lesson_comments
  for each row execute procedure public.update_updated_at();

-- RLS
alter table public.lesson_comments enable row level security;

-- Anyone enrolled can read comments on lessons of their courses
create policy "Enrolled users can read comments"
  on lesson_comments for select using (
    exists (
      select 1 from lessons l
      join modules m on m.id = l.module_id
      join enrollments e on e.course_id = m.course_id
      where l.id = lesson_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
    or public.is_admin()
  );

-- Enrolled users can post comments
create policy "Enrolled users can post comments"
  on lesson_comments for insert with check (
    auth.uid() = user_id
    and (
      exists (
        select 1 from lessons l
        join modules m on m.id = l.module_id
        join enrollments e on e.course_id = m.course_id
        where l.id = lesson_id
          and e.user_id = auth.uid()
          and e.status = 'active'
      )
      or public.is_admin()
    )
  );

-- Users can edit own comments
create policy "Users can update own comments"
  on lesson_comments for update using (auth.uid() = user_id);

-- Users can delete own comments, admins can delete any
create policy "Users can delete own comments"
  on lesson_comments for delete using (auth.uid() = user_id or public.is_admin());

-- ============================================
-- 3. STORAGE BUCKETS
-- ============================================

-- Course thumbnails bucket
insert into storage.buckets (id, name, public)
  values ('course-thumbnails', 'course-thumbnails', true);

-- Allow public read of thumbnails
create policy "Thumbnails are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'course-thumbnails');

-- Only admins can upload thumbnails
create policy "Admins can upload thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'course-thumbnails' and public.is_admin());

create policy "Admins can update thumbnails"
  on storage.objects for update
  using (bucket_id = 'course-thumbnails' and public.is_admin());

create policy "Admins can delete thumbnails"
  on storage.objects for delete
  using (bucket_id = 'course-thumbnails' and public.is_admin());

-- Lesson attachments bucket
insert into storage.buckets (id, name, public)
  values ('lesson-attachments', 'lesson-attachments', true);

-- Allow public read (access gated by app logic / enrollment check)
create policy "Attachments are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'lesson-attachments');

-- Only admins can upload attachments
create policy "Admins can upload attachments"
  on storage.objects for insert
  with check (bucket_id = 'lesson-attachments' and public.is_admin());

create policy "Admins can update attachments"
  on storage.objects for update
  using (bucket_id = 'lesson-attachments' and public.is_admin());

create policy "Admins can delete attachments"
  on storage.objects for delete
  using (bucket_id = 'lesson-attachments' and public.is_admin());
