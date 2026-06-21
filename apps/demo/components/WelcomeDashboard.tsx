'use client'

import { useState } from 'react'
import { useSession } from '@/lib/store'
import { useAgentStream } from '@/lib/hooks/useAgentStream'

interface Playbook {
  icon: string
  title: string
  description: string
  suggestions: { label: string; prompt: string }[]
}

const playbooks: Playbook[] = [
  {
    icon: '💸',
    title: 'Payments',
    description: 'Send HBAR to any account using natural language.',
    suggestions: [
      { label: 'Pay 5 HBAR — monthly subscription', prompt: 'Pay 5 HBAR to 0.0.456789 for monthly premium access' },
      { label: 'Send 2 HBAR — API credits', prompt: 'Send 2 HBAR to 0.0.789012 for API credits' },
    ],
  },
  {
    icon: '🔍',
    title: 'Research & data',
    description: 'Ask agents to fetch market data and pay for API access.',
    suggestions: [
      { label: 'Market research + payment', prompt: 'Research the LatAm SaaS market and buy a report for 1.5 HBAR' },
      { label: 'BTC price from provider', prompt: 'Pay 0.5 HBAR to api.coincap.io for BTC price data' },
    ],
  },
  {
    icon: '📜',
    title: 'Audit & history',
    description: 'Review every transaction with the full audit trail.',
    suggestions: [
      { label: 'View all transactions', prompt: 'Show me all transactions from this session' },
      { label: 'HCS audit log', prompt: 'Show the full audit trail of all HCS transactions' },
    ],
  },
  {
    icon: '⚙️',
    title: 'Policies',
    description: 'Check and configure the guardrails for your agents.',
    suggestions: [
      { label: 'Check active policies', prompt: 'What policies are currently active?' },
      { label: 'Update spend limit', prompt: 'Set max per transaction to 5 HBAR' },
    ],
  },
]

export function WelcomeDashboard({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState('')
  const { state } = useSession()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">👋</span>
              <div className="min-w-0">
                <h2 className="font-serif text-xl sm:text-2xl text-neutral-900">Your agents are ready</h2>
                <p className="text-sm text-neutral-400 mt-0.5 truncate">
                  Connected as <span className="font-mono text-neutral-600">{state.walletAccountId}</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">
              Tell your agents what to do in plain language. Every transaction passes through
              your configured policies before reaching Hedera.
            </p>
          </div>

          {/* Playbooks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {playbooks.map((pb) => (
              <div
                key={pb.title}
                className="border border-neutral-100 rounded-xl p-5 hover:border-neutral-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{pb.icon}</span>
                  <h3 className="text-sm font-medium text-neutral-900">{pb.title}</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">{pb.description}</p>
                <div className="flex flex-col gap-1.5">
                  {pb.suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => onSend(s.prompt)}
                      className="text-left text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 hover:bg-neutral-100 hover:text-neutral-700 hover:border-neutral-200 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-neutral-100 px-4 sm:px-8 md:px-10 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your agents…"
            className="flex-1 text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
