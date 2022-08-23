import { Product } from './product'
import { Supplier } from '../../commerce/types/supplier'

export interface Category {
  id: number
  name: string
  remark: string
  products?: Product[]
  suppliers?: Supplier[]
  createdAt: Date
  updatedAt: Date
}

export interface CategoryConditions {
  productId?: number
  page?: number
  size?: number
}

export interface CategoryAttrs {
  name: string
  remark?: string
}
