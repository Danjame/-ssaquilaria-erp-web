import { Plant } from './plant'

export interface Cultivation {
  id: number
  event: string
  plant: Plant
  remark: string
  images: string[]
  srcList: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CultivationConditions {
  plantId?: number
  page?: number
  size?: number
}
