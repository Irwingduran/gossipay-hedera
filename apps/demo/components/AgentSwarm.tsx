'use client'

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

const stateLabels: Record<AgentState, string> = {
  active: 'Active',
  idle: 'Idle',
  monitoring: 'Monitoring',
}

const palette: Record<string, { bg: string; border: string; dot: string; badge: string; badgeText: string }> = {
  blue: {
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 border-blue-100',
    badgeText: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50/50',
    border: 'border-green-100',
    dot: 'bg-green-500',
    badge: 'bg-green-50 border-green-100',
    badgeText: 'text-green-700',
  },
  purple: {
    bg: 'bg-purple-50/50',
    border: 'border-purple-100',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 border-purple-100',
    badgeText: 'text-purple-700',
  },
}

export function AgentSwarm() {
  const { state } = useSession()
  const txCount = state.transactions.length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {agents.map((agent) => {
        const agentState = agent.getState(txCount, state.isStreaming)
        const action = agent.getAction(txCount, state.isStreaming)
        const p = palette[agent.color]

        return (
          <div
            key={agent.name}
            className={`border ${p.border} ${p.bg} rounded-xl p-4 transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{agent.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">
                    {agent.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${stateColors[agentState]}`} />
                <span className="text-[10px] font-medium text-neutral-400">
                  {stateLabels[agentState]}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 font-mono">{action}</p>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {agent.tools.map((t) => (
                <span
                  key={t}
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${p.badge} ${p.badgeText}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
