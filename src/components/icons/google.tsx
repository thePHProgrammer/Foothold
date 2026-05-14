import { type SVGProps } from 'react'

/** Google "G" logo — used on the sign-in button. */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.73-.07-1.43-.2-2.1H12.2v3.97h5.78c-.25 1.36-1 2.5-2.16 3.27v2.7h3.5c2.05-1.9 3.18-4.69 3.18-7.84z"
      />
      <path
        fill="#34A853"
        d="M12.2 22.5c2.92 0 5.36-.96 7.15-2.6l-3.5-2.7c-.97.65-2.2 1.04-3.65 1.04-2.8 0-5.18-1.89-6.03-4.43H2.55v2.78A10.27 10.27 0 0012.2 22.5z"
      />
      <path
        fill="#FBBC04"
        d="M6.18 13.81a6.16 6.16 0 010-3.92V7.1H2.55a10.3 10.3 0 000 9.4l3.63-2.69z"
      />
      <path
        fill="#EA4335"
        d="M12.2 5.45c1.59 0 3 .55 4.13 1.62l3.1-3.1A10.3 10.3 0 002.55 7.1l3.63 2.79c.85-2.55 3.23-4.44 6.02-4.44z"
      />
    </svg>
  )
}
