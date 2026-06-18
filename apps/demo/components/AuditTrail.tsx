'use client'

import { useSession } from '@/lib/store'

export function AuditTrail() {
  const { state } = useSession()
  const txCount = state.transactions.length
  const approvedCount = state.transactions.filter((t) => t.status === 'approved').length
  const blockedCount = state.transactions.filter((t) => t.status === 'blocked').length
  const pendingCount = state.transactions.filter((t) => t.status === 'pending_approval').length

  return (
    <div className="px-5 py-4 border-b border-neutral-100">
      <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
        HCS Audit trail
      </h2>
      <div className="border border-neutral-100 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-neutral-100">
          <Stat value={txCount} label="Total" />
          <Stat value={approvedCount} label="Approved" valueClass="text-green-600" />
          <Stat value={blockedCount} label="Blocked" valueClass="text-red-600" />
          <Stat value={pendingCount} label="Pending" valueClass="text-amber-600" />
        </div>
        {txCount > 0 && (
          <a
            href={`https://hashscan.io/testnet/topic/${process.env.NEXT_PUBLIC_HCS_TOPIC_ID ?? ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-neutral-100 text-[10px] text-neutral-400 hover:text-neutral-600 px-3 py-2 transition-colors text-center"
          >
            View immutable log on Hashscan →
          </a>
        )}
      </div>
    </div>
  )
}

function Stat({
  value,
  label,
  valueClass = 'text-neutral-800',
}: {
  value: number
  label: string
  valueClass?: string
}) {
  return (
    <div className="text-center py-3">
      <p className={`text-sm font-semibold ${valueClass}`}>{value}</p>
      <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
    </div>
  )
}
