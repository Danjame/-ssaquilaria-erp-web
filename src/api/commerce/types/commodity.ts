import { Transaction } from '@/api/inventory/types/transaction'
import { Product } from '@/api/inventory/types/product'
import { Client } from './client'

export interface Commodity {
  id: number
  traceNum: string
  serialNum: string
  queryCount: number
  transaction: Transaction;
  product: Product;
  client: Client
  customer: string
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface CommodityConditions {
  serialNum?: string
  productId?: number
  page?: number
  size?: number
}
