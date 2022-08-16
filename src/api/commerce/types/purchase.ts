import { User } from '@/api/system/types/user'
import { Product } from '../../inventory/types/product'
import { Supplier } from './supplier'

export interface Purchase {
  id: number
  orderNum: string
  applicant: User
  supplier: Supplier
  product: Product
  quantity: number
  price: number
  amount: number
  remark: string
  returned: boolean
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
  productId: number | undefined
  supplierId: number | undefined
  price: number
  quantity: number
  amount: number
  remark?: string
}
