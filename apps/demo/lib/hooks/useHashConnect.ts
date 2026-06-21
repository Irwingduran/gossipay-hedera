'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../store'

interface HashPackProvider {
  connect: () => Promise<{ accountIds: string[] }>
  disconnect: () => Promise<void>
  getBalance: (accountId: string) => Promise<{ hbars: number; timestamp: string }>
  signTransaction: (transaction: Uint8Array) => Promise<Uint8Array>
}

declare global {
  interface Window {
    hashpack?: HashPackProvider
  }
}

export function useHashConnect() {
  const { state, dispatch } = useSession()
  const [installed, setInstalled] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    setInstalled(!!window.hashpack)
  }, [])

  const connect = useCallback(async () => {
    if (!window.hashpack) return
    setConnecting(true)
    try {
      const { accountIds } = await window.hashpack.connect()
      dispatch({ type: 'SET_WALLET', payload: accountIds[0] })
    } catch (err) {
      console.error('HashPack connect failed:', err)
      dispatch({ type: 'SET_WALLET', payload: null })
    } finally {
      setConnecting(false)
    }
  }, [dispatch])

  const disconnect = useCallback(async () => {
    try {
      await window.hashpack?.disconnect()
    } catch {
      // ignore
    }
    dispatch({ type: 'SET_WALLET', payload: null })
  }, [dispatch])

  return {
    connect,
    disconnect,
    connecting,
    installed,
    accountId: state.walletAccountId,
  }
}
