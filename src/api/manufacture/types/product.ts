import { Category } from './category'
import { Unit } from './unit'
import { Movement } from './movement'
import { Purchase } from '../../commerce/types/purchase'
import { Sale } from '../../commerce/types/sale'
import { Material } from './material'

export interface Product {
  id: number
  serialNum: string
  name: string
  category: Category
  size: string
  unit: Unit
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  material: Material
  movements: Movement[]
  incomingQty: number
  outgoingQty: number
  purchases: Purchase[]
  sales: Sale[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductConditions {
  serialNum?: string
  name?: string
  categoryId?: number
  page?: number
  size?: number
}

export interface ProductAttrs {
  serialNum: string
  name: string
  categoryId: number | undefined
  unitId: number | undefined
  materialId?: number
  size: string
  description?: string
  warnQty?: number
}
