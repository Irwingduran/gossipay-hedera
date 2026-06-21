'use client'

import { useState } from 'react'
import { AgentChat } from '@/components/AgentChat'
import { AgentSwarm } from '@/components/AgentSwarm'
import { PolicyPanel } from '@/components/PolicyPanel'
import { TransactionFeed } from '@/components/TransactionFeed'
import { AuditTrail } from '@/components/AuditTrail'
import { ApprovalModal } from '@/components/ApprovalModal'
import { WelcomeDashboard } from '@/components/WelcomeDashboard'
import { useHashConnect } from '@/lib/hooks/useHashConnect'
import { useSession } from '@/lib/store'
import { useAgentStream } from '@/lib/hooks/useAgentStream'

type RightTab = 'chat' | 'activity'
type SideTab = 'policies' | 'audit'

type Capability = {
  title: string
  description: string
  icon: React.ReactNode
}

const capabilities: Capability[] = [
  {
    title: 'Agent payments',
    description: 'Pay any Hedera account using natural language. Just tell the agent what to send and it executes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    ),
  },
  {
    title: 'Smart policies',
    description: 'Define rules that govern how transactions happen. Set limits, approvals, and automated conditions.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Audit trail',
    description: 'Every agent action is recorded with full transparency. Review exactly what happened and when.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Multi-agent swarms',
    description: 'Coordinate complex payment flows across multiple agents working together in real time.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="5" r="2" />
        <circle cx="5" cy="5" r="2" />
        <circle cx="19" cy="19" r="2" />
        <circle cx="5" cy="19" r="2" />
        <line x1="12" y1="9" x2="12" y2="5" />
        <line x1="10" y1="12" x2="6" y2="10" />
        <line x1="14" y1="12" x2="18" y2="10" />
        <line x1="14" y1="12" x2="18" y2="14" />
        <line x1="10" y1="12" x2="6" y2="14" />
        <line x1="12" y1="15" x2="12" y2="19" />
      </svg>
    ),
  },
]

function WalletModal({ onClose }: { onClose: () => void }) {
  const { connect, inputRef, installed } = useHashConnect()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white sm:rounded-2xl rounded-t-2xl shadow-xl w-full sm:max-w-sm sm:mx-4 p-6 pb-8 sm:pb-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="font-serif text-xl text-neutral-900 mb-1">Connect your wallet</h2>
        <p className="text-sm text-neutral-400 mb-5">
          Enter your Hedera account ID to start using the platform.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="0.0.xxxxx"
            className="flex-1 text-sm text-neutral-700 border border-neutral-200 rounded-lg px-4 py-2.5 outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                connect()
                onClose()
              }
            }}
          />
          <button
            onClick={() => {
              connect()
              onClose()
            }}
            className="text-sm font-medium text-white bg-neutral-900 rounded-lg px-5 py-2.5 hover:bg-neutral-800 transition-colors shrink-0"
          >
            Connect
          </button>
        </div>

        <a
          href="https://www.hashpack.app/download"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Don&apos;t have HashPack? Install it →
        </a>

        {installed && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <span className="text-xs text-indigo-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              HashPack extension detected
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function WalletBadge({ accountId, onClick }: { accountId: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-full px-3 py-1 hover:bg-green-100 transition-colors"
    >
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      {accountId.slice(0, 12)}…
    </button>
  )
}

export default function DemoPage() {
  const [rightTab, setRightTab] = useState<RightTab>('chat')
  const [sideTab, setSideTab] = useState<SideTab>('policies')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const { state, dispatch } = useSession()
  const { accountId } = useHashConnect()
  const { sendMessage } = useAgentStream()

  return (
    <div className="h-dvh flex flex-col bg-white">
      <header className="shrink-0 border-b border-neutral-100 px-3 md:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {accountId && (
            <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden text-neutral-400 hover:text-neutral-600 transition-colors shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <a href="/">
          <h1 className="font-serif text-lg tracking-tight text-neutral-900">
            gossipay
          </h1>
          </a>
          <span className="hidden md:inline text-[10px] text-neutral-300 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5">
            mission control
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {accountId ? (
            <WalletBadge
              accountId={accountId}
              onClick={() => dispatch({ type: 'SET_WALLET', payload: null })}
            />
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="text-[11px] font-medium text-white bg-neutral-900 rounded-full px-3 py-1.5 hover:bg-neutral-800 transition-colors"
            >
              Connect wallet
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Hedera testnet
          </span>
          <a
            href="/"
            className="hidden sm:inline text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Home
          </a>
        </div>
      </header>

      {!accountId ? (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mb-4 leading-tight">
                Multi-agent payment orchestration on Hedera
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
                Gossipay is an agentic payment infrastructure. Deploy autonomous agents that
                execute, audit, and coordinate transactions on the Hedera network — all through
                natural language.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-5 text-center">
                What you can do
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((c) => (
                  <div
                    key={c.title}
                    className="border border-neutral-100 rounded-xl p-5 hover:border-neutral-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 mb-3">
                      {c.icon}
                    </div>
                    <h4 className="text-sm font-medium text-neutral-900 mb-1.5">{c.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowWalletModal(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-neutral-900 rounded-lg px-6 py-3 hover:bg-neutral-800 transition-colors"
              >
                Get started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar overlay backdrop */}
          {showSidebar && (
            <div className="md:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setShowSidebar(false)} />
          )}

          {/* Sidebar */}
          <aside className={`absolute md:relative z-40 md:z-auto inset-y-0 left-0 w-80 md:w-96 border-r border-neutral-100 bg-white flex flex-col overflow-hidden shrink-0 transition-transform md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex items-center justify-between px-4 md:px-5 pt-4 pb-3 border-b border-neutral-100">
              <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Agent network
              </h2>
              <button onClick={() => setShowSidebar(false)} className="md:hidden text-neutral-400 hover:text-neutral-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-4 md:px-5 pb-4 border-b border-neutral-100">
              <AgentSwarm />
            </div>
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
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            {state.messages.length === 0 ? (
              <WelcomeDashboard onSend={sendMessage} />
            ) : (
              <>
                <div className="flex border-b border-neutral-100 shrink-0">
                  <button
                    onClick={() => setRightTab('chat')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs font-medium transition-colors ${
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
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs font-medium transition-colors ${
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
              </>
            )}
          </main>
        </div>
      )}

      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
      <ApprovalModal />
    </div>
  )
}
