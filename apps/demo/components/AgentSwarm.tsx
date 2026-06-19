'use client'

import { useState } from 'react'
import { useSession } from '@/lib/store'

type AgentState = 'active' | 'idle' | 'monitoring'

interface Agent {
  name: string
  role: string
  icon: string
  color: string
  tools: string[]
  getState: (txCount: number, isStreaming: boolean) => AgentState
  getAction: (txCount: number, isStreaming: boolean) => string
}

const agents: Agent[] = [
  {
    name: 'Research',
    role: 'Market intelligence',
    icon: '🔍',
    color: 'blue',
    tools: ['Web search', 'Competitor intel', 'Market data'],
    getState: (txCount, isStreaming) =>
      isStreaming ? 'active' : txCount > 0 ? 'monitoring' : 'idle',
    getAction: (txCount, isStreaming) =>
      isStreaming ? 'Analyzing markets…' : 'Standing by',
  },
  {
    name: 'Procurement',
    role: 'Payments & execution',
    icon: '⚡',
    color: 'green',
    tools: ['HBAR transfer', 'HCS logging', 'Balance check'],
    getState: (txCount, isStreaming) =>
      txCount > 0 ? 'active' : 'idle',
    getAction: (txCount, isStreaming) =>
      txCount > 0 ? `${txCount} tx(s) executed` : 'Waiting for orders',
  },
  {
    name: 'Audit',
    role: 'Verification & HCS',
    icon: '📋',
    color: 'purple',
    tools: ['HCS topic reader', 'Hashscan lookup'],
    getState: (txCount) =>
      txCount > 0 ? 'monitoring' : 'idle',
    getAction: (txCount) =>
      txCount > 0 ? `${txCount} tx(s) logged on HCS` : 'No activity',
  },
]

const stateColors: Record<AgentState, string> = {
  active: 'bg-green-500',
  idle: 'bg-neutral-300',
  monitoring: 'bg-blue-500',
}

const palette: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
  blue: { border: 'border-blue-100', bg: 'bg-blue-50/50', badge: 'bg-blue-50 border-blue-100', badgeText: 'text-blue-700' },
  green: { border: 'border-green-100', bg: 'bg-green-50/50', badge: 'bg-green-50 border-green-100', badgeText: 'text-green-700' },
  purple: { border: 'border-purple-100', bg: 'bg-purple-50/50', badge: 'bg-purple-50 border-purple-100', badgeText: 'text-purple-700' },
}

export function AgentSwarm() {
  const { state } = useSession()
  const [expanded, setExpanded] = useState<string | null>(null)
  const txCount = state.transactions.length

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        {agents.map((agent) => {
          const agentState = agent.getState(txCount, state.isStreaming)
          const p = palette[agent.color]
          const isOpen = expanded === agent.name

          return (
            <button
              key={agent.name}
              onClick={() => setExpanded(isOpen ? null : agent.name)}
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                isOpen
                  ? `${p.border} ${p.bg} ring-1 ring-inset ring-neutral-200`
                  : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <span className="text-base">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-neutral-800 truncate">
                    {agent.name}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stateColors[agentState]}`} />
                </div>
                <p className="text-[10px] text-neutral-400 truncate">
                  {agent.getAction(txCount, state.isStreaming)}
                </p>
              </div>
              <svg
                className={`w-3 h-3 text-neutral-300 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )
        })}
      </div>

      {expanded && (
        <div className="border border-neutral-100 rounded-lg p-3 text-xs text-neutral-500 space-y-2">
          {agents
            .filter((a) => a.name === expanded)
            .map((agent) => (
              <div key={agent.name}>
                <p className="text-neutral-800 font-medium mb-1">{agent.role}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${palette[agent.color].badge} ${palette[agent.color].badgeText}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-neutral-400">{agent.getAction(txCount, state.isStreaming)}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
