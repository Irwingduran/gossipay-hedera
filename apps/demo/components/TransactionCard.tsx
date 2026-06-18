'use client'

import type { TransactionRecord } from '@gossipay/sdk'

const statusColors: Record<string, string> = {
  approved: 'text-green-600 bg-green-50 border-green-100',
  blocked: 'text-red-600 bg-red-50 border-red-100',
  pending_approval: 'text-amber-600 bg-amber-50 border-amber-100',
}

export function TransactionCard({ transaction }: { transaction: TransactionRecord }) {
  const colorClass = statusColors[transaction.status] ?? 'text-neutral-600 bg-neutral-50 border-neutral-100'

  return (
    <div className="border border-neutral-100 rounded-lg px-4 py-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-neutral-900">
          {transaction.amount} HBAR
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
          {transaction.status.replace('_', ' ')}
        </span>
      </div>
      <div className="mt-1 text-xs text-neutral-400 space-y-0.5">
        <p>Provider: {transaction.provider}</p>
        <p>Tool: {transaction.toolName}</p>
        {transaction.txHash && (
          <p className="font-mono text-[10px] text-neutral-300 truncate">
            Tx: {transaction.txHash}
          </p>
        )}
      </div>
      {transaction.policyResults.length > 0 && (
        <div className="mt-2 pt-2 border-t border-neutral-50 flex gap-2">
          {transaction.policyResults.map((pr, i) => (
            <span
              key={i}
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                pr.allowed
                  ? 'text-green-500 bg-green-50'
                  : 'text-red-500 bg-red-50'
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
