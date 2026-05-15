import type { Lesson } from '@/types/lessons'

export const cryptoBasics: Lesson = {
  slug: 'crypto-basics',
  title: 'Crypto Basics',
  description:
    'Start here if blockchain feels like jargon. Learn what cryptocurrencies are, how trading works 24/7, and how to stay safe.',
  topic: 'crypto',
  difficulty: 'beginner',
  estimatedMins: 18,
  accentColor: 'var(--brand-crypto)',
  chapterSummaries: [
    { slug: 'what-is-crypto', title: 'What is cryptocurrency?', readingTimeMin: 5 },
    { slug: 'how-trading-works', title: 'How crypto trading works', readingTimeMin: 7 },
    { slug: 'staying-safe', title: 'Staying safe: wallets, scams, volatility', readingTimeMin: 6 },
  ],
  chapters: [
    {
      slug: 'what-is-crypto',
      title: 'What is cryptocurrency?',
      readingTimeMin: 5,
      content: [
        {
          kind: 'p',
          text: 'A cryptocurrency is digital money that lives on a public network of computers — a blockchain. Nobody owns the network. Instead, thousands of computers around the world keep an identical copy of every transaction, and they agree on what is valid using cryptography and incentives.',
        },
        {
          kind: 'p',
          text: 'Bitcoin (BTC) was the first. It launched in 2009 as a way to send value over the internet without needing a bank to approve it. Ethereum (ETH) came later and added programmability — small bits of code (smart contracts) that run on the same shared computer.',
        },
        { kind: 'h2', text: 'Why do prices move so much?' },
        {
          kind: 'p',
          text: 'Crypto markets are open 24 hours a day, every day of the year. There is no closing bell. Trading volume is concentrated on a few large exchanges, and a handful of holders control a large share of many tokens. The result is sharp price swings — Bitcoin commonly moves 5–10% in a single day, and smaller "altcoins" can move 20% or more.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          text: 'Volatility cuts both ways. The same characteristic that lets crypto rise quickly also lets it fall fast. Risk-management is not optional here — it is the entire game.',
        },
        { kind: 'h2', text: 'Coins, tokens, and stablecoins' },
        {
          kind: 'list',
          items: [
            'Coins (BTC, ETH, SOL): native to their own blockchain.',
            'Tokens (USDC, UNI, LINK): built on top of an existing blockchain like Ethereum.',
            'Stablecoins (USDC, USDT): designed to track the US dollar 1:1, used as "cash" between trades.',
          ],
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Coinbase Learn, Binance Academy, Kraken Learn — Crypto market volatility (kraken.com/learn/crypto-market-volatility).',
        },
      ],
      keyIdea:
        'Crypto is digital money on a shared, always-on network. Prices move fast because the market never closes and supply is concentrated.',
      finSays:
        'You do not need to understand the math behind blockchains to trade them. Knowing why they move is more useful than knowing how they work.',
      quickCheck: {
        question: 'Why is crypto more volatile than most stocks?',
        options: [
          'Because it is illegal in most countries',
          'Because the market trades 24/7 with concentrated liquidity, and there is no closing bell',
          'Because the SEC sets daily price limits',
          'Because it is always backed by gold',
        ],
        correct: 1,
      },
    },
    {
      slug: 'how-trading-works',
      title: 'How crypto trading works',
      readingTimeMin: 7,
      content: [
        {
          kind: 'p',
          text: 'You trade crypto on an exchange — a marketplace that matches buyers and sellers. The biggest exchanges by volume are Binance, Coinbase, and Kraken. Each one shows the same coins but at slightly different prices, because each has its own pool of buyers and sellers.',
        },
        { kind: 'h2', text: 'Spot trading vs derivatives' },
        {
          kind: 'list',
          items: [
            'Spot: you swap one asset for another and you actually own it. Buying 0.1 BTC on Coinbase means you hold 0.1 BTC.',
            'Derivatives (futures, perpetuals): you bet on the price moving without owning the underlying coin. Often offered with leverage.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warn',
          text: 'Some exchanges offer up to 100:1 leverage on crypto derivatives. A 1% move against you can wipe your position. Spot trading with no leverage is far safer for beginners.',
        },
        { kind: 'h2', text: 'A simple breakout setup' },
        {
          kind: 'p',
          text: 'A common entry-level strategy is the "momentum breakout". The idea: when price has been stuck in a tight range and finally jumps above it on rising volume, the move often continues.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Spot a clear horizontal resistance level on the 1H or 4H BTC chart.',
            'Wait for a candle to close above that level on above-average volume.',
            'Enter long. Place a stop-loss just below the breakout level.',
            'Take profits at 2× your risk distance (a 1:2 risk-to-reward target).',
          ],
        },
        { kind: 'h2', text: 'Position sizing' },
        {
          kind: 'p',
          text: "A widely-recommended rule: risk no more than 1–2% of your account on any single trade. Given crypto's volatility, many experienced traders cap risk at 1% or less. With a $5,000 account and a 1% risk cap ($50), if your stop-loss is $100 wide, your position size should be $50 ÷ $100 = 0.5 units.",
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Investopedia — How To Reduce Risk With Optimal Position Size; CoinGecko — Top Crypto Exchanges Ranked by Trust Score.',
        },
      ],
      keyIdea:
        'Spot first, derivatives later. Always size positions so a stop-loss caps your loss at 1–2% of your account.',
      finSays:
        'Leverage is the fastest way to lose money in crypto. If a setup only works with leverage, it probably is not a good setup.',
      quickCheck: {
        question:
          'You have a $2,000 account and want to risk 1% per trade. Your stop-loss is $20 wide. What position size keeps you within the risk rule?',
        options: ['0.5 units', '1 unit', '2 units', '20 units'],
        correct: 1,
      },
    },
    {
      slug: 'staying-safe',
      title: 'Staying safe: wallets, scams, volatility',
      readingTimeMin: 6,
      content: [
        {
          kind: 'p',
          text: 'Crypto has no SIPC, no FDIC, and no central regulator who will refund you if your exchange is hacked or your account is drained. Security is your responsibility. The good news: a few simple habits prevent most losses.',
        },
        { kind: 'h2', text: 'Exchange vs wallet' },
        {
          kind: 'list',
          items: [
            'Exchange custody: easiest to use, but the exchange holds the keys. If they go down, your coins go down with them.',
            'Self-custody (hot wallet): a software wallet on your phone or laptop. You hold the keys.',
            'Self-custody (cold wallet): a hardware device like a Ledger or Trezor. The keys never touch the internet.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          text: 'A common rule: keep small "trading" amounts on the exchange, and move long-term holdings ("HODL") to a hardware wallet.',
        },
        { kind: 'h2', text: 'Scam patterns to recognise' },
        {
          kind: 'list',
          items: [
            'Pump-and-dump groups promising guaranteed gains on obscure tokens.',
            '"Rug pulls" — projects that drain liquidity once enough people have bought in.',
            'Fake support staff DMing you on Discord or X. Real support never asks for your seed phrase.',
            'Phishing sites with one-letter-different URLs from the real exchange.',
          ],
        },
        { kind: 'h2', text: 'Manage your psychology' },
        {
          kind: 'p',
          text: 'Crypto FOMO (fear of missing out) is intense. When a coin is up 40% in a day, the urge to chase it is strong — and that is usually the worst entry. The other side is "tilt": after a loss, traders often double their size to win it back, and lose much more. The cure for both is a written plan and a trade journal you actually use.',
        },
        {
          kind: 'callout',
          tone: 'sources',
          text: 'Kraken Learn — Best Crypto Exchanges; NinjaTrader — Trading Psychology insights.',
        },
      ],
      keyIdea:
        'Security and emotional discipline matter more than picking the right coin. Hardware wallets, 2FA, and a written plan beat any tip.',
      finSays:
        'If a stranger online has a "guaranteed" coin tip, they are not your friend. They are your exit liquidity.',
      quickCheck: {
        question: 'What is the safest place to store crypto you do not plan to trade for a year?',
        options: [
          'Your exchange account',
          'A hot wallet on your phone',
          'A hardware (cold) wallet',
          'A screenshot of your seed phrase in cloud storage',
        ],
        correct: 2,
      },
    },
  ],
}
