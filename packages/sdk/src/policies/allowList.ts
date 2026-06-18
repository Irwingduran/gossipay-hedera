import { AbstractPolicy } from '@hashgraph/hedera-agent-kit'
import type { AllowListConfig } from '../types'

export class AllowListPolicy extends AbstractPolicy {
  name = 'Allow List'
  description = 'Only allows payments to approved providers'

  relevantTools = [
    'transfer_hbar',
    'transfer_hbar_with_allowance',
    'transfer_fungible_token',
    'transfer_fungible_token_with_allowance',
  ]

  constructor(private config: AllowListConfig) {
    super()
  }

  async shouldBlockPostParamsNormalization(
    params: any,
    _method: string
  ): Promise<boolean> {
    const recipient = this.extractRecipient(params)
    if (!recipient) return false

    const allowed = this.config.providers.some((p) =>
      recipient.toLowerCase().includes(p.toLowerCase())
    )

    return !allowed
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

    if ('recipient' in normalized) {
      return String(normalized.recipient)
    }

    if ('to' in normalized) {
      return String(normalized.to)
    }

    return null
  }
}
