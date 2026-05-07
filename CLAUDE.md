# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Type-check (tsc -b) then bundle (vite)
pnpm lint       # ESLint on all files
pnpm preview    # Serve the production build locally
```

No tests are configured yet.

## Stack

- **React 19** with StrictMode
- **TypeScript** — strict mode, `noUnusedLocals`, `noUnusedParameters`
- **Vite 8** with Rolldown/Oxc (fast bundler mode)
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `main.css` (not v3 `@tailwind` directives)
- **React Compiler** — enabled via Babel preset; do NOT add manual `useMemo`/`useCallback` for optimization purposes, the compiler handles it
- **Zustand v5** — global store at `src/store/store.ts`; prefer exported selector hooks over raw `useTanteadorStore`
- **Zod v4** — types are inferred from Zod schemas in `src/types/BaseTypes.ts`; the schema is the source of truth, not the TypeScript type
- **React Router v7** — `BrowserRouter` with declarative `<Routes>` in `App.tsx`
- **shadcn/ui** (radix-nova style) — generated components land in `src/components/ui/`; add via `pnpm shadcn add <component>`
- **react-hook-form** + `@hookform/resolvers/zod` — standard form stack

## Architecture

Entry point: `src/main.tsx` → `src/App.tsx` → page components.

**Routes:**
| Path | Component |
|------|-----------|
| `/` | `WelcomePage` |
| `/new` | `NewGamePage` |
| `/game` | `GamePage` |

**Directory conventions:**
- `src/pages/<page-name>/` — page entry component (named export, no default export)
- `src/pages/<page-name>/components/` — components used only by that page
- `src/components/shared/` — components shared across pages (e.g. `PageTitle`)
- `src/components/ui/` — shadcn primitives; do NOT edit these manually
- `src/types/BaseTypes.ts` — all domain types (`Match`, `MatchSet`, `TeamId`, etc.) as Zod schemas
- `src/store/store.ts` — Zustand store with selector hooks

**Path alias:** `@/` resolves to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

## Design System

See [`DESIGN.md`](./DESIGN.md) for the full design reference — tokens, typography, layout
patterns, component patterns, and animation system. Read it before making any UI changes.

## Code Style

ESLint uses flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, `react-refresh`, and `prettier` plugins. Prettier is installed with defaults (no `.prettierrc`).

Named exports only on page components. Default exports are fine for shadcn UI primitives (they ship that way) but avoid them for new code.
