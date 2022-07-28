import { Transaction } from '@/api/inventory/types/transaction'

export interface Trace {
  id: number
  serialNum: string
  queryCount: number
  transaction: Transaction;
  createdAt: Date
  updatedAt: Date
}

export interface TraceConditions {
  page?: number
  size?: number
}
