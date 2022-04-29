import { Product } from './product'
import { Transaction } from './transaction'

export interface Sale {
  id: number
  orderNum: string
  customerId: number
  product: Product
  quantity: number
  price: number
  amount: number
  comment: string
  transaction: Transaction
  createdAt: Date
  updatedAt: Date
}

export interface SaleConditions {
  orderNum?: number
  productId?: number
  page?: number
  size?: number
}

export interface SaleAttrs {
  orderNum: string
  productId: number | undefined
  customerId?: number | undefined
  price: number
  quantity: number
  amount: number
  comment?: string
}
