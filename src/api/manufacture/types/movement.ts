import { Material } from './material'
import { Sapling } from './sapling'
import { Commodity } from '@/api/commerce/types/commodity'

interface Article {
  productId: number | undefined
  size: string
  fixedPrice: number
  quantity: number
  materialId: number | undefined
  materialQty: number
}

export interface Movement {
  id: number
  type: number
  target: number
  quantity: number
  commodities: Commodity[]
  material: Material
  sapling: Sapling
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface MovementConditions {
  type?: number
  target?: number
  productId?: number
  materialId?: number
  saplingId?: number
  page?: number
  size?: number
}

export interface ProductMovementAttrs {
  type: number | undefined
  quantity: number | undefined
  goods?: Article[]
  serialNums?: string[]
  remark?: string
}

export interface MaterialMovementAttrs {
  type: number | undefined
  quantity: number | undefined
  materialId: number | undefined
  remark?: string
}

export interface SaplingMovementAttrs {
  type: number | undefined
  quantity: number | undefined
  saplingId: number | undefined
  remark?: string
}
