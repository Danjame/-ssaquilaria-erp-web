import { OperType } from './opertype'

export interface OperItem {
  id: number
  name: string
  operType: OperType
  remark: string
  createdAt: Date
  updatedAt: Date
}
