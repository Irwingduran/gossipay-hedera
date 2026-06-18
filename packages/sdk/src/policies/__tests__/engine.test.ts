import { describe, it, expect, beforeEach } from 'vitest'
import { SpendLimitPolicy } from '../spendLimit'
import { AllowListPolicy } from '../allowList'
import { RequireApprovalPolicy } from '../requireApproval'
import { resetSession } from '../../sessionStore'

function mockParams(amount: number, recipient: string): any {
  return {
    normalisedParams: { amount, recipients: [recipient] },
    rawParams: { amount, recipients: [recipient] },
    context: {},
    client: {},
  }
}

describe('PolicyEngine Integration', () => {
  const spendLimit = new SpendLimitPolicy({
    maxPerTransaction: 5,
    maxPerSession: 20,
    currency: 'HBAR',
  })
  const allowList = new AllowListPolicy({
    providers: ['api.coincap.io', 'hermes.pyth.network'],
  })
  const requireApproval = new RequireApprovalPolicy({
    aboveAmount: 10,
    currency: 'HBAR',
    timeoutSeconds: 30,
  })

  beforeEach(() => {
    resetSession()
  })

  it('allows a transaction that passes all policies', async () => {
    const params = mockParams(3, 'api.coincap.io')
    const method = 'transfer_hbar'

    expect(await allowList.shouldBlockPostParamsNormalization(params, method)).toBe(false)
    expect(await spendLimit.shouldBlockPostParamsNormalization(params, method)).toBe(false)
    expect(await requireApproval.shouldBlockPostParamsNormalization(params, method)).toBe(false)
  })

  it('blocks a transaction not on allow list', async () => {
    const params = mockParams(3, 'evil.com')
    expect(await allowList.shouldBlockPostParamsNormalization(params, 'transfer_hbar')).toBe(true)
  })

  it('blocks a transaction exceeding spend limit', async () => {
    const params = mockParams(10, 'api.coincap.io')
    expect(await spendLimit.shouldBlockPostParamsNormalization(params, 'transfer_hbar')).toBe(true)
  })

  it('requires approval for high-value transactions', async () => {
    const params = mockParams(15, 'api.coincap.io')
    expect(await spendLimit.shouldBlockPostParamsNormalization(params, 'transfer_hbar')).toBe(true)
    expect(await requireApproval.shouldBlockPostParamsNormalization(params, 'transfer_hbar')).toBe(true)
  })
})
