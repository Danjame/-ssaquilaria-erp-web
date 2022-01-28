import { Product } from './product'
import { Supplier } from './supplier'

export interface Category {
  id: number
  name: string
  value: string
  label: string
  products?: Product[]
  suppliers?: Supplier[]
  createdAt: Date
  updatedAt: Date
}
