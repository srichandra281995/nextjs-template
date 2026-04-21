# Neev — Architecture & Design System Reference

> This document is the authoritative reference for AI agents generating code in this codebase.
> Every decision described here is already implemented and verified in the current template.
> Do not deviate from these patterns unless explicitly instructed.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [File Structure](#2-file-structure)
3. [Naming Conventions](#3-naming-conventions)
4. [TypeScript Standards](#4-typescript-standards)
5. [Design System — Colors & CSS Variables](#5-design-system--colors--css-variables)
6. [Design System — Typography](#6-design-system--typography)
7. [Design System — Spacing & Layout](#7-design-system--spacing--layout)
8. [Design System — Border Radius & Shadows](#8-design-system--border-radius--shadows)
9. [Dark / Light Mode Strategy](#9-dark--light-mode-strategy)
10. [Glass Morphism Patterns](#10-glass-morphism-patterns)
11. [Component Classes (globals.css)](#11-component-classes-globalscss)
12. [Animation Standards](#12-animation-standards)
13. [Component Patterns](#13-component-patterns)
14. [Authentication — Clerk](#14-authentication--clerk)
15. [Database — Supabase](#15-database--supabase)
16. [Coding Standards](#16-coding-standards)
17. [UI Components & Classes](#17-ui-components--classes)

---

## 1. Tech Stack

| Layer | Package | Version | Notes |
|---|---|---|---|
| Framework | `next` | `^15.0.3` | App Router only — no Pages Router |
| UI Runtime | `react` + `react-dom` | `^19.0.0` | React 19 concurrent features |
| Language | `typescript` | `^5` | `strict: true` enforced |
| Styling | `tailwindcss` | `^3.4.17` | v3, NOT v4 |
| Auth | `@clerk/nextjs` | `^6.3.2` | Middleware + ClerkProvider |
| Database | `@supabase/ssr` + `@supabase/supabase-js` | `^0.5.2` / `^2.46.2` | SSR-safe clients |
| Font | `next/font/google` → Inter | built-in | Self-hosted, no external request at runtime |
| Config | `next.config.js` | — | `.js` not `.ts` — do not change extension |
| Icons | `lucide-react` | `^0.577.0` | Tree-shakeable SVG icons |
| Animation | `framer-motion` | `^12.0.0` | Motion primitives for complex animations |
| Class utils | `clsx` + `tailwind-merge` | `^2.1.0` / `^2.2.0` | Conditional + conflict-free class merging |
| CVA | `class-variance-authority` | `^0.7.0` | Typed variant-based component styling |
| Forms | `react-hook-form` + `zod` | `^7.51.0` / `^3.22.0` | Uncontrolled forms + schema validation |
| Server state | `@tanstack/react-query` | `^5.90.0` | Async data fetching, caching, and sync |
| Tables | `@tanstack/react-table` | `^8.13.0` | Headless table with sorting/filtering |
| Radix UI | `@radix-ui/react-slot` | `^1.1.0` | `asChild` pattern — powers CVA button components |
| Radix UI | `@radix-ui/react-dialog` | `^1.1.2` | Accessible modal/dialog primitive |
| Radix UI | `@radix-ui/react-dropdown-menu` | `^2.1.2` | Accessible dropdown menu |
| Radix UI | `@radix-ui/react-tooltip` | `^1.1.3` | Accessible tooltip |
| Radix UI | `@radix-ui/react-popover` | `^1.1.2` | Accessible popover |
| Radix UI | `@radix-ui/react-select` | `^2.1.2` | Accessible select/combobox |
| Radix UI | `@radix-ui/react-tabs` | `^1.1.1` | Accessible tab panels |
| Radix UI | `@radix-ui/react-checkbox` | `^1.1.2` | Accessible checkbox |
| Radix UI | `@radix-ui/react-label` | `^2.1.0` | Accessible form label |
| Radix UI | `@radix-ui/react-separator` | `^1.1.0` | Visual/semantic separator |
| Radix UI | `@radix-ui/react-switch` | `^1.1.1` | Accessible toggle switch |
| Virtualisation | `@tanstack/react-virtual` | `^3.2.0` | Virtual scrolling for large lists |
| Charts | `recharts` | `^3.8.1` | Composable chart components |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` | `^6.1.0` / `^8.0.0` / `^3.2.2` | Accessible drag-and-drop |
| Dates | `date-fns` + `react-day-picker` | `^3.6.0` / `^9.4.3` | Date utilities + calendar picker |
| Syntax highlighting | `shiki` | `^1.0.0` | Code highlighting (server-side) |
| Toasts | `sonner` | `^2.0.7` | Toast notifications via `showToast` helper |
| Payments | `stripe` | `^17.0.0` | Stripe SDK for payment processing |
| Email | `resend` + `@react-email/components` + `@react-email/render` | `^4.0.0` / `^0.0.22` / `^1.0.0` | Transactional email via Resend with React templates |
| CSV | `papaparse` | `^5.4.1` | CSV parsing and generation (`@types/papaparse` in devDeps) |

**Critical version notes:**
- Tailwind is v3. Do not use v4 syntax (no `@import "tailwindcss"`, no `@theme` blocks).
- `@apply` in CSS files cannot use arbitrary value classes like `bg-white/[0.08]` — use standard opacity steps (multiples of 5: `/5`, `/10`, `/20`, etc.).
- `cookies()` from `next/headers` is async in Next.js 15 — always `await` it.
- Use `cn()` (clsx + tailwind-merge) for combining class strings on component props — create `lib/utils.ts` with `export function cn(...inputs) { return twMerge(clsx(inputs)) }` when needed.

---

## 2. File Structure

```
/
├── app/
│   ├── globals.css                          # All CSS variables, component classes, utilities
│   ├── layout.tsx                           # Root layout: ClerkProvider, Inter font, dark class on html. No Header.
│   ├── page.tsx                             # Public landing page — own custom nav, no shared Header
│   ├── dashboard/
│   │   └── layout.tsx                       # Dashboard layout: renders Header above all authenticated pages
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx                     # Clerk catch-all sign-in route
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx                     # Clerk catch-all sign-up route
│
├── components/
│   ├── header.tsx                           # Sticky glass header — rendered by app/dashboard/layout.tsx for ALL apps
│   └── layout/
│       └── Sidebar.tsx                      # Sidebar nav component — ONLY for NAV_DECISION: SIDEBAR apps. Never modify directly.
│
├── lib/
│   └── supabase/
│       ├── client.ts                        # Browser client (Client Components)
│       └── server.ts                        # Server client (RSC, Server Actions, Route Handlers)
│
├── middleware.ts                            # Clerk auth middleware — route protection
├── next.config.js                           # Image domains for Clerk + Supabase
├── tailwind.config.ts                       # Design tokens, dark mode config
├── tsconfig.json                            # strict: true, moduleResolution: bundler
├── postcss.config.js                        # tailwindcss + autoprefixer
├── .eslintrc.json                           # next/core-web-vitals + next/typescript
├── .env.example                             # Template for required environment variables
└── neev-architecture.md                     # This file
```

**Rules:**
- App logic lives in `app/` (App Router).
- Shared UI components live in `components/`. Subdirectories are fine (`components/ui/`, `components/forms/`).
- Non-component utilities (data fetching, helpers, types) live in `lib/`.
- One component per file. File name matches the exported component name in kebab-case.
- `page.tsx` and `layout.tsx` are Next.js reserved filenames — do not use them for other purposes.

---

## 3. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `user-profile.tsx`, `auth-guard/` |
| React components | PascalCase | `UserProfile`, `AuthGuard` |
| Functions & variables | camelCase | `createClient`, `isPublicRoute` |
| CSS component classes | kebab-case, semantic | `.glass-card`, `.btn-primary`, `.gradient-text-primary` |
| CSS variables | `--` prefix, kebab-case | `--background`, `--primary-foreground` |
| Tailwind token names | match CSS variable names | `bg-background`, `text-muted-foreground` |
| Environment variables | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| Exported functions | named exports preferred | `export function createClient()` |
| Page components | default exports | `export default function SignInPage()` |

**Path alias:** `@/*` resolves to the project root. Use it for all internal imports.
```ts
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
```

---

## 4. TypeScript Standards

`tsconfig.json` has `strict: true` enabled. This means all of the following are active:
- `strictNullChecks` — no implicit null/undefined
- `strictFunctionTypes` — covariant function parameter types
- `strictPropertyInitialization` — class properties must be initialised
- `noImplicitAny` — no untyped parameters or variables
- `noImplicitThis` — explicit `this` typing required

**Patterns to follow:**

```ts
// ✅ Children prop in layouts
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) { ... }

// ✅ Async server functions with explicit return
export async function createClient(): Promise<SupabaseClient> { ... }

// ✅ Non-null assertion only when env var is guaranteed by the app
process.env.NEXT_PUBLIC_SUPABASE_URL!

// ✅ Type imports with 'type' keyword
import type { Metadata } from 'next'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// ❌ Never use 'any' — use 'unknown' and narrow, or proper types
// ❌ Never use @ts-ignore — fix the actual type issue
```

**Module resolution:** `bundler` — import paths do not require file extensions.

---

## 5. Design System — Colors & CSS Variables

All colors are defined as HSL component triplets (no `hsl()` wrapper) in `app/globals.css`.
Tailwind consumes them via `hsl(var(--token))` in `tailwind.config.ts`.

### Light Mode (`:root`)

| Token | HSL Value | Equivalent Color |
|---|---|---|
| `--background` | `213 31% 97%` | Near-white blue-tinted background |
| `--foreground` | `222 47% 11%` | Deep navy text |
| `--surface` | `0 0% 100%` | Pure white surface |
| `--surface-hover` | `210 40% 96%` | Light hover state |
| `--card` | `0 0% 100%` | White card |
| `--card-foreground` | `222 47% 11%` | Deep navy on cards |
| `--primary` | `234 89% 54%` | Vivid indigo (`#4338ca` approx) |
| `--primary-foreground` | `0 0% 100%` | White text on primary |
| `--secondary` | `210 40% 94%` | Light blue-grey |
| `--secondary-foreground` | `222 47% 11%` | Deep navy |
| `--muted` | `210 40% 94%` | Subtle background |
| `--muted-foreground` | `215 16% 47%` | Mid-grey text |
| `--accent` | `234 89% 54%` | Same as primary |
| `--accent-foreground` | `0 0% 100%` | White |
| `--border` | `214 32% 91%` | Light border |
| `--input` | `214 32% 91%` | Input border |
| `--ring` | `234 89% 54%` | Focus ring — indigo |
| `--radius` | `0.75rem` | Base border radius |

### Dark Mode (`.dark` class on `<html>`)

| Token | HSL Value | Equivalent Color |
|---|---|---|
| `--background` | `222 47% 7%` | Very deep navy (`#080e1a` approx) |
| `--foreground` | `213 31% 91%` | Light blue-white text |
| `--surface` | `222 47% 11%` | Deep navy surface |
| `--surface-hover` | `217 33% 15%` | Slightly lighter hover |
| `--card` | `222 47% 10%` | Dark navy card |
| `--card-foreground` | `213 31% 91%` | Light text |
| `--primary` | `234 89% 74%` | Lighter indigo for dark bg (`#a5b4fc` approx) |
| `--primary-foreground` | `234 60% 15%` | Dark indigo text on primary |
| `--secondary` | `217 33% 15%` | Dark surface variant |
| `--secondary-foreground` | `213 31% 91%` | Light text |
| `--muted` | `223 47% 14%` | Subtle dark background |
| `--muted-foreground` | `215 20% 55%` | Mid-tone grey-blue text |
| `--accent` | `234 89% 74%` | Same as dark primary |
| `--accent-foreground` | `222 47% 7%` | Darkest navy |
| `--border` | `217 33% 14%` | Subtle dark border |
| `--input` | `217 33% 14%` | Input border |
| `--ring` | `234 89% 74%` | Focus ring — light indigo |

### Using colors in code

```tsx
// ✅ Use semantic Tailwind tokens — they auto-switch between light/dark
<div className="bg-background text-foreground" />
<div className="bg-surface text-card-foreground" />
<button className="bg-primary text-primary-foreground" />
<p className="text-muted-foreground" />
<div className="border-border" />

// ✅ For glass effects, use raw white/black with opacity (these intentionally
//    don't switch — the opacity creates the glass look against any background)
<div className="bg-white/5 border-white/10" />

// ❌ Never hardcode hex colors in className — always use CSS variable tokens
<div className="bg-[#6366f1]" />  // wrong

// ❌ Never use Tailwind color palette directly for themed colors
<div className="bg-slate-900" />  // wrong — use bg-background instead
```

### Raw indigo values (for non-Tailwind contexts, e.g. Clerk appearance)
- Primary indigo (dark mode): `#6366f1` (indigo-500)
- Primary indigo (light): `#4338ca` (indigo-700)
- Glow color for shadows: `rgba(99, 102, 241, 0.2)`

---

## 6. Design System — Typography

**Font:** Inter, loaded via `next/font/google` and exposed as CSS variable `--font-inter`.

```ts
// app/layout.tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
// Applied to <html> as className={`dark ${inter.variable}`}
```

**Tailwind font-sans** resolves to: `var(--font-inter), Inter, system-ui, sans-serif`

**Base styles** (applied globally in `@layer base`):
- `body`: `antialiased`, `font-feature-settings: 'rlig' 1, 'calt' 1`
- `h1–h6`: `font-semibold tracking-tight`

**Type scale for pages:**

| Use | Classes |
|---|---|
| Hero headline | `text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl` |
| Section heading | `text-3xl font-bold tracking-tight sm:text-4xl` |
| Card heading | `text-lg font-semibold` or `font-semibold` |
| Body text | default (`text-base`) |
| Secondary / description | `text-muted-foreground` |
| Small / meta | `text-sm text-muted-foreground` |
| Micro / labels | `text-xs text-muted-foreground` |

**Gradient text** — two utility classes defined in `globals.css`:
```tsx
// Indigo→blue→cyan (for brand accents on dark backgrounds)
<span className="gradient-text-primary">with Neev</span>

// White→slate-400 (for hero headlines on dark backgrounds)
<span className="gradient-text-white">Ship faster</span>
```
Implementation:
```css
.gradient-text-primary { @apply bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent; }
.gradient-text-white   { @apply bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent; }
```

---

## 7. Design System — Spacing & Layout

**Page container** — use `.container-page` for all full-width sections:
```css
.container-page { @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8; }
```

**Section spacing pattern:**
```tsx
<section className="px-4 py-24">
  <div className="mx-auto max-w-6xl">
    {/* content */}
  </div>
</section>
```

**Hero section:** `pt-32 pb-24` (extra top padding to clear the sticky header)

**Grid layouts:**
- 3-column feature grid: `grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`
- 2-column: `grid grid-cols-1 gap-6 md:grid-cols-2`

**Header height:** `h-16` (64px) — account for this in hero top padding.

**Z-index layers:**
- Sticky header: `z-50`
- Background decorations: `-z-10`
- Modals/overlays: `z-[100]` (not defined yet, use this when adding)

---

## 8. Design System — Border Radius & Shadows

### Border Radius

Tailwind config overrides (all in `tailwind.config.ts`):

| Class | Value | Use |
|---|---|---|
| `rounded-sm` | `0.375rem` | Tags, small chips |
| `rounded-md` | `0.5rem` | Badges, small buttons |
| `rounded-lg` | `0.625rem` | Buttons, inputs |
| `rounded-xl` | `0.75rem` | Cards (matches `--radius`) |
| `rounded-2xl` | `1rem` | Large cards, CTA sections |
| `rounded-full` | 9999px | Pills, avatar circles |

### Shadows

Custom shadows defined in `tailwind.config.ts`:

| Class | Value | Use |
|---|---|---|
| `shadow-glass` | `0 8px 32px 0 rgba(0,0,0,0.37)` | Base glass card shadow |
| `shadow-glass-sm` | `0 4px 16px 0 rgba(0,0,0,0.2)` | Small glass elements |
| `shadow-glow-sm` | `0 0 20px rgba(99,102,241,0.15)` | Subtle indigo glow on hover |
| `shadow-glow` | `0 0 40px rgba(99,102,241,0.2)` | Stronger glow for focus states |

Custom utility defined in `globals.css`:
```css
.glow-indigo { box-shadow: 0 0 80px -20px rgba(99, 102, 241, 0.4); }
```

---

## 9. Dark / Light Mode Strategy

**Dark mode is on by default.** The `<html>` element in `app/layout.tsx` always has the `dark` class:
```tsx
<html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
```

**Tailwind config:** `darkMode: 'class'` — dark styles are applied when an ancestor has class `dark`.

**Switching modes:**
- To make an app light-mode-only: remove `dark` from the `<html>` className.
- To implement a user-toggle: manage the `dark` class on `<html>` via `localStorage` + JS in `<head>` (avoid hydration flash). Use `suppressHydrationWarning` on `<html>`.
- The `dark:` variant works normally: `dark:bg-slate-900/60`.

**CSS variable system:** `:root` = light, `.dark` = dark. All semantic tokens swap automatically.

**Glass effects in dark mode:** Glass cards use `bg-white/5 dark:bg-slate-900/40`. The light mode glass is very subtle (white/5); dark mode glass is a translucent dark navy.

**What NOT to do:**
- Do not use `prefers-color-scheme` media query for theming — the class strategy is already set.
- Do not use `@media (prefers-color-scheme: dark)` in CSS — it will conflict with the class approach.
- Do not hardcode light-specific or dark-specific values without `dark:` prefix on the Tailwind side, or separate `:root` / `.dark` blocks in CSS.

---

## 10. Glass Morphism Patterns

Glass morphism is the primary card/surface pattern for this design system. Two pre-built classes exist:

### `.glass-card` — static glass surface
```css
.glass-card {
  @apply
    relative rounded-xl
    border border-white/10
    bg-white/5 dark:bg-slate-900/40
    backdrop-blur-md
    shadow-glass
    transition-all duration-200 ease-out;
}
```

### `.glass-card-hover` — interactive glass card (lifts on hover)
```css
.glass-card-hover {
  @apply glass-card
    hover:-translate-y-0.5
    hover:border-white/20
    hover:shadow-glow-sm
    hover:bg-white/10
    dark:hover:bg-slate-900/60;
}
```

### Manual glass pattern (for one-off elements)
When you need a glass effect not covered by the classes above, compose these properties:
```tsx
<div className="
  backdrop-blur-md
  bg-white/5 dark:bg-slate-900/40
  border border-white/10
  shadow-glass
  rounded-xl
">
```

### Gradient border trick (CTA sections)
A visually richer border using a gradient wrapper with `p-px`:
```tsx
<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-slate-900/60 p-px">
  <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-md p-10">
    {/* content */}
  </div>
</div>
```

### Ambient glow background (hero sections)
```tsx
<div className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-background to-background" />
  <div className="absolute left-1/2 top-[-5%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
</div>
```

### Glass header
```tsx
<header className="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-md">
```

**Rules:**
- Always use `pointer-events-none` and `absolute inset-0 -z-10` for decorative blur blobs.
- `backdrop-blur-md` is the standard blur level. Use `backdrop-blur-sm` for smaller/subtler elements.
- Never apply `backdrop-blur` to elements that don't have a translucent background — it has no visible effect and wastes GPU.

---

## 11. Component Classes (globals.css)

These `@layer components` classes are globally available without imports. Use them instead of repeating long `@apply` chains.

### Buttons

| Class | Use |
|---|---|
| `.btn-primary` | Primary CTA — filled indigo, glow on hover |
| `.btn-secondary` | Secondary — glass/ghost border style |
| `.btn-ghost` | Tertiary — transparent, subtle hover |

All buttons include:
- `active:scale-[0.97]` — press feedback
- `transition-all duration-200 ease-out` — smooth state changes
- `focus-visible:ring-2 focus-visible:ring-ring` — keyboard accessibility

Sizing is composable via additional classes:
```tsx
<Link href="/sign-up" className="btn-primary h-12 px-8 text-base">  // large
<Link href="/sign-in" className="btn-primary">                        // default (h-auto px-5 py-2.5 text-sm)
```

Arrow animation pattern for CTAs:
```tsx
<Link href="/sign-up" className="group btn-primary">
  Get started
  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
</Link>
```

### Other classes

| Class | Use |
|---|---|
| `.badge` | Pill badge with glass border and backdrop-blur |
| `.input` | Styled text input |
| `.glass-card` | Static glass surface |
| `.glass-card-hover` | Interactive glass card with lift on hover |
| `.gradient-text-primary` | Indigo→blue→cyan gradient text |
| `.gradient-text-white` | White→slate gradient text |
| `.container-page` | Max-width page container with responsive padding |

### Utilities

| Class | Use |
|---|---|
| `.bg-noise` | Subtle SVG noise texture overlay |
| `.glow-indigo` | Strong indigo box-shadow glow |

---

## 12. Animation Standards

### Defined keyframes (tailwind.config.ts)

| Name | Effect | Class |
|---|---|---|
| `fade-in` | Opacity 0 → 1, 0.5s ease-out | `animate-fade-in` |
| `slide-up` | translateY(12px) + opacity 0 → natural, 0.5s ease-out | `animate-slide-up` |
| `ping` | Scale pulse for live indicator dots | `animate-ping` |

**Page entry animation:** Apply `animate-slide-up` to the main content wrapper:
```tsx
<div className="mx-auto max-w-4xl space-y-8 animate-slide-up">
```

**Staggered list animation** (for grids of cards):
```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="glass-card-hover"
    style={{ animationDelay: `${i * 60}ms` }}
  >
```

### Interaction animations

All interactions use `transition-all duration-200 ease-out`. Never use `transition` without explicit timing.

| Interaction | Classes |
|---|---|
| Button press | `active:scale-[0.97]` |
| Card hover lift | `hover:-translate-y-0.5` |
| Arrow nudge | `group-hover:translate-x-0.5` on child `<span>` |
| Link/logo opacity | `hover:opacity-80` |
| Button primary hover | `hover:opacity-90` |
| Glass card border reveal | `hover:border-white/20` |

### Duration guidelines

| Context | Duration |
|---|---|
| Micro interactions (scale, opacity) | `duration-200` |
| Larger motion (translate, slide-up) | `duration-200` to `duration-300` |
| Page entry animations | `0.5s` (via keyframe) |
| Never exceed | `500ms` for UI responses |

**Do not use CSS transitions on layout-affecting properties** (width, height, padding) — use opacity + transform only to avoid layout thrashing.

---

## 13. Component Patterns

### Server Components (default)

All components are Server Components by default in the App Router. Most layout and page components should stay as Server Components.

```tsx
// components/user-profile.tsx — no 'use client' needed
import { currentUser } from '@clerk/nextjs/server'

export async function UserProfile() {
  const user = await currentUser()
  return <div>{user?.firstName}</div>
}
```

### Client Components

Add `'use client'` only when the component uses:
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Event handlers that need to be interactive on the client

```tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Clerk auth gating in Server Components

Use `SignedIn` / `SignedOut` for conditional rendering (works in both Server and Client Components):
```tsx
import { SignedIn, SignedOut } from '@clerk/nextjs'

<SignedOut>
  <Link href="/sign-in" className="btn-ghost">Sign in</Link>
  <Link href="/sign-up" className="btn-primary">Get started</Link>
</SignedOut>
<SignedIn>
  <UserButton afterSignOutUrl="/" />
</SignedIn>
```

For programmatic server-side access:
```tsx
import { currentUser, auth } from '@clerk/nextjs/server'

// In async Server Component or Server Action
const user = await currentUser()
const { userId } = await auth()
```

### Page component pattern

```tsx
// app/some-page/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',  // appended as "Page Title | Neev" by root layout template
}

export default function SomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          {/* content */}
        </div>
      </section>
    </div>
  )
}
```

### Layout component pattern

```tsx
// app/dashboard/layout.tsx — already exists in template, DO NOT recreate
import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
```

ALL authenticated pages must live under `app/dashboard/` to inherit this layout and get the Header automatically. Never place authenticated pages at `app/settings/`, `app/billing/`, or any other top-level path — they will not receive the Header.

### Metadata

Root layout uses a title template:
```ts
title: { default: 'Neev — Next.js 15 Template', template: '%s | Neev' }
```
Child pages set `title: 'Page Name'` which becomes `"Page Name | Neev"`.

---

## 14. Authentication — Clerk

### Setup

- `ClerkProvider` wraps the entire app in `app/layout.tsx` with `afterSignOutUrl="/"`.
- `middleware.ts` runs on all routes (via the matcher) and calls `auth.protect()` on non-public routes.

### Public routes

Defined in `middleware.ts` via `createRouteMatcher`:
```ts
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])
```

To make a route protected: do nothing — the middleware protects all routes not in this list.
To make a new route public: add it to the `createRouteMatcher` array.

### Sign-in / Sign-up pages

Located at:
- `app/sign-in/[[...sign-in]]/page.tsx` — catches all Clerk sign-in sub-routes
- `app/sign-up/[[...sign-up]]/page.tsx` — catches all Clerk sign-up sub-routes

The `[[...slug]]` catch-all is required by Clerk for its multi-step flows.

### Clerk component appearance

Clerk UI components are themed via the `appearance` prop. Always use the dark theme variables:
```tsx
<SignIn
  appearance={{
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#0d1117',
      colorInputBackground: '#161b22',
      colorInputText: '#e2e8f0',
      colorText: '#e2e8f0',
      colorTextSecondary: '#94a3b8',
      colorNeutral: '#1e293b',
      borderRadius: '0.75rem',
      fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
    },
  }}
/>
```

### UserButton
```tsx
<UserButton
  afterSignOutUrl="/"
  appearance={{
    variables: {
      colorPrimary: '#6366f1',
      borderRadius: '0.5rem',
    },
  }}
/>
```

### What the template Header already provides — DO NOT duplicate

`components/header.tsx` is rendered automatically by `app/dashboard/layout.tsx` for all pages under `app/dashboard/`. It already includes:
- `<UserButton>` — shows user avatar, and when clicked: displays email + sign-out option
- `<SignedIn>` / `<SignedOut>` conditional rendering
- Theme toggle

**Rules for AI agents:**
- NEVER import or render `<Header />` inside any page.tsx file — `app/dashboard/layout.tsx` already renders it
- NEVER render `<Header />` in `app/page.tsx` — the landing page has its own custom nav
- NEVER add a sign-out button anywhere in the app — UserButton already has it
- NEVER add inline email display to any nav or header — UserButton already shows it on click
- NEVER modify `components/header.tsx` unless the ticket explicitly says to change the header
- If a ticket says "show user email in nav" — the UserButton already satisfies this. No code needed.

### Adding custom menu items to UserButton (e.g. Billing link)

When a ticket requires adding a custom link to the UserButton dropdown (e.g. a Billing page), use Clerk's `UserButton.MenuItems` + `UserButton.Link` pattern. This is the ONLY correct way — never use the `appearance` object for custom menu items.

```tsx
// In components/header.tsx — add CreditCard import from lucide-react, then:
import { CreditCard } from 'lucide-react'

// Wrap the existing <UserButton> like this:
<UserButton appearance={userButtonAppearance}>
  <UserButton.MenuItems>
    <UserButton.Link
      label="Billing"
      labelIcon={<CreditCard size={16} />}
      href="/dashboard/billing"
    />
  </UserButton.MenuItems>
</UserButton>
```

**Rules:**
- The `appearance` prop stays on `<UserButton>` exactly as before — do not remove or move it
- `UserButton.Link` renders above the default "Manage account" and "Sign out" items
- `href` must be a route under `app/dashboard/` so it inherits the dashboard layout and Header
- Only add this when the app has Stripe subscription billing — never for free or one-time payment apps
- `labelIcon` must be a React element (not a component reference) — `{<CreditCard size={16} />}` not `{CreditCard}`

### Navigation Patterns — Three Options

The architect picks one of three patterns per app. The pattern is recorded in the architecture doc as `NAV_DECISION: NONE | TOP_NAV | SIDEBAR`. The nav ticket reads this tag and implements the correct pattern.

**Settings and Billing are NEVER in any nav** — they live only in the UserButton dropdown (see UserButton.MenuItems above).

**The Header always renders** for all three patterns — it provides logo, theme toggle, and UserButton. The difference is whether nav links are added to it (TOP_NAV), a sidebar is added below it (SIDEBAR), or nothing changes (NONE).

---

#### NAV_DECISION: NONE
When: app has only one main dashboard section — a single-view tool, AI workspace, pure utility app.
Result: no nav ticket. The default header (logo + theme toggle + UserButton) is sufficient.
No code changes required for navigation.

---

#### NAV_DECISION: TOP_NAV
When: 2–3 flat top-level sections of equal weight. Users switch between them frequently.
Result: modify `components/header.tsx` to add nav links between the logo and right controls.

The nav ticket modifies **only** `components/header.tsx`. The layout stays unchanged.

```tsx
// components/header.tsx — modifications for TOP_NAV
// 1. Add import at top:
import { usePathname } from 'next/navigation'

// 2. Add navItems constant above the Header function:
const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Reports', href: '/dashboard/reports' },
  // ... app-specific items from architect doc
]

// 3. Inside Header function add:
const pathname = usePathname()

// 4. In JSX — insert between the logo Link and the right-side div:
<nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  {navItems.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <Link
        key={item.href}
        href={item.href}
        className="btn-ghost"
        style={{ fontSize: '14px', color: isActive ? 'var(--accent)' : undefined }}
      >
        {item.label}
      </Link>
    )
  })}
</nav>
```

**Rules:**
- NEVER rebuild the header from scratch — only insert the `<nav>` element
- NEVER add icons to top nav links — text only
- Active state: `var(--accent)` color on the link, no background
- `pathname.startsWith(item.href + '/')` catches nested routes under that section

---

#### NAV_DECISION: SIDEBAR
When: 3+ main sections, OR hierarchy exists (section → sub-pages), OR complex data-heavy tool (CRM, admin, project management).
Result: modify `app/dashboard/layout.tsx` to add a sidebar next to the main content. **The Header still renders at the top** — it handles logo, theme toggle, and UserButton. The sidebar handles section navigation only.

The layout structure becomes:
```
┌──────────────── Header (sticky, 60px) ────────────────┐
│  Logo                           Theme  UserButton      │
├─────────────┬─────────────────────────────────────────┤
│             │                                           │
│  Sidebar    │  Main content (flex-1, overflowY: auto)  │
│  nav items  │                                           │
│             │                                           │
└─────────────┴─────────────────────────────────────────┘
```

The template provides `components/layout/Sidebar.tsx` — **never modify this component**. Configure it only via the `navItems` prop.

```tsx
// app/dashboard/layout.tsx — full replacement for SIDEBAR apps
import { Header } from '@/components/header'
import { Sidebar } from '@/components/layout/Sidebar'
import { LayoutDashboard, Users, BarChart2 } from 'lucide-react'
// Use lucide-react icons that genuinely match each section

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart2 },
  // ... app-specific items — never include Settings or Billing
]

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar navItems={NAV_ITEMS} />
        <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
```

**Rules:**
- NEVER add Settings or Billing to `NAV_ITEMS` — those go in UserButton only
- NEVER remove the `<Header />` — it always stays at the top
- NEVER modify `components/layout/Sidebar.tsx` directly — it is a template file
- Use `lucide-react` icons that match the section's purpose
- Order NAV_ITEMS by user importance — most visited section first

**What `Sidebar.tsx` already does (zero code needed):**
- Sticky below header at `top: 60px`, height `calc(100vh - 60px)`
- Active route detection via `usePathname` — active link gets `var(--accent)` color + accent tinted bg
- Glass morphism using `var(--surface)` + `var(--border)` CSS variables

### Multi-Role Bootstrap Pattern — CRITICAL FOR MULTI-ROLE APPS

For any app where users have different roles (admin, member, owner, etc.), the following sequence is the ONLY correct implementation. Any deviation causes the user to land on /no-access after sign-up.

**Step 1 — Sign-up page must set `afterSignUpUrl`**

`app/sign-up/[[...sign-up]]/page.tsx` must pass `afterSignUpUrl` to the `<SignUp>` component pointing at the onboard page:
```tsx
<SignUp afterSignUpUrl="/onboard" appearance={...} />
```
Without this, Clerk redirects to `/` after sign-up and the user never reaches the onboard page.

For apps with an invite flow: `afterSignUpUrl` must be a state variable (default `/onboard`) that reads `invite_token` from `window.location.search` in a `useEffect` and appends it: `/onboard?invite_token=XXX`. This preserves the token through Clerk's sign-up redirect so invited users reach `/invite/XXX`.

**Step 2 — Onboard page = SERVER COMPONENT + OnboardClient = CLIENT COMPONENT**

`app/onboard/page.tsx` is a SERVER COMPONENT (routing only). It reads sessionClaims to check for an existing role (redirect to dashboard if already bootstrapped), checks searchParams for `invite_token` (redirect to `/invite/token` if present), then renders `<OnboardClient>` for new admin users. `/onboard` MUST be in `isPublicRoute` — new users have no role when they land here.

`app/onboard/onboardClient.tsx` is the CLIENT COMPONENT (`'use client'`). It calls the bootstrap server action then navigates.

**Step 3 — Bootstrap API route writes role to Clerk publicMetadata**

`app/api/bootstrap/route.ts` calls:
```ts
await clerkClient.users.updateUser(userId, { publicMetadata: { role, org_id } })
```
Then creates the user row in Supabase and returns success.

**Step 4 — Client calls `session?.reload()` THEN navigates with `window.location.href`**

After bootstrap succeeds in OnboardClient (and invite acceptance client):
```ts
await session?.reload()  // refreshes the JWT cookie so middleware sees the new role
window.location.href = '/dashboard/admin'  // hard nav sends fresh JWT to middleware
```
`session?.reload()` refreshes the Clerk JWT in the browser cookie. `window.location.href` triggers a full HTTP request with the fresh JWT — middleware reads the role and routes correctly.

**NEVER use `router.push()` after bootstrap** — soft navigation, middleware sees the stale (no-role) JWT and redirects to /no-access.

**NEVER skip `session?.reload()`** — without it, `window.location.href` sends the old JWT and middleware sees no role.

**Step 5 — Middleware routes based on sessionClaims**

```ts
const role = (sessionClaims?.metadata as { role?: string })?.role
if (!role && pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/onboard', request.url))
}
// role-specific redirects...
```

**Step 6 — Sign-in page must have `afterSignInUrl="/dashboard"` for returning users**

For multi-role apps, `<SignIn>` MUST have `afterSignInUrl="/dashboard"` prop. After sign-in, the user hits `/dashboard`, middleware reads the role already in the JWT (returning users have it), and redirects to `/dashboard/admin` etc. Do NOT use env vars — `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` is deprecated.

**Step 7 — Onboard page must be in `isPublicRoute`**

```ts
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboard(.*)',  // ← required — user has no session role yet when they land here
])
```

### Environment variables (Clerk)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # format: pk_test_<base64>
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Key format note:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` must be `pk_test_<base64string>` or `pk_live_<base64string>`. The base64 string decodes to a Clerk frontend API hostname. A plain string like `pk_test_placeholder` will fail validation at build time.

---

## 15. Database — Supabase

Two separate clients exist because Next.js App Router has distinct runtime contexts.

### Browser client — `lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Use in: Client Components, browser event handlers.
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export function MyComponent() {
  const supabase = createClient()
  // ...
}
```

### Server client — `lib/supabase/server.ts`

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()  // Next.js 15: cookies() is async
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from Server Component — read-only. Middleware handles refresh.
          }
        },
      },
    }
  )
}
```

Use in: Server Components, Server Actions, Route Handlers.
```tsx
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select()
  // ...
}
```

### Environment variables (Supabase)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Both are `NEXT_PUBLIC_` because they are used in both client and server code. The anon key is safe to expose — Row Level Security (RLS) on Supabase tables enforces data access.

---

## 16. Coding Standards

### General

- **No default exports from non-page/layout files.** Use named exports in `components/` and `lib/`. Default exports are reserved for `page.tsx` and `layout.tsx` (Next.js requirements).
- **No inline styles** except for dynamic values that cannot be expressed as Tailwind classes (e.g., `style={{ animationDelay: '120ms' }}`).
- **No magic numbers.** Use Tailwind scale values. If a custom value is needed more than once, add it to `tailwind.config.ts`.
- **Prefer composition over configuration.** Pass `className` props for layout overrides rather than adding variant props to every component.

### Tailwind usage

- Order classes: layout → sizing → spacing → typography → colors → borders → effects → state variants.
- Use semantic tokens (`bg-background`, `text-muted-foreground`) for anything that should respect the theme.
- Use raw opacity utilities (`bg-white/10`, `border-white/20`) only for glass/overlay effects that intentionally don't change between themes.
- Do not use arbitrary values (`bg-[#123456]`, `text-[14px]`) unless the design truly requires a one-off value not in the scale.
- In `@apply` blocks inside `.css` files: only standard Tailwind opacity steps are valid (`/5`, `/10`, `/20`, `/25`, `/30`, `/40`, `/50`, `/60`, `/70`, `/75`, `/80`, `/90`, `/95`). Arbitrary opacity like `/[0.08]` must be written as regular CSS.

### File hygiene

- **No committed `.env.local`** — it is in `.gitignore`. All secrets stay local.
- **No committed `.next/`** — build artifacts are in `.gitignore`.
- **No committed `node_modules/`** — in `.gitignore`.
- `.env.example` is the canonical reference for required variables — keep it up to date when adding new env vars.

### next.config.js

- Keep as `.js`, not `.ts`. The file uses `module.exports` CommonJS syntax.
- When adding external images: add the hostname to `images.remotePatterns` with explicit `protocol` and `hostname`.

### Adding new pages

1. Create `app/<route>/page.tsx`.
2. Export `metadata` for the page title.
3. If the route should be protected: no action needed — middleware protects all non-listed routes.
4. If the route should be public: add `'/<route>(.*)'` to the `isPublicRoute` matcher in `middleware.ts`.

### Adding new components

1. Create `components/<component-name>.tsx`.
2. Use named export.
3. Default to Server Component — only add `'use client'` if hooks or browser APIs are needed.
4. Accept `className?: string` prop if the component should support layout overrides by callers.

### Error handling

- In Server Components and Server Actions, handle database/API errors explicitly — do not let them bubble to the client unhandled.
- The `setAll` catch block in `lib/supabase/server.ts` is intentional — Server Components cannot set cookies, and this is handled by middleware.
- Supabase queries return `{ data, error }` — always check `error` before using `data`.

---

## 17. UI Components & Classes

This section is the definitive rulebook for UI construction. All classes listed here are defined in `app/globals.css` and available globally — no imports needed.

### Cards & Containers

| Use | Class |
|---|---|
| Standard card / panel | `glass-card` |
| Clickable / hoverable card | `glass-card-hover` |
| Selected / active card | `glass-card-active` |

**Rules:**
- Always use `glass-card` for any card-shaped container. Never create custom card styles inline.
- Use `glass-card-active` when a card represents a selected item (e.g. active nav item, selected plan).
- Cards already include `border-radius: var(--radius-lg)`, `backdrop-filter: blur(12px)`, border, and transition.

```tsx
// ✅
<div className="glass-card p-6">...</div>

// ❌ Never
<div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>...</div>
```

### Buttons

| Intent | Class |
|---|---|
| Primary action (submit, CTA) | `btn-primary` |
| Secondary action | `btn-secondary` |
| Tertiary / subtle / nav link | `btn-ghost` |
| Destructive (delete, remove) | `btn-danger` |

**Rules:**
- Never create custom button styles — always use one of the four classes above.
- Works on both `<button>` and `<a>` / Next.js `<Link>` elements.
- Compose size via `style={{ padding: ... }}` if the default size doesn't fit context.

```tsx
// ✅
<button className="btn-primary">Save changes</button>
<Link href="/sign-up" className="btn-primary">Get started</Link>
<button className="btn-danger">Delete account</button>

// ❌ Never
<button style={{ background: '#6366f1', borderRadius: 8 }}>Save</button>
```

### Inputs

| Use | Class |
|---|---|
| All text inputs, textareas, selects | `input-field` |

**Rules:**
- Never style inputs with inline styles or custom classes.
- `input-field` includes focus ring, placeholder color, border, and transition.

```tsx
// ✅
<input className="input-field" type="text" placeholder="Enter your name" />
<textarea className="input-field" rows={4} />

// ❌ Never
<input style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
```

### Badges & Status Indicators

All badges require both the base `badge` class and a variant class:

| Variant | Classes | Use |
|---|---|---|
| Default / neutral | `badge badge-default` | Tags, counts, labels |
| Feature / accent | `badge badge-accent` | Pro features, highlights |
| Success | `badge badge-success` | Active, completed, healthy |
| Warning | `badge badge-warning` | Pending, needs attention |
| Error | `badge badge-error` | Failed, blocked, error state |

```tsx
// ✅
<span className="badge badge-success">Active</span>
<span className="badge badge-error">Failed</span>
<span className="badge badge-accent">Pro</span>
```

### Loading / Skeleton States

| Skeleton | Classes | Dimensions |
|---|---|---|
| Single line of text | `skeleton skeleton-text` | 16px height |
| Heading / title | `skeleton skeleton-title` | 24px height |
| Card placeholder | `skeleton skeleton-card` | 120px height |
| Avatar / icon | `skeleton skeleton-avatar` | 40×40px, circle |

**Rules:**
- **Always** show skeletons while data is fetching. Never render empty containers or show nothing.
- **Never** show a loading spinner as the only feedback for inline content — use skeletons for layout-preserving loading.

```tsx
// ✅ While loading
{isLoading ? (
  <div className="space-y-3">
    <div className="skeleton skeleton-title w-1/3" />
    <div className="skeleton skeleton-text w-2/3" />
    <div className="skeleton skeleton-card" />
  </div>
) : (
  <ActualContent />
)}

// ❌ Never
{isLoading ? null : <ActualContent />}
{isLoading ? <div /> : <ActualContent />}
```

### Modals & Overlays

| Element | Class |
|---|---|
| Full-screen backdrop | `modal-overlay` |
| Modal content box | `modal-card` |

`modal-overlay` is `position: fixed; inset: 0` with `backdrop-filter: blur(4px)`. **Always render modals via `createPortal` so the overlay covers the full viewport and is never clipped by a parent container.**

```tsx
// ✅ Always use createPortal
import { createPortal } from 'react-dom'

{isOpen && createPortal(
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()}>
      <h2>Confirm action</h2>
      <p>...</p>
      <div className="flex items-center justify-end gap-2 mt-4">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>,
  document.body
)}

// ❌ Never render modals without createPortal — overlay gets clipped by parent stacking context
{isOpen && (
  <div className="modal-overlay">...</div>
)}
```

### Animations

| Trigger | Class | Effect |
|---|---|---|
| Page / component mount | `animate-fade-in` | Fades up from 8px below, 0.3s |
| Sidebar / drawer / list item | `animate-slide-in` | Slides in from left, 0.3s |
| Modal / popup / dropdown | `animate-scale-in` | Scales up from 95%, 0.2s |

```tsx
// ✅ Page section entry
<section className="animate-fade-in">...</section>

// ✅ Modal
<div className="modal-card animate-scale-in">...</div>

// ✅ Staggered list
{items.map((item, i) => (
  <div key={item.id} className="glass-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
    ...
  </div>
))}
```

### Toast Notifications

**Import:** `import { showToast } from '@/lib/toast'`

| Method | Use |
|---|---|
| `showToast.success('message')` | Successful action (save, create, update) |
| `showToast.error('message')` | Failed action, API error |
| `showToast.loading('message')` | In-progress async operation |
| `showToast.dismiss()` | Dismiss all active toasts |

**Rules:**
- **Never** use `alert()` for user feedback.
- **Never** use `console.log()` for user-visible messages.
- Always call `showToast.dismiss()` before `showToast.loading()` to avoid stacking.

```tsx
// ✅
async function handleSave() {
  showToast.loading('Saving...')
  try {
    await save()
    showToast.dismiss()
    showToast.success('Saved!')
  } catch {
    showToast.dismiss()
    showToast.error('Failed to save. Please try again.')
  }
}

// ❌ Never
alert('Saved!')
console.log('error:', err)
```

### Dividers

```tsx
// ✅
<div className="divider" />

// ❌ Never
<hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
```

### Dark / Light Mode

- **Dark is default** — `:root` CSS variables define the dark palette.
- **Light mode** — toggled by adding `.light` class to `<html>`. Handled by the Header component, persisted in `localStorage`.
- **Never hardcode colors** — always use CSS custom properties.
- When building new components, use `var(--text-primary)`, `var(--surface)`, `var(--border)` etc., not hex values.

```tsx
// ✅
<p style={{ color: 'var(--text-secondary)' }}>Subtitle</p>
<div style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>...</div>

// ❌ Never
<p style={{ color: '#8888aa' }}>Subtitle</p>
<div style={{ background: '#111118' }}>...</div>
```

**Available CSS variables:**

| Variable | Dark value | Light value |
|---|---|---|
| `--background` | `#0a0a0f` | `#f8f8fc` |
| `--surface` | `#111118` | `#ffffff` |
| `--surface-raised` | `#16161f` | `#ffffff` |
| `--surface-overlay` | `#1c1c28` | `#ffffff` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--border-strong` | `rgba(255,255,255,0.15)` | `rgba(0,0,0,0.15)` |
| `--text-primary` | `#f0f0ff` | `#0f0f1a` |
| `--text-secondary` | `#8888aa` | `#555570` |
| `--text-tertiary` | `#555570` | `#9999bb` |
| `--accent` | `#6366f1` | `#6366f1` |
| `--accent-hover` | `#818cf8` | `#818cf8` |
| `--accent-glow` | `rgba(99,102,241,0.2)` | `rgba(99,102,241,0.2)` |
| `--success` | `#22c55e` | `#22c55e` |
| `--warning` | `#f59e0b` | `#f59e0b` |
| `--error` | `#ef4444` | `#ef4444` |
| `--radius-sm` | `8px` | — |
| `--radius-md` | `12px` | — |
| `--radius-lg` | `16px` | — |
| `--radius-xl` | `24px` | — |
