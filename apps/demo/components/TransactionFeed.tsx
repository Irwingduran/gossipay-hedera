'use client'

import { useSession } from '@/lib/store'
import { TransactionCard } from './TransactionCard'

export function TransactionFeed() {
  const { state } = useSession()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Activity log
        </h2>
        {state.transactions.length > 0 && (
          <span className="text-[10px] text-neutral-300">
            {state.transactions.length} tx(s)
          </span>
        )}
      </div>
      {state.transactions.length === 0 ? (
        <div className="border border-dashed border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-xs text-neutral-300">
            No transactions yet. Ask the agent to do something.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {[...state.transactions].reverse().map((tx, i) => (
            <TransactionCard key={tx.txHash ?? i} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  )
}
