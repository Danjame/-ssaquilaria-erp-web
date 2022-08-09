import { Transaction } from '@/api/inventory/types/transaction'
import { Client } from './client'

export interface Trace {
  id: number
  traceNum: string
  serialNum: string
  queryCount: number
  transaction: Transaction;
  client: Client
  createdAt: Date
  updatedAt: Date
}

export interface TraceConditions {
  serialNum?: string
  productId?: number
  page?: number
  size?: number
}
