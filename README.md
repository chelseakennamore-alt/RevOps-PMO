# RevOps PMO
React + TypeScript + Vite + Tailwind. Run `npm install && npm run dev`.

- `src/data/seed.ts` – 15 sample projects (dates are generated relative to today)
- `src/store.tsx` – all data access; persists to localStorage. Swap this file for Supabase/API when hosting.
- `src/components/` – Overview, ProjectDetail, CalendarView, ExecSummary

## Viewing in Lovable
1. In Lovable, create a new project and choose the GitHub import / connect option.
2. Authorize Lovable for this repo and select `RevOps-PMO` (branch `main`).
3. Lovable builds the app and gives you a live preview link.

Working rules while iterating:
- Make code changes in one place at a time (here via Claude Code, or in Lovable), not both at once, to avoid merge conflicts.
- Data is saved in each browser's localStorage only. A shared backend (e.g. Supabase) is the step before real team use.
- The repo is public; make it private before adding real project data.
