import { User } from '@/api/system/types/user'
import { Commodity } from './commodity'
import { Supplier } from './supplier'

interface Article {
  productId: number | undefined
  size: string
  weight: string
  purchasePrice: number
  quantity: number
}

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
  goods: Article[]
  supplierId: number | undefined
  quantity: number
  amount: number
  remark?: string
}
