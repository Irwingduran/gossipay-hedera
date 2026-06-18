'use client'

import { useSession } from '@/lib/store'

export function AuditTrail() {
  const { state } = useSession()
  const txCount = state.transactions.length
  const approvedCount = state.transactions.filter((t) => t.status === 'approved').length
  const blockedCount = state.transactions.filter((t) => t.status === 'blocked').length

  return (
    <div className="px-5 py-4 border-b border-neutral-100">
      <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
        Audit trail
      </h2>
      <div className="border border-neutral-100 rounded-lg p-3 text-xs text-neutral-500 space-y-1.5">
        <div className="flex justify-between">
          <span>Total transactions</span>
          <span className="font-medium text-neutral-800">{txCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Approved</span>
          <span className="font-medium text-green-600">{approvedCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Blocked</span>
          <span className="font-medium text-red-600">{blockedCount}</span>
        </div>
        {txCount > 0 && (
          <a
            href={`https://hashscan.io/testnet/topic/${process.env.NEXT_PUBLIC_HCS_TOPIC_ID ?? ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 pt-2 border-t border-neutral-50 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            View on Hashscan →
          </a>
        )}
      </div>
    </div>
  )
}
