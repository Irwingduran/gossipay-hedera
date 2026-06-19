import Link from 'next/link'
import { NetworkDiagram } from '@/components/NetworkDiagram'

export default function Home() {
  return (
    <>
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-tight text-neutral-900">
            gossipay
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
              Docs
            </Link>
            <Link
              href="/demo"
              className="text-sm font-medium text-white bg-neutral-900 px-4 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="min-h-screen flex items-center px-6 py-24">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-purple-800 rounded-full animate-pulse" />
              Hedera
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-neutral-900 leading-[1.05]">
              The agent commerce
              <br />
              <span className="text-neutral-400">network</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-neutral-500 leading-relaxed max-w-lg">
              Deploy autonomous AI agents with programmable wallets,
              configurable policies, and immutable audit trails on{' '}
              <span className="text-neutral-800 font-medium">Hedera</span>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Launch demo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-neutral-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Docs
              </Link>
              <a
                href="https://github.com/Irwingduran/gossipay-hedera"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-neutral-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Source
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <NetworkDiagram />
          </div>
        </div>
      </section>

      {/* ───── For developers ───── */}
      <section className="px-6 py-24 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
            For developers
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
            Three lines to deploy an agent economy
          </h2>
          <p className="mt-3 text-neutral-500 max-w-2xl">
            gossipay is an open-source SDK that extends the Hedera Agent Kit with
            programmable policies. Each agent gets its own wallet, its own rules,
            and its own tools.
          </p>
          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            <CodeBlock
              title="Initialize a wallet"
              lang="typescript"
              code={`const wallet = new GossipayWallet({\n  accountId: process.env.HEDERA_ACCOUNT_ID,\n  privateKey: process.env.HEDERA_PRIVATE_KEY,\n  policies: [{\n    maxPerTransaction: 2,\n    maxPerSession: 10,\n    currency: 'HBAR',\n  }],\n  auditTopicId: process.env.HCS_TOPIC_ID,\n})`}
            />
            <CodeBlock
              title="Attach policies as hooks"
              lang="typescript"
              code={`// Policies run before every tool call\nclass SpendLimitPolicy extends AbstractPolicy {\n  async shouldBlockPostParamsNormalization(\n    params, method\n  ): Promise<boolean> {\n    return amount > this.config.maxPerTransaction\n  }\n}`}
            />
            <CodeBlock
              title="Deploy a LangChain agent"
              lang="typescript"
              code={`const agent = createReactAgent({\n  llm: new ChatOpenAI({ model: 'gpt-4o' }),\n  tools: wallet.getTools(),\n  checkpointSaver: new MemorySaver(),\n})`}
            />
            <CodeBlock
              title="Stream events in real-time"
              lang="typescript"
              code={`for await (const event of streamAgentEvents(sessionId, msg)) {\n  switch (event.event) {\n    case 'token':       // LLM tokens\n    case 'transaction':  // Hedera tx results\n    case 'pending_approval': // Human needed\n  }\n}`}
            />
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
              TypeScript &bull; ESM &bull; Strict
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
              Works with any LLM (OpenAI / Anthropic)
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
              pnpm monorepo &bull; Turborepo
            </span>
          </div>
        </div>
      </section>

      {/* ───── Architecture ───── */}
      <section className="px-6 py-24 border-t border-neutral-100 bg-neutral-50/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
            Architecture
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
            Every agent is a node in your economy
          </h2>
          <p className="mt-3 text-neutral-500 max-w-2xl">
            Agents aren't monolithic. Each one has a distinct role, wallet,
            policy set, and tool belt. They discover, negotiate, and transact
            autonomously — while you control the guardrails.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <ArchCard
              icon="🔍"
              title="Research Agent"
              subtitle="Market intelligence"
              features={[
                'Web search + competitor analysis',
                'Spend limit: 2 HBAR/tx',
                'Allow list: 3 providers',
              ]}
            />
            <ArchCard
              icon="⚡"
              title="Procurement Agent"
              subtitle="Payments & execution"
              features={[
                'HBAR transfers to APIs',
                'Approval threshold: > 5 HBAR',
                'HCS audit logging',
              ]}
            />
            <ArchCard
              icon="📋"
              title="Audit Agent"
              subtitle="Verification & HCS"
              features={[
                'Read-only: no spend allowed',
                'HCS topic reader',
                'Hashscan verification',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ───── Telegram Bot ───── */}
      <section className="px-6 py-24 border-t border-neutral-100 bg-neutral-50/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
            Telegram
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
            Your agents on the go
          </h2>
          <p className="mt-3 text-neutral-500 max-w-2xl">
            gossipay ships with a production-ready Telegram bot. Each chat gets an
            isolated agent session with its own wallet, policies, and conversation
            history — the same stack as the web demo, accessible from your phone.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <div className="border border-neutral-200 bg-white rounded-xl p-6">
              <a
                href="https://t.me/gossipay_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0284c7">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">@gossipay_bot</h3>
                  <p className="text-xs text-neutral-400">Start chatting now</p>
                </div>
              </a>
              <ul className="space-y-2">
                {[
                  'Isolated agent per Telegram chat',
                  'Same policies, wallet & audit trail',
                  '/status, /reset, and free-form messages',
                  'Works with any LLM (OpenAI / Anthropic)',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-neutral-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 shrink-0 mt-0.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-neutral-200 bg-white rounded-xl p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Architecture</h3>
              <pre className="text-[11px] font-mono text-neutral-600 leading-relaxed whitespace-pre">
{`apps/bot/
├── src/
│   ├── index.ts    # Telegraf + polling
│   ├── agent.ts    # Agent per chat_id
│   └── env.ts      # Env validation
└── package.json`}
              </pre>
              <p className="mt-3 text-xs text-neutral-500">
                Reuses <code className="text-neutral-800 bg-neutral-100 px-1 rounded">@gossipay/sdk</code> — same wallet, policies, and hooks as the web demo.
              </p>
            </div>
            <div className="border border-neutral-200 bg-white rounded-xl p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick start</h3>
              <pre className="text-[11px] font-mono text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 overflow-x-auto"><code>TELEGRAM_BOT_TOKEN=xxx pnpm --filter @gossipay/bot dev</code></pre>
              <ul className="mt-3 space-y-2">
                {[
                  'Set TELEGRAM_BOT_TOKEN in .env',
                  'Run with tsx watch (hot reload)',
                  'Built on Telegraf 4',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-neutral-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 shrink-0 mt-0.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Floating Telegram button ───── */}
      <a
        href="https://t.me/gossipay_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label="Chat on Telegram"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on Telegram
        </span>
      </a>

      {/* ───── Enterprise features ───── */}
      <section className="px-6 py-24 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
            Enterprise
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-tight">
            Safety, transparency, control
          </h2>
          <p className="mt-3 text-neutral-500 max-w-2xl">
            gossipay is built for financial operations that demand
            cryptographic guarantees and human oversight.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🛡️"
              title="Three guardrails"
              desc="Spend limits, allow lists, and approval thresholds — enforced at runtime before any transaction reaches Hedera."
            />
            <FeatureCard
              icon="📜"
              title="Immutable audit"
              desc="Every approved transaction is logged on Hedera Consensus Service. Viewable on Hashscan. Tamper-proof."
            />
            <FeatureCard
              icon="👤"
              title="Human-in-the-loop"
              desc="Configurable approval flows. High-value transactions pause and wait for human sign-off before execution."
            />
            <FeatureCard
              icon="⚙️"
              title="Hot-reload policies"
              desc="Update policies without restarting agents. Changes take effect on the next tool call."
            />
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="px-6 py-24 border-t border-neutral-100 bg-neutral-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
            Build your agent economy
          </h2>
          <p className="mt-4 text-neutral-400 text-sm leading-relaxed max-w-lg mx-auto">
            Spin up the demo, configure policies, and watch agents trade on
            Hedera testnet in real-time. Full SDK available on GitHub.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-900 bg-white rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Launch demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/Irwingduran/gossipay-hedera"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-300 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-16 text-xs text-neutral-600">
            gossipay &mdash; Hedera &mdash; 2026.
          </p>
        </div>
      </section>
    </>
  )
}

function CodeBlock({ title, code, lang }: { title: string; code: string; lang: string }) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500">{title}</span>
        <span className="text-[10px] text-neutral-400 font-mono">{lang}</span>
      </div>
      <pre className="p-4 text-xs font-mono text-neutral-700 leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ArchCard({
  icon,
  title,
  subtitle,
  features,
}: {
  icon: string
  title: string
  subtitle: string
  features: string[]
}) {
  return (
    <div className="border border-neutral-200 bg-white rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-lg">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-neutral-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 shrink-0 mt-0.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="border border-neutral-100 rounded-xl p-5">
      <span className="text-lg">{icon}</span>
      <h3 className="mt-3 text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  )
}
