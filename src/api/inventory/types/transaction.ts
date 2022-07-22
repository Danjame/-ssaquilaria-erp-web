import { Material } from './material'
import { Product } from './product'
import { Seedling } from './seedling'

export interface Transaction {
  id: number
  type: string
  method: string
  quantity: number
  weight: number
  product: Product
  material: Material
  seedling: Seedling
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionConditions {
  type?: string
  method?: string
  productId?: number
  materialId?: number
  seedlingId?: number
  page?: number
  size?: number
}

export interface TransactionAttrs {
  type: string
  method: string
  quantity: number
  weight?: number
  productId?: number | undefined
  materialId?: number | undefined
  seedlingId?: number | undefined
  remark?: string
}
