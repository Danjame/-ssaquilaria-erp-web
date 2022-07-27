import { Category } from './category'
import { Unit } from './unit'
import { Transaction } from './transaction'
import { Purchase } from '../../commerce/types/purchase'
import { Sale } from '../../commerce/types/sale'
import { Material } from './material'

export interface Product {
  id: number
  name: string
  category: Category
  size: string
  unit: Unit
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  material: Material
  transactions: Transaction[]
  incomingQty: number
  outgoingQty: number
  purchases: Purchase[]
  sales: Sale[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductConditions {
  name?: string
  categoryId?: number
  page?: number
  size?: number
}

export interface ProductAttrs {
  name: string
  categoryId: number | undefined
  unitId: number | undefined
  materialId?: number
  size: string
  description?: string
  warnQty?: number
}
