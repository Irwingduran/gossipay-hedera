'use client'

import { AgentChat } from '@/components/AgentChat'
import { PolicyPanel } from '@/components/PolicyPanel'
import { TransactionFeed } from '@/components/TransactionFeed'
import { AuditTrail } from '@/components/AuditTrail'
import { ApprovalModal } from '@/components/ApprovalModal'

export default function DemoPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-80 border-r border-neutral-100 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h1 className="font-serif text-xl tracking-tight">gossipay</h1>
          <p className="text-xs text-neutral-400 mt-0.5">demo</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <PolicyPanel />
          <TransactionFeed />
          <AuditTrail />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <AgentChat />
      </main>

      <ApprovalModal />
    </div>
  )
}
