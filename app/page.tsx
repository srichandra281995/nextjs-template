import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

const features = [
  {
    icon: '⚡',
    title: 'Next.js 15',
    description:
      'App Router, Server Components, Partial Prerendering, and the full power of React 19 for maximum performance.',
  },
  {
    icon: '🔐',
    title: 'Clerk Auth',
    description:
      'Complete authentication with sign-in, sign-up, user profiles, and session management—zero config.',
  },
  {
    icon: '🗃️',
    title: 'Supabase',
    description:
      'PostgreSQL database with browser and server clients pre-wired for the App Router and RSC.',
  },
  {
    icon: '🎨',
    title: 'Design System',
    description:
      'Dark mode first, glass morphism, CSS variables, and a cohesive color palette out of the box.',
  },
  {
    icon: '📘',
    title: 'TypeScript Strict',
    description:
      'Strict mode enabled everywhere—catch bugs at compile time, not in production at 3 AM.',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description:
      'Optimised for Vercel with sensible defaults, image domains, and environment variable hygiene.',
  },
]

const stack = ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v3', 'Clerk', 'Supabase']

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative px-4 pb-24 pt-32 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-background to-background" />
          <div className="absolute left-1/2 top-[-5%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-4xl space-y-8 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Production-ready · Next.js 15 + Clerk + Supabase
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text-white">Ship faster</span>
            <br />
            <span className="gradient-text-primary">with Neev</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
            A production-ready Next.js 15 starter that handles auth, database, and design so you can
            focus entirely on building your product.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <SignedOut>
              <Link href="/sign-up" className="group btn-primary h-12 px-8 text-base">
                Get started free
                <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link href="/sign-in" className="btn-secondary h-12 px-8 text-base">
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="group btn-primary h-12 px-8 text-base">
                Go to dashboard
                <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </SignedIn>
          </div>

          {/* Stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything included
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pre-configured so you can clone and start shipping within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-32 pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-slate-900/60 p-px">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-10 text-center backdrop-blur-md sm:p-14">
              {/* Inner glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-indigo-500/5" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to build?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Clone this template, add your keys, and ship your first feature today.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <SignedOut>
                  <Link href="/sign-up" className="btn-primary h-12 px-8">
                    Start building for free
                  </Link>
                  <Link href="/sign-in" className="btn-ghost h-12 px-6">
                    Already have an account →
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="btn-primary h-12 px-8">
                    Go to dashboard →
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          Built with{' '}
          <span className="text-foreground/80">Next.js 15 · Clerk · Supabase · Tailwind CSS</span>
        </p>
      </footer>
    </div>
  )
}
