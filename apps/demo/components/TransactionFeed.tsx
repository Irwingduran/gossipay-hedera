'use client'

import { useSession } from '@/lib/store'
import { TransactionCard } from './TransactionCard'

export function TransactionFeed() {
  const { state } = useSession()

  return (
    <div className="px-5 py-4 border-b border-neutral-100">
      <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
        Transaction feed
      </h2>
      {state.transactions.length === 0 ? (
        <p className="text-xs text-neutral-300">No transactions yet</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...state.transactions].reverse().map((tx, i) => (
            <TransactionCard key={i} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  )
}
