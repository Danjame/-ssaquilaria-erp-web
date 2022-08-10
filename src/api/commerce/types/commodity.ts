import { Transaction } from '@/api/inventory/types/transaction'
import { Client } from './client'

export interface Commodity {
  id: number
  traceNum: string
  serialNum: string
  queryCount: number
  transaction: Transaction;
  client: Client
  createdAt: Date
  updatedAt: Date
}

export interface CommodityConditions {
  serialNum?: string
  productId?: number
  page?: number
  size?: number
}
