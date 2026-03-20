import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight transition-opacity duration-200 hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
            N
          </span>
          <span className="text-lg">Neev</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <SignedOut>
            <Link href="/" className="btn-ghost hidden sm:inline-flex">
              Home
            </Link>
            <Link
              href="/sign-in"
              className="btn-ghost hidden sm:inline-flex"
            >
              Sign in
            </Link>
            <Link href="/sign-up" className="btn-primary ml-2">
              Get started
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/" className="btn-ghost hidden sm:inline-flex">
              Home
            </Link>
            <div className="ml-3 flex items-center">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  variables: {
                    colorPrimary: '#6366f1',
                    borderRadius: '0.5rem',
                  },
                }}
              />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
