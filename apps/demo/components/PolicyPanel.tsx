'use client'

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

export function PolicyPanel() {
  const { state, dispatch } = useSession()

  const spendCfg = state.policies.find(isSpendLimit)
  const allowCfg = state.policies.find(isAllowList)
  const approvalCfg = state.policies.find(isRequireApproval)

  const updatePolicy = (index: number, updated: PolicyConfig) => {
    const next = [...state.policies]
    next[index] = updated
    dispatch({ type: 'SET_POLICIES', payload: next })
  }

  return (
    <div className="px-5 py-4 border-b border-neutral-100">
      <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
        Policies
      </h2>
      <div className="space-y-3">
        {spendCfg && (
          <div className="border border-neutral-100 rounded-lg p-3">
            <label className="text-xs font-medium text-neutral-700">Spend limit</label>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-[10px] text-neutral-400">Per tx</span>
                <input
                  type="number"
                  value={spendCfg.maxPerTransaction}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(spendCfg),
                      { ...spendCfg, maxPerTransaction: Number(e.target.value) }
                    )
                  }
                  className="mt-0.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400">Per session</span>
                <input
                  type="number"
                  value={spendCfg.maxPerSession}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(spendCfg),
                      { ...spendCfg, maxPerSession: Number(e.target.value) }
                    )
                  }
                  className="mt-0.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>Spent</span>
                <span>{state.transactions
                  .filter((t) => t.status === 'approved')
                  .reduce((s, t) => s + t.amount, 0)} / {spendCfg.maxPerSession} HBAR</span>
              </div>
              <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-800 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (state.transactions
                        .filter((t) => t.status === 'approved')
                        .reduce((s, t) => s + t.amount, 0) /
                        spendCfg.maxPerSession) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {allowCfg && (
          <div className="border border-neutral-100 rounded-lg p-3">
            <label className="text-xs font-medium text-neutral-700">Allow list</label>
            <div className="mt-2">
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
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400"
              />
              <p className="mt-1 text-[10px] text-neutral-400">
                Comma-separated provider domains
              </p>
            </div>
          </div>
        )}

        {approvalCfg && (
          <div className="border border-neutral-100 rounded-lg p-3">
            <label className="text-xs font-medium text-neutral-700">
              Approval threshold
            </label>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-[10px] text-neutral-400">Above (HBAR)</span>
                <input
                  type="number"
                  value={approvalCfg.aboveAmount}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(approvalCfg),
                      { ...approvalCfg, aboveAmount: Number(e.target.value) }
                    )
                  }
                  className="mt-0.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400">Timeout (s)</span>
                <input
                  type="number"
                  value={approvalCfg.timeoutSeconds}
                  onChange={(e) =>
                    updatePolicy(
                      state.policies.indexOf(approvalCfg),
                      { ...approvalCfg, timeoutSeconds: Number(e.target.value) }
                    )
                  }
                  className="mt-0.5 w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
