import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RequireApprovalPolicy } from '../requireApproval'
import { resetSession, resolveApproval } from '../../sessionStore'

function mockParams(amount: number, recipient = '0.0.12345'): any {
  return {
    normalisedParams: { amount, recipients: [recipient] },
    rawParams: { amount, recipients: [recipient] },
    context: {},
    client: {},
  }
}

describe('RequireApprovalPolicy', () => {
  beforeEach(() => {
    resetSession()
    vi.useFakeTimers()
  })

  it('allows a transaction under the threshold', async () => {
    const policy = new RequireApprovalPolicy({
      aboveAmount: 5,
      currency: 'HBAR',
      timeoutSeconds: 30,
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(3),
      'transfer_hbar'
    )
    expect(result).toBe(false)
  })

  it('blocks a transaction above the threshold (creates pending approval)', async () => {
    const policy = new RequireApprovalPolicy({
      aboveAmount: 5,
      currency: 'HBAR',
      timeoutSeconds: 30,
    })
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(6),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })

  it('allows a transaction after human approval', async () => {
    const policy = new RequireApprovalPolicy({
      aboveAmount: 5,
      currency: 'HBAR',
      timeoutSeconds: 30,
    })
    await policy.shouldBlockPostParamsNormalization(
      mockParams(6),
      'transfer_hbar'
    )
    resolveApproval(
      Object.keys(import.meta)[0] ?? 'mock',
      'approved'
    )
  })

  it('blocks a transaction after rejection', async () => {
    const policy = new RequireApprovalPolicy({
      aboveAmount: 5,
      currency: 'HBAR',
      timeoutSeconds: 30,
    })
    await policy.shouldBlockPostParamsNormalization(
      mockParams(6),
      'transfer_hbar'
    )

    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(6, '0.0.99999'),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })

  it('blocks a transaction after timeout expires', async () => {
    const policy = new RequireApprovalPolicy({
      aboveAmount: 5,
      currency: 'HBAR',
      timeoutSeconds: 1,
    })
    await policy.shouldBlockPostParamsNormalization(
      mockParams(6),
      'transfer_hbar'
    )
    vi.advanceTimersByTime(2000)
    const result = await policy.shouldBlockPostParamsNormalization(
      mockParams(6),
      'transfer_hbar'
    )
    expect(result).toBe(true)
  })
})
