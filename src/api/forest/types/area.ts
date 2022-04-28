import { Farm } from './farm'

export interface Area {
  id: number
  name: string
  farm: Farm
  remark: string
  createdAt: Date
  updatedAt: Date
}

export interface AreaConditions {
  farmId?: number
  page?: number
  size?: number
}

export interface AreaAttrs {
  name: string
  farmId: number
  remark: string
}
