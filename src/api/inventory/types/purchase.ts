import { User } from '@/api/system/types/user'
import { Product } from './product'
import { Supplier } from './supplier'
import { Transaction } from './transaction'

export interface Purchase {
  id: number
  orderNum: string
  applicant: User
  supplier: Supplier
  product: Product
  quantity: number
  price: number
  amount: number
  comment: string
  transaction: Transaction
  createdAt: Date
  updatedAt: Date
}
