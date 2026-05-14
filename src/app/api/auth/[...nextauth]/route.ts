import { handlers } from '@/auth'

// NextAuth v5 App Router handler.
// All OAuth callbacks, sign-in, sign-out, session endpoints are handled here.
export const { GET, POST } = handlers
