import { Farm } from './farm'
import { Area } from './area'

export interface Tree {
  id: number
  serialNum: string
  name: string
  farm: Farm
  area: Area
  areaCount: number
  treeCount: number
  positionX: number
  positionY: number
  machineCode: string
  plantedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface TreeAttrs {
  name: string
  farmId: number
  areaId: number
  positionX: number
  positionY: number
  machineCode: string
  plantedAt: Date
}

export interface TreeConditions {
  serialNum?: string
  name?: string
  farmId?: number
  areaId?: number
  page?: number
  size?: number
}
