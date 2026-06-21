'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type {
  TransactionRecord,
  ApprovalRequest,
  PolicyConfig,
} from '@gossipay/sdk'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AppState {
  sessionId: string
  messages: ChatMessage[]
  transactions: TransactionRecord[]
  pendingApprovals: ApprovalRequest[]
  policies: PolicyConfig[]
  isStreaming: boolean
  error: string | null
  walletAccountId: string | null
}

type Action =
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TRANSACTION'; payload: TransactionRecord }
  | { type: 'SET_TRANSACTIONS'; payload: TransactionRecord[] }
  | { type: 'ADD_APPROVAL'; payload: ApprovalRequest }
  | { type: 'UPDATE_APPROVAL'; payload: { id: string; status: ApprovalRequest['status'] } }
  | { type: 'SET_POLICIES'; payload: PolicyConfig[] }
  | { type: 'SET_WALLET'; payload: string | null }
  | { type: 'RESET_SESSION' }

const initialState: AppState = {
  sessionId: 'default',
  messages: [],
  transactions: [],
  pendingApprovals: [],
  policies: [
    { maxPerTransaction: 2, maxPerSession: 10, currency: 'HBAR' },
    { providers: ['api.coincap.io', 'hermes.pyth.network', 'gossipay.xyz'] },
    { aboveAmount: 5, currency: 'HBAR', timeoutSeconds: 30 },
  ],
  isStreaming: false,
  error: null,
  walletAccountId: null,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload }
    case 'ADD_MESSAGE': {
      const exists = state.messages.findIndex((m) => m.id === action.payload.id)
      if (exists >= 0) {
        const next = [...state.messages]
        next[exists] = action.payload
        return { ...state, messages: next }
      }
      return { ...state, messages: [...state.messages, action.payload] }
    }
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      }
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    case 'ADD_APPROVAL':
      return {
        ...state,
        pendingApprovals: [...state.pendingApprovals, action.payload],
      }
    case 'UPDATE_APPROVAL':
      return {
        ...state,
        pendingApprovals: state.pendingApprovals.map((a) =>
          a.id === action.payload.id
            ? { ...a, status: action.payload.status }
            : a
        ),
      }
    case 'SET_POLICIES':
      return { ...state, policies: action.payload }
    case 'SET_WALLET':
      return { ...state, walletAccountId: action.payload }
    case 'RESET_SESSION':
      return { ...initialState, walletAccountId: state.walletAccountId }
    default:
      return state
  }
}

const SessionContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
