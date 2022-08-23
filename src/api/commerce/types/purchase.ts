import { User } from '@/api/system/types/user'
import { Commodity } from './commodity'
import { Supplier } from './supplier'

export interface Purchase {
  id: number
  orderNum: string
  applicant: User
  supplier: Supplier
  commodities: Commodity[]
  quantity: number
  amount: number
  remark: string
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
