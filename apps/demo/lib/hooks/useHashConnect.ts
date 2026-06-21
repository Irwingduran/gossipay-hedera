'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from '../store'

let extensionDetected = false
let listening = false

export function useHashConnect() {
  const { state, dispatch } = useSession()
  const [installed, setInstalled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (listening) return
    listening = true

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'hashconnect-query-extension-response') {
        extensionDetected = true
        setInstalled(true)
      }
    }

    window.addEventListener('message', handleMessage)
    window.postMessage({ type: 'hashconnect-query-extension', id: crypto.randomUUID() }, '*')

    return () => {
      window.removeEventListener('message', handleMessage)
      listening = false
    }
  }, [])

  const connect = useCallback(() => {
    const accountId = inputRef.current?.value?.trim()
    if (!accountId) return
    if (!/^\d+\.\d+\.\d+$/.test(accountId)) {
      alert('Enter a valid Hedera account ID (e.g. 0.0.12345)')
      return
    }
    dispatch({ type: 'SET_WALLET', payload: accountId })
  }, [dispatch])

  const disconnect = useCallback(() => {
    dispatch({ type: 'SET_WALLET', payload: null })
  }, [dispatch])

  return {
    connect,
    disconnect,
    installed,
    inputRef,
    accountId: state.walletAccountId,
  }
}
