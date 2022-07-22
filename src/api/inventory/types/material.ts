import { Rank } from './rank'
import { Unit } from './unit'
import { Transaction } from './transaction'

export interface Material {
  id: number
  name: string
  unit: Unit
  rank: Rank
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

export interface MaterialConditions {
  name?: string
  rankId?: number
  page?: number
  size?: number
}

export interface MaterialAttrs {
  name: string
  unitId: number | undefined
  rankId: number | undefined
  description?: string
  warnQty?: number
}
