'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      document.documentElement.classList.add('light')
      setIsLight(true)
    }
  }, [])

  const toggle = () => {
    const html = document.documentElement
    if (isLight) {
      html.classList.remove('light')
      localStorage.setItem('theme', 'dark')
      setIsLight(false)
    } else {
      html.classList.add('light')
      localStorage.setItem('theme', 'light')
      setIsLight(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className="btn-ghost"
      style={{ padding: '8px', fontSize: '16px', lineHeight: 1 }}
      aria-label="Toggle theme"
    >
      {isLight ? '🌙' : '☀️'}
    </button>
  )
}

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'App'

export function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          {appName}
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />

          <SignedOut>
            <Link href="/sign-in" className="btn-ghost">
              Sign in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                variables: {
                  colorPrimary: '#6366f1',
                  borderRadius: '8px',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
