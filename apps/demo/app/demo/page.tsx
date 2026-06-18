'use client'

import { AgentChat } from '@/components/AgentChat'
import { AgentSwarm } from '@/components/AgentSwarm'
import { PolicyPanel } from '@/components/PolicyPanel'
import { TransactionFeed } from '@/components/TransactionFeed'
import { AuditTrail } from '@/components/AuditTrail'
import { ApprovalModal } from '@/components/ApprovalModal'

export default function DemoPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <header className="shrink-0 border-b border-neutral-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-lg tracking-tight text-neutral-900">
            gossipay
          </h1>
          <span className="text-[10px] text-neutral-300 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5">
            mission control
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Hedera testnet
          </span>
          <a
            href="/"
            className="text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Home
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <aside className="w-96 border-r border-neutral-100 flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto">
            {/* Agent swarm */}
            <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Agent network
                </h2>
              </div>
              <AgentSwarm />
            </div>
            <PolicyPanel />
            <AuditTrail />
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <AgentChat />
          </div>

          {/* Transaction feed inline at bottom */}
          <div className="shrink-0 border-t border-neutral-100 px-6 py-4 max-h-64 overflow-y-auto">
            <TransactionFeed />
          </div>
        </main>
      </div>

      <ApprovalModal />
    </div>
  )
}
