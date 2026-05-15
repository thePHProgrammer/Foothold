import type { Lesson } from '@/types/lessons'

export const forexIntro: Lesson = {
  slug: 'forex-intro',
  title: 'Forex Intro',
  description:
    "The world's biggest market trades $7.5 trillion a day. Learn what forex is, how pairs are quoted, and where the risks live.",
  topic: 'forex',
  difficulty: 'beginner',
  estimatedMins: 22,
  accentColor: 'var(--brand-forex)',
  chapterSummaries: [
    { slug: 'what-is-forex', title: 'What is forex?', readingTimeMin: 7 },
    { slug: 'currency-pairs', title: 'Currency pairs and pips', readingTimeMin: 8 },
    { slug: 'majors-and-leverage', title: 'Majors, minors, and leverage', readingTimeMin: 7 },
  ],
  chapters: [
    {
      slug: 'what-is-forex',
      title: 'What is forex?',
      readingTimeMin: 7,
      content: [
        {
          kind: 'p',
          text: 'Forex (FX) is the market where currencies are exchanged. Every time you travel and buy euros with dollars, you are participating in it. At the institutional level, the same trades happen in enormous size — about $7.5 trillion per day, making forex the largest financial market in the world.',
        },
        {
          kind: 'p',
          text: 'Unlike stocks, forex has no central exchange. Trades happen "over the counter" (OTC) through a network of banks, brokers, and electronic platforms. This is why forex runs 24 hours a day, 5 days a week, opening in Sydney on Sunday evening and closing in New York on Friday afternoon.',
        },
        { kind: 'h2', text: 'Why people trade currencies' },
        {
          kind: 'list',
          items: [
            "Hedging: a UK company expecting US-dollar revenue locks in today's exchange rate to protect against future moves.",
            'Speculation: traders bet on whether one currency will strengthen or weaken against another.',
            'Carry: borrowing a low-yielding currency to buy a higher-yielding one and pocketing the rate difference.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warn',
          text: 'Regulators warn that the majority of retail forex traders lose money. The combination of high leverage and 24-hour markets makes it easy to over-trade. Treat forex like a discipline, not a casino.',
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Reuters — Global FX trading hits record $7.5 trln a day (BIS survey, 2022); CFTC Customer Advisory: Eight Things You Should Know Before Trading Forex.',
        },
      ],
      keyIdea:
        "Forex is the world's biggest market, runs 24/5, and has no central exchange. Most retail traders lose — discipline matters more than any setup.",
      finSays:
        'A market that never sleeps is also a market that will let you ruin your sleep schedule. Pick your hours and stick to them.',
      quickCheck: {
        question: 'Roughly how much currency changes hands in the forex market each day?',
        options: ['$75 million', '$7.5 billion', '$750 billion', '$7.5 trillion'],
        correct: 3,
      },
    },
    {
      slug: 'currency-pairs',
      title: 'Currency pairs and pips',
      readingTimeMin: 8,
      content: [
        {
          kind: 'p',
          text: 'Forex prices are always quoted in pairs — you are simultaneously buying one currency and selling another. EUR/USD = 1.1050 means one euro buys $1.1050. The first currency (EUR) is the base; the second (USD) is the quote.',
        },
        { kind: 'h2', text: 'What is a pip?' },
        {
          kind: 'p',
          text: 'A pip is the smallest standard price move in a forex pair, almost always the fourth decimal place: 0.0001. So if EUR/USD goes from 1.1050 to 1.1051, that is a one-pip move. JPY pairs are the exception — for them, a pip is the second decimal (0.01) because yen quotes are smaller.',
        },
        { kind: 'h2', text: 'Lots and pip values' },
        {
          kind: 'list',
          items: [
            'Standard lot: 100,000 units of the base currency. One pip ≈ $10 on EUR/USD.',
            'Mini lot: 10,000 units. One pip ≈ $1.',
            'Micro lot: 1,000 units. One pip ≈ $0.10.',
            'Nano lot: 100 units. One pip ≈ $0.01 (rare, broker-specific).',
          ],
        },
        { kind: 'h2', text: 'Worked example: position sizing' },
        {
          kind: 'p',
          text: 'You have a $10,000 account and want to risk 1% per trade ($100). Your stop-loss on EUR/USD is 20 pips wide. You divide your risk by the stop distance to get $5 per pip — which corresponds to a 0.5 mini-lot position (5,000 units). At that size, hitting your stop loses exactly $100, hitting a 40-pip target gains $200, and you have a 1:2 risk-to-reward.',
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'Almost every blown forex account traces back to a position size that ignored the stop distance. Get this calculation right and you have already done more risk management than most retail traders.',
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Babypips School of Pipsology; Investopedia — How To Reduce Risk With Optimal Position Size.',
        },
      ],
      keyIdea:
        'A pip is your unit of measurement. Pip value × stop distance = your risk per trade — and that should never exceed 1–2% of your account.',
      finSays:
        'Calculate your position size before you decide whether to enter. If the right size feels uncomfortably small, the stop is too far away or the account is too small.',
      quickCheck: {
        question:
          'You risk 1% of a $5,000 account on a EUR/USD trade with a 25-pip stop. Roughly what position size is correct?',
        options: ['Standard lot (1.0)', 'Mini lot (0.2)', 'Mini lot (2.0)', 'Standard lot (10)'],
        correct: 1,
      },
    },
    {
      slug: 'majors-and-leverage',
      title: 'Majors, minors, and leverage',
      readingTimeMin: 7,
      content: [
        { kind: 'h2', text: 'Three families of pairs' },
        {
          kind: 'list',
          items: [
            'Majors: pairs that include USD on one side, like EUR/USD, GBP/USD, USD/JPY. These have the tightest spreads and the most predictable behaviour.',
            'Minors (crosses): non-USD pairs between major currencies, like EUR/GBP or AUD/JPY. Slightly wider spreads.',
            'Exotics: a major currency paired with an emerging-market one (USD/TRY, USD/ZAR). Wide spreads, large jumps, harder to trade.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'For most beginners, EUR/USD is the right starting place. It has the highest liquidity, the tightest spread, and the most chart-pattern history to learn from.',
        },
        { kind: 'h2', text: 'Leverage: the loaded gun' },
        {
          kind: 'p',
          text: 'Forex brokers offer leverage — the ability to control a position larger than your account balance. In the US, retail forex leverage is capped at 30:1 on majors (50:1 in some other markets, much higher offshore). With 30:1 leverage, $1,000 of margin can control a $30,000 position.',
        },
        {
          kind: 'p',
          text: 'Leverage amplifies both wins and losses. A 1% move in your favour with 30:1 leverage is a 30% account gain. A 1% move against you is a 30% loss. This is why position sizing — not leverage — should drive how much you trade.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          text: '"If you use margin and the trade fails, you end up with a large debt for nothing." Set your stop-loss before you size the trade, not after.',
        },
        { kind: 'h2', text: 'A complete trade walkthrough' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Identify a clean consolidation in EUR/USD on the 1H or 4H chart.',
            'Draw clear support and resistance levels around the range.',
            'Wait for a candle to close beyond resistance on above-average volume.',
            'Enter long. Place a stop just below the breakout level.',
            'Set a profit target at 2× your risk distance, or trail the stop as price moves.',
            'Exit at stop or target — never move the stop further away "just this once".',
          ],
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'ForexBrokers.com — 7 Best Forex Demo Accounts for 2026; Investopedia — Mastering Breakout Trading; Common Investor and Trader Blunders.',
        },
      ],
      keyIdea:
        'Trade majors first. Leverage is a tool, not a strategy — your stop distance and position size are what actually control risk.',
      finSays:
        'Moving a stop further away to "give the trade room" is the most expensive habit in forex. The plan only works if you keep the plan.',
      quickCheck: {
        question: 'Which of these is a "major" forex pair?',
        options: ['EUR/GBP', 'EUR/USD', 'AUD/JPY', 'USD/TRY'],
        correct: 1,
      },
    },
  ],
}
