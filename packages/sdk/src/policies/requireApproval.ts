import { AbstractPolicy } from '@hashgraph/hedera-agent-kit'
import type { RequireApprovalConfig } from '../types'
import {
  getPendingApproval,
  addPendingApproval,
  resolveApproval,
} from '../sessionStore'
import crypto from 'node:crypto'

export class RequireApprovalPolicy extends AbstractPolicy {
  name = 'Require Approval'
  description = 'Requires human approval for transactions above a threshold'

  relevantTools = [
    'transfer_hbar',
    'transfer_hbar_with_allowance',
    'transfer_fungible_token',
    'transfer_fungible_token_with_allowance',
  ]

  constructor(private config: RequireApprovalConfig) {
    super()
  }

  updateConfig(config: RequireApprovalConfig): void {
    this.config = config
  }

  async shouldBlockPostParamsNormalization(
    params: any,
    method: string
  ): Promise<boolean> {
    const amount = this.extractAmount(params)
    if (!amount || amount <= 0) return false

    if (amount <= this.config.aboveAmount) return false

    const recipient = this.extractRecipient(params) ?? 'unknown'
    const approvalId = this.buildApprovalId(amount, recipient, method)

    const existing = getPendingApproval(approvalId)
    if (!existing) {
      addPendingApproval({
        id: approvalId,
        amount,
        provider: recipient,
        toolName: method,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.config.timeoutSeconds * 1000,
        status: 'pending',
      })
      return true
    }

    if (existing.status === 'approved') {
      return false
    }

    if (existing.status === 'rejected') {
      return true
    }

    if (existing.status === 'expired') {
      return true
    }

    if (Date.now() > existing.expiresAt) {
      resolveApproval(approvalId, 'expired')
      return true
    }

    return true
  }

  private buildApprovalId(
    amount: number,
    recipient: string,
    method: string
  ): string {
    const data = `${amount}:${recipient}:${method}:${Date.now()}`
    return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16)
  }

  private extractAmount(params: any): number | null {
    const normalized = params?.normalisedParams ?? params?.rawParams
    if (!normalized) return null
    if ('amount' in normalized) {
      const raw = Number(normalized.amount)
      if (isNaN(raw)) return null
      const s = normalized.amount?.toString() ?? ''
      if (s.includes('.')) return raw
      if (raw >= 10_000_000) return raw / 10 ** 8
      return raw
    }
    return null
  }

  private extractRecipient(params: any): string | null {
    const normalized = params?.normalisedParams ?? params?.rawParams
    if (!normalized) return null
    if ('recipients' in normalized) {
      const recipients = normalized.recipients
      if (Array.isArray(recipients) && recipients.length > 0) {
        const first = recipients[0]
        if (typeof first === 'string') return first
        if (typeof first === 'object' && first.accountId) return first.accountId
      }
    }
    if ('recipient' in normalized) return String(normalized.recipient)
    if ('to' in normalized) return String(normalized.to)
    return null
  }
}
