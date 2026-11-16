# PROJECT: D.A.N.A FLOOR site

Read this file before any work. Update **Status** and **Session log** before ending a session.

## What this is

A brand site plus a courses platform. The owner calls it an "upgraded brand site".

- The brand: D.A.N.A FLOOR, hospitality consulting and training by Dana Shimroni (name from `CLAUDE.md` and `src/app/layout.tsx`). The brand site presents her consulting, training, establishment-support services and results.
- The platform: customers buy courses on the site, and watch them on the site. The courses are built by the business owner in the admin area (`src/app/(admin)`).
- Audience (from `CLAUDE.md`): restaurant owners, managers, shift supervisors and hospitality teams, mainly in Israel. The site is Hebrew, right to left (`src/app/layout.tsx`).

## What exists

### Brand site (public pages, `src/app`)

| Route | Path |
|---|---|
| `/` home: Hero, Introduction, Services, ForWhom, Testimonials, FAQ, CTA | `src/app/page.tsx`, `src/components/sections/` |
| `/about` | `src/app/about/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` |
| `/services` overview | `src/app/services/page.tsx` |
| `/services/consulting`, `/services/establishment`, `/services/results` | `src/app/services/consulting/`, `establishment/`, `results/` |
| `/services/training` and 11 training pages: `service`, `sales`, `management`, `roles`, `bar`, `coffee`, `hospitality`, `hostess`, `menu`, `shift-managers`, `wine` | `src/app/services/training/` |
| `/floor-guide`: lead-capture form that e-mails a PDF guide | `src/app/floor-guide/page.tsx`, `public/guides/` |
| `/privacy`, `/terms`, `/refund`, `/unsubscribe` | `src/app/privacy/`, `terms/`, `refund/`, `unsubscribe/` |
| 404, loading, sitemap, OG and Twitter images, `robots.txt`, `manifest.json` | `src/app/not-found.tsx`, `loading.tsx`, `sitemap.ts`, `opengraph-image.tsx`, `twitter-image.tsx`, `public/robots.txt`, `public/manifest.json` |

Shared pieces: Header and Footer (`src/components/layout/`), page sections and the service page layout (`src/components/sections/`), the accessibility widget and service navigation (`src/components/ui/`).

`src/app/sitemap.ts` lists 13 pages: home, about, contact, the services pages, four of the 11 training pages (`service`, `sales`, `management`, `roles`) and `/floor-guide`. It leaves out the other seven training pages, `/catalog`, `/catalog/[slug]`, `/refund`, `/privacy` and `/terms`.

### Courses platform

- Catalogue and course sales page: `/catalog` (`src/app/catalog/page.tsx`) and `/catalog/[slug]` (`src/app/catalog/[slug]/page.tsx`). Components in `src/components/course/` (CourseCard, PricingCard, StickyPurchaseBar, CourseTestimonials, ModuleAccordion).
- Sign-up and login (Supabase Auth): `/login`, `/signup`, `/forgot-password`, `/reset-password`, and the auth callback `src/app/(auth)/callback/route.ts`. All under `src/app/(auth)/`.
- Purchase: `PurchaseButton` (`src/components/payment/PurchaseButton.tsx`) calls `POST /api/payments/create`, which creates a PayPlus payment page and a pending row in `payments`. The course has a `payment_type` of `one_time` or `subscription` (`supabase/migrations/001_lms_schema.sql`); `src/app/api/payments/create/route.ts` selects the PayPlus charge method from it. PayPlus confirms through `/api/webhooks/payplus`; the buyer returns through `/api/payments/success`; `/api/payments/verify` is a further check. Code: `src/lib/payplus/`.
- Viewing: `/courses` (my courses) and `/courses/[slug]`, and lessons at `/courses/[slug]/lessons/[lessonId]`, all in `src/app/(platform)/`. Lesson pages are reachable without login for preview lessons (`src/middleware.ts`, `is_preview` column). Videos play through Mux signed tokens (`/api/video/token`, `src/lib/mux/tokens.ts`, `src/components/course/LessonPlayer.tsx`). Progress is saved through `/api/progress`. Lesson attachments download through `/api/attachments/[id]`. Lesson comments exist (`src/components/course/LessonComments.tsx`, per-course toggle `comments_enabled`).
- User account: `/profile` (`src/app/(platform)/profile/page.tsx`, shown as "account settings").

### Admin area (`src/app/(admin)/admin`)

Access is limited to users whose `profiles.role` is `admin` (`src/middleware.ts`).

- `/admin`: dashboard (course, enrollment and payment counts).
- `/admin/courses`, `/admin/courses/new`, `/admin/courses/[id]`: create and edit courses, modules, lessons, attachments, testimonials, images and video upload. Components in `src/components/admin/` (drag-and-drop ordering uses `@dnd-kit`).
- `/admin/students`, `/admin/payments`: lists.
- Course export and import as JSON: `/api/admin/courses/[id]/export`, `/api/admin/courses/import` (schema in `src/lib/courses/export-schema.ts`).

### API routes (`src/app/api`)

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | contact form, sends e-mail through Resend |
| `/api/floor-guide` | POST | guide form: validates, e-mails the PDF in `public/guides/` |
| `/api/subscribe` | POST | adds a contact to the Resend audience |
| `/api/unsubscribe` | POST | unsubscribe |
| `/api/payments/create` | POST | start a PayPlus payment (login required, same-origin check) |
| `/api/payments/success` | GET, POST | return from PayPlus |
| `/api/payments/verify` | POST | verify a payment |
| `/api/webhooks/payplus` | POST, GET | PayPlus callback, including subscription cancel and fail events |
| `/api/webhooks/mux` | POST | Mux asset-ready events |
| `/api/mux/upload` | POST | create a Mux direct upload (admin) |
| `/api/video/token` | POST | signed playback token for a lesson |
| `/api/progress` | POST | save lesson progress |
| `/api/attachments/[id]` | GET | signed URL for a lesson attachment |
| `/api/admin/courses/import`, `/api/admin/courses/[id]/export` | POST, GET | course import and export |
| `/api/admin/testimonials/upload` | POST | upload testimonial media |

Security helpers: rate limit (Upstash Redis, `src/lib/security/rate-limit.ts`), same-origin check, HTML escaping, safe redirect (`src/lib/security/`). Security headers and the redirect from `www.dana-floor.com` and `dana-floor.com` to `floor-dana.com` are in `next.config.ts`.

### Database (Supabase, `supabase/migrations`)

| File | Adds |
|---|---|
| `001_lms_schema.sql` | `profiles` (with signup trigger), `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `payments`, indexes and row-level security |
| `002_attachments_comments_storage.sql` | `lesson_attachments`, `lesson_comments`, storage buckets (course thumbnails, lesson attachments) and policies |
| `003_course_comments_toggle.sql` | `courses.comments_enabled` |
| `004_security_hardening.sql` | `is_enrolled()` helper, stricter policies for lessons and attachments, private attachments bucket, `lesson_summaries` view |
| `005_protect_profile_role.sql` | trigger that blocks a user from changing their own `role` |
| `006_lesson_content_split.sql` | moves `content_html` and `download_url` into a new `lesson_content` table with strict policies; drops the `lesson_summaries` view |
| `007_lock_purchased_courses.sql` | trigger that blocks deleting a course that has buyers or enrollments |
| `008_course_testimonials.sql` | `course_testimonials` table and policies |

Generated types: `src/types/database.ts`. The migrations are applied by hand in the Supabase SQL editor (as their header comments say); there is no migration runner in the repository.

### Environment variables (names only; there is no `.env.example`, these come from `process.env` in `src`)

`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYPLUS_API_KEY`, `PAYPLUS_SECRET_KEY`, `PAYPLUS_PAYMENT_PAGE_UID`, `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_PRIVATE_KEY`, `MUX_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `RESEND_SEGMENT_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## Stack

From `package.json`:

- Next.js 16.1.1 (App Router), React 19.2.3, TypeScript ^5
- Tailwind CSS ^4 (`@tailwindcss/postcss`), Framer Motion ^12, Lucide React ^0.562
- Supabase (`@supabase/supabase-js` ^2.103, `@supabase/ssr` ^0.10): auth, Postgres, storage
- Mux (`@mux/mux-node` ^12.8, `@mux/mux-player-react` ^3.11): lesson video
- PayPlus (called with `fetch` from `src/lib/payplus/`, no SDK): payments
- Resend ^6.9: e-mail and mailing-list contacts
- Upstash Redis and Ratelimit: rate limiting
- Zod ^4, `@dnd-kit` (core 6, sortable 10), clsx, use-debounce
- ESLint ^9 with `eslint-config-next` 16.1.1
- Hosting: Vercel (see Release)

## Verify

Scripts in `package.json`: `npm run lint` (ESLint), `npm run build` (production build), `npm run dev`, `npm run start`.

There is no `test` script and no test files: **there are no automated tests**. There is no typecheck script either; `npx tsc --noEmit` can be run by hand (not run when this file was written). There is no CI workflow in the repository (no `.github` directory). Before a merge to `master`: run lint and build, and check the pages you touched by eye.

## Release

The site is deployed by Vercel from `master` (stated by the owner; the repository holds no Vercel config file). Every merge to `master` is therefore a production release and needs the owner's approval first.

Applying a database migration to the real Supabase database is a separate step and also needs the owner's approval. Merging a migration file does not apply it.

## Status

2026-11-16: this file was written from a reading of the code on that date. Nothing was run. The earlier documents (`CLAUDE.md`, `README.md`) described only a brochure site on Next.js 14; they were updated in the same change. `IMPLEMENTATION_PLAN.md` is the original brochure-site plan, kept as history.

Not known from the code: see Open questions.

Repository oddities noticed: three empty files at the repository root named `dana-floor-app@0.1.0`, `next` and `npm` (likely created by a mistyped shell command such as `npm run ... > next`). They are tracked in git and do nothing. Left in place.

## Open questions

For the owner to answer; none are guessed here.

1. Is PayPlus the live payment provider, and is it in production or test mode?
2. Is any course published (`status = 'published'`) and for sale today? What are the prices and access terms (one-time or subscription)?
3. Are all eight migrations applied to the production Supabase database, and in which project?
4. Which environment variables are set in Vercel, and is Upstash configured? Without it the rate limiter uses an in-memory fallback (`src/lib/security/rate-limit.ts`).
5. Is Vercel connected to `master` for production, and are preview deployments used?
6. What is planned next: more courses, subscriptions, more admin features, changes to the brand pages?
7. Should `/catalog` and its course pages be added to the sitemap, and the legal pages too?
8. Should the three empty root files be removed?
9. Are the refund, terms and privacy pages current for selling courses (they have not been reviewed here)?

## Session log

- 2026-11-16: created this file from a reading of the code (routes, `src/lib`, migrations, `package.json`, `next.config.ts`). Updated `README.md` and `CLAUDE.md` to match. No code changed.
