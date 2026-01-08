# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

D.A.N.A FLOOR is a website for Dana Shimroni's hospitality consulting business. The brand focuses on service, sales, and hospitality training for restaurants, cafes, hotels, and other hospitality businesses in Israel.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (RTL, Hebrew fonts)
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles, CSS variables
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Page sections (Hero, Services, CTA, etc.)
│   └── ui/                 # Reusable UI components
└── lib/
    └── utils.ts            # Utility functions (cn)
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
--accent: #d4a574         /* Warm gold */
--text-primary: #333333
--text-secondary: #666666
```

## Brand Context

- **Target audience**: Restaurant owners, managers, shift supervisors, and hospitality teams
- **Language**: Hebrew (RTL)
- **Tone**: Professional but approachable, field-experienced, no-nonsense
- **Key message**: "From floor to max income" - practical, results-oriented consulting

## Content Source

Refer to these files for detailed page content and copy:
- `תוכן ואיפיון ראשוני לאתר אינטרנט.pdf`
- `דנה Floor - דיגיטל.docx`
