import { Product } from './product'
import { Material } from './material'
import { Seedling } from './seedling'
import { Farm } from '@/api/forest/types/farm'
import { Area } from '@/api/forest/types/area'

export interface Transaction {
  id: number
  type: string
  method: string
  quantity: number
  weight: number
  product: Product
  material: Material
  seedling: Seedling
  farm: Farm
  area: Area
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionConditions {
  type?: string
  method?: string
  target?: number
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
  farmId?: number | undefined
  areaId?: number | undefined
  remark?: string
}

export interface ProductTransactionAttrs {
  type: string
  method: string
  quantity: number
  weight?: number
  productId: number | undefined
  remark?: string
}

export interface MaterialTransactionAttrs {
  type: string
  method: string
  quantity: number
  materialId: number | undefined
  farmId?: number
  areaId?: number
  remark?: string
}

export interface SeedlingTransactionAttrs {
  type: string
  method: string
  quantity: number
  seedlingId: number | undefined
  remark?: string
}
