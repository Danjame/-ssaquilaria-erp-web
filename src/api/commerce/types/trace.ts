import { Transaction } from '@/api/inventory/types/transaction'

export interface Trace {
  id: number
  code: string
  queryCount: number
  transaction: Transaction;
  createdAt: Date
  updatedAt: Date
}

export interface TraceConditions {
  page?: number
  size?: number
}
