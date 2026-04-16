-- ============================================
-- LMS Schema for FLOOR D.A.N.A
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. COURSES
-- ============================================
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  short_description text,
  thumbnail_url text,
  price_ils integer not null default 0,
  subscription_price_ils integer,
  payment_type text not null default 'one_time'
    check (payment_type in ('one_time', 'subscription')),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 3. MODULES
-- ============================================
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  title text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- 4. LESSONS
-- ============================================
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules on delete cascade not null,
  title text not null,
  description text,
  lesson_type text not null default 'video'
    check (lesson_type in ('video', 'text', 'quiz', 'download')),
  mux_playback_id text,
  mux_asset_id text,
  duration_seconds integer,
  content_html text,
  download_url text,
  sort_order integer default 0,
  is_preview boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 5. ENROLLMENTS
-- ============================================
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  status text not null default 'active'
    check (status in ('active', 'expired', 'cancelled', 'refunded')),
  payment_type text not null default 'one_time',
  payplus_transaction_id text,
  payplus_subscription_id text,
  enrolled_at timestamptz default now(),
  expires_at timestamptz,
  unique(user_id, course_id)
);

-- ============================================
-- 6. LESSON PROGRESS
-- ============================================
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  progress_seconds integer default 0,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- ============================================
-- 7. PAYMENTS
-- ============================================
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  amount_ils integer not null,
  currency text default 'ILS',
  status text not null
    check (status in ('pending', 'completed', 'failed', 'refunded')),
  payplus_transaction_id text unique,
  payplus_payment_page_uid text,
  payment_method text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================
-- 8. INDEXES
-- ============================================
create index idx_courses_slug on public.courses(slug);
create index idx_courses_status on public.courses(status);
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_enrollments_user_id on public.enrollments(user_id);
create index idx_enrollments_course_id on public.enrollments(course_id);
create index idx_lesson_progress_user_id on public.lesson_progress(user_id);
create index idx_lesson_progress_lesson_id on public.lesson_progress(lesson_id);
create index idx_payments_user_id on public.payments(user_id);

-- ============================================
-- 9. HELPER FUNCTION: is_admin()
-- ============================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Admins can read all profiles"
  on profiles for select using (public.is_admin());
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- COURSES
alter table public.courses enable row level security;

create policy "Published courses visible to everyone"
  on courses for select using (status = 'published');
create policy "Admins can see all courses"
  on courses for select using (public.is_admin());
create policy "Admins can insert courses"
  on courses for insert with check (public.is_admin());
create policy "Admins can update courses"
  on courses for update using (public.is_admin());
create policy "Admins can delete courses"
  on courses for delete using (public.is_admin());

-- MODULES
alter table public.modules enable row level security;

create policy "Modules visible for published courses"
  on modules for select using (
    exists (select 1 from courses where id = course_id and status = 'published')
    or public.is_admin()
  );
create policy "Admins can insert modules"
  on modules for insert with check (public.is_admin());
create policy "Admins can update modules"
  on modules for update using (public.is_admin());
create policy "Admins can delete modules"
  on modules for delete using (public.is_admin());

-- LESSONS
alter table public.lessons enable row level security;

create policy "Lessons visible for published courses"
  on lessons for select using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      where m.id = module_id and (c.status = 'published' or public.is_admin())
    )
  );
create policy "Admins can insert lessons"
  on lessons for insert with check (public.is_admin());
create policy "Admins can update lessons"
  on lessons for update using (public.is_admin());
create policy "Admins can delete lessons"
  on lessons for delete using (public.is_admin());

-- ENROLLMENTS
alter table public.enrollments enable row level security;

create policy "Users can view own enrollments"
  on enrollments for select using (auth.uid() = user_id);
create policy "Admins can view all enrollments"
  on enrollments for select using (public.is_admin());
create policy "Admins can manage enrollments"
  on enrollments for insert with check (public.is_admin());
create policy "Admins can update enrollments"
  on enrollments for update using (public.is_admin());
create policy "Admins can delete enrollments"
  on enrollments for delete using (public.is_admin());

-- LESSON PROGRESS
alter table public.lesson_progress enable row level security;

create policy "Users can view own progress"
  on lesson_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on lesson_progress for update using (auth.uid() = user_id);
create policy "Admins can view all progress"
  on lesson_progress for select using (public.is_admin());

-- PAYMENTS
alter table public.payments enable row level security;

create policy "Users can view own payments"
  on payments for select using (auth.uid() = user_id);
create policy "Admins can view all payments"
  on payments for select using (public.is_admin());
create policy "Admins can manage payments"
  on payments for insert with check (public.is_admin());
create policy "Admins can update payments"
  on payments for update using (public.is_admin());

-- ============================================
-- 11. UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger courses_updated_at
  before update on public.courses
  for each row execute procedure public.update_updated_at();

create trigger lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.update_updated_at();

create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute procedure public.update_updated_at();
