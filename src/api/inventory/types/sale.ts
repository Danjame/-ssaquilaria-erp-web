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
