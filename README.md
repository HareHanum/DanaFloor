# D.A.N.A FLOOR

Website of D.A.N.A FLOOR, hospitality consulting and training for restaurants, cafes, bars and hotels in Israel. It is a Hebrew (right-to-left) brand site plus a courses platform: customers buy courses and watch them on the site, and the owner builds the courses in an admin area.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev      # http://localhost:3000
```

Environment variables (Supabase, PayPlus, Mux, Resend, Upstash) are read from `.env.local`, which is git-ignored. The variable names are listed in `docs/PROJECT.md`. Without them the brand pages render, but login, purchase, video and forms will not work.

## Verify

```bash
npm run lint
npm run build
```

There are no automated tests.

## More

- `docs/PROJECT.md`: what the site is, what exists, release rules, status and open questions. Read it first.
- `CLAUDE.md`: guidance for Claude Code working in this repository.
- `IMPLEMENTATION_PLAN.md`: the original brochure-site plan, kept as history.

Deployment: Vercel, from `master`. A merge to `master` is a production release.
