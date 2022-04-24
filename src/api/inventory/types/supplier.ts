import { Category } from './category'
import { Purchase } from './purchase'
import { Product } from './product'

export interface Supplier {
  id: number
  name: string
  value: string
  label: string
  description: string
  categories: Category[]
  purchases: Purchase[]
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface SupplierAttrs {
  name: string
  value: string
  label: string
  description?: string
}

export interface SupplierConditions {
  productId?: number
  page?: number
  size?: number
}
