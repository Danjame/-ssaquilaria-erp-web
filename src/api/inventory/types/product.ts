import { Category } from './category'
import { Unit } from './unit'
import { Transaction } from './transaction'
import { Purchase } from './purchase'
import { Sale } from './sale'
import { Supplier } from './supplier'

export interface Product {
  id: number
  name: string
  serialNum: string
  machineCode: string
  category: Category
  size: string
  unit: Unit
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  transactions: Transaction[]
  incomingQty: number
  outgoingQty: number
  purchases: Purchase[]
  sales: Sale[]
  // cost: { default: number }
  // price: { default: number }
  suppliers: Supplier[]
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
  size: string
  description?: string
  serialNum?: string
  machineCode?: string
  warnQty?: number
}
