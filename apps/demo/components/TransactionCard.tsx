'use client'

import type { TransactionRecord } from '@gossipay/sdk'

const statusConfig: Record<string, { label: string; dot: string; bg: string; border: string; text: string }> = {
  approved: {
    label: 'Approved',
    dot: 'bg-green-500',
    bg: 'bg-green-50/30',
    border: 'border-green-100',
    text: 'text-green-700',
  },
  blocked: {
    label: 'Blocked',
    dot: 'bg-red-500',
    bg: 'bg-red-50/30',
    border: 'border-red-100',
    text: 'text-red-700',
  },
  pending_approval: {
    label: 'Pending',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50/30',
    border: 'border-amber-100',
    text: 'text-amber-700',
  },
}

export function TransactionCard({ transaction }: { transaction: TransactionRecord }) {
  const cfg = statusConfig[transaction.status] ?? statusConfig.blocked

  return (
    <div className={`border ${cfg.border} ${cfg.bg} rounded-lg px-3 py-2.5`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-neutral-900 text-sm">
                {transaction.amount} HBAR
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 shrink-0">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
              <span className="text-xs text-neutral-500 truncate">{transaction.provider}</span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
              {transaction.toolName}
              {transaction.txHash && (
                <> · <span className="text-neutral-300">{transaction.txHash.slice(0, 10)}…</span></>
              )}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${cfg.bg} ${cfg.border} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
      {transaction.policyResults.length > 0 && (
        <div className="mt-1.5 flex gap-1.5">
          {transaction.policyResults.map((pr, i) => (
            <span
              key={i}
              className={`text-[9px] font-medium px-1 py-0.5 rounded ${
                pr.allowed
                  ? 'text-green-600 bg-green-50 border border-green-100'
                  : 'text-red-600 bg-red-50 border border-red-100'
              }`}
            >
              {pr.policyName}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
