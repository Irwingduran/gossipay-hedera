'use client'

import { useCallback, useRef, useState } from 'react'
import { useSession } from '@/lib/store'
import type { SpendLimitConfig, AllowListConfig, RequireApprovalConfig, PolicyConfig } from '@gossipay/sdk'

function isSpendLimit(c: PolicyConfig): c is SpendLimitConfig {
  return 'maxPerTransaction' in c
}

function isAllowList(c: PolicyConfig): c is AllowListConfig {
  return 'providers' in c
}

function isRequireApproval(c: PolicyConfig): c is RequireApprovalConfig {
  return 'aboveAmount' in c
}

function useDebounceSync() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sync = useCallback((sessionId: string, policies: PolicyConfig[]) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        await fetch('/api/policies', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, policies }),
        })
      } catch {
        // silently fail — policies still work locally
      }
    }, 600)
  }, [])

  return sync
}

const sections = ['spend', 'allowlist', 'approval'] as const
type SectionId = (typeof sections)[number]

export function PolicyPanel() {
  const { state, dispatch } = useSession()
  const syncPolicies = useDebounceSync()
  const [open, setOpen] = useState<Set<SectionId>>(new Set(['spend', 'allowlist', 'approval']))
  const toggle = (id: SectionId) => {
    const next = new Set(open)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setOpen(next)
  }

  const spendCfg = state.policies.find(isSpendLimit)
  const allowCfg = state.policies.find(isAllowList)
  const approvalCfg = state.policies.find(isRequireApproval)

  const updatePolicy = (index: number, updated: PolicyConfig) => {
    const next = [...state.policies]
    next[index] = updated
    dispatch({ type: 'SET_POLICIES', payload: next })
    syncPolicies(state.sessionId, next)
  }

  const spent = state.transactions
    .filter((t) => t.status === 'approved')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="px-5 py-4">
      <div className="flex items-start gap-2 mb-3">
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Policies
        </h2>
        <div className="group relative">
          <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 text-neutral-500 text-[9px] font-bold flex items-center justify-center cursor-help">?</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-neutral-900 text-white text-[10px] leading-relaxed rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
            Policies run as guardrails before every transaction. If a policy blocks a payment, the agent reports the reason instead of executing.
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {/* Spend Limit */}
        {spendCfg && (
          <Section
            id="spend"
            label="Spend limit"
            summary={`${spendCfg.maxPerTransaction} HBAR/tx · ${spendCfg.maxPerSession} HBAR/session`}
            open={open}
            onToggle={toggle}
          >
            <p className="text-[10px] text-neutral-400 leading-relaxed mb-2.5">
              Blocks any transaction that exceeds these caps. Agents cannot spend more than the per-tx or per-session limit.
            </p>
            <div className="space-y-2.5">
              <div className="flex gap-2">
                <Field label="Per tx">
                  <input
                    type="number"
                    value={spendCfg.maxPerTransaction}
                    onChange={(e) =>
                      updatePolicy(
                        state.policies.indexOf(spendCfg),
                        { ...spendCfg, maxPerTransaction: Number(e.target.value) }
                      )
                    }
                    className="w-full text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400 transition-colors"
                  />
                </Field>
                <Field label="Per session">
                  <input
                    type="number"
                    value={spendCfg.maxPerSession}
                    onChange={(e) =>
                      updatePolicy(
                        state.policies.indexOf(spendCfg),
                        { ...spendCfg, maxPerSession: Number(e.target.value) }
                      )
                    }
                    className="w-full text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400 transition-colors"
                  />
                </Field>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                  <span>Spent this session</span>
                  <span>{spent} / {spendCfg.maxPerSession} HBAR</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-800 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (spent / spendCfg.maxPerSession) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Allow List */}
        {allowCfg && (
          <Section
            id="allowlist"
            label="Allow list"
            summary={`${allowCfg.providers.length} provider(s) allowed`}
            open={open}
            onToggle={toggle}
          >
            <p className="text-[10px] text-neutral-400 leading-relaxed mb-2.5">
              Only allows transactions to approved recipients. Any address or domain not in this list will be blocked.
            </p>
            <div>
              <input
                type="text"
                value={allowCfg.providers.join(', ')}
                onChange={(e) =>
                  updatePolicy(
                    state.policies.indexOf(allowCfg),
                    {
                      ...allowCfg,
                      providers: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }
                  )
                }
                className="w-full text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400 transition-colors font-mono"
              />
              <p className="mt-1 text-[10px] text-neutral-400">
                Comma-separated provider domains or account IDs
              </p>
            </div>
          </Section>
        )}

        {/* Approval Threshold */}
        {approvalCfg && (
          <Section
            id="approval"
            label="Approval threshold"
            summary={`> ${approvalCfg.aboveAmount} HBAR · ${approvalCfg.timeoutSeconds}s timeout`}
            open={open}
            onToggle={toggle}
          >
            <p className="text-[10px] text-neutral-400 leading-relaxed mb-2.5">
              When a transaction exceeds this amount, it pauses and asks for your explicit approval before executing. The request expires after the timeout.
            </p>
            <div className="flex gap-2">
              <Field label="Above (HBAR)">
                <input
                  type="number"
                  value={approvalCfg.aboveAmount}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(approvalCfg),
                      { ...approvalCfg, aboveAmount: Number(e.target.value) }
                    )
                  }
                  className="w-full text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400 transition-colors"
                />
              </Field>
              <Field label="Timeout (s)">
                <input
                  type="number"
                  value={approvalCfg.timeoutSeconds}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(approvalCfg),
                      { ...approvalCfg, timeoutSeconds: Number(e.target.value) }
                    )
                  }
                  className="w-full text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400 transition-colors"
                />
              </Field>
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({
  id,
  label,
  summary,
  open,
  onToggle,
  children,
}: {
  id: SectionId
  label: string
  summary: string
  open: Set<SectionId>
  onToggle: (id: SectionId) => void
  children: React.ReactNode
}) {
  const isOpen = open.has(id)
  return (
    <div className="border border-neutral-100 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-50 transition-colors text-left"
      >
        <div>
          <span className="text-xs font-medium text-neutral-700">{label}</span>
          {!isOpen && (
            <span className="ml-2 text-[10px] text-neutral-400">{summary}</span>
          )}
        </div>
        <svg
          className={`w-3 h-3 text-neutral-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <span className="text-[10px] text-neutral-400">{label}</span>
      {children}
    </div>
  )
}
