import { Unit } from './unit'
import { Movement } from './movement'
import { Farm } from '@/api/forest/types/farm'
import { Area } from '@/api/forest/types/area'

export interface Sapling {
  id: number
  name: string
  unit: Unit
  farm: Farm
  area: Area
  description: string
  images: string[]
  stockQty: number
  warnQty: number
  movements: Movement[]
  incomingQty: number
  outgoingQty: number
  createdAt: Date
  updatedAt: Date
}

export interface SaplingConditions {
  name?: string
  farmId?: number
  areaId?: number
  page?: number
  size?: number
}

export interface SaplingAttrs {
  name: string
  unitId: number | undefined
  farmId: number | undefined
  areaId: number | undefined
  description?: string
  warnQty?: number
}
