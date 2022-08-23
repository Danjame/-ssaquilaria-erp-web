import { Rank } from './rank'
import { Unit } from './unit'
import { Movement } from './movement'
import { Farm } from '@/api/forest/types/farm'
import { Area } from '@/api/forest/types/area'

export interface Material {
  id: number
  name: string
  unit: Unit
  rank: Rank
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

export interface MaterialConditions {
  name?: string
  rankId?: number
  farmId?: number
  areaId?: number
  page?: number
  size?: number
}

export interface MaterialAttrs {
  name: string
  unitId: number | undefined
  rankId: number | undefined
  farmId: number | undefined
  areaId: number | undefined
  description?: string
  warnQty?: number
}
