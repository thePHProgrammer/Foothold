# Foothold

> A free, mobile-first platform to learn stocks, crypto, and forex — one step at a time.

**Status:** Step 6 complete — Trading Journal ✅

---

## Tech stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Framework   | Next.js 14 (App Router)            |
| Language    | TypeScript (strict)                |
| Styling     | TailwindCSS + custom design tokens |
| Auth        | NextAuth v5 + Google OAuth         |
| Database    | Neon (PostgreSQL serverless)       |
| ORM         | Prisma                             |
| Market data | CoinGecko + Finnhub (free tiers)   |
| Deployment  | Vercel                             |

---

## Prerequisites

- Node.js ≥ 18.18
- A [Neon](https://neon.tech) account (free)
- A Google Cloud project with OAuth 2.0 credentials (free)

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/thePHProgrammer/Foothold.git
cd Foothold
npm install
```

### 2. Set up Neon database

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Go to **Connection Details** and copy two URLs:
   - **Pooled connection** → `DATABASE_URL` (tick "Pooled connection")
   - **Direct connection** → `DIRECT_URL` (untick "Pooled connection")

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Add authorised redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`
4. Copy the **Client ID** and **Client Secret**

### 4. Configure environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 5. Migrate database and start

```bash
npx prisma migrate dev --name init
npm run dev
```

Visit `http://localhost:3000` → redirected to `/login` → sign in with Google → completes onboarding → lands on `/learn`.

---

## Vercel deployment

1. Import the GitHub repo on [vercel.com](https://vercel.com)
2. Add all environment variables from `.env.example` in Vercel project settings
3. Run `npx prisma migrate deploy` once against your production `DIRECT_URL`
4. Deploy — `prisma generate` runs automatically as part of `npm run build`

> **Migration blocker:** Steps 2–6 added schema models
> (`UserLessonProgress`, `UserOnboardingPreferences`, `PaperPortfolio`,
> `PaperPosition`, `PaperTrade`, `PaperTradeSide`, `UserQuizAttempt`,
> `JournalEntry`, plus `PaperTrade.symbolName/kind/executedAt`). The schema
> is generated locally only — production must run `npx prisma migrate
deploy` (or `prisma migrate dev --name add_journal`) against the Neon
> `DIRECT_URL` before onboarding, progress, paper trading, quizzes, and the
> journal work in prod.

---

## Project structure

```
src/
├── actions/          # Server Actions (auth, user, ...)
├── app/
│   ├── (auth)/       # Login, access-denied pages
│   ├── (app)/        # Protected app pages
│   ├── api/auth/     # NextAuth handler
│   └── globals.css   # Design tokens + base styles
├── auth.ts           # NextAuth v5 config
├── components/
│   ├── icons/        # SVG icons
│   ├── layout/       # Topbar, BrandMark, SessionProvider
│   ├── shared/       # Skeleton, EmptyState, ErrorState
│   └── ui/           # Button and future components
├── config/features.ts  # Feature flags
├── lib/              # env, prisma, utils, logger, rate-limit, validations
├── middleware.ts     # Edge-safe route protection
├── server/           # Server-only: auth, db, repositories, services
├── styles/fonts.ts   # next/font configuration
└── types/auth.ts     # NextAuth type augmentation
```

---

## Security overview

| Concern           | Approach                                         |
| ----------------- | ------------------------------------------------ |
| Session storage   | JWT in HttpOnly cookie (XSS-safe)                |
| CSRF              | Built-in NextAuth protection                     |
| Route protection  | Edge middleware + layout-level auth check        |
| Env validation    | Zod schema — crashes at startup if vars missing  |
| Rate limiting     | In-memory limiter (swap Upstash Redis for scale) |
| SQL injection     | Prisma parameterised queries only                |
| Role manipulation | `role` sourced from DB via JWT callback          |
| Security headers  | CSP, HSTS, X-Frame-Options in `next.config.mjs`  |

---

## Build roadmap

| Step | Feature                     | Status      |
| ---- | --------------------------- | ----------- |
| 1    | Authentication System       | ✅ Complete |
| 2    | Learning Modules            | ✅ Complete |
| 3    | Live Market Data            | ✅ Complete |
| 4    | Paper Trading Simulator     | ✅ Complete |
| 5    | Quizzes & Progress Tracking | ✅ Complete |
| 6    | Trading Journal             | ✅ Complete |
| 7    | Watchlists & News Feed      | ⏳ Next     |
| 8    | Admin CMS                   | ⏳ Pending  |
| 9    | Dark Mode & Accessibility   | ⏳ Pending  |

---

## Design system

- **Accent**: Terracotta (`#D97757`)
- **Typography**: Manrope + JetBrains Mono
- **Palette**: Warm off-white paper with ink neutrals
- Screen mockups: `design-references/`

---

## Disclaimer

Foothold is an **educational platform only**. Nothing here constitutes financial advice.
All trading simulations use fake money. Always do your own research before investing.
