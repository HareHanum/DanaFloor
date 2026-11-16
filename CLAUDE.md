# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Read `docs/PROJECT.md` before any work. Update its Status and Session log before ending a session.**

## Project Overview

D.A.N.A FLOOR is a website for Dana Shimroni's hospitality consulting business. The brand focuses on service, sales, and hospitality training for restaurants, cafes, hotels, and other hospitality businesses in Israel.

The site is a brand site plus a courses platform: customers buy courses (PayPlus), watch them on the site (Mux video, Supabase auth and data), and the owner builds the courses in the admin area (`/admin`). Details and open questions are in `docs/PROJECT.md`.

Releases: Vercel deploys from `master`, so every merge to `master` is a production release and needs the owner's approval. Applying a Supabase migration to the real database is a separate step that also needs the owner's approval. This repository is public: never commit secrets or private data.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test script and there are no automated tests. Before a merge: lint and build, and look at the pages you touched. `npx tsc --noEmit` can be run by hand.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Auth, database, storage**: Supabase (`supabase/migrations/`, applied by hand)
- **Video**: Mux
- **Payments**: PayPlus
- **E-mail**: Resend; rate limiting: Upstash Redis (in-memory fallback)

## Architecture

```
src/
├── middleware.ts           # Supabase session; protects /courses, /profile, /admin
├── app/
│   ├── layout.tsx          # Root layout (RTL, Hebrew fonts)
│   ├── page.tsx            # Homepage
│   ├── about/ contact/ services/ floor-guide/   # Brand pages
│   ├── privacy/ terms/ refund/ unsubscribe/     # Legal and mailing pages
│   ├── catalog/            # Course catalogue and course sales pages
│   ├── (auth)/             # login, signup, password reset, auth callback
│   ├── (platform)/         # /courses, lessons, /profile (logged-in area)
│   ├── (admin)/admin/      # Admin: courses, students, payments
│   ├── api/                # contact, floor-guide, subscribe, unsubscribe, payments,
│   │                       #   webhooks (payplus, mux), mux, video, progress, attachments, admin
│   └── globals.css         # Global styles, CSS variables
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Page sections (Hero, Services, CTA, etc.)
│   ├── ui/                 # AccessibilityWidget, ServiceNav
│   ├── course/ payment/ auth/ admin/   # Courses platform components
└── lib/
    ├── supabase/ mux/ payplus/ resend/ courses/ security/
    └── utils.ts            # Utility functions (cn)
supabase/migrations/        # 001-008 SQL, applied by hand
docs/PROJECT.md             # What exists, status, open questions
```

## Key Design Patterns

- **RTL Layout**: `dir="rtl"` and `lang="he"` set in root layout
- **Hebrew Font**: Heebo from Google Fonts
- **CSS Variables**: Colors and spacing defined in `globals.css`
- **Animation**: Framer Motion with `useInView` for scroll-triggered animations

## Color Palette

```css
--background: #fafafa     /* Off-white */
--foreground: #1a1a1a     /* Near-black */
--accent: #f69a62         /* Warm gold */
--text-primary: #333333
--text-secondary: #666666
```

## Brand Context

- **Target audience**: Restaurant owners, managers, shift supervisors, and hospitality teams
- **Language**: Hebrew (RTL)
- **Tone**: Professional but approachable, field-experienced, no-nonsense
- **Key message**: "From floor to max income" - practical, results-oriented consulting
