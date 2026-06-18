'use client'

import { useCallback, useRef } from 'react'
import { useSession } from '../store'

interface SSEEvent {
  event: string
  data: any
}

export function useAgentStream() {
  const { state, dispatch } = useSession()
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (message: string) => {
      const sessionId = state.sessionId

      dispatch({ type: 'ADD_MESSAGE', payload: {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: Date.now(),
      }})

      dispatch({ type: 'SET_STREAMING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const assistantMessageId = crypto.randomUUID()
      let assistantContent = ''

      dispatch({ type: 'ADD_MESSAGE', payload: {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }})

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message, sessionId }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          let currentEvent = ''
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim()
            } else if (line.startsWith('data: ')) {
              const dataStr = line.slice(6)
              try {
                const data = JSON.parse(dataStr)
                handleEvent({ event: currentEvent, data })
              } catch {
                // ignore malformed JSON
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', payload: err.message ?? 'Connection failed' })
        }
      } finally {
        dispatch({ type: 'SET_STREAMING', payload: false })
        abortRef.current = null
      }

      function handleEvent(ev: SSEEvent) {
        switch (ev.event) {
          case 'token':
            assistantContent += ev.data.content ?? ''
            dispatch({ type: 'ADD_MESSAGE', payload: {
              id: assistantMessageId,
              role: 'assistant',
              content: assistantContent,
              timestamp: Date.now(),
            }})
            break
          case 'transaction':
            dispatch({ type: 'ADD_TRANSACTION', payload: ev.data })
            break
          case 'tool_start':
            break
          case 'tool_end':
            break
          case 'done':
            break
          case 'error':
            dispatch({ type: 'SET_ERROR', payload: ev.data.message })
            break
        }
      }
    },
    [state.sessionId, dispatch]
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { sendMessage, cancel, isStreaming: state.isStreaming, error: state.error }
}
