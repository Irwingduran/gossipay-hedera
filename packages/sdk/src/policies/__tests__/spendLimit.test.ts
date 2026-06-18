import { describe, it, expect, beforeEach } from 'vitest'
import { SpendLimitPolicy } from '../spendLimit'
import { resetSession, addTransaction } from '../../sessionStore'

function mockParams(amount: number): any {
  return {
    normalisedParams: { amount },
    rawParams: { amount },
    context: {},
    client: {},
  }
}

describe('SpendLimitPolicy', () => {
  beforeEach(() => {
    resetSession()
  })

  it('allows a transaction under the per-transaction limit', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 10,
      maxPerSession: 50,
      currency: 'HBAR',
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(5),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('blocks a transaction over the per-transaction limit', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 2,
      maxPerSession: 10,
      currency: 'HBAR',
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(5),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })

  it('blocks a transaction that would exceed the session limit', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 10,
      maxPerSession: 10,
      currency: 'HBAR',
    })

    addTransaction({
      amount: 8,
      provider: 'test',
      recipient: '0.0.123',
      toolName: 'transfer_hbar',
      timestamp: Date.now(),
      status: 'approved',
      policyResults: [],
    })

    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(5),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })

  it('allows a transaction exactly at the per-transaction limit', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 2,
      maxPerSession: 10,
      currency: 'HBAR',
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(2),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('handles amount in tinybars (8 decimal places)', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 2,
      maxPerSession: 10,
      currency: 'HBAR',
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(150_000_000),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('does not block irrelevant tools', async () => {
    const policy = new SpendLimitPolicy({
      maxPerTransaction: 2,
      maxPerSession: 10,
      currency: 'HBAR',
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      { normalisedParams: {}, rawParams: {}, context: {}, client: {} },
      'create_account'
    )
    expect(result).toBe(false)
  })
})
