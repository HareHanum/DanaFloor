-- ============================================
-- Migration 007: Block deletion of purchased courses
-- ============================================
-- Once at least one customer has paid for or enrolled in a course, the admin
-- can no longer delete it from the dashboard. Editing the course (title,
-- modules, lessons, attachments) is still allowed — only DELETE is blocked.
--
-- This protects buyers' access: under the previous CASCADE rule, deleting
-- a course nuked all the modules → lessons → progress for every student
-- who paid for it, which is both a UX disaster and likely a consumer-law
-- violation (we sold "12 months of access").

create or replace function public.block_purchased_course_deletion()
returns trigger as $$
declare
  enrollment_count integer;
  payment_count integer;
begin
  select count(*) into enrollment_count
  from public.enrollments where course_id = old.id;

  select count(*) into payment_count
  from public.payments where course_id = old.id and status = 'completed';

  if enrollment_count > 0 or payment_count > 0 then
    raise exception
      'Cannot delete course "%": % enrolled student(s), % completed payment(s). Archive the course instead (set status = ''archived'').',
      old.title, enrollment_count, payment_count
      using errcode = 'check_violation';
  end if;

  return old;
end;
$$ language plpgsql;

drop trigger if exists courses_block_purchased_deletion on public.courses;

create trigger courses_block_purchased_deletion
  before delete on public.courses
  for each row execute function public.block_purchased_course_deletion();
