# Design System — Tanteador Pelota Paleta

Mobile-first scorer app. Designed to be used on the court, in hand, under direct sunlight.
Every decision prioritizes glanceability and large touch targets over visual richness.

---

## Theme & Color Tokens

Dark mode is active by default (`class="dark"` on `<html>`). Light mode is fully defined
and ready — switching is a one-liner when a toggle is added.

Tokens live in `src/main.css` using **OKLCH** color space (perceptually uniform, great for
dark/light parity). All shadcn/ui components consume these tokens automatically.

```
:root          → light theme values
.dark          → dark theme values (currently active)
```

Key tokens in use:

| Token                  | Role                                              |
|------------------------|---------------------------------------------------|
| `bg-background`        | Page background (near-black in dark)              |
| `bg-card`              | Elevated surfaces — cards, panels                 |
| `border-border`        | Dividers, card outlines                           |
| `text-foreground`      | Primary text (near-white in dark)                 |
| `text-muted-foreground`| Secondary/label text                             |
| `bg-primary`           | Interactive selected state (e.g. serve selector)  |
| `text-primary-foreground` | Text on primary background                    |
| `bg-destructive`       | Destructive actions (discard, terminar partido)   |

**Never use hardcoded colors for UI elements** — always map to a semantic token so both
themes work without extra work.

---

## Team Colors

The scoring panel uses `bg-red-950` (Team A) and `bg-blue-950` (Team B) as **temporary
hardcoded values**. These are intentionally not tokenized yet — a future feature will let
users pick team colors per match.

When that feature lands:
- Add `--team-a` and `--team-b` CSS custom properties to `:root` and `.dark`
- Replace `bg-red-950` / `bg-blue-950` with `bg-[var(--team-a)]` / `bg-[var(--team-b)]`
- The `teamStyle` map in `GamePage.tsx` is the single place to update

---

## Typography

Font: **Geist Variable** (loaded via `@fontsource-variable/geist`).
Base: `font-sans` applied on `html`.

Scale in use:

| Size          | Usage                                      |
|---------------|--------------------------------------------|
| `text-9xl`    | Set number in StartSetPanel                |
| `text-8xl`    | Live score in GamePage                     |
| `text-5xl`    | Serve reveal overlay (winner name)         |
| `text-4xl`    | Mini scoreboard in CurrentMatch card       |
| `text-3xl`    | Page titles (via `PageTitle`)              |
| `text-xl`     | —                                          |
| `text-base`   | Body, primary buttons                      |
| `text-sm`     | Labels, form inputs, secondary text        |
| `text-xs`     | Section headers, uppercase tracking labels |

Section labels follow this pattern:
```
text-xs font-semibold tracking-widest uppercase text-muted-foreground
```

---

## Layout Patterns

### Full-screen page (GamePage, StartSetPanel)
```
h-screen flex flex-col
```
Content fills the screen with no scroll. Controls anchor to the bottom.

### Scrollable page (WelcomePage, NewGamePage)
```
min-h-screen flex flex-col px-6 pt-14 pb-10 gap-6
```
Padding: `pt-14–pt-16` top, `pb-10` bottom, `px-6` horizontal.

### Action anchor (primary button at bottom)
```
Button size="lg" className="w-full h-14 text-base rounded-xl"
```
All primary CTAs are full-width, `h-14`, and sit at the very bottom of the screen.

---

## Component Patterns

### Card
```tsx
<div className="bg-card border border-border rounded-xl p-4">
```
Use for any elevated surface: current match, score history, serve selector container.

### Section label
```tsx
<p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
  Últimos partidos
</p>
```

### Icon-only destructive button
```tsx
<Button variant="destructive" size="icon-lg">
  <Trash2 />
</Button>
```

### Segmented selector (serve options)
Three-option row using `gap-px bg-border` as separator trick:
```tsx
<div className="flex w-full rounded-xl overflow-hidden border border-border gap-px bg-border">
  {options.map(({ value, label }) => (
    <button className={selected === value
      ? "bg-primary text-primary-foreground"
      : "bg-card text-muted-foreground"
    }>
      {label}
    </button>
  ))}
</div>
```

---

## Animation System

Built with **Framer Motion**.

### Page transitions — `PageTransition`

Every page component wraps its root element in `<PageTransition>`.
Direction is tracked in `AppRoutes` (`App.tsx`) by comparing route depth:

```
/ (0)  →  /new (1)  →  /game (2)
```

Forward navigation slides right-to-left; backward slides left-to-right.
The `DirectionContext` in `src/components/shared/PageTransition.tsx` carries
the direction to each `PageTransition` instance.

**To add a new route**, register its depth in the `routeOrder` map in `App.tsx`.

### Inner transitions (within a route)

Used in `GamePage` to fade between `StartSetPanel` and the scoring panel:
```tsx
<AnimatePresence mode="wait">
  <motion.div key="start-set | scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
```

### Score pop

The score number uses `key={score}` on a `motion.span` to re-trigger on every change:
```tsx
<motion.span
  key={score}
  initial={{ scale: 1.2 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
>
```

### Serve reveal (random selection)

`useServeReveal` in `StartSetPanel.tsx` owns the timing logic.
`ServeReveal` component owns the visuals. Both are intentionally decoupled.

Tweak the rhythm by editing these constants:
```ts
const SPIN_DELAYS_MS = [80, 80, 90, 100, 120, 150, 200, 270, 350, 450];
const SETTLED_HOLD_MS = 900;
```

---

## Pending / Future Work

- **Team color picker**: replace `bg-red-950`/`bg-blue-950` with CSS custom properties
- **Light mode toggle**: add a `ThemeProvider` that toggles `class="dark"` on `<html>`
- **Full match history screen**: new route `/history`, needs a `routeOrder` entry (depth 3)
- **Footer**: copyright + links, to be added to `WelcomePage`
