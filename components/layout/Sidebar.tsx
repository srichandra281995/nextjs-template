'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        position: 'sticky',
        top: '60px', // offset by header height
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
        overflowY: 'auto',
        zIndex: 30,
      }}
    >
      <nav
        style={{
          flex: 1,
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="btn-ghost"
              style={{
                display: 'flex',
                width: '100%',
                color: isActive ? 'var(--accent)' : undefined,
                background: isActive
                  ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                  : undefined,
                fontWeight: isActive ? 500 : undefined,
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
