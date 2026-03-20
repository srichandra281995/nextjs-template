import type { Metadata } from 'next'
import { SignUp } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Get started for free — no credit card required</p>
        </div>

        <SignUp
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
      </div>
    </div>
  )
}
