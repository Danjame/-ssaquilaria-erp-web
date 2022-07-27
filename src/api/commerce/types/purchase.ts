import { User } from '@/api/system/types/user'
import { Product } from '../../inventory/types/product'
import { Supplier } from './supplier'
import { Transaction } from '../../inventory/types/transaction'

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

export interface PurchaseConditions {
  orderNum?: number
  productId?: number
  supplierId?: number
  page?: number
  size?: number
}

export interface PurchaseAttrs {
  orderNum: string
  productId: number | undefined
  supplierId: number | undefined
  price: number
  quantity: number
  amount: number
  comment?: string
}
