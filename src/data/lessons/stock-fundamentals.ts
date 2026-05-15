import type { Lesson } from '@/types/lessons'

export const stockFundamentals: Lesson = {
  slug: 'stock-fundamentals',
  title: 'Stock Fundamentals',
  description:
    'Understand what a share really is, how exchanges set prices, and the chart-reading basics every stock trader needs.',
  topic: 'stocks',
  difficulty: 'beginner',
  estimatedMins: 20,
  accentColor: 'var(--brand-stocks)',
  chapterSummaries: [
    { slug: 'what-are-stocks', title: 'What are stocks?', readingTimeMin: 6 },
    { slug: 'reading-a-chart', title: 'Reading a chart', readingTimeMin: 7 },
    { slug: 'valuation-basics', title: 'Valuation basics: P/E and earnings', readingTimeMin: 7 },
  ],
  chapters: [
    {
      slug: 'what-are-stocks',
      title: 'What are stocks?',
      readingTimeMin: 6,
      content: [
        {
          kind: 'p',
          text: 'A stock (or "share") is a unit of ownership in a company. Buy one share of Apple and you own a tiny slice of the business — its factories, its cash, and a claim on its future profits.',
        },
        {
          kind: 'p',
          text: 'Public companies sell shares on stock exchanges like the NYSE or NASDAQ. The exchange runs a continuous auction during set hours (9:30am–4:00pm ET in the US) where buyers and sellers post the prices they are willing to trade at.',
        },
        { kind: 'h2', text: 'How prices are set' },
        {
          kind: 'list',
          items: [
            'The bid is the highest price a buyer will currently pay.',
            'The ask is the lowest price a seller will currently accept.',
            'The last trade price is whatever the most recent matched order went through at.',
            'The spread (ask minus bid) is essentially the cost of trading.',
          ],
        },
        { kind: 'h2', text: 'Order types every trader needs' },
        {
          kind: 'list',
          items: [
            'Market order: buy or sell now at whatever price is available.',
            'Limit order: only execute at a specific price or better.',
            'Stop-loss: sell automatically once price falls to a level you set.',
            'Stop-limit: a stop that turns into a limit order, not a market order, when triggered.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'Most US brokers (Robinhood, Schwab, Fidelity) now charge $0 commission for stock trades. You still pay a tiny cost via the bid-ask spread, but the explicit fee is usually zero.',
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Investopedia — Investing 101; SEC Investor.gov; FINRA broker rules.',
        },
      ],
      keyIdea:
        'A share is a slice of a real company. The price you see is just the most recent point at which a buyer and seller agreed.',
      finSays:
        'You are not buying a ticker symbol — you are buying a piece of a business. That framing makes valuation questions easier to think about.',
      quickCheck: {
        question: 'What is the spread on a stock?',
        options: [
          'The daily price range',
          'The difference between the highest bid and lowest ask price',
          'The commission your broker charges',
          'The annual dividend',
        ],
        correct: 1,
      },
    },
    {
      slug: 'reading-a-chart',
      title: 'Reading a chart',
      readingTimeMin: 7,
      content: [
        {
          kind: 'p',
          text: 'A price chart compresses thousands of trades into a picture. The most common style is the candlestick chart: each "candle" shows the open, high, low, and close price for one period (a day, an hour, five minutes — your choice).',
        },
        { kind: 'h2', text: 'Anatomy of a candle' },
        {
          kind: 'list',
          items: [
            'Body: rectangle between the open and close. Filled (often red) if the close is below the open; hollow or green if above.',
            'Wicks: thin lines above and below showing the high and low reached during the period.',
            'Volume: how many shares changed hands. Big moves on big volume are more reliable than big moves on quiet days.',
          ],
        },
        { kind: 'h2', text: 'Trend, support, resistance' },
        {
          kind: 'p',
          text: 'Three concepts cover most chart reading. A trend is the general direction of price (up, down, or sideways). Support is a price level where buying interest has stopped declines before. Resistance is a level where selling has previously stopped rises.',
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'A "breakout" is when price closes decisively above resistance (or below support) on rising volume. Many of the most popular trading strategies are just refined versions of this idea.',
        },
        { kind: 'h2', text: 'Two beginner-friendly indicators' },
        {
          kind: 'list',
          items: [
            'Moving averages (50-day, 200-day): smooth out noise to show the underlying trend. When the 50-day crosses above the 200-day, it is called a "golden cross" — a classic momentum signal.',
            'RSI (Relative Strength Index): a 0–100 oscillator. Below 30 is sometimes called "oversold"; above 70, "overbought". Use it as a hint, not a trigger.',
          ],
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Investopedia — Mastering Breakout Trading; Master Moving Averages: A Guide to Smarter Stock Investments.',
        },
      ],
      keyIdea:
        'Charts compress the auction into a picture. Trend, support, and resistance explain most of what you see.',
      finSays:
        'Indicators are flashlights, not fortune tellers. They illuminate the chart you are already reading — they do not predict the next candle.',
      quickCheck: {
        question: 'What is a "golden cross"?',
        options: [
          'When a stock pays a dividend',
          'When the 50-day moving average crosses above the 200-day moving average',
          'When RSI hits exactly 50',
          'When a stock splits',
        ],
        correct: 1,
      },
    },
    {
      slug: 'valuation-basics',
      title: 'Valuation basics: P/E and earnings',
      readingTimeMin: 7,
      content: [
        {
          kind: 'p',
          text: 'Charts tell you what price has done. Valuation tells you whether that price makes sense. Even pure technical traders benefit from knowing the basics — it stops you from buying a falling knife or shorting a giveaway.',
        },
        { kind: 'h2', text: 'Earnings per share (EPS)' },
        {
          kind: 'p',
          text: 'EPS is a company\'s net profit divided by the number of shares outstanding. If a company makes $1B in profit and has 500M shares, its EPS is $2. Companies report EPS every quarter — these "earnings reports" are the single biggest scheduled mover for individual stocks.',
        },
        { kind: 'h2', text: 'Price-to-earnings (P/E) ratio' },
        {
          kind: 'p',
          text: "P/E divides the share price by the EPS. A stock at $40 with $2 EPS has a P/E of 20 — meaning investors are paying $20 today for every $1 of current annual profit. Higher P/E means the market expects strong future growth; lower P/E often signals a mature business or doubt about the company's prospects.",
        },
        {
          kind: 'callout',
          tone: 'warn',
          text: "P/E only works as a comparison tool. A P/E of 30 might be cheap for a fast-growing software company and expensive for a slow-growing utility. Always compare to the company's own history and to its sector.",
        },
        { kind: 'h2', text: 'A simple checklist before any trade' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'When is the next earnings report? Avoid surprise binary moves unless you intend to trade the event.',
            "How does the stock's P/E compare to its 5-year average and to its sector?",
            'Is revenue growing? Profits without revenue growth often signal cost-cutting that cannot continue.',
            'What is the stock doing relative to the broader index? A weak stock in a strong market is suspicious.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'In the US, you need at least $25,000 in your account to make more than three day-trades a week (the "Pattern Day Trader" rule). For most beginners, swing-trading on daily charts is a better fit anyway.',
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Investopedia — Common Investor and Trader Blunders; FINRA Pattern Day Trader rule.',
        },
      ],
      keyIdea:
        'Valuation context turns a chart from a guess into an informed bet. P/E and earnings dates are the two numbers every stock trader should know before entering a trade.',
      finSays:
        "Cheap stocks are sometimes cheap for a reason, and expensive stocks are sometimes worth it. Compare to the company's own history and to peers — never in isolation.",
      quickCheck: {
        question: 'A stock trades at $50 with EPS of $2.50. What is its P/E ratio?',
        options: ['5', '10', '20', '125'],
        correct: 2,
      },
    },
  ],
}
