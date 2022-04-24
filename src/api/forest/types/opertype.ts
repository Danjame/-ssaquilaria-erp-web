import { OperItem } from './operitem'

export interface OperType {
  id: number
  name: string
  operItems: OperItem[]
  remark: string
  createdAt: Date
  updatedAt: Date
}
