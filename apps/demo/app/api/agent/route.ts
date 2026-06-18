import { NextRequest } from 'next/server'
import { streamAgentEvents, getOrCreateAgent } from '@/lib/agent'
import { getSession, getPendingApproval } from '@gossipay/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function* sseEvents(sessionId: string, message: string) {
  getOrCreateAgent(sessionId)
  const initialTxCount = getSession().transactions.length

  yield { event: 'session_start', data: { sessionId } }

  const generator = streamAgentEvents(sessionId, message)

  for await (const chunk of generator) {
    yield chunk

    if (chunk.event === 'tool_end') {
      const session = getSession()
      const newTxs = session.transactions.slice(initialTxCount)
      for (const tx of newTxs) {
        yield { event: 'transaction', data: tx }
      }
      const pendingApprovals = session.pendingApprovals.filter(
        (a) => a.status === 'pending'
      )
      for (const approval of pendingApprovals) {
        yield { event: 'pending_approval', data: approval }
      }
    }
  }

  const session = getSession()
  for (const approval of session.pendingApprovals) {
    if (approval.status === 'pending') {
      yield { event: 'pending_approval', data: approval }
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const message: string = body.message ?? ''
  const sessionId: string = body.sessionId ?? 'default'

  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of sseEvents(sessionId, message)) {
          const payload = `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`
          controller.enqueue(encoder.encode(payload))
        }
      } catch (error) {
        const errPayload = `event: error\ndata: ${JSON.stringify({ message: String(error) })}\n\n`
        controller.enqueue(encoder.encode(errPayload))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
  })
}
