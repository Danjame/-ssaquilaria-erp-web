import { Product } from './product'

export interface Unit {
  id: number
  name: string
  value: string
  label: string
  description: string
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface UnitAttrs {
  name: string
  value: string
  label: string
  description?: string
}

export interface UnitConditions {
  page?: number
  size?: number
}
