import type { Topic } from '@/types/lessons'

export type GlossaryTerm = {
  slug: string
  term: string
  definition: string
  topic: Topic | 'general'
  example?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'pip',
    term: 'Pip',
    definition:
      'The smallest standardised price move in a forex pair, usually the fourth decimal place (0.0001) — or the second for JPY pairs (0.01).',
    topic: 'forex',
    example: 'EUR/USD moving from 1.1050 to 1.1051 is a one-pip change.',
  },
  {
    slug: 'leverage',
    term: 'Leverage',
    definition:
      'Borrowed capital that lets you control a larger position than your own balance. Amplifies both gains and losses.',
    topic: 'general',
    example: '30:1 leverage means $1,000 of margin can control a $30,000 position.',
  },
  {
    slug: 'margin',
    term: 'Margin',
    definition:
      'The deposit a broker requires to open a leveraged trade. Falls below the maintenance level and the position is liquidated.',
    topic: 'general',
  },
  {
    slug: 'lot',
    term: 'Lot',
    definition:
      'A standard trade size in forex. One standard lot is 100,000 units of the base currency; a mini lot is 10,000.',
    topic: 'forex',
  },
  {
    slug: 'spread',
    term: 'Spread',
    definition:
      'The difference between the bid (sell) and ask (buy) price. Effectively the cost of opening a trade.',
    topic: 'general',
  },
  {
    slug: 'rsi',
    term: 'RSI (Relative Strength Index)',
    definition:
      'A momentum oscillator measuring the speed of price changes on a 0–100 scale. Below 30 is often called oversold; above 70, overbought.',
    topic: 'general',
    example: 'A crypto trader might watch for BTC RSI(14) crossing back above 30 after a sell-off.',
  },
  {
    slug: 'macd',
    term: 'MACD',
    definition:
      'Moving Average Convergence Divergence — a trend-following indicator showing the relationship between two EMAs of price.',
    topic: 'general',
  },
  {
    slug: 'ema',
    term: 'EMA (Exponential Moving Average)',
    definition:
      'A moving average that weights recent prices more heavily than older ones, reacting faster than a simple moving average.',
    topic: 'general',
  },
  {
    slug: 'golden-cross',
    term: 'Golden Cross',
    definition:
      'When a short-term moving average (e.g. 50-day) crosses above a long-term one (e.g. 200-day) — often interpreted as a bullish signal.',
    topic: 'stocks',
  },
  {
    slug: 'breakout',
    term: 'Breakout',
    definition:
      'When price moves decisively beyond a defined support or resistance level, often on rising volume.',
    topic: 'general',
  },
  {
    slug: 'mean-reversion',
    term: 'Mean Reversion',
    definition:
      'A strategy assuming price will return to its average after stretching too far in one direction.',
    topic: 'general',
  },
  {
    slug: 'atr',
    term: 'ATR (Average True Range)',
    definition:
      'A volatility indicator measuring the average size of price moves over a set period.',
    topic: 'general',
    example: 'Many traders set stops at 1.5× ATR below entry.',
  },
  {
    slug: 'drawdown',
    term: 'Drawdown',
    definition:
      'The peak-to-trough decline in account value. A 10% drawdown means the account is 10% below its high-water mark.',
    topic: 'general',
  },
  {
    slug: 'risk-reward',
    term: 'Risk:Reward (R:R)',
    definition:
      'The ratio of how much you stand to lose vs. gain on a trade. A 1:2 R:R means risking $100 to make $200.',
    topic: 'general',
  },
  {
    slug: 'position-sizing',
    term: 'Position Sizing',
    definition:
      'Choosing how many units to trade so a stop-loss caps the loss at a fixed percentage of your account — commonly 1–2%.',
    topic: 'general',
  },
  {
    slug: 'fomo',
    term: 'FOMO',
    definition:
      'Fear Of Missing Out — the urge to chase a move that has already run, usually leading to bad entries near tops.',
    topic: 'general',
  },
  {
    slug: 'tilt',
    term: 'Tilt',
    definition:
      'Trading impulsively to recover losses, abandoning your plan. A leading cause of blown accounts.',
    topic: 'general',
  },
  {
    slug: 'hodl',
    term: 'HODL',
    definition:
      'Crypto slang for buy-and-hold (originally a typo of "hold"). A long-term, no-trading strategy.',
    topic: 'crypto',
  },
  {
    slug: 'defi',
    term: 'DeFi',
    definition:
      'Decentralised Finance — financial services (lending, swaps, yield) built on public blockchains, without traditional intermediaries.',
    topic: 'crypto',
  },
  {
    slug: 'tokenomics',
    term: 'Tokenomics',
    definition:
      'The economic design of a crypto token: total supply, emission schedule, vesting, utility, and incentives.',
    topic: 'crypto',
  },
]

export const GLOSSARY_BY_SLUG: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.slug, t])
)
