import { Unit } from './unit'
import { Transaction } from './transaction'

export interface Seedling {
  id: number
  name: string
  unit: Unit
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  transactions: Transaction[]
  incomingQty: number
  outgoingQty: number
  createdAt: Date
  updatedAt: Date
}

export interface SeedlingConditions {
  name?: string
  page?: number
  size?: number
}

export interface SeedlingAttrs {
  name: string
  unitId: number | undefined
  description?: string
  warnQty?: number
}
