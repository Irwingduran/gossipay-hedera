'use client'

import { useState } from 'react'
import { AgentChat } from '@/components/AgentChat'
import { AgentSwarm } from '@/components/AgentSwarm'
import { PolicyPanel } from '@/components/PolicyPanel'
import { TransactionFeed } from '@/components/TransactionFeed'
import { AuditTrail } from '@/components/AuditTrail'
import { ApprovalModal } from '@/components/ApprovalModal'

type RightTab = 'chat' | 'activity'
type SideTab = 'policies' | 'audit'

export default function DemoPage() {
  const [rightTab, setRightTab] = useState<RightTab>('chat')
  const [sideTab, setSideTab] = useState<SideTab>('policies')

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
          {/* Agent swarm — always visible */}
          <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Agent network
              </h2>
            </div>
            <AgentSwarm />
          </div>

          {/* Side tabs: Policies / Audit */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex border-b border-neutral-100 shrink-0">
              <button
                onClick={() => setSideTab('policies')}
                className={`flex-1 text-xs font-medium py-2.5 transition-colors ${
                  sideTab === 'policies'
                    ? 'text-neutral-900 border-b-2 border-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Policies
              </button>
              <button
                onClick={() => setSideTab('audit')}
                className={`flex-1 text-xs font-medium py-2.5 transition-colors ${
                  sideTab === 'audit'
                    ? 'text-neutral-900 border-b-2 border-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Audit trail
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sideTab === 'policies' ? <PolicyPanel /> : <AuditTrail />}
            </div>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab toggle */}
          <div className="flex border-b border-neutral-100 shrink-0">
            <button
              onClick={() => setRightTab('chat')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-medium transition-colors ${
                rightTab === 'chat'
                  ? 'text-neutral-900 border-b-2 border-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat
            </button>
            <button
              onClick={() => setRightTab('activity')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-medium transition-colors ${
                rightTab === 'activity'
                  ? 'text-neutral-900 border-b-2 border-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Activity
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === 'chat' ? <AgentChat /> : <TransactionFeed />}
          </div>
        </main>
      </div>

      <ApprovalModal />
    </div>
  )
}
