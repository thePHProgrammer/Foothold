import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
}

/**
 * Centered auth layout with the Foothold radial gradient background.
 * Matches the hf-auth shell from the design reference.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center p-5"
      style={{
        background: `
          radial-gradient(900px 600px at 90% -10%, #FBE9DF, transparent 60%),
          radial-gradient(700px 500px at -10% 110%, rgba(217,119,87,0.07), transparent 60%),
          #FBF9F6
        `,
      }}
    >
      {children}
    </main>
  )
}
