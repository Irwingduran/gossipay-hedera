import { NextRequest, NextResponse } from 'next/server'
import { updateAgentPolicies } from '@/lib/agent'
import type { PolicyConfig } from '@gossipay/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sessionId, policies } = body as {
    sessionId: string
    policies: PolicyConfig[]
  }

  if (!sessionId || !policies) {
    return NextResponse.json(
      { error: 'sessionId and policies are required' },
      { status: 400 }
    )
  }

  updateAgentPolicies(sessionId, policies)

  return NextResponse.json({ success: true })
}
