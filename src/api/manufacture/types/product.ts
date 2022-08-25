import { Category } from './category'
import { Unit } from './unit'

export interface Product {
  id: number
  serialNum: string
  name: string
  category: Category
  unit: Unit
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  incomingQty: number
  outgoingQty: number
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
  description?: string
  warnQty?: number
}
