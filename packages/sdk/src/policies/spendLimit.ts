import { AbstractPolicy } from '@hashgraph/hedera-agent-kit'
import type { SpendLimitConfig } from '../types'
import { getSession } from '../sessionStore'

export class SpendLimitPolicy extends AbstractPolicy {
  name = 'Spend Limit'
  description = 'Limits spending per transaction and per session'

  relevantTools = [
    'transfer_hbar',
    'transfer_hbar_with_allowance',
    'transfer_fungible_token',
    'transfer_fungible_token_with_allowance',
    'transfer_non_fungible_token',
    'transfer_non_fungible_token_with_allowance',
  ]

  constructor(private config: SpendLimitConfig) {
    super()
  }

  async shouldBlockPostParamsNormalization(
    params: any,
    _method: string
  ): Promise<boolean> {
    const amount = this.extractAmount(params)
    if (!amount || amount <= 0) return false

    if (amount > this.config.maxPerTransaction) {
      return true
    }

    const session = getSession()
    if (session.totalSpent + amount > this.config.maxPerSession) {
      return true
    }

    return false
  }

  async postToolExecutionHook(params: any, method: string): Promise<void> {
    if (!this.relevantTools.includes(method)) return
    const amount = this.extractAmount(params)
    if (!amount || amount <= 0) return
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
}
