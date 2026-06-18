import { NextRequest, NextResponse } from 'next/server'
import { resolveApproval, getPendingApproval } from '@gossipay/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { approvalId, action } = body

  if (!approvalId || !action) {
    return NextResponse.json(
      { error: 'approvalId and action are required' },
      { status: 400 }
    )
  }

  if (action !== 'approved' && action !== 'rejected') {
    return NextResponse.json(
      { error: 'action must be "approved" or "rejected"' },
      { status: 400 }
    )
  }

  const existing = getPendingApproval(approvalId)
  if (!existing) {
    return NextResponse.json(
      { error: 'approval not found' },
      { status: 404 }
    )
  }

  if (existing.status !== 'pending') {
    return NextResponse.json(
      { error: `approval already ${existing.status}` },
      { status: 409 }
    )
  }

  const resolved = resolveApproval(approvalId, action)

  return NextResponse.json({ success: true, approval: resolved })
}
