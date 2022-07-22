import { Category } from './category'
import { Purchase } from './purchase'
import { Product } from './product'

export interface Supplier {
  id: number
  name: string
  remark: string
  description: string
  categories: Category[]
  purchases: Purchase[]
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface SupplierConditions {
  productId?: number
  page?: number
  size?: number
}

export interface SupplierAttrs {
  name: string
  remark?: string
  description?: string
}
