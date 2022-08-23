import { Product } from './product'

export interface Unit {
  id: number
  name: string
  remark: string
  description: string
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface UnitConditions {
  page?: number
  size?: number
}

export interface UnitAttrs {
  name: string
  remark?: string
  description?: string
}
