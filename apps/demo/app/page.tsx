import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-serif text-5xl sm:text-6xl tracking-tight text-neutral-900">
          gossipay
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-500 leading-relaxed">
          The programmable economic layer for autonomous AI agents.
          <br />
          Built on{' '}
          <span className="text-neutral-800">Hedera</span>.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Launch demo
          </Link>
          <a
            href="https://github.com/Irwingduran/gossipay-hedera"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-neutral-800 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="border border-neutral-100 rounded-lg p-5">
            <h3 className="font-serif text-lg text-neutral-900">Policy engine</h3>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Configurable guardrails — spend limits, allow lists, and human
              approval thresholds.
            </p>
          </div>
          <div className="border border-neutral-100 rounded-lg p-5">
            <h3 className="font-serif text-lg text-neutral-900">HCS audit trail</h3>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Every transaction logged immutably on Hedera Consensus Service.
              Verifiable on Hashscan.
            </p>
          </div>
          <div className="border border-neutral-100 rounded-lg p-5">
            <h3 className="font-serif text-lg text-neutral-900">Agent-native</h3>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Built for autonomous agents. LangChain tools, streaming, and
              real-time policy enforcement.
            </p>
          </div>
        </div>

        <p className="mt-16 text-xs text-neutral-400">
          gossipay — Hedera AI Studio Challenge 2026
        </p>
      </div>
    </main>
  )
}
