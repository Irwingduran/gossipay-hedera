'use client'

import { useSession } from '@/lib/store'
import { TransactionCard } from './TransactionCard'

export function TransactionFeed() {
  const { state } = useSession()

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 px-6 py-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Activity log
          </h2>
          {state.transactions.length > 0 && (
            <span className="text-[10px] text-neutral-300">
              {state.transactions.length} tx(s)
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {state.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <p className="text-sm text-neutral-400">No transactions yet</p>
            <p className="text-xs text-neutral-300 mt-1">
              Ask the agent to do something — activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...state.transactions].reverse().map((tx, i) => (
              <TransactionCard key={tx.txHash ?? i} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
