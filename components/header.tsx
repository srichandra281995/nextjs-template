'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'App'

export function Header() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
    const observer = new MutationObserver(() =>
      setIsLight(document.documentElement.classList.contains('light'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (isLight) {
      html.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
    // state updates via the MutationObserver above
  }

  const userButtonAppearance = {
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: isLight ? '#ffffff' : '#16161f',
      colorText: isLight ? '#0f0f1a' : '#f0f0ff',
      colorTextSecondary: isLight ? '#555570' : '#8888aa',
      colorInputBackground: isLight ? '#f8f8fc' : '#0a0a0f',
      colorInputText: isLight ? '#0f0f1a' : '#f0f0ff',
      colorNeutral: isLight ? '#e0e0f0' : '#2a2a3a',
      borderRadius: '12px',
      fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
    },
    elements: {
      userButtonPopoverCard: {
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      },
      userButtonPopoverActionButton: {
        borderRadius: '8px',
      },
    },
  }

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
        background: 'color-mix(in srgb, var(--background) 85%, transparent)',
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
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '8px', fontSize: '16px', lineHeight: 1 }}
            aria-label="Toggle theme"
          >
            {isLight ? '🌙' : '☀️'}
          </button>

          <SignedOut>
            <Link href="/sign-in" className="btn-ghost">
              Sign in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={userButtonAppearance} />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
