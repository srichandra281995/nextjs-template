import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Header } from '@/components/header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Neev — Next.js 15 Template',
    template: '%s | Neev',
  },
  description:
    'Production-ready Next.js 15 starter with Clerk authentication, Supabase, TypeScript, and a modern design system.',
  keywords: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Clerk', 'Supabase'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      {/* dark class = dark mode by default; remove to default to light */}
      <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans text-foreground antialiased">
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
